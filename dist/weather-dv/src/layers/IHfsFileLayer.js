// import HfsFileLoader from "../HfsFileLoader";
// import '@mesh-3d/meteolib/Source/Util/ExtendMethod'
// import FileInfo from "@mesh-3d/meteolib/Source/Util/HttpFileSystem/FileInfo";

/**
 * 
 * @param {SateCloudLayer} layer 
 */
function setCurrentFile(layer) {
    if (layer.fileList.length == 1) {
        layer._currentFile = layer.fileList[0]
    } else {
        for (let i = 1; i < layer.fileList.length; i++) {
            const a = layer.fileList[i - 1], b = layer.fileList[i];
            var dB = b.datetime - layer.currentTime
            var dA = a.datetime - layer.currentTime
            if (dB == 0) {//b.datetime == layer.currentTime
                layer._currentFile = b;
                layer._currentIndex = i
                break
            } else if (dA == 0) {//a.datetime == layer.currentTime
                layer._currentFile = a;
                layer._currentIndex = i - 1
                break
            } else if (dA < 0 && dB>0) {//a.datetime < layer.currentTime < b.datetime 
                dA = Math.abs(dA)
                dB = Math.abs(dB)
                layer._currentFile = dA <= dB ? a : b;
                layer._currentIndex = dA <= dB ? i - 1 : i;
                break;
            }
        }
    }
}

//保存上次查询的时间范围
var _startTime, _endTime;

export default class IHfsFileLayer {
    /**
     * 
     * @param {HfsFileLoader} fileLoader 
     * @param {{
     *  dir: string;
     *  path: string;
     *  ext: string;
     *  fromDb: boolean;
     *  timeRegex: string;
     * }} options 
     */
    constructor(fileLoader, options) {
        options = options || {}
        this._fileLoader = fileLoader;
        this.options = Object.assign({
            dir: 'GZData',
            path: '',
            fromDb: false,
            timeRegex: 'yyyyMMddhhmmss'
        }, options)
        /**
         * @type {FileInfo[]}
         */
        this.fileList = [];
        this.timeList = []
        this.isLoading = false;
        this.earth = null;
        this.colorMap = null
        this.rectangle = null
        this.name = '未命名图层'
        this.zIndex = options.zIndex || 3

        this._currentTime = null
        /**
         * @type {FileInfo}
         * @private
         */
        this._currentFile = null;
        this._currentIndex = -1;
        this._show = true;
    }

    //可读可写属性

    get currentTime() {
        return this._currentTime
    }
    set currentTime(val) {
        if (this._currentTime != val) {
            this._currentTime = val;
            setCurrentFile(this);
            this.updateLayer()
        }
    }

    get show() {
        return this._show
    }
    set show(val) {
        if (this._show != val) {
            this._show = val;
        }
    }

    //只读属性

    get currentFile() {
        return this._currentFile
    }
    get channelPath() {
        return this.options.path
    }
    get latestTime() {
        if (!this.timeList || !this.timeList.length) return null;
        return this.timeList[this.timeList.length - 1]
    }

    updateList(startTime, endTime) {
        if (this.isLoading) {
            return this._listPromise
        }
        this.isLoading = true;

        var timeRegex = this.options.timeRegex
        if (startTime instanceof Date) {
            startTime = startTime.format(timeRegex)
        }
        if (endTime instanceof Date) {
            endTime = endTime.format(timeRegex)
        }

        if (startTime) {
            _startTime = startTime;
        }
        if (endTime) {
            _endTime = endTime;
        }

        this._listPromise = this._fileLoader.getFiles(Object.assign({}, this.options, {
            path: this.channelPath,
            startTime: _startTime,
            endTime: _endTime
        })).then(files => {
            //按时间降序排序
            files.sort((a, b) => {
                return a.datetime - b.datetime;
            })
            this.fileList.slice(0)
            this.timeList.slice(0)
            for (const file of files) {
                this.fileList.push(file)
                this.timeList.push(file.datetime)
            }
            this.isLoading = false
            this._listPromise = null
            this.onListUpdate(this);
            return this;
        }).catch(err => {
            this.isLoading = false
            this._listPromise = null
            this.onError(err)
        })
        return this._listPromise;
    }
    load(earth) {
        this.earth = earth;
        return this.updateList()
    }

    //子类需要实现的接口

    updateLayer(layer) { }
    unload(earth) {
        this.earth = null;
        throw new Error('IHfsFileLayer：卸载方法未实现')
    }
    onError(err) { }
    onListUpdate(layer) { }
}