/**
 * 单站雷达PUP产品图层
 */

// import PupProductFormat from '@mesh-3d/meteolib/Source/Data/PUP/PupProductFormat'
// import RasterImageGenerator from '@mesh-3d/meteolib/Source/Render/RasterImageGenerator'
// import CoordinateHelper from '@mesh-3d/meteolib/Source/Data/Radar/CoordinateHelper';
// import MyLatLng from '@mesh-3d/meteolib/Source/Data/Radar/MyLatLng'
const { PupProductFormat, RasterImageGenerator, CoordinateHelper, MyLatLng } = MeteoLib;
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
 * 获取产品名称
 * @param {*}} code 
 * @returns 
 */
function getDataName(code) {

    //基本反射率  19  /R/19
    //基本反射率  20  /R/20
    //基本速度    26  /V/26
    //基本速度    27  /V/27
    //组合反射率  37  /CR/37
    //组合反射率  38  /CR/38
    //回波顶高    41  /ET/41
    //风廓线      48  /VWP/48
    //风暴相对平均径向速度 56 /SRM/56
    //垂直积分液态含水量  57 /VIL/57
    //风暴追踪信息    58  /STI/58
    //冰雹指数        59  /HI/59 
    //中尺度气旋      60  /M/60
    //龙卷漩涡特征    61  /TVS/61
    //一小时累积降水  78  /OHP/78
    //三小时累积降水  79  /THP/79
    //风暴总累计降水  80  /STP/80
    //CAPPI反射率     110 /CAR/110

    var dataName = "";
    switch (code) {
        case 36:
        case 37:
        case 38: dataName = "CR";
            break;
        case 41: dataName = "ET";
            break;
        case 57: dataName = "VIL";
            break;
        default:
            return undefined;
    }
    return dataName;
}

/**
 * 获取产品分辨率，单位为km
 * @param {*} code 
 * @returns 
 */
function getResolution(code) {
    switch (code) {
        case 37:
            return 0.54;
        case 36:
        case 38:
        case 41:
        case 57:
            return 2.2;
        default:
            return undefined;
    }

}


/**
* 雷达局部坐标转经纬高度（等距离投影时使用）
* @param {any} centerWC
* @param {any} srcLC
* @param {any} resultCartographic
*@private
*/
function radarCoordinatesToCartographicEquidistance(centerWC, srcLC, ellipsoid, resultCartographic) {
    const { Cartographic, Ellipsoid } = Cesium, _Math = Cesium.Math
    if (ellipsoid instanceof Cartographic) {
        resultCartographic = ellipsoid;
        ellipsoid = null
    }
    if (!ellipsoid) {
        ellipsoid = Ellipsoid.WGS84;
    }
    if (!resultCartographic) {
        resultCartographic = new Cartographic()
    }
    resultCartographic = Cartographic.fromCartesian(centerWC);
    var cn = new MyLatLng(
        _Math.toDegrees(resultCartographic.longitude),
        _Math.toDegrees(resultCartographic.latitude)
    );
    var length = Math.sqrt(Math.pow(srcLC.x, 2) + Math.pow(srcLC.y, 2));
    var angle = _Math.toDegrees(Math.atan2(srcLC.x, srcLC.y));
    var lonlat = CoordinateHelper.getMyLatLng(cn, length / 1000.0, angle);
    resultCartographic.longitude = _Math.toRadians(lonlat.m_Longitude);
    resultCartographic.latitude = _Math.toRadians(lonlat.m_Latitude);
    resultCartographic.height = 0;
    return resultCartographic;

}

/**
 * 计算产品四至范围
 * @param {*} pupProduct 
 * @returns 
 */
function computeViewRectangle(pupProduct) {
    const { Cartesian3, Rectangle } = Cesium, _Math = Cesium.Math;

    var packet = pupProduct.productSymbology.layers[0].packets[0];

    var width = packet.numberOfRows,
        height = width;

    var cnLon = pupProduct.productDescription.longitude;
    var cnLat = pupProduct.productDescription.latitude;
    var cnH = pupProduct.productDescription.height * 0.3048; //英尺转米
    var res = getResolution(pupProduct.msgHeader.code);

    var xDistance = width * res / 4 + 36,
        yDistance = height * res / 4 + 30;

    var cn = Cartesian3.fromDegrees(cnLon, cnLat, cnH);
    var west = 190, south = 190, east = -190, north = -190;
    var xs = [xDistance, -xDistance];
    var ys = [yDistance, -yDistance];
    for (var i = 0; i < xs.length; i++) {
        for (var j = 0; j < ys.length; j++) {
            var lc = new Cartesian3(xs[i] * 1000, ys[j] * 1000, 0);
            var lonlat = radarCoordinatesToCartographicEquidistance(cn, lc);
            west = Math.min(west, lonlat.longitude);
            east = Math.max(east, lonlat.longitude);
            south = Math.min(south, lonlat.latitude);
            north = Math.max(north, lonlat.latitude);
        }
    }

    return new Rectangle(west, south, east, north);

}

/**
 * 获取产品图生成工具
 * @param {*} code 
 * @returns 
 */
function getImageGenerator(code) {
    var dataName = getDataName(code);

    var imageGenerator = null;
    if (dataName == "CR") {
        imageGenerator = RasterImageGenerator.Radar.R;
    } else if (dataName == "ET") {
        imageGenerator = RasterImageGenerator.Radar.ET;
    } else if (dataName == "VIL") {
        imageGenerator = RasterImageGenerator.Radar.VIL;
    }
    return imageGenerator
}

/**
 * 单站雷达PUP产品图层
 */
export default class PUPRadarLayer extends IHfsFileLayer {
    /**
     * 单站雷达PUP产品图层
     * @param {HfsFileLoader}  fileLoader
     */
    constructor(fileLoader) {
        super(fileLoader, {
            dir: 'GZData',
            path: "SINGLERADAR/PRODUCTS",
            ext: '*.851',
            zIndex: 6,
            timeRegex: 'yyyyMMdd.hhmmss'
        })

        this._station = '贵阳'
        this._prodCode = 'CR/38'

        var _pupProduct = new PupProductFormat()

        this.ready = false;
        var deffered = {}
        this.readyPromise = new Promise((resolve, reject) => {
            deffered.resolve = resolve
            deffered.reject = reject
        })
        this._deffered = deffered

        var imageryLayer = null;
        Object.defineProperties(this, {
            _pupProduct:{
                enumerable: false,
                get(){
                    return _pupProduct
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
        return [this.options.path, this.station, this.prodCode].join('/');
    }

    //雷达站点名称
    get station() {
        return this._station
    }
    set station(val) {
        if (this._station != val) {
            this._station = val;
            this.updateList()
        }
    }

    /**
     * 产品代码:
     * * 组合反射率： CR/38
     * * 回波顶高：ET/41
     * * 垂直积分液态含水量：VIL/57
     */
    get prodCode() {
        return this._prodCode
    }
    set prodCode(val) {
        if (this._prodCode != val) {
            this._prodCode = val;
            this.updateList()
        }
    }


    /**
     * 基于当前时次的数据重新绘制
     */
    updateImageryLayer() {
        var { imageryLayer, earth, currentFile } = this;
        /**
         * @type {PupProductFormat}
         * @private
         */
        var pupProduct = this._pupProduct

        removeImageryLayer(this)

        /**
         * @type {RasterImageGenerator}
         */
        var imageGenerator = getImageGenerator(pupProduct.msgHeader.code);
        var colorMap = imageGenerator.colorMap;
        var rectangle = computeViewRectangle(pupProduct);
        var packet = pupProduct.productSymbology.layers[0].packets[0];
        var width = packet.numberOfRows, height = width;
        var data = packet.colorCodes;

        var oldSelectColorByIndex = imageGenerator.selectColorByIndex;
        imageGenerator.selectColorByIndex = true;

        var image = imageGenerator.generate(data, width, height);

        imageGenerator.selectColorByIndex = oldSelectColorByIndex;

        var provider = new Cesium.SingleTileImageryProvider({
            url: image,
            rectangle: rectangle
        })

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

        /**
         * @type {PupProductFormat}
         * @private
         */
        var pupProduct = this._pupProduct
        if (this._lastFile == this.currentFile) {
            this.updateImageryLayer();

        } else {
            var _fileLoader = this._fileLoader;
            _fileLoader.readFile(currentFile).then(buf => {
                if (pupProduct.loadByteArray(buf)) {
                    this.updateImageryLayer()
                } else {
                    this.onError(new Error('PUP雷达产品数据解析失败'))
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