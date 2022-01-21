

/**
 * micaps格点格式的EC数值模式图层
 */

// import RasterImageGenerator from '@mesh-3d/meteolib/Source/Render/RasterImageGenerator'
// import SwanRadar from '@mesh-3d/meteolib/Source/Data/SWAN/SwanRadar'
const { RasterImageGenerator, SwanRadar } = MeteoLib;
import HfsFileLoader from "../HfsFileLoader";
import IHfsFileLayer from "./IHfsFileLayer";

function removeImageryLayer(layer) {
    var { imageryLayer, earth } = layer;
    if (imageryLayer) {
        earth.imageryLayers.remove(imageryLayer)
        imageryLayer.imageryProvider.destroy&& imageryLayer.imageryProvider.destroy()
        layer.imageryLayer = null
    }
}

/**
 * swan格点格式的雷达拼图图层
 */
export default class SwanRadarLayer extends IHfsFileLayer {
    /**
     *  swan格点格式的雷达拼图图层
     * @param {HfsFileLoader}  fileLoader
     */
    constructor(fileLoader) {
        super(fileLoader, {
            dir: 'GZData',
            path: "SWAN_PRODUCT/LOCAL/NCRAD/TDMOSAIC",
            ext: '*.BZ2',
            timeRegex: 'yyyyMMddhhmmss',
            zIndex: 6
        })

        this._level = 0
        this._lastFile = null
        this._levelCount = 1;

        this.ready = false;
        var deffered = {}
        this.readyPromise = new Promise((resolve, reject) => {
            deffered.resolve = resolve
            deffered.reject = reject
        })
        this._deffered = deffered

        var imageryLayer = null;
        var swanRadar = null
        Object.defineProperties(this, {
            swanRadar: {
                enumerable: false,
                get() {
                    return swanRadar;
                },
                set(val) {
                    swanRadar = val
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
        return this.options.path
    }

    //层次

    get levelCount() {
        return this._levelCount;
    }
    set levelCount(val) {
        this._levelCount = val;
    }

    get level() {
        return this._level
    }
    set level(val) {
        if (this._level != val) {
            this._level = val;
            if (this._lastFile && this.swanRadar) {
                this.updateImageryLayer()
            }
        }
    }

    /**
     * 基于当前时次的数据重新绘制
     */
    updateImageryLayer() {
        var { imageryLayer, earth, currentFile } = this;
        /**
        * @type {SwanRadar}
        * @private
        */
        var swanRadar = this.swanRadar, header = swanRadar.header

        removeImageryLayer(this)

        /**
         * @type {RasterImageGenerator}
         */
        var imageGenerator = RasterImageGenerator.Radar.R;
        var colorMap = imageGenerator.colorMap;

        var width = header.LonNumGrids, height = header.LatNumGrids;
        var length = header.LatNumGrids * header.LonNumGrids;
        var offset = this.level * length;
        var data = new Float32Array(swanRadar.data.buffer, offset, length);
        var rectangle = swanRadar.rectangle

        var image = imageGenerator.generate(data, width, height);

        var provider = new Cesium.SingleTileImageryProvider({
            url: image,
            rectangle: rectangle
        });

        imageryLayer = earth.imageryLayers.addImageryProvider(provider)
        imageryLayer.show = this._show

        this.name = currentFile.fileName
        this.colorMap = colorMap
        this.imageryLayer = imageryLayer
        this.rectangle = rectangle;
        this.levelCount = header.ZNumGrids

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

        if (this.swanRadar && this._lastFile == currentFile) {
            this.updateImageryLayer();

        } else {
            var _fileLoader = this._fileLoader;
            _fileLoader.readFile(currentFile).then(buf => {
                return new Promise((resolve, reject) => {
                    SwanRadar.load(buf, currentFile.fileName).then(resolve).otherwise(reject);
                })
            }).then((swanRadar) => {
                this.swanRadar = swanRadar;
                this._lastFile = currentFile
                this.updateImageryLayer()
            }).catch(err => {
                this._lastFile = null
                console.error(err);
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