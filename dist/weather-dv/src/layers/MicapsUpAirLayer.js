
/**
 * 高空填图图层
 */

// import MeteoLib from "@mesh-3d/meteolib-wdv";
// import CesiumVectorTile from "cesiumvectortile";

import * as turf from '@turf/helpers'
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
    *获取风场符号
    *@param {Number}speed 风速
    *@param {Number}dir 风向
    *@return {Canvas}
    */
function getWindSymbol(speed, dir, layer) {
    var windSymbolType = layer.windSymbolType;
    var level = computeWindLevel(speed);
    var meteoSign = layer.meteoSign;
    var windSymbols = layer.windSymbols;
    if (!windSymbols) {
        windSymbols = {};
    }
    if (!windSymbols[windSymbolType]) {
        windSymbols[windSymbolType] = {};
    }
    layer.windSymbols = windSymbols;

    if (!windSymbols[windSymbolType][level]) {
        var canvas = document.createElement('canvas');
        canvas.width = Cesium.defaultValue(layer.windSymbolSize, 64);
        canvas.height = Cesium.defaultValue(layer.windSymbolSize, 64);
        var ctx = canvas.getContext("2d");

        if (windSymbolType == 'arrow') {
            var percent = level / 12.0;
            var arrowLength = percent * canvas.width;

            var top = (canvas.height - arrowLength);
            var left = arrowLength * 0.125;
            var lines = [
                [
                    { x: left, y: canvas.height },
                    { x: left, y: top }
                ],
                [
                    { x: left - arrowLength * 0.125, y: top + arrowLength * 0.25 },
                    { x: left, y: top }
                ],
                [
                    { x: left + arrowLength * 0.125, y: top + arrowLength * 0.25 },
                    { x: left, y: top }
                ]
            ]
            ctx.lineWidth = layer.meteoSign.lineWidth;
            ctx.strokeStyle = layer.style.fontColor;

            lines.forEach(function (line) {
                ctx.beginPath();
                ctx.moveTo(line[0].x, line[0].y);
                ctx.lineTo(line[1].x, line[1].y);
                ctx.stroke();
            })

        } else {
            var symbol = meteoSign.GetWindCanvas(speed);
            ctx.drawImage(symbol, 0, 0, canvas.width, canvas.height)
        }
        canvas._symbolLeft = left;
        windSymbols[windSymbolType][level] = canvas;
    }
    if (windSymbols[windSymbolType][level]) {
        var symbol = windSymbols[windSymbolType][level];

        //"-":canvas的角度顺时针为正，而风向是逆时针为正;
        //风向符号绘制时箭头向上，而micaps格点格式的风向数据，向西为0，向南为90
        var angle = Cesium.Math.toRadians(dir - 180)// + 90);
        if (windSymbolType !== 'arrow') {
            angle += Math.PI;
        }
        var cv = document.createElement('canvas');
        cv.width = symbol.width * 2;
        cv.height = symbol.height * 2;
        var ctx1 = cv.getContext('2d');
        var xpos = cv.width / 2;
        var ypos = cv.height / 2;

        //旋转图
        ctx1.translate(xpos, ypos);
        ctx1.rotate(angle);
        ctx1.translate(-xpos, -ypos);
        ctx1.drawImage(
            symbol,
            xpos - (symbol._symbolLeft ? symbol._symbolLeft : 0),
            ypos - symbol.height
        );
        return cv;
    }

}
/** 
     *数据加载并解析完成后，回调此函数，获取站点符号。在外部或子类中重写此函数，可实现自定义站点填图符号
     *@param {Object}station 站点至少包含以下属性，更多要素，参考{@link MeteoLib.Data.Micaps.StationData}中资料代码的注释
     *@param {String}station.stationId 站号
     *@param {String}station.longitude 经度
     *@param {String}station.latitude  纬度
     * @param {MicapsUpAirLayer} layer
     *@return {Image|Canvas}
     */
function getSymbol(station, layer) {

    const { defined,
        Color,
        writeTextToCanvas
    } = Cesium;

    var T = station["601"];//温度
    var H = station["421"];//位势高度(探空)
    var Q = station["805"];//湿度
    var TTd = station["803"];//温度露点差
    var windDir = station["201"];//风向
    var windSpeed = station["203"];//风速
    var id = station["stationId"];//ID
    var Td;
    if (defined(T) && defined(TTd)) {
        Td = T - TTd;
    }
    try {
        if (typeof T != 'undefined') {
            T = T.toFixed(0);
        }
        if (typeof Q != 'undefined') {
            Q = Q.toFixed(0);
        }
        if (typeof TTd != 'undefined') {
            TTd = TTd.toFixed(0);
        }
        if (typeof H != 'undefined') {
            H = H.toFixed(0);
        }
        if (typeof Td != 'undefined') {
            Td = Td.toFixed(0);
        }
        T = Number.pad(T, 4, ' ');
        H = Number.pad(H, 4, ' ');
        Q = Number.pad(Q, 4, ' ');
        TTd = Number.pad(TTd, 4, ' ');
        Td = Number.pad(Td, 4, ' ');

        var style = layer.style;
        var opts = {
            fill: true,
            font: "bold " + style.fontSize + 'px ' + style.fontFamily,
            stroke: style.labelStroke,
            strokeWidth: style.labelStrokeWidth,
            strokeColor:
                typeof style.labelStrokeColor == 'string' ?
                    Color.fromCssColorString(style.labelStrokeColor) :
                    style.labelStrokeColor,
            fillColor: typeof style.fontColor == 'string' ?
                Color.fromCssColorString(style.fontColor) :
                style.fontColor
        };

        opts.fillColor = Color.RED;
        T = writeTextToCanvas(T, opts)
        opts.fillColor = typeof style.fontColor == 'string' ?
            Color.fromCssColorString(style.fontColor) :
            style.fontColor;

        H = writeTextToCanvas(H, opts)
        TTd = writeTextToCanvas(TTd, opts)
        Q = writeTextToCanvas(Q, opts)
        Td = writeTextToCanvas(Td, opts)
        id = writeTextToCanvas(id, opts)

        var cv = document.createElement('canvas');
        var width = id.width * 3;
        var height = id.height * 4;
        cv.width = width,
            cv.height = height;
        var ctx = cv.getContext('2d')
        //第一行
        if (T.height) ctx.drawImage(T, width / 3.0 - T.width, 0);
        if (H.height) ctx.drawImage(H, width * 2 / 3.0, 0);
        //第二行
        if (TTd.height) ctx.drawImage(TTd, width / 3.0 - TTd.width, height / 3.0);
        if (Q.height) ctx.drawImage(Q, width * 2 / 3.0, height / 3.0);
        //第三行
        if (Td.height) ctx.drawImage(Td, width / 3.0 - Td.width, height * 2 / 3.0);
        ctx.drawImage(id, width * 2 / 3.0, height * 2 / 3.0);

        if (windDir && windSpeed) {
            var wind = getWindSymbol(windSpeed, windDir, layer);

            var newH = Math.max(wind.height, cv.height);
            var newW = Math.max(wind.width, cv.width);
            var newCv = document.createElement("canvas");
            newCv.height = newH;
            newCv.width = newW;
            ctx = newCv.getContext('2d');

            if (cv.width && cv.height)
                ctx.drawImage(cv, (newW - cv.width) / 2, (newH - cv.height) / 2);

            if (wind.width && wind.height)
                ctx.drawImage(wind,
                    (newW - wind.width) / 2,
                    (newH - wind.height) / 2)

            // ctx.drawImage(cv, (newW - cv.width) / 2, (newH - cv.height) / 2);

            // ctx.drawImage(wind,
            //     (newW - wind.width) / 2,
            //     (newH - wind.height) / 2)
        }
        ctx.fillStyle = style.fontColor.toCssColorString()
        ctx.fillRect(ctx.canvas.width / 2 - 2, ctx.canvas.height / 2 - 2, 4, 4);
        return ctx.canvas;
    } catch (e) {
        console.log(e)
    }
}

function computeWindLevel(speed) {
    var level = 1;
    //1级风
    if (speed <= 1.5) {
        level = 1;
    }
    //2级风
    else if (speed <= 3.3) {
        level = 2;
    }
    //3级风
    else if (speed <= 5.4) {
        level = 3;
    }
    //4级风
    else if (speed <= 7.9) {
        level = 4;
    }
    //5级风
    else if (speed <= 10.7) {
        level = 5;
    }
    //6级风
    else if (speed <= 13.8) {
        level = 6;
    }
    //7级风
    else if (speed <= 17.1) {
        level = 7;
    }
    //8级风
    else if (speed <= 20.7) {
        level = 8;
    }
    //9级风
    else if (speed <= 24.4) {
        level = 9;
    }
    //10级风
    else if (speed <= 28.4) {
        level = 10;
    }
    //11级风
    else if (speed <= 32.6) {
        level = 11;
    }
    //12级风
    else {
        level = 12;
    }
    return level;
}

/**
* 站点数据转成geojson
*@param {MeteoLib.Data.Micaps.StationData}stationData
*@return {Geojson}
*/
function toGeojson(stationData, layer) {
    var stationIds = Object.keys(stationData.stationDataMap);
    var pts = [];

    stationIds.forEach(function (id) {

        var st = stationData.stationDataMap[id];

        st.stationId = id;

        if(typeof st.longitude=='undefined'){
            st.longitude = st["1"];
            st.latitude = st["2"];
            delete st["1"], delete st['2'];
        }
        st.symbol = getSymbol(st, layer);

        var pt = turf.point([st.longitude, st.latitude], st)
        pts.push(pt);
    })

    if (pts.length > 0) {
        pts = turf.featureCollection(pts);
        pts.name = stationData.description + "_" + stationData.level + stationData.levelDescription;
        return pts;
    }
    return null;
}

/**
 * 高空填图图层
 */
export default class MicapsUpAirLayer extends IHfsFileLayer {
    constructor(fileLoader) {
        super(fileLoader, {
            dir: 'LNData',
            path: "UPPER_AIR/PLOT/",
            ext: '*.000',
            timeRegex: 'yyyyMMddhhmmss',
            zIndex: 7
        })
        this._level = '100'

        this.ready = false;
        var deffered = {}
        this.readyPromise = new Promise((resolve, reject) => {
            deffered.resolve = resolve
            deffered.reject = reject
        })
        this._deffered = deffered

        var meteoSign = new MeteoLib.MeteoSign();
        /**
         * @type {MeteoLib.MeteoSign}
         */
        this.meteoSign = meteoSign;
        meteoSign.lineWidth = 3;
        meteoSign.size = 64;
        meteoSign.color = "black";

        this.style = {
            showLabel: true,
            fontColor: Cesium.Color.BLACK,
            labelStroke: false,
            labelStrokeWidth: 4,
            labelStrokeColor: Cesium.Color.BLACK,
            showMarker: false,
            labelPropertyName: "text",
            outlineColor: Cesium.Color.BLACK
        }
        this._windSymbolType = "windShaft";//windShaft,arrow
        this._windSymbolSize = 32;
        this.windSymbols = {};

        var _featureCollection = null;
        var imageryLayer = null;
        var _stationData = new MeteoLib.StationData()

        Object.defineProperties(this, {
            _featureCollection: {
                enumerable: false,
                get() {
                    return _featureCollection
                },
                set(val) {
                    _featureCollection = val
                }
            },
            _stationData: {
                enumerable: false,
                get() {
                    return _stationData
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

    get show(){
        return  this._show
    }
    set show(val) {
        if (this.imageryLayer) {
            this._show = val
            this.imageryLayer.show = val
        }
    }

    get channelPath() {
        return this.options.path + this.level
    }

    get level() {
        return this._level
    }
    set level(val) {
        if (this._level != val) {
            this._level = val
            this.updateList()
        }
    }

    get windSymbolType() {
        return this._windSymbolType
    }
    set windSymbolType(val) {
        if (this._windSymbolType != val) {
            this._windSymbolType = val
            this.windSymbols = {}
            this.updateImageryLayer()
        }
    }

    get windSymbolSize() {
        return this._windSymbolSize
    }
    set windSymbolSize(val) {
        if (this._windSymbolSize != val) {
            this._windSymbolSize = val
            this.windSymbols = {}
            this.updateImageryLayer()
        }
    }

    get symbolSize() {
        return this.meteoSign.size
    }
    set symbolSize(val) {
        if (this.meteoSign.size != val) {
            this.meteoSign.size = val
            this.windSymbols = {}
            this.updateImageryLayer()
        }
    }

    updateImageryLayer() {
        var { imageryLayer, earth, currentFile } = this;

        /**
         * @type {MeteoLib.StationData}
         * @private
         */
         var stationData = this._stationData;
        var fcs = toGeojson(stationData, this)
        this._featureCollection = fcs;

        removeImageryLayer(this)
        
        if (fcs && fcs.features.length > 1) {
            var provider = new CesiumVectorTile.VectorTileImageryProvider({
                source: fcs,
                defaultStyle: this.style,
                minimumLevel: 3,
                styleFilter: function (feature, style) {
                    if (feature.properties.lineWidth) {
                        style.lineWidth = feature.properties.lineWidth;
                    } else if (Cesium.defined(feature.properties.symbol)) {
                        style.markerImage = feature.properties.symbol;
                        if (style.markerImage) {
                            style.pointSize = 64;
                            style.showMarker = true;
                        } else {
                            style.showMarker = false;
                        }
                    }
                    return style;
                }
            })

            imageryLayer = earth.imageryLayers.addImageryProvider(provider)
            imageryLayer.show = this._show

            this.name = currentFile.fileName
            this.imageryLayer = imageryLayer

            //调整图层顺序
            provider.zIndex = this.zIndex;
            earth.updateOrder()

            this.ready = true
            this._deffered.resolve(this)
        }
        else {
            this.error(new Error("高空填图数据文件为空，不包含任何站点数据"))
            return;
        }

    }

    updateLayer() {
        let currentFile = this.currentFile;
        if (!currentFile) {
            return
        }

        /**
         * @type {MeteoLib.StationData}
         * @private
         */
        var stationData = this._stationData
        if (this._lastFile == this.currentFile) {
            this.updateImageryLayer();

        } else {
            var _fileLoader = this._fileLoader;
            _fileLoader.readFile(currentFile).then(buf => {
                if (stationData.loadByteArray(buf)) {
                    this.updateImageryLayer()
                } else {
                    this.onError(new Error('高空填图数据解析失败'))
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