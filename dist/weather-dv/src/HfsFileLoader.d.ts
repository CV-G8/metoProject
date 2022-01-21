
// import HttpFileSystem from '@mesh-3d/meteolib/Source/Util/HttpFileSystem/HttpFileSystem'
// import FileInfo from '@mesh-3d/meteolib/Source/Util/HttpFileSystem/FileInfo'
// import '@mesh-3d/meteolib/Source/Util/ExtendMethod'

import { HttpFileSystem, FileInfo } from '@mesh-3d/meteolib-wdv'


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
    constructor(config)
    hfs: HttpFileSystem
    isLoading: boolean
    /**
     * @type {FileInfo}
     */
    currentFileInfo: FileInfo


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
    readFile(fileInfo: FileInfo, options: {
        /**
         * 开始读取的位置（字节数）
         */
        offset?: number;
        /**
         * 读取的字节数
         */
        length?: number;
        responseType?: 'arrayBuffer' | 'blob' | 'json' | 'text' | 'xml' | 'image';
        encoding?: string;
    }): Promise<ArrayBuffer | Object | string | HTMLImageElement | Document | Blob>


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
    getFiles(options: {
        dir: string;
        path: string;
        ext?: string;
        startTime?: string;
        endTime?: string;
        timeRegex?: string;
        timeZone?: boolean;
        fromDb?: boolean;
    }): Promise<FileInfo[]>

    /**
     * 取消读取，如果还没开始读取，则直接退出排队；如果已经开始读取则在读到文件后不处理
     * @param {FileInfo} fileInfo 
     */
    cancelRead(fileInfo: FileInfo): void
}