/**
 * 卫星云图图层
 */

// import AwxSateImageryProvider from "@mesh-3d/meteolib/Source/Scene/AwxSateImageryProvider";
const { AwxSateImageryProvider } = MeteoLib;
import HfsFileLoader from "../HfsFileLoader";
import IHfsFileLayer from "./IHfsFileLayer";

export default class SateCloudLayer extends IHfsFileLayer {
    /**
     *   
     * @param {HfsFileLoader}  fileLoader
     */
    constructor(fileLoader) {
        super(fileLoader, {
            dir: 'GZData',
            path: "SATELLITE/FY4A/L1/CHINA/",
            ext: '*.awx',
            zIndex: 2
        })

        this._channel = 'C001'

        this.ready = false;
        var deffered = {}
        this.readyPromise = new Promise((resolve, reject) => {
            deffered.resolve = resolve
            deffered.reject = reject
        })
        this._deffered = deffered

        var imageryLayer = null;
        Object.defineProperties(this, {
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
        return this.options.path + this.channel
    }

    /**
     * 可见光：C002
     * 红外：C012
     * 水汽：C008
     */
    get channel() {
        return this._channel
    }
    set channel(val) {
        if (this._channel != val) {
            this._channel = val;
            this.updateList()
        }
    }

    updateLayer() {
        let currentFile = this._currentFile;
        if (!currentFile) {
            return
        }
        var { imageryLayer, earth, channelPath, options } = this;
        if (imageryLayer) {
            earth.imageryLayers.remove(imageryLayer)
            imageryLayer.imageryProvider.destroy()
            this.imageryLayer = imageryLayer = null
        }

        var fileName = currentFile.fileName;
        var iPrvovider = new AwxSateImageryProvider({
            url: this._fileLoader.hfs.getUrl({
                dir: options.dir,
                path: channelPath
            }),
            fileName: fileName
        })
        imageryLayer = earth.imageryLayers.addImageryProvider(iPrvovider);
        imageryLayer.show = this._show

        iPrvovider.readyPromise.then(() => {
            var imageGenerator = iPrvovider.imageGenerator
            this.colorMap = imageGenerator.colorMap
            this.rectangle = iPrvovider._dataRectangle

            this.ready = true
            this._deffered.resolve(this)

        }).otherwise(reason => {
            this._deffered.reject(reason)
        })

        this.imageryLayer = imageryLayer
        this.name = currentFile.fileName

        //调整图层顺序
        iPrvovider.zIndex = this.zIndex;
        earth.updateOrder()

    }

    unload() {
        var { imageryLayer, earth } = this;
        if (imageryLayer) {
            earth.imageryLayers.remove(imageryLayer)
            imageryLayer.imageryProvider.destroy()
            imageryLayer = null
        }
    }
}