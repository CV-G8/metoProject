
/**
 * 地面监测要素图层
 */

// import { GridDataImageryProvider,RasterImageGenerator, Interpolate } from "@mesh-3d/meteolib-wdv";
const { GridDataImageryProvider, RasterImageGenerator, Interpolate, GridDataColorMap } = MeteoLib
import IHfsFileLayer from "./IHfsFileLayer";

/**
 * 
 * @param {object[]} dataset 
 */
function computeBBox(dataset) {
    var bbox = [180, 90, -180, -90]
    for (const row of dataset) {
        var { Lon, Lat } = row;
        bbox[0] = Math.min(Lon, bbox[0])
        bbox[1] = Math.min(Lat, bbox[1])
        bbox[2] = Math.max(Lon, bbox[2])
        bbox[3] = Math.max(Lat, bbox[3])
    }
    return bbox
}

function updateInterpDataset(dataset, fieldName, bbox, numX, numY) {
    var xs = [], ys = [], vals = [];
    dataset.forEach(function (data) {
        var lon = parseFloat(data.Lon),
            lat = parseFloat(data.Lat);
        var v = parseFloat(data[fieldName]);

        xs.push(lon);
        ys.push(lat);
        vals.push(v);
    })
    var s = [xs, ys, vals];

    var gridXY = Interpolate.CreateGridXY_Num(bbox[0], bbox[1], bbox[2], bbox[3], numX, numY);
    var result = Interpolate.Interpolation_IDW_Neighbor(s, gridXY[0], gridXY[1], 8);
    result.reverse();

    var dataArray = new Float32Array(numX * numY);
    var idx = 0;

    for (var i = 0; i < numY; i++) {
        for (var j = 0; j < numX; j++) {
            var v = result[i][j]
            dataArray[idx++] = v;
        }
    }

    return dataArray
}

function removePointsLayer(layer) {
    var { points, earth } = layer;
    while (points.length) {
        var entity = points.shift()
        earth.entities.remove(entity)
    }
}

function removeImageryLayer(layer) {
    var { imageryLayer, earth } = layer;
    if (imageryLayer) {
        earth.imageryLayers.remove(imageryLayer)
        imageryLayer.imageryProvider.destroy()
        layer.imageryLayer = null
    }
}

/**
 * 地面监测要素图层
 */
export default class SurfLayer extends IHfsFileLayer {
    constructor(fileLoader) {
        super(fileLoader, {
            dir: 'GZData',
            path: 'surf',
            ext: '*.json',
            timeRegex: 'yyyyMMddhhmmss',
            zIndex: 8
        })

        this._element = "MAX_PRE_1h";
        this._textField = "Station_Name"

        this._interpWidth = 256;
        this._interpHeight = 256;

        //色斑图和等值线显示配置
        this.imageryOptions = {
            // clipperLayer: clipperLayer,
            zIndex: 9,

            //原始数据点显示设置
            point: false,
            pointSize: 2,
            pointColor: Cesium.Color.fromBytes(128, 128, 128),

            pointDensity: 5, //指示点的密度，值越大越稀疏
            maximumPointDensity: 8, //指示当自动分级（pointDensity为0或者不设置）时点的密度，值越大越稀疏

            //原始数据点数值显示设置
            value: false,
            valueColor: Cesium.Color.fromBytes(128, 128, 128),
            valueBackColor: Cesium.Color.TRANSPARENT,
            valueStroke: true,
            valueStrokeWidth: 1,
            valueStrokeColor: Cesium.Color.WHITE,
            valueFontSize: 9,
            //valueFontFamily: 'kaiti',
            valuePadding: 0,

            //等值线数值显示设置
            isoValue: true,
            isoValueColor: Cesium.Color.fromBytes(0, 0, 0),
            isoValueBackColor: Cesium.Color.TRANSPARENT,
            isoValueStroke: true,
            isoValueStrokeWidth: 4,
            isoValueStrokeColor: Cesium.Color.fromBytes(228, 228, 228),
            isoValueFontSize: 12,
            isoValueFontFamily: 'heiti',
            isoValuePadding: 0,

            //等值线显示设置
            isoLine: true,
            // lineColor: Cesium.Color.WHITE,
            lineWidth: 1,
            lineDash: [5, 0, 5, 0], //虚线样式，不设置则为实线
            lineColorType: "single",

            //栅格色斑图数据显示设置
            fill: true,
            // colorMap: this._colorMap,
            interpolate: true,

            // dataArray: dataArray,
            // width: width,
            // height: height,
            // breaks: breaks,
            maximumLevel: 8,
            // rectangle: rectangle
        }

        //点显示配置
        this._showPoint = true;
        this._showText = false;
        this._showValue = true;

        this._pointGraphics = {
            pixelSize: 10,
            outlineWidth: 1.5
        };
        this._labelGraphics = {
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            font: '20px sans-serif',
            fillColor: Cesium.Color.BLACK,
            pixelOffset: new Cesium.Cartesian2(0, -8)
        };
        this._disableDepthTestDistance = null

        this.ready = false;
        var deffered = {}
        this.readyPromise = new Promise((resolve, reject) => {
            deffered.resolve = resolve
            deffered.reject = reject
        })
        this._deffered = deffered

        var imageGeneratorPRE = new RasterImageGenerator({
            name: 'PRE',
            colorMap: [
                [-0.99999, 1, [212, 255, 192, 255], '0~1'],
                [1, 2, [166, 240, 145, 255], '1~2'],
                [2, 4, [59, 166, 10, 255], '2~4'],
                [4, 6, [94, 182, 254, 255], '4~6'],
                [6, 8, [0, 2, 245, 255], '6~8'],
                [8, 10, [2, 112, 75, 255], '8~10'],
                [10, 20, [254, 1, 242, 255], '10~20'],
                [20, 50, [218, 79, 12, 255], '20~50'],
                [50, 65535, [120, 1, 0, 255], '>50']
            ]
        })
        var imageGeneratorRHU = new RasterImageGenerator({
            name: 'RHU',
            colorMap: [
                [-20, 0, [213, 6, 55, 255], '-20~0'],
                [0, 10, [231, 0, 0, 255], '0~10'],
                [10, 20, [252, 38, 3, 255], '10~20'],
                [20, 30, [247, 79, 20, 255], '20~30'],
                [30, 40, [249, 250, 212, 255], '30~40'],
                [40, 50, [238, 252, 202, 255], '40~50'],
                [50, 60, [64, 73, 202, 255], '50~60'],
                [60, 70, [84, 64, 182, 255], '60~70'],
                [70, 80, [70, 33, 164, 255], '70~80'],
                [80, 90, [51, 13, 128, 255], '80~90'],
                [90, 100, [8, 0, 0, 255], '90~100']
            ]
        })
        var imageGeneratorTEM = new RasterImageGenerator({
            name: 'TEM',
            colorMap: [
                [-66666666, -30, [0, 0, 255, 255], '<-30'],
                [-30, -28, [0, 20, 255, 255], '-30~-28'],
                [-28, -24, [0, 70, 255, 255], '-28~-24'],
                [-24, -22, [0, 100, 255, 255], '-24~-22'],
                [-22, -20, [0, 170, 255, 255], '-22~-20'],
                [-20, -18, [0, 200, 255, 255], '-20~-18'],
                [-18, -16, [0, 230, 255, 255], '-18~-16'],
                [-16, -14, [0, 255, 245, 255], '-16~-14'],
                [-14, -12, [0, 255, 215, 255], '-14~-12'],
                [-12, -10, [0, 255, 175, 255], '-12~-10'],
                [-10, -8, [0, 255, 145, 255], '-10~-8'],
                [-8, -6, [0, 255, 110, 255], '-8~-6'],
                [-6, -4, [0, 255, 80, 255], '-6~-4'],
                [-4, -2, [0, 255, 45, 255], '-4~-2'],
                [-2, 0, [0, 255, 15, 255], '-2~0'],
                [0, 2, [20, 255, 0, 255], '0~2'],
                [2, 4, [50, 255, 0, 255], '2~4'],
                [4, 6, [90, 255, 0, 255], '4~6'],
                [6, 8, [120, 255, 0, 255], '6~8'],
                [8, 10, [155, 255, 0, 255], '8~10'],
                [10, 12, [185, 255, 0, 255], '10~ 12'],
                [12, 14, [220, 255, 0, 255], '12~14'],
                [14, 16, [255, 255, 0, 255], '14~16'],
                [16, 18, [255, 225, 0, 255], '16~ 18'],
                [18, 20, [255, 195, 0, 255], '18~20'],
                [20, 22, [255, 160, 0, 255], '20~ 22'],
                [22, 24, [255, 130, 0, 255], '20~ 22'],
                [24, 26, [255, 100, 0, 255], '24~ 26'],
                [26, 28, [255, 65, 0, 255], '26~ 28'],
                [28, 30, [255, 45, 0, 255], '28~ 30'],
                [30, 33, [255, 37, 0, 255], '30~ 33'],
                [33, 35, [255, 20, 0, 255], '33~35'],
                [35, 666666666, [255, 0, 0, 255], '35>']
            ]
        })

        var imageryLayer = null, _dataset, _dataArray, points = [];
        Object.defineProperties(this, {
            _dataArray: {
                enumerable: false,
                get() {
                    return _dataArray;
                },
                set(val) {
                    _dataArray = val
                }
            },
            _dataset: {
                enumerable: false,
                get() {
                    return _dataset
                },
                set(val) {
                    _dataset = val
                }
            },
            imageGenerator: {
                get() {
                    var imageGenerator = imageGeneratorPRE;
                    switch (this._element) {
                        case 'TEM':
                            imageGenerator = imageGeneratorTEM
                            break;
                        case 'RHU':
                            imageGenerator = imageGeneratorRHU
                            break;
                        default:
                            break;
                    }
                    imageGenerator.ready = true
                    return imageGenerator;
                }
            },
            imageryLayer: {
                enumerable: false,
                get() {
                    return imageryLayer
                },
                set(val) {
                    imageryLayer = val
                }
            },
            points: {
                enumerable: false,
                get() {
                    return points;
                }
            }
        })

    }

    get element() {
        return this._element
    }
    set element(val) {
        if (this._element != val) {
            this._element = val
            this.updateImageryLayer()
        }
    }

    get showIsoLine() {
        return this.imageryOptions.isoLine
    }
    set showIsoLine(val) {
        if (this.imageryOptions.isoLine != val) {
            this.imageryOptions.isoLine = val
            this.updateImageryLayer()
        }
    }

    get fill() {
        return this.imageryOptions.fill
    }
    set fill(val) {
        if (this.imageryOptions.fill != val) {
            this.imageryOptions.fill = val
            this.updateImageryLayer()
        }
    }

    get showPoint() {
        return this._showPoint
    }
    set showPoint(val) {
        if (this._showPoint != val) {
            this._showPoint = val
            this.points.forEach(pt => {
                pt.point.show = val
            })
        }
    }

    get showText() {
        return this._showText
    }
    set showText(val) {
        if (this._showText != val) {
            this._showText = val
            this.updatePointLayer()
        }
    }

    get showValue() {
        return this._showValue
    }
    set showValue(val) {
        if (this._showValue != val) {
            this._showValue = val
            this.updatePointLayer()
        }
    }

    get textField() {
        return this._textField
    }
    set textField(val) {
        if (this._textField != val) {
            this._textField = val
            this.updatePointLayer()
        }
    }

    updatePointLayer() {

        const { defined, Cartesian3, Color } = Cesium;

        const earth = this.earth;
        /**
         * @type {RasterImageGenerator}
         */
        var imageGenerator = this.imageGenerator;
        var colorMap = imageGenerator.colorMap;
        var pointGraphics = this._pointGraphics,
            labelGraphics = this._labelGraphics,
            pointVisible = this._showPoint,
            textVisible = this._showText,
            valueVisible = this._showValue,
            valueField = this.element,
            textField = this.textField,

            disableDepthTestDistance = this._disableDepthTestDistance;

        var points = this.points;
        while (points.length) {
            var entity = points.shift()
            earth.entities.remove(entity)
        }

        this._dataset.DS.forEach(function (data) {
            var lon = parseFloat(data.Lon),
                lat = parseFloat(data.Lat);
            var v = parseFloat(data[valueField]);

            var color = GridDataColorMap.getColor(v, colorMap);
            color = Color.fromBytes.apply(null, color);

            var point = Object.assign(pointGraphics, {
                color: color,
                show: pointVisible,
                disableDepthTestDistance: disableDepthTestDistance
            })

            var label = Object.assign(labelGraphics, {
                text: "",
                disableDepthTestDistance: disableDepthTestDistance
            })
            if (textVisible && textField && defined(data[textField])) {
                label.text += data[textField] + "\r\n"
            }
            if (valueVisible && valueField && defined(data[valueField])) {
                label.text += data[valueField];
            }
            label.show = textVisible || valueVisible;

            var pt = earth.entities.add({
                position: Cartesian3.fromDegrees(lon, lat),
                point: point,
                label: label
            });
            pt.stationData = data;

            points.push(pt);

        })
    }

    /**
     * 基于当前时次的数据重新绘制
     */
    updateImageryLayer() {
        var { imageryLayer, earth, currentFile } = this;

        removeImageryLayer(this)

        /**
         * @type {RasterImageGenerator}
         */
        var imageGenerator = this.imageGenerator;
        var colorMap = imageGenerator.colorMap;
        var bbox = this.bbox;
        var rectangle = Cesium.Rectangle.fromDegrees(bbox[0], bbox[1], bbox[2], bbox[3])

        var breaks = [];
        //生成等值线数值
        for (var index = 1; index < colorMap.length; index++) {
            var item = colorMap[index];
            breaks.push(item[0])
        }

        var provider = new GridDataImageryProvider(Object.assign({}, this.imageryOptions, {
            colorMap: colorMap,
            dataArray: this._dataArray,
            width: this._interpWidth,
            height: this._interpHeight,
            breaks: breaks,
            dataRectangle: rectangle
        }))

        imageryLayer = earth.imageryLayers.addImageryProvider(provider)
        imageryLayer.show = this._show

        this.name = currentFile.fileName
        this.colorMap = colorMap
        this.imageryLayer = imageryLayer

        //调整图层顺序
        provider.zIndex = this.zIndex;
        earth.updateOrder()

        this.ready = true
        this._deffered.resolve(this)

    }

    updateLayer() {
        let currentFile = this.currentFile;
        if (!currentFile) {
            return
        }
        this.ready = false

        if (this._lastFile == this.currentFile) {
            this.updateImageryLayer();
            this.updatePointLayer()
        } else {

            var _fileLoader = this._fileLoader;
            _fileLoader.readFile(currentFile, {
                responseType: 'json'
            }).then(dataset => {
                this._dataset = dataset;
                var bbox = computeBBox(dataset.DS);
                this._dataArray = updateInterpDataset(dataset.DS, this.element, bbox, this._interpWidth, this._interpWidth);
                this.bbox = bbox;

                if (this.imageGenerator.ready) {
                    this.updateImageryLayer()
                    this.updatePointLayer()
                } else {
                    return new Promise((resolve, rejcect) => {
                        this.imageGenerator.readyPromise.then(() => {
                            this.updateImageryLayer();
                            this.updatePointLayer()
                            resolve();
                        }).otherwise(rejcect)
                    })
                }

            }).catch(err => {
                console.error(err);
                removeImageryLayer(this)
                removePointsLayer(this)
                this.onError(err)
                this.ready = false
                this._deffered.resolve(err)
            })
        }
    }

    unload() {
        removeImageryLayer(this)
        removePointsLayer(this)
    }
}