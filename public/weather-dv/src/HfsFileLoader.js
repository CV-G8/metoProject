
// import HttpFileSystem from '@mesh-3d/meteolib/Source/Util/HttpFileSystem/HttpFileSystem'
// import FileInfo from '@mesh-3d/meteolib/Source/Util/HttpFileSystem/FileInfo'
// import '@mesh-3d/meteolib/Source/Util/ExtendMethod'

const { HttpFileSystem, FileInfo } = MeteoLib

function extractDatetime(data) {
    var timeRegex = data.timeRegex;
    if (!timeRegex) {
        timeRegex = 'yyyyMMddhhmm';
    }
    var regex = timeRegex;
    regex = regex.replace("yyyy", "\\d{4}");
    regex = regex.replace("MM", "\\d{2}");
    regex = regex.replace("dd", "\\d{2}");
    regex = regex.replace("hh", "\\d{2}");
    regex = regex.replace("mm", "\\d{2}");
    regex = regex.replace("ss", "\\d{2}");
    regex = new RegExp(regex);
    var time = regex.exec(data.fileName);
    if (!time || !time.length) {
        time = regex.exec('20' + data.fileName);
    }
    if (!time || !time.length) {
        time = null;
    } else {
        time = parseDate(time[0], timeRegex);
    }
    if (data.timeZone) {
        time = time.add('h', data.timeZone)
    }
    data.datetime = time;
    return time;
}

/**
 * 
 * @param {HfsFileLoader} loader 
 * @private
 */
function executeRead(loader) {
    if (loader._fileList.length == 0) {
        loader.isLoading = false
        return;
    }

    var fileInfo = loader._fileList.shift()
    var options = loader._readOptionsList.shift() || {}
    var { offset, length, responseType, encoding } = options;
    var deferred = loader._deferredList.shift()

    if (!fileInfo || fileInfo._aborted) {
        if (deferred) {
            delete deferred.resolve
            delete deferred.reject
        }
        executeRead(loader);
        return;
    }

    //指示文件正在加载
    fileInfo.isLoading = true;
    //指示加载器正在加载文件
    loader.isLoading = true;
    //设置当前正在加载的文件信息
    loader.currentFileInfo = fileInfo

    loader.hfs.readFile(fileInfo, offset, length, responseType, encoding).then(res => {
        fileInfo.loaded = true;
        fileInfo.isLoading = false;

        if (!fileInfo._aborted) {
            deferred.resolve(res);
        }

        fileInfo = null;
        loader.currentFileInfo = null
        delete deferred.resolve
        delete deferred.reject

        executeRead(loader);

    }).otherwise(reason => {
        fileInfo.isLoading = false;
        fileInfo = null;
        loader.currentFileInfo = null

        deferred.reject(reason);
        executeRead(loader)
    })
}

/**
 * hfs文件加载器，内部会自动排队，逐个文件地执行读取
 * @example
var hfsLoader = new HfsFileLoader({
    baseUrl: 'http://39.107.107.142:18880/hfs',
    auth: {
        uid: 'admin',
        pwd: 'Adnin@123456'
    }
})
hfsLoader.hfs.getFiles('GZData', 'ECMWF_LR/RH/850', '.000').then(files => {
    console.log(files);
    var promises = files.map(file => {
        return hfsLoader.load(file)
    })
    Promise.all(promises).then(fileBuffers => {
        console.log(fileBuffers);
    })
})
 */
export default class HfsFileLoader {
    /**
     *hfs文件加载器，内部会自动排队，逐个文件地执行读取 
     * @param {{
     *  baseUrl:string
     *  auth: {
     *      uid: string
     *      pwd: string
     *  }
     * }} config 
     * @example
var hfsLoader = new HfsFileLoader({
    baseUrl: 'http://39.107.107.142:18880/hfs',
    auth: {
        uid: 'admin',
        pwd: 'Adnin@123456'
    }
})
hfsLoader.hfs.getFiles('GZData', 'ECMWF_LR/RH/850', '.000').then(files => {
    console.log(files);
    var promises = files.map(file => {
        return hfsLoader.load(file)
    })
    Promise.all(promises).then(fileBuffers => {
        console.log(fileBuffers);
    })
})
     */
    constructor(config) {
        this.hfs = new HttpFileSystem({
            config: config
        })
        this._fileList = [];
        this._readOptionsList = [];
        this._deferredList = [];
        this.isLoading = false;
        /**
         * @type {FileInfo}
         */
        this.currentFileInfo = null
    }

    /**
     * 读取文件数据，如果加载器正在读取文件则排队等待
     * @param {FileInfo} fileInfo 
     * @param {object} [options] 
     * @param {Number} [options.offset=0] 可选，开始读取的位置（字节数）
     * @param {Number} [options.length] 可选，读取的字节数 
     * @param {'arrayBuffer'|'blob'|'json'|'text'|'xml'|'image'} [options.responseType="arrayBuffer"]
     * @param {String} [options.encoding]
     * @returns 
     */
    readFile(fileInfo, options) {
        if (this._fileList.includes(fileInfo)) {
            return;
        }
        this._fileList.push(fileInfo);
        this._readOptionsList.push(options);
        var deferred = {}
        this._deferredList.push(deferred);
        fileInfo._aborted = false

        var readPromise = new Promise((resolve, reject) => {
            deferred.resolve = resolve
            deferred.reject = reject
        });

        if (!this.isLoading) {
            executeRead(this);
        } else {
            //指示文件正在排队等待
            fileInfo.isWaiting = true;
        }

        return readPromise;
    }

    /**
     * 获取文件列表
    * @param {object} options
    * @param {String} options.dir 根目录名称
    * @param {String} options.path 相对路径
    * @param {String} [options.ext] 可选，如"*.png"等
    * @param {String} [options.startTime] 可选，开始时间
    * @param {String} [options.endTime] 可选，结束时间
    * @param {String} [options.timeRegex] 可选，按文件名中的时间筛选，指定时间格式
    * @param {Boolean} [options.timeZone=0] 时区，0表示北京时间（BTC），8表示世界时间（UTC）
    * @param {Boolean} [options.fromDb=true] 可选，从数据库中检索
    *@return {Promise<FileInfo[]>}
    */
    getFiles(options) {
        var { dir, path, ext, startTime, endTime, timeRegex, fromDb, timeZone } = options
        return new Promise((resolve, reject) => {
            this.hfs.getFiles(dir, path, ext, startTime, endTime, timeRegex, fromDb).then(files => {
                if (fromDb == false) {
                    files = files.map(file => {
                        file = {
                            fileName: file,
                            dir: dir,
                            path: path,
                            size: 0
                        }
                        file.timeZone = options.timeZone;
                        file.timeRegex = options.timeRegex;
                        extractDatetime(file)
                        return file;
                    })
                } else {
                    files.forEach(file => {
                        if (file.datetime) {
                            file.datetime = new Date(file.datetime)
                            if (data.timeZone) {
                                file.datetime.add('h', data.timeZone)
                            }
                        }
                    })
                }

                resolve(files);

            }).otherwise(reject)
        });
    }

    /**
     * 取消读取，如果还没开始读取，则直接退出排队；如果已经开始读取则在读到文件后不处理
     * @param {FileInfo} fileInfo 
     */
    cancelRead(fileInfo) {
        if (!fileInfo.isLoading) {
            var idx = this._fileList.indexOf(fileInfo)
            this._fileList.splice(idx, 1);
        } else {
            fileInfo._aborted = true;
        }
    }
}