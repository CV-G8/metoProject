/**
 * micaps格点格式的EC数值模式图层
 */

// import GridDataImageryProvider from '@mesh-3d/meteolib/Source/Scene/GridDataImageryProvider'
// import RasterImageGenerator from '@mesh-3d/meteolib/Source/Render/RasterImageGenerator'
// import GridData from '@mesh-3d/meteolib/Source/Data/Micaps/GridData'
const { GridDataImageryProvider, RasterImageGenerator, GridData } = MeteoLib
import HfsFileLoader from "../HfsFileLoader";
import IHfsFileLayer from "./IHfsFileLayer";

function removeImageryLayer(layer) {
    var { imageryLayer, earth } = layer;
    if (imageryLayer) {
        earth.imageryLayers.remove(imageryLayer)
        imageryLayer.imageryProvider.destroy()
        layer.imageryLayer = null
    }
}

/**
 * micaps格点格式的EC数值模式图层
 */
export default class MicapsECLayer extends IHfsFileLayer {
    /**
     *  micaps格点格式的EC数值模式图层
     * @param {HfsFileLoader}  fileLoader
     */
    constructor(fileLoader) {
        super(fileLoader, {
            dir: 'GZData',
            path: "ECMWF_LR",
            ext: '*.000',
            timeRegex: 'yyyyMMddhh',
            zIndex: 4
        })

        this._element = 'TMP'
        this._level = '850'
        this._forecastTime = '000';

        this._lastFile = null

        this.rectangle = Cesium.Rectangle.fromDegrees(105, 24, 112, 32)
        this.imageryOptions = {
            // minimumLevel: 1,
            maximumLevel: 6,

            isoLine: true,
            lineColorType: 'single',
            lineColor: 'rgba(40,40,40,0.8)',

            isoValue: true,
            // isoValueColor: Cesium.Color.fromBytes(0, 0, 0),
            // isoValueBackColor: Cesium.Color.TRANSPARENT,
            // isoValueStroke: true,
            // isoValueStrokeWidth: 4,
            // isoValueStrokeColor: Cesium.Color.fromBytes(228, 228, 228),
            // isoValueFontSize: 12,
            // isoValueFontFamily: 'heiti',
            // isoValuePadding: 0,

            point: false,
            maxSamplePointLevel: 6,
            value: false,

            fill: true,
            interpolate: false,
            rectangle: this.rectangle,

        }

        this.ready = false;
        var deffered = {}
        this.readyPromise = new Promise((resolve, reject) => {
            deffered.resolve = resolve
            deffered.reject = reject
        })
        this._deffered = deffered

        var imageryLayer = null;
        var gridData = new GridData()
        Object.defineProperties(this, {
            gridData: {
                enumerable: false,
                get() {
                    return gridData;
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
            }
        })

    }

    get show() {
        return this._show
    }
    set show(val) {
        if (this.imageryLayer) {
            this._show = val
            this.imageryLayer.show = val
        }
    }

    get channelPath() {
        return [this.options.path, this.element, this.level].join('/')
    }

    //要素
    get element() {
        return this._element
    }
    set element(val) {
        if (this._element != val) {
            this._element = val;
            this.updateList()
        }
    }

    //层次
    get level() {
        return this._level
    }
    set level(val) {
        if (this._level != val) {
            this._level = val;
            this.updateList()
        }
    }

    //预报时间
    get forecastTime() {
        return this._forecastTime
    }
    set forecastTime(val) {
        if (this._forecastTime != val) {
            this._forecastTime = val;
            this.options.ext = '*.' + val
            this.updateList()
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

    get interpolate() {
        return this.imageryOptions.interpolate
    }
    set interpolate(val) {
        if (this.imageryOptions.interpolate != val) {
            this.imageryOptions.interpolate = val
            this.updateImageryLayer()
        }
    }

    get clipperLayer() {
        return this.imageryOptions.clipperLayer;
    }
    set clipperLayer(val) {
        if (val.provider) {
            val = val.provider
        }
        if (this.imageryOptions.clipperLayer != val) {
            this.imageryOptions.clipperLayer = val;
        }
    }

    /**
     * 基于当前时次的数据重新绘制
     */
    updateImageryLayer() {
        var { imageryLayer, earth, currentFile } = this;
        /**
        * @type {GridData}
        * @private
        */
        var gridData = this.gridData

        removeImageryLayer(this)

        if (gridData.familyName) {
            var element = gridData.element
            /**
             * @type {RasterImageGenerator}
             */
            var imageGenerator = RasterImageGenerator.find(element);
            var colorMap = imageGenerator.colorMap;

            var breaks = []
            var { isolineStartValue, isolineEndValue, isolineSpace } = gridData
            for (let num = isolineStartValue; num <= isolineEndValue; num += isolineSpace) {
                breaks.push(num);
            }

            var provider = new GridDataImageryProvider(Object.assign({}, this.imageryOptions, {
                colorMap: colorMap,
                dataArray: gridData.dataArray,
                width: gridData.width,
                height: gridData.height,
                breaks: breaks,
                dataRectangle: Cesium.Rectangle.fromDegrees(gridData.bbox[0], gridData.bbox[1], gridData.bbox[2], gridData.bbox[3])
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

        } else {
            var err = new Error('数据名称为空')
            this.onError(err)
            this.ready = false
            this._deffered.resolve(err)
        }
    }

    updateLayer() {
        let currentFile = this.currentFile;
        if (!currentFile) {
            return
        }

        /**
         * @type {GridData}
         * @private
         */
        var gridData = this.gridData
        if (this._lastFile == this.currentFile) {
            this.updateImageryLayer();

        } else {
            var _fileLoader = this._fileLoader;
            _fileLoader.readFile(currentFile).then(buf => {
                if (gridData.loadByteArray(buf)) {
                    this.updateImageryLayer()
                } else {
                    this.onError(new Error('格点数据解析失败'))
                }
            }).catch(err => {
                removeImageryLayer(this)
                this.onError(err)
                this.ready = false
                this._deffered.resolve(err)
            })
        }
    }

    unload() {
        removeImageryLayer(this)
    }
}