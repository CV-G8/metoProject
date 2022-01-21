/**
  *
  *文件信息，将文件全路径拆分为三部分分别维护，<br/>
  *dir———文件所属根目录即根目录，用该目录在系统中的唯一名称表示，物理路径等其他信息在数据库存储；
  *path———文件所在目录相对于根目录的路径；
  *fileName———文件名
  *举例：服务器上文件“D:/xxx/exampleRoot/subDir1/subDir2/fileNamePart0.ext”拆分后
  *可以将D:/xxx/exampleRoot作为根目录并命名为root1,
  *则path为“subDir1/subDir2”，
  *fileName为fileNamePart0.ext，使用json表达如下:
  *{
  *    dir:"root1",
  *    path:"subDir1/subDir2",
  *    fileName:"fileNamePart0.ext"
  *} 
  */declare class FileInfo {
    /**
    *
    *文件信息，将文件全路径拆分为三部分分别维护，<br/>
    *dir———文件所属根目录即根目录，用该目录在系统中的唯一名称表示，物理路径等其他信息在数据库存储；
    *path———文件所在目录相对于根目录的路径；
    *fileName———文件名
    *举例：服务器上文件“D:/xxx/exampleRoot/subDir1/subDir2/fileNamePart0.ext”拆分后
    *可以将D:/xxx/exampleRoot作为根目录并命名为root1,
    *则path为“subDir1/subDir2”，
    *fileName为fileNamePart0.ext，使用json表达如下:
    *{
    *    dir:"root1",
    *    path:"subDir1/subDir2",
    *    fileName:"fileNamePart0.ext"
    *} 
    */
    constructor(options)

    /**
    *文件名
    *@type {String}
    */
    fileName: string
    /**
    *文件日期（从文件名中提取）
    *@type {Date}
    */
    datetime: string | Date
    /**
    *
    *根目录物理路径名称，对应{@link MeteoLib.Util.HttpFileSystem.DirectoryInfo}的name属性
    *@type {String}
    */
    dir: string
    /**
    *相对路径，相对于dir表示的根目录物理路径，比如dir指向的是“D:/TestData”，那么“D:/TestData/someDir/sub1”的相对路径path为“/someDir/sub1”
    *@type {String} 
    */
    path: string
    /**
    *文件大小
    *@type {Number}
    */
    size?: number
}
declare class HFSConfig {
    baseUrl: string
    auth: {
        uid: string,
        pwd: string
    }
}
declare class DirectoryInfo {
    name: string
    absoluteDir?: string
    description?: string
}

declare class ApiResponse {
    errorCode: string
    msg: string
}

/**
 * 基于http协议的网络文件系统接口
 */declare class HttpFileSystem {

    /**
    *基于http协议的网络文件系统接口
    *@param {Object}options
    *@param {MeteoLib.Util.HttpFileSystem.HFSConfig}[options.config= MeteoLib.Util.HttpFileSystem.HFSConfig.DEFAULT]
    *@property {MeteoLib.Util.HttpFileSystem.HFSConfig}config
    *@constructor
    *@memberof MeteoLib.Util
    *@example
        var HttpFileSystem = MeteoLib.Util.HttpFileSystem;
     
        var hfs = new HttpFileSystem({
            config: {
                baseUrl: 'http://127.0.0.1:18880/hfs',
                auth: {
                    uid: 'xxx',
                    pwd: 'xxx'
                }
            }
        });
     
        hfs.getDirectoryList().then(function (dirList) {
            console.log(dirList);
            hfs.getFiles(dirList[0], 'SATELLITE/FY4A/L1/CHINA/C002')
                .then(function (fileList) {
                console.log(fileList);
                var fileUrl = hfs.getFileUrl(fileList[0]);
                window.open(fileUrl)
            })
        })
    
    */
    constructor(options:{
        config:HFSConfig
    }) 
    config: HFSConfig
    static HFSConfig: typeof HFSConfig;
    static DirectoryInfo: typeof DirectoryInfo;
    static FileInfo: typeof FileInfo;
    static ApiResponse: typeof ApiResponse;

    /**
    *
    *@param {Object}params
    *@return {String}
    */
    getUrl(params: object): string
    /**
     * 新增目录，将服务器上存在的文件夹信息录入数据库。
    *@param {MeteoLib.Util.HttpFileSystem.DirectoryInfo}dirInfo
    *@return {Promise<ApiResponse>|Promise<Any>}
    */
    addDirectory(dirInfo): Promise<ApiResponse>
    /**
     * 获取目录列表
    *@return {Promise<MeteoLib.Util.HttpFileSystem.DirectoryInfo>}
    */
    getDirectoryList(): Promise<DirectoryInfo | string>

    /**
     * 获取文件详细信息
     */
    getFileInfo(fileInfo: FileInfo | {
        fileName: string;
        dir: string;
        path: string;
    }): FileInfo


    /**
     * 获取文件元数据（目前只支持hdf、nc格式文件的元数据读取）
     */
    getMetaData(fileInfo: FileInfo | {
        fileName: string;
        dir: string;
        path: string;
    }): object


    /**
     * 读取hdf、nc格式数据指定变量
     * @param {MeteoLib.Util.HttpFileSystem.FileInfo}fileInfo
     * @param {String}variable 
     * @return {Promise<MeteoLib.Util.ApiResponse|Object>}
     */
    readVariable(fileInfo: FileInfo | {
        fileName: string;
        dir: string;
        path: string;
    }, variable: string): Promise<ApiResponse | Object>


    /**
     * 读取hdf、nc格式文件的元数据和所有变量数据
     * @param {MeteoLib.Util.HttpFileSystem.FileInfo}fileInfo
     * @param {Array<String>|String}variables 数组或字符串，用字符串时多个变量用','分隔
     * @return {Promise<MeteoLib.Util.ApiResponse|Object>}
     */
    readNetCDF4(fileInfo: FileInfo | {
        fileName: string;
        dir: string;
        path: string;
    }, variables: string | string[])

    /**
     * 获取文件列表
    * @param {MeteoLib.Util.HttpFileSystem.DirectoryInfo|String}dirInfo 根目录对象或者名称
    * @param {String}[path]
    * @param {String} [ext] 可选，如"*.png"等
    * @param {String} [startTime] 可选，开始时间
    * @param {String} [endTime] 可选，结束时间
    * @param {String} [timeRegex] 可选，按文件名中的时间筛选，指定时间格式
    * @param {Boolean} [fromDb=true] 可选，从数据库中检索，为兼容旧版本而增加的参数，未来版本将移除
    *@return {Promise<MeteoLib.Util.HttpFileSystem.FileInfo>}
    */
    getFiles(dirInfo: string, path: string, ext?: string, startTime?: string, endTime?: string, timeRegex?: string, fromDb?: boolean): Promise<FileInfo>

    /**
    * @param {MeteoLib.Util.HttpFileSystem.DirectoryInfo|String}dirInfo
    * @param {String}path
    * @param {String}fileName
    * @return {Promise<Boolean>}
    * @example 
    * 
        hfs.getDirectoryList().then(function (dirList) { 
            hfs.exists(dirList[0], 'SATELLITE/FY4A/L1/CHINA/C002')
                .then(function (exists) {
                    if(exists){
                        //todo
                    }else{
                        //error
                    }
                })
        })
     */
    exists(dirInfo: string, path: string, fileName: string): Promise<Boolean>
    /**
    * @param {MeteoLib.Util.HttpFileSystem.DirectoryInfo|String}dirInfo
    * @param {String}path
    * @return {Promise<Array.<String>>}
    */
    getSubDirs(dirInfo: string, path?: string): Promise<string[]>
    /**
     *获取文件url
     * @param {MeteoLib.Util.HttpFileSystem.FileInfo}fileInfo 文件信息
     * @param {Number} [offset=0] 可选，开始读取的位置（字节数）
     * @param {Number} [length] 可选，读取的字节数 
     * @returns {Promise<ArrayBuffer>}  
     */
    getFileUrl(fileInfo: FileInfo | {
        fileName: string;
        dir: string;
        path: string;
    }, offset?: number, length?: number): Promise<ArrayBuffer>


    /**
     *读取文件（块）
     * @param {MeteoLib.Util.HttpFileSystem.FileInfo|Object}fileInfo 文件信息
     * @param {MeteoLib.Util.HttpFileSystem.FileInfo|Object}fileInfo.dir 文件所属根目录名称
     * @param {MeteoLib.Util.HttpFileSystem.FileInfo|Object}fileInfo.path 文件所在目录相对于根目录的路径
     * @param {MeteoLib.Util.HttpFileSystem.FileInfo|Object}fileInfo.fileName 文件名
     * @param {Number} [offset=0] 可选，开始读取的位置（字节数）
     * @param {Number} [length] 可选，读取的字节数 
     * @param {String} [responseType="arrayBuffer"] 可选的值有:arrayBuffer,blob,json,text,xml,image
     * @param {String} [encoding]
     * @returns {Promise<ArrayBuffer>}  
     * @example
     * //1、读取整个文件，返回arrayBuffer
     * hfs.readFile(fileInfo).then(function(buf){
     *      //TODO
     * }).otherwise(function(reason){
     *      //throw 
     * })
     * //2、从文件中读取一块数据，返回arrayBuffer
     * hfs.readFile(fileInfo,0,1024).then(function(buf){
     *      //TODO
     * }).otherwise(function(reason){
     *      //throw 
     * })
     * //3、读取整个文件，返回json
     * hfs.readFile(fileInfo,'json').then(function(json){
     *      //TODO
     * }).otherwise(function(reason){
     *      //throw 
     * })
     * //4、读取整个文件，并按指定编码解码，返回文本
     * hfs.readFile(fileInfo,'text','gb2312').then(function(text){
     *      //TODO
     * }).otherwise(function(reason){
     *      //throw 
     * })
     * //5、读取整个文件，返回图片
     * hfs.readFile(fileInfo,'image').then(function(image){
     *      //TODO
     * }).otherwise(function(reason){
     *      //throw 
     * })
     */
    readFile(fileInfo: FileInfo | {
        fileName: string;
        dir: string;
        path: string;
    }, offset?: number, length?: number, responseType?: "arrayBuffer" | "blob" | "json" | "text" | "xml" | "image" | "encoding"): Promise<Object | ArrayBuffer | string | Document | HTMLImageElement>

    /**
     *使用读取栅格数据的方式读取文件数据
     * @param {MeteoLib.Util.HttpFileSystem.FileInfo}fileInfo 文件信息
     * @param {Number} xOffset 列偏移量
     * @param {Number} yOffset 行偏移量
     * @param {Number} xSize 将读取原始栅格数据的列数（宽度）
     * @param {Number} ySize 将读取原始栅格数据的行数（高度）
     * @param {Number} [typeSize=0] 每个像素数据占用的字节数
     * @param {Number} xBufferSize 读取数据后存放的缓冲区列数
     * @param {Number} yBufferSize 读取数据后存放的缓冲区行数
     * @param {Number} stride 原始栅格数据宽度
     * @param {Array.<Number>} [bandOffsets] 读取多个波段时需要单独设置各个波段的起始位置（该波段第一个字节的位置相对于整个文件开头的字节数）
     * @param {Boolean} [flipY=false] true则图像上下翻转，默认为false
     * @param {Number} [numberOfY=0] 原始栅格数据高度（行数）
     * @param {Number} [headerSize=0] 文件头占用字节数，读取时将跳过此数据块。可选，默认为0
     * @param {Boolean} [compress=false] 默认为false，指示返回结果需要gzip压缩。为false则不压缩
     * @returns {Promise<ArrayBuffer>}  
     */
    readRasterData(
        fileInfo: FileInfo | {
            fileName: string;
            dir: string;
            path: string;
        },
        xOffset: number, yOffset: number, xSize: number, ySize: number, stride: number,
        typeSize?: number, xBufferSize?: number, yBufferSize?: number,
        bandOffsets?: number[], flipY?: boolean, numberOfY?: number,
        headerSize?: number, compress?: boolean
    ): Promise<ArrayBuffer>
    /**
     * 扫描目录，将文件名及时间信息录入数据库
    *@param {MeteoLib.Util.HttpFileSystem.DirectoryInfo|String}dirInfo
    *@param {String}timeRegex
    *@param {String}ext
    *@return {Promise<ApiResponse>|Promise<Any>}
    */
    scanDirectory(dirInfo: string, path: string, timeRegex: string, ext: string): Promise<ApiResponse>


    /**
    *上传文件
    * @param {MeteoLib.Util.HttpFileSystem.DirectoryInfo|String}dirInfo
    * @param {String}path
    * @param {File|Blob}file 
    * @param {Object}options 可选参数
    * @param {String}[options.fileName] 文件名
    * @param {Date} [options.datetime] 时间
    * @param {Boolean}[options.overwrite] 覆盖旧文件
    * @param {Boolean}[options.rename] 允许系统重命名，使用全局唯一标识的fileId字段作为文件名，文件扩展名不变
    * @param {MeteoLib.Util.HttpFileSystem~uploadFileProgressCallback}[options.onProgress] 上传进度变化时执行的回调函数
    * @param {MeteoLib.Util.HttpFileSystem~uploadFileProgressCallback}[options.onCancel] 取消上传后执行的回调函数
    *@returns {Promise<MeteoLib.Util.ApiResponse>} promise
    *@returns {function} promise.abort
    *@example 
            var Api = MeteoLib.Util;
            var dir = "TestDisk", path = "/", fname = "test.txt";
            var hfs = new Api.HttpFileSystem({
                config: {
                    baseUrl: 'http://127.0.0.1:8081/hfs',
                    auth: {
                        uid: 'gt-admin',
                        pwd: 'wm-server-1024'
                    }
                }
            })
            var file = new File(["hello!hfs uploadFile"], fname)
            var promise = hfs.uploadFile(dir, '/txt', file, {
                onProgress:function(e){
                    var progress=e.loaded/e.total;//0~1
                    console.log(progress)
                }
            });
            if (promise) {
                promise.then(function (rsp) {
    
                    if (rsp.errorCode) {
                        alert(rsp.msg)
                    } else {
                        alert(JSON.stringify(rsp.files))
                    }
                    console.log(rsp)
                }).otherwise(function (err) {
                    console.error(err)
                    alert(err)
                })
                //取消上传
                //promise.abort();
                
            }
    */
    uploadFile(dirInfo: string, path: string, file: File | Blob, options: {
        /**
         * 文件名
         */
        fileName: string
        /**
         * 时间
         */
        datetime?: Date
        /**
         * 覆盖旧文件
         */
        overwrite?: boolean
        /**
         * 允许系统重命名，使用全局唯一标识的fileId字段作为文件名，文件扩展名不变
         */
        rename?: boolean
        onProgress: (e: ProgressEvent) => void
        onCancel: () => void
    }): Promise<ApiResponse>

}
/**
 * 实现在浏览器端读取通过input打开的本地文件，支持大文件分块读取，接口与HttpFileSystem一致 
 */declare class FileSystem {
    /**
     * 实现在浏览器端读取通过input打开的本地文件，支持大文件分块读取，接口与HttpFileSystem一致
     */
    constructor()

    /**
    *读取文件（块）
    * @param {File|Blob}fileInfo 本地文件
    * @param {Number} [offset=0] 可选，开始读取的位置（字节数）
    * @param {Number} [length] 可选，读取的字节数 
    * @param {String} [responseType="arrayBuffer"] 可选的值有:arrayBuffer,blob,json,text,xml,image
    * @param {String} [encoding]
    * @returns {Promise<ArrayBuffer>}  
    * @example
    * //1、读取整个文件，返回arrayBuffer
    * fs.readFile(fileInfo).then(function(buf){
    *      //TODO
    * }).otherwise(function(reason){
    *      //throw 
    * })
    * //2、从文件中读取一块数据，返回arrayBuffer
    * fs.readFile(fileInfo,0,1024).then(function(buf){
    *      //TODO
    * }).otherwise(function(reason){
    *      //throw 
    * })
    * //3、读取整个文件，返回json
    * fs.readFile(fileInfo,'json').then(function(json){
    *      //TODO
    * }).otherwise(function(reason){
    *      //throw 
    * })
    * //4、读取整个文件，并按指定编码解码，返回文本
    * fs.readFile(fileInfo,'text','gb2312').then(function(text){
    *      //TODO
    * }).otherwise(function(reason){
    *      //throw 
    * })
    * //5、读取整个文件，返回图片
    * fs.readFile(fileInfo,'image').then(function(image){
    *      //TODO
    * }).otherwise(function(reason){
    *      //throw 
    * })
    */
    readFile(fileInfo?: File | Blob, offset?: number, length?: number, responseType?: "arrayBuffer" | "blob" | "json" | "text" | "xml" | "image" | "encoding"): Promise<Object | ArrayBuffer | string | Document | HTMLImageElement>


    /**
     *使用读取栅格数据的方式读取文件数据
     * @param {File|Blob}fileInfo 文件信息
     * @param {Number} xOffset 列偏移量
     * @param {Number} yOffset 行偏移量
     * @param {Number} xSize 将读取原始栅格数据的列数（宽度）
     * @param {Number} ySize 将读取原始栅格数据的行数（高度）
     * @param {Number} [typeSize=0] 每个像素数据占用的字节数
     * @param {Number} xBufferSize 读取数据后存放的缓冲区列数
     * @param {Number} yBufferSize 读取数据后存放的缓冲区行数
     * @param {Number} stride 原始栅格数据宽度
     * @param {Array.<Number>} [bandOffsets] 读取多个波段时需要单独设置各个波段的起始位置（该波段第一个字节的位置相对于整个文件开头的字节数）
     * @param {Boolean} [flipY=false] true则图像上下翻转，默认为false
     * @param {Number} [numberOfY=0] 原始栅格数据高度（行数）
     * @param {Number} [headerSize=0] 文件头占用字节数，读取时将跳过此数据块。可选，默认为0
     * @param {Number} [useWorker=false] true则使用webWorker读取,需要将MeteoLib源码中Source/Workers/FileSystem.js拷贝到对应的Cesium/Workers文件夹中。默认为false
     * @returns {Promise<ArrayBuffer>}  
     */
    readRasterData(
        fileInfo: File | Blob, xOffset: number, yOffset: number, xSize: number, ySize: number, stride: number,
        typeSize?: number, xBufferSize?: number, yBufferSize?: number,
        bandOffsets?: number[], flipY?: boolean, numberOfY?: number,
        headerSize?: number, useWorker?: boolean
    ): Promise<ArrayBuffer>

}
/**
* 插值工具
*/declare class Interpolate {

    /**
    *Create grid x/y coordinate arrays with x/y delt
    *@param Xlb X of left-bottom
    *@param Ylb Y of left-bottom
    *@param Xrt X of right-top
    *@param Yrt Y of right-top
    *@param XDelt X delt
    *@param YDelt Y delt 
    */
    static CreateGridXY_Delt(Xlb: number, Ylb: number, Xrt: number, Yrt: number, XDelt: number, YDelt: number): number[][]


    /**
    *Create grid x/y coordinate arrays with x/y number
    *@param Xlb X of left-bottom
    *@param Ylb Y of left-bottom
    *@param Xrt X of right-top
    *@param Yrt Y of right-top
    *@param Xnum X number
    *@param Ynum Y number 
    */
    static CreateGridXY_Num(Xlb: number, Ylb: number, Xrt: number, Yrt: number, Xnum: number, Ynum: number): number[][]

    /**
     *Interpolation with IDW neighbor method
     *@param SCoords Discrete data array
     *@param X Grid X array
     *@param Y Grid Y array
     *@param NumberOfNearestNeighbors Number of nearest neighbors 
     */
    static Interpolation_IDW_Neighbor(SCoords: number[][], X: number[], Y: number[], NumberOfNearestNeighbors: number): number[][]

    /**
    *Interpolation with IDW neighbor method,asynchronous
    *@param SCoords Discrete data array
    *@param X Grid X array
    *@param Y Grid Y array
    *@param  NumberOfNearestNeighbors Number of nearest neighbors 
    */
    static Interpolation_IDW_Neighbor_Async(SCoords: number[][], X: number[], Y: number[], NumberOfNearestNeighbors: number): Promise<number[][]>


}
import { Rectangle, Color } from '@mesh-3d/cesium';
export interface DrawContoursOptons {
    width: number
    height: number
    /**
     * 显示的地理范围
     */
    rectangle: Rectangle
    /**
     * 原始数据的地理范围
     */
    dataRectangle: Rectangle
    /**
     * 背景颜色，默认为透明
     * @default  Color.TRANSPARENT
     */
    backColor?: Color

    /**
     * 是否填充颜色
     * @default false
     */
    fill?: boolean
    colorMap?: any[]

    /**
     * @default true
     */
    isoLine?: boolean
    lineColor?: Color
    /**
     * @default 1.5
     */
    lineWidth?: number

    /**
     * 是否显示等值线标注文本
     * @default true
     */
    isoValue?: boolean
    /**
     * 等值线标注颜色
     * @default Cesium.Color.BLACK
     */
    isoValueColor?:  Color
    /**
     * 等值线标注背景色
     * @default Cesium.Color.TRANSPARENT
     */
    isoValueBackColor?:  Color
    /**
     * 等值线标注描边颜色
     * @default Cesium.Color.WHITE
     */
    isoValueStrokeColor?:  Color
    /**
     * 等值线标注文本是否描边
     * @default false
     */
    isoValueStroke?: boolean
    /**
     * 等值线标注描边线宽
     * @default 1
     */
    isoValueStrokeWidth?: number
    /**
     * 等值线标注字体大小
     * @default 9
     */
    isoValueFontSize?: number
    /**
     * 等值线标注字体名称
     */
    isoValueFontFamily?: string
    /**
     * 等值线标注边距
     * @default 0
     */
    isoValuePadding?: number
    /**
     * 等值线标注保留小数点位数，默认保留2位小数
     * @default 2
     */
    isoValueDigit?: number
    /**
     * 等值线标注颜色类型，single表示纯色，颜色由isoValueColor给定；fillColor表示使用调色板，由从colorMap中查找
     * @default 'single'
     */
    isoValueColorType?: 'single' | 'fillColor'
    /**
     * 等值线颜色类型，single表示纯色，颜色由lineColor给定；fillColor表示使用调色板，由从colorMap中查找
     * @default 'single'
     */
    lineColorType?: 'single' | 'fillColor'

}
/**
 * @example
 * var contours = d3Contour()
                 .size([width, height])
                 .thresholds(breaks)
                 (dataArray);
 */declare class d3Contour {


    /**
    *同步提取等值线
    *@param {Array.<Number>}dataArray
    *@param {Number}width
    *@param {Number}height
    *@param {Array.<Number>}breaks
    *@return {Array.<MultiPolygon>}
    *@method extract
    *@name extract
    *@memberof MeteoLib.Util.d3Contour 
    */
    extract(dataArray: number[], width: number, height: number, breaks: number[]): MultiPolygon[]

    /**
    *异步提取等值线，在数据量较大时，推荐使用该方法，可以因提取时间过长而导致界面长时间卡顿
    *@param {Array.<Number>}dataArray
    *@param {Number}width
    *@param {Number}height
    *@param {Array.<Number>}breaks
    *@return {Promise<Array.<MultiPolygon>>}
    *@method extractAsync
    *@name extractAsync
    *@memberof MeteoLib.Util.d3Contour
    */
    extractAsync(dataArray: number[], width: number, height: number, breaks: number[]): Promise<MultiPolygon[]>

    /**
    *@param {Object}options
    * @param {Number} options.width
    * @param {Number} options.height
    * @param {Cesium.Rectangle} options.rectangle 显示的地理范围
    * @param {Cesium.Rectangle} options.dataRectangle 原始数据的地理范围
    *
    *@param {Cesium.Color}[options.backColor=Cesium.Color.TRANSPARENT] 背景颜色，默认为透明
    *
    * @param {Boolean} [options.fill=false] 是否填充颜色
    * @param {MeteoLib.Render.GridDataColorMap} options.colorMap
    *  
    * @param {Boolean} [options.isoLine=true]
    * @param {Cesium.Color} [options.lineColor=undefined]
    * @param {Number} [options.lineWidth=1.5] 
    *
    * @param {Boolean} [options.isoValue=true] 是否显示等值线标注文本
    * @param {Cesium.Color} [options.isoValueColor=Cesium.Color.BLACK] 等值线标注颜色
    * @param {Cesium.Color} [options.isoValueBackColor=Cesium.Color.TRANSPARENT] 等值线标注背景色 
    * @param {Cesium.Color} [options.isoValueStrokeColor=Cesium.Color.WHITE] 等值线标注描边颜色
    * @param {Boolean} [options.isoValueStroke=false] 等值线标注文本是否描边
    * @param {Number} [options.isoValueStrokeWidth=1] 等值线标注描边线宽
    * @param {Number} [options.isoValueFontSize=9] 等值线标注字体大小
    * @param {String} [options.isoValueFontFamily] 等值线标注字体名称
    * @param {Number} [options.isoValuePadding=0] 等值线标注边距
    * @param {Number} [options.isoValueDigit=2] 等值线标注保留小数点位数，默认保留2位小数
    * @param {Number} [options.isoValueColorType='single'] 'single'|'fillColor' 等值线标注颜色类型，single表示纯色，颜色由isoValueColor给定；fillColor表示使用调色板，由从colorMap中查找
    * @param {Number} [options.lineColorType='single'] 'single'|'fillColor' 等值线颜色类型，single表示纯色，颜色由lineColor给定；fillColor表示使用调色板，由从colorMap中查找
    * @return {Object}
    *
    *@method defaultDrawOptions
    *@name defaultDrawOptions
    *@memberof MeteoLib.Util.d3Contour
    */
    defaultDrawOptions(options: object): object

    /**
    *
    *@param {Array.<MultiPolygon>}contours
    *@param {Object}options
    * @param {Number} options.width
    * @param {Number} options.height
    * @param {Cesium.Rectangle} options.rectangle 显示的地理范围
    * @param {Cesium.Rectangle} options.dataRectangle 原始数据的地理范围
    *
    *@param {Cesium.Color}[options.backColor=Cesium.Color.TRANSPARENT] 背景颜色，默认为透明
    *
    * @param {Boolean} [options.fill=false] 是否填充颜色
    * @param {MeteoLib.Render.GridDataColorMap} options.colorMap
    *  
    * @param {Boolean} [options.isoLine=true]
    * @param {Cesium.Color} [options.lineColor=undefined]
    * @param {Number} [options.lineWidth=1.5] 
    *
    * @param {Boolean} [options.isoValue=false] 是否显示等值线标注文本
    * @param {Cesium.Color} [options.isoValueColor=Cesium.Color.BLACK] 等值线标注颜色
    * @param {Cesium.Color} [options.isoValueBackColor=Cesium.Color.TRANSPARENT] 等值线标注背景色 
    * @param {Cesium.Color} [options.isoValueStrokeColor=Cesium.Color.WHITE] 等值线标注描边颜色
    * @param {Boolean} [options.isoValueStroke=false] 等值线标注文本是否描边
    * @param {Number} [options.isoValueStrokeWidth=1] 等值线标注描边线宽
    * @param {Number} [options.isoValueFontSize=9] 等值线标注字体大小
    * @param {String} [options.isoValueFontFamily] 等值线标注字体名称
    * @param {Number} [options.isoValuePadding=0] 等值线标注边距
    * @param {Number} [options.isoValueDigit=2] 等值线标注保留小数点位数，默认保留2位小数  
    * @param {Number} [options.isoValueColorType='single'] 'single'|'fillColor' 等值线标注颜色类型，single表示纯色，颜色由isoValueColor给定；fillColor表示使用调色板，由从colorMap中查找
    * @param {Number} [options.lineColorType='single'] 'single'|'fillColor' 等值线颜色类型，single表示纯色，颜色由lineColor给定；fillColor表示使用调色板，由从colorMap中查找
    *
    *@method drawContours
    *@name drawContours
    *@memberof MeteoLib.Util.d3Contour
    *@return {HTMLCanvasElement}
    */
    drawContours(contours: MultiPolygon[], options: object): HTMLCanvasElement

    /**
    *异步提取等值线，在数据量较大时，推荐使用该方法，可以因提取时间过长而导致界面长时间卡顿
    *@param {Array.<Number>}dataArray
    *@param {Number}width
    *@param {Number}height
    *@param {Array.<Number>}breaks
    *@param {Object}drawOptions
    * @param {Number} drawOptions.width
    * @param {Number} drawOptions.height
    * @param {Cesium.Rectangle} drawOptions.rectangle 显示的地理范围
    * @param {Cesium.Rectangle} drawOptions.dataRectangle 原始数据的地理范围
    *
    * @param {Boolean} [drawOptions.fill=false] 是否填充颜色
    * @param {MeteoLib.Render.GridDataColorMap} drawOptions.colorMap
    *  
    * @param {Boolean} [drawOptions.isoLine=true]
    * @param {Cesium.Color} [drawOptions.lineColor=undefined]
    * @param {Number} [drawOptions.lineWidth=1.5] 
    *
    * @param {Boolean} [drawOptions.isoValue=false] 是否显示等值线标注文本
    * @param {Cesium.Color} [drawOptions.isoValueColor=Cesium.Color.BLACK] 等值线标注颜色
    * @param {Cesium.Color} [drawOptions.isoValueBackColor=Cesium.Color.TRANSPARENT] 等值线标注背景色 
    * @param {Cesium.Color} [drawOptions.isoValueStrokeColor=Cesium.Color.WHITE] 等值线标注描边颜色
    * @param {Boolean} [drawOptions.isoValueStroke=false] 等值线标注文本是否描边
    * @param {Number} [drawOptions.isoValueStrokeWidth=1] 等值线标注描边线宽
    * @param {Number} [drawOptions.isoValueFontSize=9] 等值线标注字体大小
    * @param {String} [drawOptions.isoValueFontFamily] 等值线标注字体名称
    * @param {Number} [drawOptions.isoValuePadding=0] 等值线标注边距
    * @param {Number} [drawOptions.lineColorType='single'] single|fillColor 等值线颜色类型，single表示纯色，颜色由lineColor给定；fillColor表示使用调色板，由从colorMap中查找
    *@return {Promise<Canvas>}
    *@method extractAndDrawAsync
    *@name extractAndDrawAsync
    *@memberof MeteoLib.Util.d3Contour
    */
    extractAndDrawAsync(dataArray: number[], width: number, height: number, breaks: number[], drawOptions: object): Promise<HTMLCanvasElement>

}

/** 
*创建常用气象符号类
*@memberof MeteoLib.Util
*@constructor
 */declare class MeteoSign {

    /**
     * @default 'rgba(0,0,255,1)'
     */
    color: string
    /**
     * 正方形边长
     * @default 100
     */
    size: number
    /**
     * @default 4
     */
    lineWidth: number


    /**
     * 绘制风的canvas图
     * @param {float} speed 风速，单位m/s。根据风速生成对应等级风羽，当为-1时，生成旋转风标
     * @return {Canvas}
     */
    GetWindCanvas(speed: number): HTMLCanvasElement

    /**
     * 绘制下雨的canvas图
     * @param {int} type 类型。0：小雨；1：中雨；2：大雨；3：暴雨；4：大暴雨；5：特大暴雨；6：阵雨；7：轻冻雨；8：冻雨
     * @return {Canvas}
     */
    GetRainCanvas(type:number): HTMLCanvasElement

    /**
     * 绘制下雪的canvas图
     * @param {int} type 类型。0：雨雪；1：小雪；2：中雪；3：大雪；4：暴雪；5：阵雪；6：霜冻
     * @return {Canvas}
     */
    GetSnowCanvas(type:number): HTMLCanvasElement

    /**
     * 绘制雾的canvas图
     * @param {int} type 类型。0：轻雪；1：雾
     * @return {Canvas}
     */
    GetFogCanvas(type:number): HTMLCanvasElement

    /**
     * 绘制云的canvas图
     * @param {int} type 类型。0：晴天；1：多云；2：阴天
     * @return {Canvas}
     */
    GetCloudCanvas(type:number): HTMLCanvasElement
    /**
     * 绘制风沙的canvas图
     * @param {int} type 类型。0：浮尘；1：扬沙；2：轻沙暴；3：沙暴
     * @return {Canvas}
     */
    GetSandCanvas(type:number): HTMLCanvasElement

    /**
     * 绘制其他的canvas图
     * @param {int} type 类型。0：雷暴；1：冰雹；2：台风；3：烟；4：霾；5：冷暖中心N；6：冷暖中心L；7：高低中心G；8：高低中心D。
     * @param {Cesium.Color|String}color
     * @return {Canvas}
     */
    GetOtherCanvas(type, color): HTMLCanvasElement
}

/**
* Micaps气象数据类的抽象基类
*/declare class MeteorologicalData {
    /**
     *  该气象数据的数据类型标识,如T639, SATELLITE
     */
    familyName: string
    /**
     * 该气象数据的路径表示，可能为虚拟URL，如Cassandra的CF+Row Key，或者Samba服务器的相对路径。该路径由setDataPath方法设定，通常在解码时由Decoder的具体类指定。
     */
    dataPath: string
    /**
     * 该气象数据的数据名称，可能为虚拟文件名，如Cassandra中的Column Name,或者Samba服务器的文件名，该名称由setDataName方法设定，通常在解码时由Decoder的具体类指定。
     */
    dataName: string
    /**
     *  该数据原始FTP接收时的绝对文件名称
     */
    originalAbsoluteDataName: string
    /**
     * 该气象数据的URL表示中的时间对应的时区，由于该类的对象是最终客户端用户使用的数据，因此通常需要将此实例变量设置为客户端所在时区。取值范围：[-12,12]的整数值，其中-12和12都代表东西十二区，0代表中时区，[1,11]代表东一区至东十一区，[-11,-1]代表西十一区至西一区。该变量通常在解码时由具体的Decoder设定
     */
    timezone: number


    /**
     * 将该气象数据转换为新系统byte数组的格式，写入到Cassandra或Samba服务器中，该方法由具体子类来实现，对于大部分数据，新旧格式是一样的
     */
    toByteArray(): Uint8Array | Buffer

    /**
     * 释放具体子类的字节数组内存，加快写入时的内存释放速度
     */
    clear()

    /**
     * 
     * @param dataBytes 
     */
    loadByteArray(dataBytes: Buffer | Uint8Array): boolean

}
/**
* 
* @constructor
* @memberof MeteoLib.Data.Micaps
* @extends MeteoLib.Data.Micaps.MeteorologicalData
*
* @property {Boolean}isEnsemble 该网格是否是集合预报数据
* @property {String}element  物理量：字节型50字节。应优先采用标准化字典表中的名称，建议采用全大写字母表示物理量名称，不建议使用汉字，否则会影响以后的字典标准化。不足50字节用“0”字节补齐。
* @property {Number}description  附加描述信息：字节型30字节，用于表示附加描述，如区域范围，物理量单位等，建议使用字母，不建议使用汉字，如必须使用汉字，则采用GBK编码，不足30字节用“0”字节补齐。特别注意，该字段只用以表示附加描述，模式名、物理量、层次、起报日期、起报时刻、时效信息不得写入此字段中，否则会影响客户端对于数据描述的自动生成。
* @property {Number}level  层次：代表模式数据高度对应的压强值，float型4字节。
* @property {Number}year 起报日期：年：采用完整的整数表示，如2014，int型4字节。
* @property {Number}month 起报日期：月：int型4字节。
* @property {Number}day 起报日期：日：int型4字节。
* @property {Number}hour 起报时刻：采用24小时制，数值范围0-23，int型4字节。
* @property {Number}period 预报时效：单位小时，int型4字节。
* @property {Number}startLongitude 起始经度：float型4字节。
* @property {Number}endLongitude 终止经度：float型4字节。
* @property {Number}longitudeGridSpace 经度格距：非0浮点数，float型4字节。
* @property {Number}latitudeGridNumber 纬向经线格点数：int型4字节，代表一个纬线圈上经度格点的数量，应近似等于( endLongitude - startLongitude ) / longitudeGridSpace + 1。
* @property {Number}startLatitude 起始纬度：float型4字节。
* @property {Number}endLatitude 终止纬度：float型4字节。
* @property {Number}latitudeGridSpace 纬度格距：非0浮点数，float型4字节。
* @property {Number}longitudeGridNumber 经向纬线格点数：int型4字节，代表一个经线圈上纬度格点的数量。应近似等于( endLatitude - startLatitude ) / latitudeGridSpace + 1。latitudeGridNumber * longitudeGridNumber = 网格点数据个数
* @property {Number}isolineStartValue 等值线起始值：float型4字节。当type为4时（标量网格数据），代表客户端进行等值线分析的起始数值，当type为11时（矢量网格数据），此字段应忽略，建议设置为全0字节。
* @property {Number}isolineEndValue 等值线终止值：float型4字节。当type为4时（标量网格数据），代表客户端进行等值线分析的终止数值，当type为11时（矢量网格数据），此字段应忽略，建议设置为全0字节。
* @property {Number}isolineSpace 等值线间隔：float型4字节。当type为4时（标量网格数据），代表等值线公差间隔，当type为11时（矢量网格数据），此字段应忽略，建议设置为全0字节。
* @property {Number}perturbationNumber 集合预报成员编号,如果是集合预报数据,则该字段占用扩展段前2字节
* @property {Number}ensembleTotalNumber 集合预报成员总数,如果是集合预报数据，则该字段占用扩展段3-4字节
* @property {Array.<Number>}dataArray  对于标量数据，代表网格数值，对于向量数据，代表向量的模
* @property {Array.<Number>}angleArray 当数据是向量时，用来表示网格各点的角度值，数据是角度制，西风是0度，南风是90度，东风是180度，北风是270度
* @example
* 
* 
    var GDSClient = MeteoLib.Data.Micaps.GDSClient;

    GDSClient.config.gdsServerIp = "xxx";
    GDSClient.config.gdsServerPort = "xx";

    var gdsClient = new GDSClient({
        proxy: {
            getUrl: function (srcUrl) {
                return   "http://xxxxxx/proxy/" + srcUrl;
            }
        }
    }); 
    gdsClient.getLatestDataName("ECMWF_HR/TMP/850", "*.024").then(function (strResult) {
    console.log(strResult)
    gdsClient.getData("ECMWF_HR/TMP/850", strResult.data).then(function (bytesResult) {

        var gridData = new GridData();
        gridData.loadByteArray(bytesResult.data);
        console.log(gridData)
    })
})
*/declare class GridData extends MeteorologicalData {

    /**
     * 该网格是否是集合预报数据
     */
    isEnsemble: boolean;// 
    //大部分域变量均对应最终MICAPS网格数据格式中的数据头字段和数据区字段，字节数组总长度为数据头278字节+数据区（网格点数*float4字节，对于矢量网格还要再乘以2，因为还包括角度数组）

    //数据头开始，总共278字节
    type: number;//数据类型：short型2字节，4为模式标量数据，11为模式矢量数据，与原系统diamond 4和diamond 11含义一致。

    //首先是模式名称：字节型20字节，建议采用全大写字母表示模式名称，不建议使用汉字。不足20字节用“0”字节补齐。

    /**
     * 物理量：字节型50字节。应优先采用标准化字典表中的名称，建议采用全大写字母表示物理量名称，不建议使用汉字，否则会影响以后的字典标准化。不足50字节用“0”字节补齐。
     */
    element: string;//
    /**
     * 附加描述信息：字节型30字节，用于表示附加描述，如区域范围，物理量单位等，建议使用字母，不建议使用汉字，如必须使用汉字，则采用GBK编码，不足30字节用“0”字节补齐。特别注意，该字段只用以表示附加描述，模式名、物理量、层次、起报日期、起报时刻、时效信息不得写入此字段中，否则会影响客户端对于数据描述的自动生成。
     */
    description: string;//
    /**
     * 层次：代表模式数据高度对应的压强值，float型4字节。
     */
    level: number;//

    /**
     * 起报日期：年：采用完整的整数表示，如2014，int型4字节。
     */
    year: number;//
    /**
     * 起报日期：月：int型4字节。
     */
    month: number;//
    /**
     * 起报日期：日：int型4字节。
     */
    day: number;//
    /**
     * 起报时刻：采用24小时制，数值范围0-23，int型4字节。
     */
    hour: number;//
    //不要忘记还继承了超类MeteorologicalData的timezone，int型4字节，表示时区

    /**
     * 预报时效：单位小时，int型4字节。
     */
    period: number;//

    /**
     * 起始经度：float型4字节。
     */
    startLongitude: number;//
    /**
     * 终止经度：float型4字节。
     */
    endLongitude: number;//
    /**
     * 经度格距：非0浮点数，float型4字节。
     */
    longitudeGridSpace: number;//
    /**
     * 纬向经线格点数：int型4字节，代表一个纬线圈上经度格点的数量，应近似等于( endLongitude - startLongitude ) / longitudeGridSpace + 1。
     */
    latitudeGridNumber: number;//
    /**
     * 起始纬度：float型4字节。
     */
    startLatitude: number;//
    /**
     * 终止纬度：float型4字节。
     */
    endLatitude: number;//
    /**
     * 纬度格距：非0浮点数，float型4字节。
     */
    latitudeGridSpace: number;//
    /**
     * 经向纬线格点数：int型4字节，代表一个经线圈上纬度格点的数量。应近似等于( endLatitude - startLatitude ) / latitudeGridSpace + 1。latitudeGridNumber * longitudeGridNumber = 网格点数据个数
     */
    longitudeGridNumber: number;//

    /**
     * 等值线起始值：float型4字节。当type为4时（标量网格数据），代表客户端进行等值线分析的起始数值，当type为11时（矢量网格数据），此字段应忽略，建议设置为全0字节。
     */
    isolineStartValue: number;//
    /**
     * 等值线终止值：float型4字节。当type为4时（标量网格数据），代表客户端进行等值线分析的终止数值，当type为11时（矢量网格数据），此字段应忽略，建议设置为全0字节。
     */
    isolineEndValue: number;//
    /**
     * 等值线间隔：float型4字节。当type为4时（标量网格数据），代表等值线公差间隔，当type为11时（矢量网格数据），此字段应忽略，建议设置为全0字节。
     */
    isolineSpace: number;//

    //数据头最后是100字节的扩展段Extent,用于未来扩展，不用时建议设置为全0字节。扩展段后紧接数据区。
    /**
     * 集合预报成员编号,如果是集合预报数据,则该字段占用扩展段前2字节
     */
    perturbationNumber: number;//
    /**
     * 集合预报成员总数,如果是集合预报数据，则该字段占用扩展段3-4字节
     */
    ensembleTotalNumber: number;//
    //数据头结束

    //数据区开始
    /*数据区为所有网格数据的紧密排列，每个网格数据都是float型4字节，因此数据区总大小为latitudeGridNumber×longitudeGridNumber*4(矢量网格等于latitudeGridNumber*longitudeGridNumber*4*2)。
     * 排列顺序为先纬向后经向，即先从起始纬度开始，沿起始纬线圈扫描各点（从起始经度到终止经度），接着扫描下一个纬线圈，直至终止纬度。*/

    /**
     * 对于标量数据，代表网格数值，对于向量数据，代表向量的模
     */
    dataArray: number[]; //
    /**
     * 当数据是向量时，用来表示网格各点的角度值，数据是角度制，西风是0度，南风是90度，东风是180度，北风是270度
     */
    angleArray: number[]; //
    //数据区结束

    static DISCRIMINATOR: string;//合法数据关键字：始终为小写的mdfs，字符型4字节。不以mdfs开头的数据为非法数据
    static MODEL_NAME_LENGTH: number;//模式名最大长度
    static ELEMENT_LENGTH: number;//物理量最大长度
    static DESCRIPTION_LENGTH: number;//网格数据附加描述信息最大长度
    static SCALAR: number;//标量网格
    static VECTOR: number;//矢量网格
    static CHARSET_NAME: string;
}
/**
 * @constructor
 * @memberof MeteoLib.Data.Micaps
 * @extends MeteoLib.Data.Micaps.MeteorologicalData
 * @property {Number}type   数据类型：short型2字节。
 * @property {String}description   观测数据描述信息，最多100字节
 * @property {Number}level  层次：代表数据高度对应的压强值，float型4字节。
 * @property {String}levelDescription   观测数据层次描述信息，最多50字节
 * @property {Number}year 观测日期：年：采用完整的整数表示，如2014，int型4字节。
 * @property {Number}month 观测日期：月：int型4字节。
 * @property {Number}day 观测日期：日：int型4字节。
 * @property {Number}hour 观测时：采用24小时制，数值范围0-23，int型4字节。
 * @property {Number}minute   观测分：0-59,int型4字节。
 * @property {Number}second   观测秒：0-59，int型4字节。
 * @property {Object}stationDataMap 数据的实际数据存储结构 <站点ID,<物理量ID，物理量值>>,是一个包含了所有站点所有物理量信息的Map
 * @example
 *  
 var GDSClient = MeteoLib.Data.Micaps.GDSClient;
 
 GDSClient.config.gdsServerIp = "xxx";
 GDSClient.config.gdsServerPort = "xx";
 
 var gdsClient = new GDSClient({
     proxy: {
         getUrl: function (srcUrl) {
             return   "http://xxxxxx/proxy/" + srcUrl;
         }
     }
 });
 
 gdsClient.getLatestDataName("SURFACE/PLOT_10MIN", "*.000").then(function (strResult) {
     console.log(strResult)
     gdsClient.getData("SURFACE/PLOT_10MIN", strResult.data).then(function (bytesResult) {
 
         var stationData = new StationData();
         stationData.loadByteArray(bytesResult.data);
         console.log(stationData)
     })
 })
 
 要素代码
 
地理信息类1-200：
1 经度
2 纬度
3 测站高度
4 测站级别(short)
5 测站类型(short)
6 气压传感器海拔高度
7 温湿传感器离地面高度
8 温湿传感器距水面高度
9 风速传感器距地面高度
10 风传感器距甲板平台高度
11 风速传感器距水面高度
12 移动平台移动方向
13 移动平台移动速度
14 海盐传感器距海面深度
15 浪高传感器距海面高度
16 浮标方位
17 总水深
18 海面/水面以下深度
19 船面距海面高度
20 方位或方位角
21 字符型站名
 
风向风速类201-400：
201 风向
203 风速
205 1分钟平均风向
207 1分钟平均风速
209 2分钟平均风向
211 2分钟平均风速
213 10分钟平均风向
215 10分钟平均风速
217 最大风速的风向
219 最大风速
221 瞬时风向
223 瞬时风速
225 极大风速的风向
227 极大风速
229 过去6小时极大瞬时风速的风向
231 过去6小时极大瞬时风速
233 过去12小时极大瞬时风速的风向
235 过去12小时极大瞬时风速
237 风力(short)
239 垂直阵风风速/垂直速度
 
 
气压类401-600：
401 海平面气压
403 3小时变压
405 24小时变压
407 本站气压
409 最高气压
411 最低气压
413 气压
415 日平均气压
417 日平均海平面气压
419 高度(探空)
421 位势高度(探空)
 
 
气温类601-800：
601 温度
603 最高气温
605 最低气温
607 24小时变温
609 过去24小时最高气温
611 过去24小时最低气温
613 日平均气温
 
 
湿度类801-1000：
801 露点温度
803 温度露点差
805 相对湿度
807 最小相对湿度
809 日平均相对湿度
811 水汽压
813 日平均水汽压
 
 
降水蒸发类1001-1200：
1001 降水量
1003 1小时降水
1005 3小时降水
1007 6小时降水
1009 12小时降水
1011 24小时降水
1013 日总降水
1015 20-08时降水量
1017 08-20时降水量
1019 20-20时降水量
1021 08-08时降水量
1023 蒸发
1025 蒸发(大型)
1027 可降水分(预报降水量)
 
 
能见度类1201-1400：
1201 1分钟平均水平能见度
1203 10分钟平均水平能见度
1205 最小水平能见度
1207 水平能见度(人工)
 
 
云类1401-1600：
1401 总云量
1403 低云量
1405 云底高度
1407 低云状(short)
1409 中云状(short)
1411 高云状(short)
1413 日平均总云量
1415 日平均低云量
1417 云量(低云或中
 
 
天气现象类1601-1800：
1601 现在天气(short)
1603 过去天气1(short)
1605 过去天气2(short)
1607 湍流(short)
 
 
重要天气现象类1801-2000：
1801 龙卷类型(short)
1803 龙卷所在方位(short)
1805 最大冰雹直径
1807 雷暴(short)
1809 电流强度(闪电定位)
 
 
地温类2001-2200：
2001 地面温度
2003 最高地面温度
2005 最低地面温度
2007 过去12小时最低地面温度
2009 5cm地温
2011 10cm地温
2013 15cm地温
2015 20cm地温
2017 40cm地温
2019 80cm地温
2021 160cm地温
2023 320cm地温
2025 草面（雪面）温度
2027 草面（雪面）最高温度
2029 草面（雪面）最低温度
2031 日平均地面温度
2033 日平均5cm地温
2035 日平均10cm地温
2037 日平均15cm地温
2039 日平均20cm地温
2041 日平均40cm地温
2043 日平均80cm地温
2045 日平均160cm地温
2047 日平均320cm地温
2049 日平均草面（雪面）温度
 
 
积雪冰冻类2201-2400：
2201 地面状态(short)
2203 积雪深度
2205 雪压
2207 电线积冰直径
2209 电线积冰-现象(short)
2211 电线积冰-南北方向直径
2213 电线积冰-南北方向厚度
2215 电线积冰-南北方向重量
2217 电线积冰-东西方向直径
2219 电线积冰-东西方向厚度
2221 电线积冰-东西方向重量
2223 船上结冰原因(short)
2225 船上结冰厚度
2227 船上结冰速度(short)
2229 海冰密集度(short)
2231 冰情发展(short)
2233 冰总量和类型(short)
2235 冰缘方位
2237 冰情(short)
 
 
 
时间类10001-14000：
10001 最高气压出现时间
10003 最低气压出现时间
10005 最高气温出现时间
10007 最低气温出现时间
10009 最小相对湿度出现时间
10011 最大风速出现时间
10013 极大风速出现时间
10015 最高地面温度出现时间
10017 最低地面温度出现时间
10019 草面（雪面）最低温度出现时间
10021 草面（雪面）最高温度出现时间
10023 最小水平能见度出现时间
10025 天气出现时间
10027 海表最高温度出现时间
10029 海表最低温度出现时间
10031 最大波高出现时间
10033 资料时间
10035 观测时间
 
 
方法类2401-2600：
2401 风速表类型
2403 湿球温度测量方法
2405 海面温度测量方法
2407 洋流测量方法
2409 气压倾向特征
 
 
海温/盐类2601-2800：
2601 海面温度
2603 湿球温度
2605 海面盐度
2607 海表最高温度
2609 海表最低温度
2611 海水温度
2613 海水盐度
 
 
洋流/海流类2801-3000：
2801 海面海流方向
2803 海面海流速度
2805 洋流方向和速度的平均周期(short)
2807 表层海洋面流速
2809 表层海洋面波向
2811 海流方向
2813 海流速度
 
 
海浪类3001-3200：
3001 波浪方向
3003 波浪周期
3005 波浪高度
3007 风浪方向
3009 风浪周期
3011 风浪高度
3013 第一涌浪方向
3015 第一涌浪周期
3017 第一涌浪高度
3019 第二涌浪方向
3021 第二涌浪周期
3023 第二涌浪高度
3025 有效波高
3027 有效波高的周期
3029 平均波高
3031 平均波周期
3033 最大波高
3035 最大波高的周期
3037 人工测量浪高
3039 仪器测量浪高
3041 浪级代码
 
 
飞行设备类3201-3400
3201 飞机飞行状态(short)
3203 飞机导航系统状态(short)
3205 飞行高度
 
 
大气成分类3401-3600
3401 PM2.5质量浓度(微克/立方米)
*/
export class StationData extends MeteorologicalData {
    type: number;//数据类型：short型2字节。
    description: string;//观测数据描述信息，最多100字节
    level: number;//层次：代表数据高度对应的压强值，float型4字节。
    levelDescription: string;//观测数据层次描述信息，最多50字节
    year: number;//观测日期：年：采用完整的整数表示，如2014，int型4字节。
    month: number;//观测日期：月：int型4字节。
    day: number;//观测日期：日：int型4字节。
    hour: number;//观测时：采用24小时制，数值范围0-23，int型4字节。
    minute: number;//观测分：0-59,int型4字节。
    second: number;//观测秒：0-59，int型4字节。
    //不要忘记还继承了超类MeteorologicalData的timezone，int型4字节，表示时区
    //数据头最后是100字节的扩展段Extent,用于未来扩展，不用时建议设置为全0字节。扩展段后紧接数据区。

    //数据区开始
    /*
    数据区由2大部分组成：
    第一大部分：1个int，表示站点数目
    第二大部分：该数据区中实际存储的所有物理量ID个数，以及物理量ID和类型的映射：物理量ID个数：short 2字节，物理量ID 2字节，物理量数值类型(short 2字节)，物理量ID和物理量数值类型4字节重复存放
    物理量数值类型: 1: byte, 2: short, 3: int, 4: long, 5: float, 6: double, 7: string
    第三大部分由各站点记录拼接而成：14个字节作为记录开头: 站点ID(int 4字节), 站点经度(float 4字节), 站点纬度(float 4字节), 站点物理量个数(除去经纬度不算,short 2字节)
    然后是各物理量数据信息: 物理量ID(short 2字节), 物理量值(字节数受物理量数值类型决定)
    */
    //private Map < Integer, Map < Integer, String > > stationDataMap;//
    /**
     * 数据的实际数据存储结构 <站点ID,<物理量ID，物理量值>>,是一个包含了所有站点所有物理量信息的Map
     */
    stationDataMap: Map<number, Map<number, string>>;


    DATA_DESCRIPTION_LENGTH: number;//观测数据描述信息最大长度
    LEVEL_DESCRIPTION_LENGTH: number;//观测数据层次描述信息最大长度
    CHARSET_NAME: string;
    //数据头开始，总共288字节
    DISCRIMINATOR: string;//合法数据关键字：始终为小写的mdfs，字符型4字节。不以mdfs开头的数据为非法数据
}
/**
*
*@memberof MeteoLib.Data.SWAN
*@constructor
 *@property {Number} CenterLat  
 *@property {Number} CenterLon  
 *@property {String} DataName  
 *@property {String} Flag  
 *@property {Number} LatNumGrids 
 *@property {Number} LatReso  
 *@property {Number} LonNumGrids  
 *@property {Number} LonReso  
 *@property {Number} StationCount  
 *@property {Number} StartLat  
 *@property {Number} StartLon  
 *@property {String} Version  
 *@property {Number} ZNumGrids  
 *@property {Number} ZhighGrids  
 *@property {String} ZonName  
*/declare class Diamond131Header {
    CenterLat: number
    CenterLon: number

    DataName: string
    Flag: string
    LatNumGrids: number
    LatReso: number
    LonNumGrids: number
    LonReso: number
    StationCount: number
    StartLat: number
    StartLon: number
    Version: string
    ZNumGrids: number
    ZhighGrids: number
    ZonName: string
    day: number
    hour: number
    interval: number
    minute: number
    month: number
    year: number
}
import Diamond131Header from './Diamond131Header';
declare class SwanRadar {
    /**
     *
     * <pre>摘自《短时临近预报系统（SWAN）拼图用户手册》
     * 2.数据格式
     * 2.1.三维拼图数据格式
     * 文件头格式，长度1024个字节
     * char ZonName[12];	// diamond 131 12个字节
     * char DataName[38];//数据说明(例如 2008年5月19日雷达三维拼图)38个字节
     * char	Flag[8];		// 文件标志，"swan"
     * char	Version[8];		// 数据版本号，"1.0"
     * unsigned short int year;//2008 两个字节
     * unsigned short int month;//05  两个字节
     * unsigned short int day;//19    两个字节
     * unsigned short int hour;//14   两个字节
     * unsigned short int minute;//31 两个字节
     * unsigned short int interval ;  //两个字节
     * unsigned short int XNumGrids;//1300 两个字节
     * unsigned short int YNumGrids;//800 两个字节
     * unsigned short int ZNumGrids;//20  两个字节
     * int RadarCount; //拼图雷达数 四个字节
     * float StartLon; //网格开始经度（左上角） 四个字节
     * float StartLat; //网格开始纬度（左上角） 四个字节
     * float CenterLon;//网格中心经度 四个字节
     * float CenterLat;//网格中心纬度 四个字节
     * float XReso;	//经度方向分辨率 四个字节
     * float YReso;	//纬度方向分辨率 四个字节
     * float ZhighGrids[40];//垂直方向的高度（单位km）数目根据ZnumGrids而得（最大40层） 160个字节。
     * char RadarStationName[20][16];    //雷达站点名称,	20*16字节
     * float  RadarLongitude[20];      //雷达站点所在经度，单位：度， 4*20字节
     * float  RadarLatitude[20];       //雷达站点所在纬度，单位：度， 4*20字节
     * float  RadarAltitude[20];      //雷达所在海拔高度，单位：米， 4*20字节
     * unsigned char    MosaicFlag[20];    //该雷达数据是否包含在本次拼图中，未包含:0，包含:1, 20字节
     * char	Reserved[172];	
     * 接下来是数据块，从底层到高层进行排列共ZnumGrids层。一个字节存储一个数据，值的范围0-255，2*dBZ+66等于该字节的值。每层的数据从起始点（左上角）开始，按维向（纬度y）减小写每行的经向（经度x增大）数据。
     *             //备用
     * 2.2.三维拼图产品格式
     * 三维拼图产品头文件和三维拼图数据的头文件相同，只是ZNumGrids只有一层，接下来是数据块。组合反射率、CAPPI率数据值为单字节，范围0-255，2*dBZ+66等于该字节的值。回波顶高、垂直液态水含量、一小估算降水等三种数据为两字节整数（short  int），回波顶高单位为0.1 km，垂直液态水含量单位为0.1 kg/m2，一小估算降水单位为0.1 mm,范围0-203（大于203的全部等于203）每层的数据从起始点（左上角）开始，按维向（纬度y）减小写每行的经向（经度x增大）数据。
     * 
     * 2.3.二维拼图产品格式
     * 头文件和三维拼图数据的头文件相同，只是ZNumGrids只有一层，接下来是数据块。组合反射率、PPI率数据值为单字节，范围0-255，2*dBZ+66等于该字节的值。回波顶高、垂直液态水含量、垂直液态水含量密度等数据为两字节整数（short  int），回波顶高单位为0.1 km，垂直液态水含量单位为0.1 kg/m2，垂直液态水含量密度单位为0.1 kg/m3。每层的数据从起始点（左上角）开始，按维向（纬度y）减小写每行的经向（经度x增大）数据。
     * </pre>
     *@memberof MeteoLib.Data.SWAN
     *@constructor
     *@property {MeteoLib.Data.SWAN.Diamond131Header} header
     *@property {ArrayNumber|TypeArray} data
     *@property {Cesium.Rectangle} rectangle
     *@property {Number} xNum
     *@property {Number} yNum
     *@property {Number} zNum
     */
    constructor()
    header: Diamond131Header
    data: number[];
    readonly xNum: number
    readonly yNum: number
    readonly zNum: number
    readonly rectangle: Cesium.Rectangle
    /**
    *
    *@param {ArrayBuffer|Uint8Array}
    *@return {MeteoLib.Data.SWAN.SwanRadar}
    */
    static parse(arrayBuffer): SwanRadar

    /**
    *
    *@param {ArrayBuffer|Uint8Array|String} arrayBufferOrUrl ArrayBuffer或者数据文件url，可以是解压后的文件，也可以是bz2文件）
    *@param {String} fileName 文件名
    *@return {Promise<MeteoLib.Data.SWAN.SwanRadar>}
    */
    static load(arrayBufferOrUrl, fileName): Promise<MeteoLib.Data.SWAN.SwanRadar>
}
// var BinaryReader = require('../../Util/BinaryReader');

import BinaryReader from "../../Util/BinaryReader"


class MessageHeader {
    code: number
    date: number
    time: number
    length: number
    sourceId: number
    destinationId: number
    numberOfBlocks: number
}

class ProductDescription {
    blockDivider: number
    latitude: number
    longitude: number
    height: number
    productCode: number
    operationalMode: number
    volumeCoveragePattern: number
    volumeScanNumber: number
    volumeScanDate: number
    volumeScanStartTime: number
    generationDate: number
    generationTime: number

    productDependents: number[]

    elevationNumber: number

    dataLevelThresholds: number[];

    numberOfMapsOrVersionOrSpotBlank: number
    offsetToSymbology: number
    offsetToGraphic: number
    offsetToTabular: number

}

/**
*@constructor
*@param {Function} ProductSymbologyPacket
*@memberof MeteoLib.Data.PupProductFormat
*@property {Array.<MeteoLib.Data.PupProductFormat.SymbologyLayer>} layers
*/
class ProductSymbology {

    blockDivider: number
    blockId: number
    lengthOfBlock: number
    numberOfLayers: number
    layers: SymbologyLayer[]

}

/**
*@constructor
*@memberof MeteoLib.Data.PupProductFormat
*@property {Array.<MeteoLib.Data.PupProductFormat.ProductSymbologyPacket>} packets
*/
class SymbologyLayer {
    layerDivider: number
    lengthOfDataLayer: number
    packets: ProductSymbologyPacket[];
}

/**
*pup雷达产品数据包接口
*@param {MeteoLib.Util.BinaryReader} br
*@constructor
*@memberof MeteoLib.Data.PupProductFormat
*/
export class IProductSymbologyPacket {
    constructor(br: BinaryReader)
}

/**
*@constructor
*@memberof MeteoLib.Data.PupProductFormat
*@property {Array.<Number>} colorCodes
*/
class RasterDataPacket {

    type: number
    flags_1: number
    flags_2: number
    iCoordinateStart: number
    jCoordinateStart: number

    xScale: number
    xScaleFractor: number
    yScale: number
    yScaleFractor: number

    numberOfRows: number
    packingDescriptor: number

    colorCodes: Uint8Array;

}

class GraphicAlphanumeric {
    blockDivider: number
    blockId: number
    length: number
    numberOfPages: number
    pageNumber: number
    lengthOfPage: number
    textPagckets: TextPacket[];
}

class TextPacket {
    packetCode: number
    lengthBlock: number
    valueOfText?: number
    iStartingPoint: number
    jStartingPoint: number
    characters: string[];

    str: string
}

class TabularAlphanumeric {
    blockDivider: number
    blockId: number
    lengthOfBlock: number

    msgHeader: MessageHeader;

    secondBlock: TabularSecondBlock;
}
class TabularSecondBlockPage {
    numberOfCharacters: number
    characterData: string[];
    str: string
}
class TabularSecondBlock {
    blockDivider: number
    numberOfPages: number

    pages: TabularSecondBlockPage[];

    endOfPageFlag: number
}
/**
*
*参考{@link https://github.com/xantronix/libnexrad}
*@constructor
*@memberof MeteoLib.Data
*/declare class PupProductFormat {
    msgHeader: MessageHeader
    productDescription: ProductDescription
    /**
     * 数据存储在这里
     */
    productSymbology: ProductSymbology
    graphicAlphanumeric: GraphicAlphanumeric
    tabularAlphanumeric: TabularAlphanumeric

    /**
    *@param {Uint8Array|ArrayBuffer}buffer
    *@param {IProductSymbologyPacket}ProductSymbologyPacket
    *@return {Boolean}
    */
    loadByteArray(buffer: Uint8Array | ArrayBuffer, ProductSymbologyPacket?: IProductSymbologyPacket): boolean
}

/**
 * 定义栅格数据存储数据结构以及相关操作接口
 */
declare module RasterData {

    /**
     * 几何体外接矩形
     */
    class CoordEnvelope {
        /**
         * 几何体外接矩形
         * @param minX 
         * @param maxX 
         * @param minY 
         * @param maxY 
         */
        constructor(minX: number, maxX: number, minY: number, maxY: number)
        MinX: number
        MaxX: number
        MinY: number
        MaxY: number
        /**
        * 
        */
        Clone(): CoordEnvelope
    }

    /**
     *  表示数据类型
     */
    enum enumDataType {
        Bits,
        Byte,
        Int16,
        UInt16,
        Int32,
        UInt32,
        Int64,
        UInt64,
        Float,
        Double,
        Atypism,
        Unknow
    }

    /**
    * 表示字节序 
    */
    enum enumHdrByteOder {
        /**
         * little endian，小端字节序
         */
        Host_intel,
        /**
         * IEEE 标准，大端字节序
         */
        Network_IEEE
    }

    /**
    * 表示图像（遥感图像）存储格式BSQ/BIL/BIP
    */
    enum enumInterleave {
        /**
         * 按波段保存，也就是一个波段保存后接着保存第二个波段
         */
        BIP,
        /**
         * BIP是按像元保存，即先保存第一个波段的第一个像元，之后保存第二波段的第一个像元，依次保存
         */
        BSQ,
        /**
         * 按行保存，就是保存第一个波段的第一行后接着保存第二个波段的第一行，依次类推
         */
        BIL
    }

    /**
      *  
      */
    class Point {
        /**
         * 
         * @param x 
         * @param y 
         */
        constructor(x, y)
        X: number
        Y: number
        static Empty: Point
    }

    /**
     *  
     */
    class PointF {
        /**
         * 
         * @param x 
         * @param y 
         */
        constructor(x, y)
        X: number
        Y: number
        static Empty: PointF
    }

    class HdrMapInfo {
        Name: string
        BaseRowColNumber: Point
        BaseMapCoordinateXY: HdrGeoPointCoord
        XYResolution: HdrGeoPointCoord
        CoordinateType: string
        Units: string
    }

    /**
     * 
     */
    class HdrGeoPoint {
        /**
         * 
         * @param pixelPoint 
         * @param geoPoint 
         */
        constructor(pixelPoint: Point, geoPoint: HdrGeoPointCoord)
        PixelPoint: Point
        GeoPoint: HdrGeoPointCoord
    }

    /**
     *  
     */
    class HdrProjectionInfo {
        PrjArguments: number[]
        ProjectionID: number
        Datum: string
        Units: string
    }

    class Envelope {
        /**
         * 
         * @param minX 
         * @param minY 
         * @param maxX 
         * @param maxY 
         */
        constructor(minX: number, minY: number, maxX: number, maxY: number)
        minX: number
        minY: number
        maxX: number
        maxY: number
    }

    /**   
    */
    class RectangleF {
        /**
         * 
         * @param x 
         * @param y 
         * @param width 
         * @param height 
         */
        constructor(x, y, width, height)
        X: number
        Y: number
        Width: number
        Height: number

        /**  
          *@param left   
          *@param top
          *@param right   
          *@param bottom    
          */
        FromLTRB(left: number, top: number, right: number, bottom: number): RectangleF
    }

    /**
     *  envi hdr文件
     *
     *@example
       The type of data representation, where 
                1=8-bit byte;
                2=16-bit signed integer; 
                3=32-bit signed long integer;
                4=32-bit floating point; 
                5=64-bit double-precision floating point; 
                6=2x32-bit complex, real-imaginary pair of double precision; 
                9=2x64-bit double-precision complex,real-imaginary pair of double precision; 
                12=16-bit unsigned integer; 
                13=32-bit unsigned long integer; 
                14=64-bit signed long integer;   
                15=64-bit unsigned long integer.
    */
    class HdrFile {
        constructor()

        MinX: number
        MinY: number
        MaxX: number
        MaxY: number
        LeftUpPoint: PointF
        RightDownPoint: PointF
        Points: PointF[]
        CenterPoint: PointF
        Width: number
        Height: number
        Description: string
        Samples: number
        Lines: number
        Bands: number
        BandNums: number[]
        HeaderOffset: number
        FileType: string
        DataType: enumDataType
        Intertleave: enumInterleave
        MajorFrameOffsets: number[]
        SensorType: string
        ByteOrder: enumHdrByteOder
        MapInfo: HdrMapInfo
        GeoPoints: HdrGeoPoint[]
        BandNames: string[]
        HdrProjectionInfo: HdrProjectionInfo


        GetEnvelope(): Envelope
    }

    class RasterDataProvider {
        CoordEnvelope: CoordEnvelope
        Tag: object
        DataType: enumDataType
        BandCount: number
        Width: number
        Height: number
        ResolutionX: number
        ResolutionY: number
        DataIdentify: object

        FileName: string
        IsSupprtOverviews: boolean
        IsOverviewsBuilded: boolean

        /**
         *获取指定波段号的栅格波段对象
         *@param  bandNo 波段号 
         */
        GetRasterBand(bandNo: number): RasterBand

        /**
        *读取波段数据
        *@param xOffset x偏移量
        *@param xOffset y偏移量
        *@param xSize 待读取数据x方向宽度
        *@param ySize 待读取数据y方向宽度
        *@param buffer 输出读取结果的数组
        *@param dataType 数据类型
        *@param xBufferSize 输出读取结果的数组buffer的x方向宽度
        *@param yBufferSize 输出读取结果的数组buffer的y方向宽度
        *@param bandCount 读取波段数
        *@param bandMap 读取波段号集合
        *@param sinterleave 图像数据存储格式，目前只支持BSQ格式
        */
        Read(xOffset: number, yOffset: number, xSize: number, ySize: number, buffer: ArrayBufferView, dataType: enumDataType, xBufferSize: number, yBufferSize: number, bandCount: number, bandMap: number[], interleave: enumInterleave): void
        /**
         *释放资源
         */
        Dispose(): void
    }

    /**
     *  栅格波段类，定义栅格波段数据结构及相关操作方法（如读取、统计等）接口
     *@see MeteoLib.Data.Ldf.LdfRasterBand
     *@see MeteoLib.Data.Envi.EnviRasterBand
     */
    class RasterBand {

        /**
         * 波段号
         */
        BandNo: number
        /**
         *   数据提供者
         */
        RasterDataProvider: RasterDataProvider
        /**
         * 描述
         */
        Description: string
        MeasureBits: number
        /**
         * 数据类型
         */
        DataType: enumDataType
        /**
         * DataType存储大小，即存储一个该数据类型所占用字节数
         */
        DataTypeSize: number
        /**
         * 波段宽度
         */
        Width: number
        /**
         * 波段高度
         */
        Height: number
        /**
         * x向（一般为经向）分辨率
         */
        ResolutionX: number
        /**
         * x向（一般为纬向）分辨率
         */
        ResolutionY: number
        /**
         * 无效值
         */
        NoDataValue: number
        /**
         * 偏移量
         */
        DataOffset: number
        /**
         * 缩放倍数
         */
        DataScale: number
        MinByMeasureBits: number
        MaxByMeasureBits: number

        /**
         *读取波段数据
         *@param xOffset x偏移量
         *@param xOffset y偏移量
         *@param xSize 待读取数据x方向宽度
         *@param ySize 待读取数据y方向宽度
         *@param buffer 保存读取结果的数组
         *@param dataType 数据类型
         *@param xBufferSize 保存读取结果的数组buffer的x方向宽度
         *@param yBufferSize 保存读取结果的数组buffer的y方向宽度
         */
        Read(xOffset: number, yOffset: number, xSize: number, ySize: number, buffer: ArrayBufferView, dataType: enumDataType, xBufferSize: number, yBufferSize: number): void
    }

    /**
    * 
    *@see MeteoLib.Data.RasterData.RasterDataDriver
    *@see MeteoLib.Data.Ldf.LdfDriver
    *@see MeteoLib.Data.Envi.EnviDriver
    */
    abstract class IRasterDataDriver {
        Name: string
        FullName: string
        /**
        *
        *@param arrayAuffer
        *@param header4096
        *@param access
        *@param args
        */
        Open(arrayAuffer: ArrayBufferView, header4096: Uint8Array | number[], access: enumDataProviderAccess, args: object[]): RasterDataProvider
    }

    /**
     * 
     */
    class RasterDataDriver extends IRasterDataDriver {
        constructor(name, fullName)
        static RegisteredDrivers: IRasterDataDriver[]
    }
}
declare class AwxRasterHeader {
    /**
     *
     *@param {ArrayBuffer}headBuffer
     *@param {String}AwxRasterHeader
     *@property {Float32Array|Array.<Number>}CalTable
     *@constructor  
     *@memberof MeteoLib.Data.Awx 
     *@extends MeteoLib.Data.Awx.AwxHeaderBase
     */
    constructor(headBuffer, awxFileName)

    readonly FileName: string
    readonly BandNames: string
    readonly BandName: string
    readonly Attributes: object

    readonly HeaderSize: number
    readonly CoordEnvelope: object
    readonly ResolutionX: number
    readonly ResolutionY: number

    readonly Width: number
    readonly Height: number

    readonly CalTable: number[]

    /**
     * 定标（将计数值转为实际物理量），返回结果缩放倍数为1，并存储为float数据类型
     */
    ChangeToFloat(srcDataArray: number[], dstDbArray: number[]): void

    /**
     * 定标（将计数值转为实际物理量），返回结果缩放倍数为10，并存储为short数据类型
     */
    ChangeToShort(srcDataArray: number[], dstDbArray: number[]): void

    Dispose(): void

    /**
  *
  */
    destroy(): void

}
/**
 * 栅格数据集,以交替存储的方式将二维数组转存在一维数组中，提供一系列方法来操作栅格数据集
 */
export class RasterDataset {
    /**
     * 栅格数据集,以交替存储的方式将二维数组转存在一维数组中，提供一系列方法来操作栅格数据集
     */
    constructor()
    /**
     * 各通道（波段）数据
     */
    bands: ArrayBufferView[]
    /**
     * 各通道（波段）数据查找表
     */
    calTables: number[]
    width: number
    height: number
    west: number
    south: number
    north: number
    east: number
    dataType: DataType
    nodataValue: number


    /**
    * 查询指定波段和地理位置的数值
    * @param  bandNo 波段索引，从0开始
    * @param {number|Number} lon 经度
    * @param {number|Number} lat 纬度
    */
    selectPoint(bandNo: number, lon: number, lat: number): number

    /**
    * 选择矩形区域内的数据
    * @param  bandNo 待选取数据波段
    * @param  west 东北角经度（最小经度）
    * @param  north 东北角纬度（最大纬度）
    * @param  east 西南角经度（最大经度）
    * @param  south 西南角纬度（最小纬度） 
    */
    selectRectangle(bandNo: number, west: number, north: number, east: number, south: number, buffer: ArrayBufferView): ArrayBufferView


    /**
    *  选取多边形区域内的数据,这里的多边形是一个栅格化的多边形，
    *  是一个栅格数据集，此数据集包含一个（多个的时候按第一个）波段的二值化（只有0和大于0的byte数据）的数据，
    *  在提取或裁剪算法中，0表示非多边形区域，大于0处均认为多边形。所以此处需要使用工具辅助，预先裁出多边形区域的栅格数据
    * @param  polygonDataset 表示多边形区域的栅格数据集
    * @param bandNoList 待筛选的波段
    */
    selectPolygon(polygonDataset: RasterDataset, bandNoList: number[]): RasterDataset

    /**
    *  剔除多边形区域内的数据,这里的多边形是一个栅格化的多边形，
    *  是一个栅格数据集，此数据集包含一个（多个的时候按第一个）波段的二值化（只有0和大于0的byte数据）的数据，
    *  在提取或裁剪算法中，0表示非多边形区域，大于0处均认为多边形。所以此处需要使用工具辅助，预先裁出多边形区域的栅格数据
    * @param  polygonDataset 表示多边形区域的栅格数据集
    * @param  bandNoList 待筛选的波段
    */
    removePolygon(polygonDataset: RasterDataset, bandNoList: number[]): RasterDataset


    /**
     * 重采样
     * @param  band
     * @param  west
     * @param  south
     * @param  east
     * @param  north
     * @param  outWidth
     * @param  outHeight
     * @param  outMinMax
     * @param  result
     */
    resample(band: number, west: number, south: number, east: number, north: number, outWidth: number, outHeight: number, minMax: number[], ret: ArrayBufferView): void

    /**
     * 重采样
     * @param  band
     * @param  west
     * @param  south
     * @param  east
     * @param  north
     * @param  outWidth
     * @param  outHeight
     * @param  outMinMax
     * @param  result
     */
    resample(band: number, west: number, south: number, east: number, north: number, outWidth: number, outHeight: number, minMax: number[], ret: Array): void


    /**
    * 创建一个结构跟自身一样的副本，但不复制数据
    */
    clone(): RasterDataset
}
declare interface WhenPromise<T> {
    then(callback: (obj: T) => any): WhenPromise<T>
    otherwise(callback: (err: Error) => WhenPromise<T>): WhenPromise<T>
}
/**
 * 色斑图生成工具类
 */declare class RasterImageGenerator {

    /**
     * 色斑图生成工具类
     * @param {Object} options
     * @param {String} options.name 名称 
     * @param {String} [options.palattePath] micaps图例xml文件路径，palattePath和colorMap不能同时为空
     * @param {GridDataColorMap} [options.colorMap] 默认图例，palattePath和colorMap不能同时为空
     * @param {Boolean} [options.selectColorByIndex=false] 为true表示绘图时给定的数值为图例（调色板）中的索引，将直接从图例数组中取颜色；否则为图例中的数值，取颜色时先将给定数值与图例中的数值范围进行对比，落在指定区间则取该区间的对应的颜色。
     * @param {Boolean} [options.palatteReverse=false] 从micaps图例xml文件解析图例时，是否需要逆转列表，micaps图例有的时按数值从大到小排列，有的从小到大排列，需要根据实际情况调整此参数。
     * @param {Number} [options.quality=1] 输出jpg图像质量，0——1之间，质量越好图像文件越大。
     * @constructor
     * @memberof MeteoLib.Render
     */
    constructor(options: {
        name: string;
        palattePath?: string;
        colorMap?: any[];
        selectColorByIndex?: boolean;
        palatteReverse?: boolean;
        quality?: number;
    })

    colorMap: any[]
    selectColorByIndex: boolean;
    palatteReverse: boolean;
    quality: number;

    readonly ready:boolean
    readonly readyPromise:WhenPromise<this>

    /**
    *注册
    */
    static register(options: RasterImageGenerator | {
        name: string;
        palattePath?: string;
        colorMap?: any[];
        selectColorByIndex?: boolean;
        palatteReverse?: boolean;
        quality?: number;
    }): RasterImageGenerator
    /**
    *
    */
    static find(name): RasterImageGenerator


    /**
     *  
     * @param {Array.<Number>} data 网格数据
     * @param {Number} width 图像宽度
     * @param {Number} height 图像高度
     * @param {Array.<Number>} [calTable] 定标查找表
     * @param {Array.<Number>} [bbox]
     * @return {Canvas|MeteoLib.Util.Scijs.JPEG}
     */
    generate(data: number[], width: number, height: number, calTable?: number[], bbox?: number[]): HTMLCanvasElement | Object

    /**
     *  
     * @param {Array.<Number>} data 卫星云图数据
     * @param {Number} width 图像宽度
     * @param {Number} height 图像高度
     * @param {Array.<Number>} [calTable] 定标查找表
     * @param {Array.<Number>} [bbox]
     * @return {MeteoLib.Util.Scijs.JPEG}
     */
    generateNode(data: number[], width: number, height: number, calTable?: number[]): Object
    /**
    *
    */
    clone(): RasterImageGenerator

    /**
     * 注册所有内置的色斑图绘制工具
     * @param {String} [palDir='./Assets/pal/'] 将所有内置的调色板文件放置在palDir(默认项为目根目录下的Assets/pal/）指定的文件夹
     */
     static registerAll(palDir?: string): void

    static FY4A: {
        /**
         * FY4A-L1-CH1-CH6.xml
         */
        C01_C06: RasterImageGenerator
        /**
         * FY4A-L1-CH7-CH8.xml
         */
        C07_C08: RasterImageGenerator
        /**
         * FY4A-L1-CH9-CH10.xml
         */
        C09_C10: RasterImageGenerator
        /**
         * FY4A-L1-CH11-CH14.xml
         */
        C11_C14: RasterImageGenerator
    }

    static HMW8: {
        /**
         * B03可见光通道.xml
         */
        B03: RasterImageGenerator
        /**
         * B08水汽通道.xml
         */
        B08: RasterImageGenerator
        /**
         * B13红外通道.xml
         */
        B13: RasterImageGenerator
    }
    static FY2G: {
        /**
         * 'I-01.xml'
         */
        IR01_02: RasterImageGenerator
        /** 
         * W-02.xml
         */
        IR03: RasterImageGenerator
        /**
         * v-011.xml
         */
        IR4_VIS: RasterImageGenerator
    }

    static FY2E: {
        /**
         * 'I-01.xml'
         */
        IR01_02: RasterImageGenerator
        /**
         * W-02.xml
         */
        IR03: RasterImageGenerator
        /**
         * v-011.xml
         */
        IR4_VIS: RasterImageGenerator
    }

    static EC: {
        /**
         * TMP.xml
         */
        TMP: RasterImageGenerator
        /**
         * 'rain1.xml'
         */
        RH: RasterImageGenerator
        /**
         * rain1.xml
         */
        HGT: RasterImageGenerator
        /**
         * tempreture1.xml
         */
        WIND: RasterImageGenerator
    }

    static Radar: {
        /**
         * REF/反射率(<palDir>/PUP产品-组合反射率-381.xml)
         */
        R: RasterImageGenerator
        /**
         * ET/回波顶高(<palDir>/PUP产品-回波顶高-411.xml)
         */
        ET: RasterImageGenerator
        /**
         * VIL/液体水含量(<palDir>/PUP产品-垂直积分液态含水量-571.xml)
         */
        VIL: RasterImageGenerator
    }
}
import RasterData from '../Data/RasterData'
export class RasterTileData {
    /**
    *  
    *@param {Object}options
    *@param {Number}options.width
    *@param {Number}options.height
    *@param {Array.<Number>|TypeArray}options.data
    *@param {Array.<Number>|TypeArray}options.bbox
    *@param {Number}[options.bandNo=1]
    */
    constructor(options)

    width: number
    height: number
    data: number[]
    bbox: number[]
    bandNo: number
}

export interface RasterTileImageryProviderOptions {
    imageGenerator?: RasterImageGenerator
    fileName: string
    /**
     * 接口url，接口形如http://xxx?fileName={fileName}&xOffset={xOffset}&yOffset={yOffset}&xSize={xSize}&ySize={ySize}&stride={stride}&typeSize={typeSize}&headerSize={headerSize}&xBufferSize={xBufferSize}&yBufferSize={yBufferSize}
     */
    url: string
    minimumLevel?: number
    maximumLevel?: number
    headerSize?: number
    typeSize?: number
    /**
     * 加载的波段编号，波段编号从1开始
     */
    bands?: number[]
    /**
     * 默认有效值范围，形如[min,max]
     */
    defaultValidRange?: number[]
    /**
     * 无效值，当显示为灰度图时，遇无效值则透明 
     */
    nodataValue: ?number
    enumDataType?: number | RasterData.enumDataType
    hdrFileName?: string | File
    /**
     * 图层地理范围
     */
    rectangle?: Cesium.Rectangle
    /**
     * 图层原始数据地理范围
     */
    dataRectangle?: Cesium.Rectangle
    zIndex?: number
    parseHeader?: (headerBuffer: ArrayBuffer, headerFileName: string | File) => object
    getImageGenerator?: (header: object) => RasterImageGenerator
}

/**
*定义了以动态切片的方式加载栅格数据的接口，内置envi格式栅格数据加载方法。
*内部调用流程图如下：<br/>
*<img src="https://www.plantuml.com/plantuml/png/LL6zJiD03DuZvHqyLUd20pG35Qe4I0mLuWMCuYGdNNF1vxGA6wfWOMNZ1JAoiF8sfV0ME9T68jlv-_5d-vPUaANPMBX5ByHtnjBr1WlYTirkQpBYmylpxxxx-TWVtxhlpwTZztfu_ugZO8oZXQcC6BJcaLAj2f9WlwIA6CLn2eeoFJJavOfG-_Mo6jdJgLG1KqsepNQbnaF2IhGmWmm50RTeBDuhFWDVkjtvF8u0nfOXBFsFz1kir3Y08MW2cHmICnbn3b9IbRJaGsjrJVcpOdWDEMIzZbYvKJkI5-sAScoi3AegCtcOGCQBtZXTDrDMkR1eVqDNnz5I0Vs1Fm00"/>
*@constructor
*@memberof MeteoLib.Scene
* 
*@param {Object}options
*@param {MeteoLib.Render.RasterImageGenerator}options.imageGenerator
*@param {String}options.fileName
*@param {String}options.url 接口url，接口形如http://xxx?fileName={fileName}&xOffset={xOffset}&yOffset={yOffset}&xSize={xSize}&ySize={ySize}&stride={stride}&typeSize={typeSize}&headerSize={headerSize}&xBufferSize={xBufferSize}&yBufferSize={yBufferSize}
*@param {Number}[options.minimumLevel=0]
*@param {Number}[options.maximumLevel]
*@param {Number}[options.headerSize=0]
*@param {Number}[options.typeSize=1]
*@param {Array.<Number>}[options.bands] 加载的波段编号，波段编号从1开始
*@param {Array.<Number>}[options.defaultValidRange] 
*@param {Number}[options.nodataValue] 无效值，当显示为灰度图时，遇无效值则透明 
*@param {MeteoLib.Data.RasterData.enumDataType|Number}[options.dataType=MeteoLib.Data.RasterData.enumDataType.Byte] 
*@param {String}[options.hdrFileName]
*@param {Array.<Number>|Cesium.Rectangle}[options.rectangle] 图层地理范围
*@param {Array.<Number>|Cesium.Rectangle}[options.dataRectangle=Cesium.Rectangle.MAX_VALUE] 图层原始数据地理范围
*@param {Number}[options.zIndex]
*@param {Boolean}[options.compress=true]
*@param {Boolean}[options.userWebWorker=false]
*@param {Boolean}[options.enableServerCache=false]
*@param {MeteoLib.Scene.RasterTileImageryProvider~ParseHeaderCallback}options.parseHeader
*@param {MeteoLib.Scene.RasterTileImageryProvider~GetImageGeneratorCallback}options.getImageGenerator
*
*@see MeteoLib.Scene.AwxSateImageryProvider
*@see MeteoLib.Scene.GrADSRasterImageryProvider
*
*@example
    //1、示例一：加载awx格式云图
    var options={
        headerSize : 4096,
        getImageGenerator : function (header) {
            var sateNames = ['FY2E', 'F2E', 'FY2G', 'F2G', 'FY4A', 'HMW8']
            var dataNameParts = this.fileName.split(/[\._-]+/g);
            var sateName;
            for (var i = 0; i < dataNameParts.length; i++) {
                sateName = dataNameParts[i].toUpperCase()
                var exits = false;
                for (var j = 0; j < sateNames.length; j++) {
                    if (sateNames[j] == sateName) {
                        exits = true;
                        break;
                    }
                }
                if (exits) break;
            }
 
            var dataAttributes = header.Attributes;
            var bandNo = dataAttributes['通道号'];
 
            if (sateName == 'FY2E'
                || sateName == 'FY2G'
                || sateName == 'F2E'
                || sateName == 'F2G') {
 
                if (bandNo == 1 || bandNo == 3) {
                    imageGenerator = RasterImageGenerator.FY2G.IR01_02;
                } else if (bandNo == 2) {
                    imageGenerator = RasterImageGenerator.FY2G.IR03;
                } else {
                    imageGenerator = RasterImageGenerator.FY2G.IR4_VIS;
                }
            }
            else if (sateName == 'FY4A') {
 
                if (bandNo == 4) {
                    imageGenerator = RasterImageGenerator.FY4A.C01_C06;
                } else if (bandNo == 5) {
                    imageGenerator = RasterImageGenerator.FY4A.C07_C08;
                } else if (bandNo == 2) {
                    imageGenerator = RasterImageGenerator.FY4A.C09_C10;
                } else if (bandNo == 1) {
                    imageGenerator = RasterImageGenerator.FY4A.C11_C14;
                }
 
            } else if (sateName == 'HMW8') {
 
                if (bandNo == 4) {
                    imageGenerator = RasterImageGenerator.HMW8.B03;
                } else if (bandNo == 2) {
                    imageGenerator = RasterImageGenerator.HMW8.B08;
                } else if (bandNo == 1) {
                    imageGenerator = RasterImageGenerator.HMW8.B13;
                }
            }
            return imageGenerator;
        },
        parseHeader : function (headerBuffer, headerFileName) {
            this.header = new AwxRasterHeader(headerBuffer, headerFileName);
            this.width = this.header.Width;
            this.height = this.header.Height;
            var ce = this.header.CoordEnvelope;
            this.bbox = [ce.MinX, ce.MinY, ce.MaxX, ce.MaxY];
            this.rectangle = Cesium.Rectangle.fromDegrees(
                ce.MinX, ce.MinY, ce.MaxX, ce.MaxY, undefined, this.rectangle
            );
            this.headerSize = this.header.HeaderSize;
            return this.header;
        } 
    }
    var imgPrvd=new RasterTileImageryProvider(options);
    var layer=viewer.imageryLayers.addImageryProvider(imgPrvd);
 
   //2、示例二：加载envi格式云图
    var imgPrvdEnvi = new RasterTileImageryProvider({
        fileName: "FY4A-_AGRI--_N_DISK_1047E_L1-_FDI-_MULT_NOM_20180807080000_20180807081459_4000M_V0001.DN.DAT",
        hdrFileName: "FY4A-_AGRI--_N_DISK_1047E_L1-_FDI-_MULT_NOM_20180807080000_20180807081459_4000M_V0001.DN.hdr",
        url: "http://39.107.107.142:18880/hfs?dir=EnviData&path=FY4A/Demo",
        defaultValidRange: [0, 3000],
        compress: false,
        bands:[3,2,1]//大于等于三个波段时，默认按前三个波段做rgb合成
    });
    var layerEnvi = viewer.imageryLayers.addImageryProvider(imgPrvdEnvi);
*/declare class RasterTileImageryProvider {
    /**
    *定义了以动态切片的方式加载栅格数据的接口，内置envi格式栅格数据加载方法。
    *内部调用流程图如下：<br/>
    *<img src="https://www.plantuml.com/plantuml/png/LL6zJiD03DuZvHqyLUd20pG35Qe4I0mLuWMCuYGdNNF1vxGA6wfWOMNZ1JAoiF8sfV0ME9T68jlv-_5d-vPUaANPMBX5ByHtnjBr1WlYTirkQpBYmylpxxxx-TWVtxhlpwTZztfu_ugZO8oZXQcC6BJcaLAj2f9WlwIA6CLn2eeoFJJavOfG-_Mo6jdJgLG1KqsepNQbnaF2IhGmWmm50RTeBDuhFWDVkjtvF8u0nfOXBFsFz1kir3Y08MW2cHmICnbn3b9IbRJaGsjrJVcpOdWDEMIzZbYvKJkI5-sAScoi3AegCtcOGCQBtZXTDrDMkR1eVqDNnz5I0Vs1Fm00"/>
    *@constructor
    *@memberof MeteoLib.Scene
    * 
    *@param {Object}options
    *@param {MeteoLib.Render.RasterImageGenerator}options.imageGenerator
    *@param {String}options.fileName
    *@param {String}options.url 接口url，接口形如http://xxx?fileName={fileName}&xOffset={xOffset}&yOffset={yOffset}&xSize={xSize}&ySize={ySize}&stride={stride}&typeSize={typeSize}&headerSize={headerSize}&xBufferSize={xBufferSize}&yBufferSize={yBufferSize}
    *@param {Number}[options.minimumLevel=0]
    *@param {Number}[options.maximumLevel]
    *@param {Number}[options.headerSize=0]
    *@param {Number}[options.typeSize=1]
    *@param {Array.<Number>}[options.bands] 加载的波段编号，波段编号从1开始
    *@param {Array.<Number>}[options.defaultValidRange] 
    *@param {Number}[options.nodataValue] 无效值，当显示为灰度图时，遇无效值则透明 
    *@param {MeteoLib.Data.RasterData.enumDataType|Number}[options.dataType=MeteoLib.Data.RasterData.enumDataType.Byte] 
    *@param {String}[options.hdrFileName]
    *@param {Array.<Number>|Cesium.Rectangle}[options.rectangle] 图层地理范围
    *@param {Array.<Number>|Cesium.Rectangle}[options.dataRectangle=Cesium.Rectangle.MAX_VALUE] 图层原始数据地理范围
    *@param {Number}[options.zIndex]
    *@param {Boolean}[options.compress=true]
    *@param {Boolean}[options.userWebWorker=false]
    *@param {Boolean}[options.enableServerCache=false]
    *@param {MeteoLib.Scene.RasterTileImageryProvider~ParseHeaderCallback}options.parseHeader
    *@param {MeteoLib.Scene.RasterTileImageryProvider~GetImageGeneratorCallback}options.getImageGenerator
    *
    *@see MeteoLib.Scene.AwxSateImageryProvider
    *@see MeteoLib.Scene.GrADSRasterImageryProvider
    *
    *@example
        //1、示例一：加载awx格式云图
        var options={
            headerSize : 4096,
            getImageGenerator : function (header) {
                var sateNames = ['FY2E', 'F2E', 'FY2G', 'F2G', 'FY4A', 'HMW8']
                var dataNameParts = this.fileName.split(/[\._-]+/g);
                var sateName;
                for (var i = 0; i < dataNameParts.length; i++) {
                    sateName = dataNameParts[i].toUpperCase()
                    var exits = false;
                    for (var j = 0; j < sateNames.length; j++) {
                        if (sateNames[j] == sateName) {
                            exits = true;
                            break;
                        }
                    }
                    if (exits) break;
                }
        
                var dataAttributes = header.Attributes;
                var bandNo = dataAttributes['通道号'];
        
                if (sateName == 'FY2E'
                    || sateName == 'FY2G'
                    || sateName == 'F2E'
                    || sateName == 'F2G') {
        
                    if (bandNo == 1 || bandNo == 3) {
                        imageGenerator = RasterImageGenerator.FY2G.IR01_02;
                    } else if (bandNo == 2) {
                        imageGenerator = RasterImageGenerator.FY2G.IR03;
                    } else {
                        imageGenerator = RasterImageGenerator.FY2G.IR4_VIS;
                    }
                }
                else if (sateName == 'FY4A') {
        
                    if (bandNo == 4) {
                        imageGenerator = RasterImageGenerator.FY4A.C01_C06;
                    } else if (bandNo == 5) {
                        imageGenerator = RasterImageGenerator.FY4A.C07_C08;
                    } else if (bandNo == 2) {
                        imageGenerator = RasterImageGenerator.FY4A.C09_C10;
                    } else if (bandNo == 1) {
                        imageGenerator = RasterImageGenerator.FY4A.C11_C14;
                    }
        
                } else if (sateName == 'HMW8') {
        
                    if (bandNo == 4) {
                        imageGenerator = RasterImageGenerator.HMW8.B03;
                    } else if (bandNo == 2) {
                        imageGenerator = RasterImageGenerator.HMW8.B08;
                    } else if (bandNo == 1) {
                        imageGenerator = RasterImageGenerator.HMW8.B13;
                    }
                }
                return imageGenerator;
            },
            parseHeader : function (headerBuffer, headerFileName) {
                this.header = new AwxRasterHeader(headerBuffer, headerFileName);
                this.width = this.header.Width;
                this.height = this.header.Height;
                var ce = this.header.CoordEnvelope;
                this.bbox = [ce.MinX, ce.MinY, ce.MaxX, ce.MaxY];
                this.rectangle = Cesium.Rectangle.fromDegrees(
                    ce.MinX, ce.MinY, ce.MaxX, ce.MaxY, undefined, this.rectangle
                );
                this.headerSize = this.header.HeaderSize;
                return this.header;
            } 
        }
        var imgPrvd=new RasterTileImageryProvider(options);
        var layer=viewer.imageryLayers.addImageryProvider(imgPrvd);
        
        //2、示例二：加载envi格式云图
        var imgPrvdEnvi = new RasterTileImageryProvider({
            fileName: "FY4A-_AGRI--_N_DISK_1047E_L1-_FDI-_MULT_NOM_20180807080000_20180807081459_4000M_V0001.DN.DAT",
            hdrFileName: "FY4A-_AGRI--_N_DISK_1047E_L1-_FDI-_MULT_NOM_20180807080000_20180807081459_4000M_V0001.DN.hdr",
            url: "http://39.107.107.142:18880/hfs?dir=EnviData&path=FY4A/Demo",
            defaultValidRange: [0, 3000],
            compress: false,
            bands:[3,2,1]//大于等于三个波段时，默认按前三个波段做rgb合成
        });
        var layerEnvi = viewer.imageryLayers.addImageryProvider(imgPrvdEnvi);
    */
    constructor(options: {
        fileName: string
        /**
         * 接口url，接口形如http://xxx?fileName={fileName}&xOffset={xOffset}&yOffset={yOffset}&xSize={xSize}&ySize={ySize}&stride={stride}&typeSize={typeSize}&headerSize={headerSize}&xBufferSize={xBufferSize}&yBufferSize={yBufferSize}
         */
        url: string
        minimumLevel?: number
        maximumLevel?: number
        headerSize?: number
        typeSize?: number
        /**
         * 加载的波段编号，波段编号从1开始
         */
        bands?: number[]
        /**
         * 默认有效值范围，形如[min,max]
         */
        defaultValidRange?: number[]
        /**
         * 无效值，当显示为灰度图时，遇无效值则透明 
         */
        nodataValue: ?number
        enumDataType?: number | RasterData.enumDataType
        hdrFileName?: string | File
        /**
         * 图层地理范围
         */
        rectangle?: Cesium.Rectangle
        /**
         * 图层原始数据地理范围
         */
        dataRectangle?: Cesium.Rectangle
        zIndex?: number
        imageGenerator?: RasterImageGenerator
        parseHeader?: (headerBuffer: ArrayBuffer, headerFileName: string | File) => object
        getImageGenerator?: (header: object) => RasterImageGenerator
    })

    readonly imageGenerator:RasterImageGenerator
}
// var RasterImageGenerator = require('../Render/RasterImageGenerator');

/**
*@constructor
*@extends MeteoLib.Scene.RasterTileImageryProvider.RasterTileData
*@memberof MeteoLib.Scene.AwxSateImageryProvider
*/
declare class AwxRasterTileData extends RasterTileData {

    /**
    *@type {MeteoLib.Data.Awx.AwxRasterHeader}
    */
    header: AwxRasterHeader
}
declare class AwxSateImageryProvider extends RasterTileImageryProvider {
    /**
    *
    *@constructor
    *@memberof MeteoLib.Scene
    *@param {Object}options
    *@param {String}options.fileName
    *@param {String}options.url
    *@constructor
    *@extends MeteoLib.Scene.RasterTileImageryProvider
    */
    constructor(options: RasterTileImageryProviderOptions)
    
    readonly header: AwxRasterHeader

    static AwxRasterTileData: typeof AwxRasterTileData;

}

declare class GridDataImageryProviderOptions {
    /**
     * 格点数据数组,矢量数据时表示矢量大小
     */
    dataArray: ArrayBufferView | number[]
    /**
     * 矢量数据时表示方向
     */
    angleArray: ArrayBufferView | number[]

    /**
     * 等值线分段数值
     */
    breaks?: number[]
    /**
     * 格点场宽度，经向格点数
     */
    width: number
    /**
     * 格点长高度，纬向格点数
     */
    height: number
    /**
     *  显示的地理范围 
     */
    rectangle: Cesium.Rectangle
    /**
     *   原始数据的地理范围 
     */
    dataRectangle?: Cesium.Rectangle

    /**
     * 是否填充颜色
     */
    fill?: boolean
    /**
     * 色斑图图例（调色板）
     */
    colorMap: Array

    minimumLevel?: number
    maximumLevel: number
    tileWidth?: number
    tileHeight?: number
    maximumCacheSize?: number
    /**
     * 是否插值
     */
    interpolate?: boolean
    isoLine?: boolean
    lineColor?: string
    lineWidth?: number
    /**
     *  是否显示点
     */
    point?: boolean
    pointColor?: Cesium.Color | string
    pointSize?: number
    /**
     *  是否显原始数据点数值
     */
    value?: boolean
    /**
     *  原始数据点数值显示颜色
     */
    valueColor?: Cesium.Color
    valueBackColor?: Cesium.Color
    valueStrokeColor?: Cesium.Color
    /**
     * 是否显原始数据点数值 
     */
    valueStroke?: boolean
    valueStrokeWidth?: number
    valueFontSize?: number
    valueFontFamily?: string
    valuePadding?: number
    /**
     *  是否显原始数据点数值
     */
    isoValue?: boolean
    /**
     * 原始数据点数值显示颜色
     */
    isoValueColor?: Cesium.Color
    isoValueBackColor?: Cesium.Color
    isoValueStrokeColor?: Cesium.Color
    /**
     *  是否显原始数据点数值 
     */
    isoValueStroke: boolean
    isoValueStrokeWidth?: number
    isoValueFontSize?: number
    isoValueFontFamily?: string
    isoValuePadding?: number
    maximumPointDensity?: number
    pointDensity?: number
    /**
     * ='single'|"fillColor"
     */
    lineColorType?: string
    /**
     *  大于该级别时不进行抽稀处理
     */
    maxSamplePointLevel: number
    beforeDrawPoint: (

        context: HTMLCanvas2DContext,
        args: {
            scalarValue: number
            vectorValue: number
            x: number
            y: number
            lon: number
            lat: number
            cancel: boolean
        }
    ) => void
    /**
     *  裁剪图层 
     */
    clipperLayer?: VectorTileImageryProvider
}

/**
 * 加载格点数据数据，内置等值线，色斑图，格点图以及箭头矢量图的显示功能
 */declare class GridDataImageryProvider {
    /**
     * 加载格点数据数据，内置等值线，色斑图，格点图以及箭头矢量图的显示功能 
     * @example
     
        var GridData = MeteoLib.Data.Micaps.GridData;
        var GridDataColorMap = MeteoLib.Render.GridDataColorMap;
        var GridDataImageryProvider=MeteoLib.Scene.GridDataImageryProvider;
     
        GridDataColorMap.fromMICAPSPalatteXml('Apps/rain1.xml').then(function (colorMap) {
             
            var start = new Date();
            loadArrayBuffer('Apps/RH85018090608.072').then(function (buf) {
                console.log("loadArrayBuffer:" + (new Date() - start))
                var gridData = new GridData();
                gridData.loadByteArray(buf);
                console.log("loadByteArray:" + (new Date() - start))
                var width = gridData.latitudeGridNumber,
                    height = gridData.longitudeGridNumber;
     
                var geoInfo = new Float32Array(4);
                var endLon = gridData.startLongitude + width * gridData.longitudeGridSpace
                if (endLon < 180) {
                    geoInfo[0] = gridData.startLongitude;
                    geoInfo[2] = gridData.endLongitude;
                } else {
                    geoInfo[0] = 180 - endLon;
                    geoInfo[2] = 180;
                }
                geoInfo[1] = gridData.startLatitude < gridData.endLatitude ? gridData.startLatitude : gridData.endLatitude;
                geoInfo[3] = gridData.startLatitude > gridData.endLatitude ? gridData.startLatitude : gridData.endLatitude;
     
                var imgPrvd = new GridDataImageryProvider({
                    zIndex: 9,
                    scene: viewer.scene,
     
                    //原始数据点显示设置
                    point: true,
                    pointSize: 2,
                    pointColor: Cesium.Color.fromBytes(128, 128, 128),
     
                    pointDensity:5,//指示点的密度，值越大越稀疏
                    maximumPointDensity :8,//指示当自动分级（pointDensity为0或者不设置）时点的密度，值越大越稀疏
     
                    //原始数据点数值显示设置
                    value: true,
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
                    isoValueStrokeColor: Cesium.Color.fromBytes(228,228,228),
                    isoValueFontSize: 12,
                    isoValueFontFamily: 'heiti',
                    isoValuePadding: 0,
     
                    //等值线显示设置
                    isoLine: true,
                    lineColor: Cesium.Color.WHITE,
                    lineWidth: 1,
                    lineDash:[5,0,5,0],//虚线样式，不设置则为实线
     
                    //栅格色斑图数据显示设置
                    fill: true,
                    colorMap: colorMap,
     
                    dataArray: gridData.dataArray,
                    width: width,
                    height: height,
                    breaks: [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    maximumLevel: 6,
                    rectangle: Cesium.Rectangle.fromDegrees(
                        geoInfo[0], geoInfo[1], geoInfo[2], geoInfo[3]
                    )
                })
                viewer.imageryLayers.addImageryProvider(imgPrvd);
                console.log("addImageryProvider:" + (new Date() - start))
                viewer.imageryLayers.orderByZIndex();
                
     
            })
     
        })
     
     */
    constructor(options: {

        /**
         * 格点数据数组,矢量数据时表示矢量大小
         */
        dataArray: ArrayBufferView | number[]
        /**
         * 矢量数据时表示方向
         */
        angleArray: ArrayBufferView | number[]

        /**
         * 等值线分段数值
         */
        breaks?: number[]
        /**
         * 格点场宽度，经向格点数
         */
        width: number
        /**
         * 格点长高度，纬向格点数
         */
        height: number
        /**
         *  显示的地理范围 
         */
        rectangle: Cesium.Rectangle
        /**
         *   原始数据的地理范围 
         */
        dataRectangle?: Cesium.Rectangle

        /**
         * 是否填充颜色
         */
        fill?: boolean
        /**
         * 色斑图图例（调色板）
         */
        colorMap: Array

        minimumLevel?: number
        maximumLevel: number
        tileWidth?: number
        tileHeight?: number
        maximumCacheSize?: number
        /**
         * 是否插值
         */
        interpolate?: boolean
        isoLine?: boolean
        lineColor?: string
        lineWidth?: number
        /**
         *  是否显示点
         */
        point?: boolean
        pointColor?: Cesium.Color | string
        pointSize?: number
        /**
         *  是否显原始数据点数值
         */
        value?: boolean
        /**
         *  原始数据点数值显示颜色
         */
        valueColor?: Cesium.Color
        valueBackColor?: Cesium.Color
        valueStrokeColor?: Cesium.Color
        /**
         * 是否显原始数据点数值 
         */
        valueStroke?: boolean
        valueStrokeWidth?: number
        valueFontSize?: number
        valueFontFamily?: string
        valuePadding?: number
        /**
         *  是否显原始数据点数值
         */
        isoValue?: boolean
        /**
         * 原始数据点数值显示颜色
         */
        isoValueColor?: Cesium.Color
        isoValueBackColor?: Cesium.Color
        isoValueStrokeColor?: Cesium.Color
        /**
         *  是否显原始数据点数值 
         */
        isoValueStroke: boolean
        isoValueStrokeWidth?: number
        isoValueFontSize?: number
        isoValueFontFamily?: string
        isoValuePadding?: number
        maximumPointDensity?: number
        pointDensity?: number
        /**
         * ='single'|"fillColor"
         */
        lineColorType?: string
        /**
         *  大于该级别时不进行抽稀处理
         */
        maxSamplePointLevel: number
        beforeDrawPoint: (

            context: HTMLCanvas2DContext,
            args: {
                scalarValue: number
                vectorValue: number
                x: number
                y: number
                lon: number
                lat: number
                cancel: boolean
            }
        ) => void
        /**
         *  裁剪图层 
         */
        clipperLayer?: VectorTileImageryProvider

    })
    ds: Data.RasterDataset
}
/**
*
*@name  GridDataColorMap
*@extends Array
*@class 
*@memberof MeteoLib.Render
*@constructor
*@example  //海面风速图例
 var ascatWinSpeedColorMap = [
    [Number.MIN_VALUE, -0.01, [0, 0, 0, 0], "~0m/s"],
    [-0.01, 1, [155, 1, 255, 180], "0~1m/s"],
    [1.01, 2, [104, 1, 255, 180], "1~2m/s"],
    [2.01, 3, [57, 9, 255, 180], "2~3m/s"],
    [3.01, 4, [16, 54, 255, 180], "3~4m/s"],
    [4.01, 5, [1, 91, 255, 180], "4~5m/s"],
    [5.01, 6, [1, 120, 255, 180], "5~6m/s"],
    [6.01, 7, [1, 154, 255, 180], "6~7m/s"],
    [7.01, 8, [0, 221, 255, 180], "7~8m/s"],
    [8.01, 9, [1, 255, 1, 180], "8~9m/s"],
    [9.01, 10, [120, 255, 1, 180], "9~10m/s"],
    [10.01, 11, [180, 255, 1, 180], "10~11m/s"],
    [11.01, 12, [239, 255, 1, 180], "11~12m/s"],
    [12.01, 13, [255, 255, 1, 180], "12~13m/s"],
    [13.01, 14, [255, 251, 1, 180], "13~14m/s"],
    [14.01, 55, [255, 231, 1, 180], "14~15m/s"],
    [15.01, 16, [255, 206, 1, 180], "15~16m/s"],
    [16.01, 17, [255, 180, 1, 180], "16~17m/s"],
    [17.01, 18, [255, 146, 1, 180], "17~18m/s"],
    [18.01, 19, [255, 92, 1, 180], "18~19m/s"],
    [19.01, 20, [255, 33, 1, 180], "19~20m/s"],
    [20.01, Number.MAX_VALUE, [0, 0, 0, 0], "20~m/s"]
];
*/declare class GridDataColorMap extends Array {

    /**
     * micaps图例解析
     * @param {String} uri
     * @return {Promise.<MeteoLib.Render.GridDataColorMap>}
       *@memberof MeteoLib.Render.GridDataColorMap
     */
    static fromMICAPSPalatteXml(uri: string): Promise<GridDataColorMap>

    /**
       *从pal调色板文件中加载图例
       *@param {String|ArrayBuffer} palURLOrArrayBuffer
       *@return {Promise.<MeteoLib.Render.GridDataColorMap>}
       *@memberof MeteoLib.Render.GridDataColorMap
       */
    static fromPal(palURLOrArrayBuffer: String | ArrayBuffer, rangeFlip?: boolean): Promise<GridDataColorMap>


    /**
    *
    *@param {Number} val
    *@param {MeteoLib.Render.GridDataColorMap} colorMap
    *@return {Array.<Number>} rgba
    *@memberof MeteoLib.Render.GridDataColorMap
    */
    static getColor(val: number, colorMap: GridDataColorMap): number[]


    /**
    *
    *@param {Number} value
    *@param {MeteoLib.Render.GridDataColorMap} colorMap
    *@return {Number} index
    *@memberof MeteoLib.Render.GridDataColorMap
    */
    static getRangeIndex(value: number, colorMap: GridDataColorMap): number

    /**
    *画垂直布局且有间隔的图例，返回图例图片
    *@param {MeteoLib.Render.GridDataColorMap} colorMap
    *@param {Number} recSize
    *@param {Number} legendSize
    *@param {Object} recMargins
    *@param {Number} recMargins.left
    *@param {Number} recMargins.right
    *@param {Number} recMargins.top
    *@param {Number} recMargins.bottom
    *@param {Object} legendPadding
    *@param {Number} legendPadding.left
    *@param {Number} legendPadding.right
    *@param {Number} legendPadding.top
    *@param {Number} legendPadding.bottom
    *@param {Number} fontSize
    *@returns {Object} imageObj
    *@returns {String} imageObj.imageUrl
    *@returns {Number} imageObj.width
    *@returns {Number} imageObj.height
    *@memberof MeteoLib.Render.GridDataColorMap
    */
    static getLegend(colorMap, recSize, legendSize, recMargins, legendPadding, fontSize): {
        imageUrl: string
        width: number
        height: number
    }

    /**
    *画垂直布局且无间隔的图例，返回图例图片
    *@param {MeteoLib.Render.GridDataColorMap} colorMap
    *@param {String} title
    *@param {Number} recSize
    *@param {Number} legendSize
    *@param {Object} recMargins
    *@param {Number} recMargins.left
    *@param {Number} recMargins.right
    *@param {Number} recMargins.top
    *@param {Number} recMargins.bottom
    *@param {Object} legendPadding
    *@param {Number} legendPadding.left
    *@param {Number} legendPadding.right
    *@param {Number} legendPadding.top
    *@param {Number} legendPadding.bottom
    *@param {Number} fontSize
    *@returns {Object} imageObj
    *@returns {String} imageObj.imageUrl
    *@returns {Number} imageObj.width
    *@returns {Number} imageObj.height
    *@memberof MeteoLib.Render.GridDataColorMap
    */
    static getLegendEx(colorMap, title, recSize, legendSize, recMargins, legendPadding, fontSize): {
        imageUrl: string
        width: number
        height: number
    }


    /**
     * 画水平布局且倾斜的图例，返回图例canvas
     * @param {Object}options
     * @param {Array}options.colorMap
     * @param {Number}[options.width=300]
     * @param {Number}[options.height=30]
     * 
     * @param {Boolean}[options.outline=false]
     * @param {String}[options.lineStyle='black']
     * @param {Number}[options.lineWidth=1]
     *  
     * @param {Boolean}[options.label=true] true则显示标注
     * @param {String}[options.labelColor='black'] 标注文本颜色
     * @param {Number}[options.fontSize=12] 标注字体大小
     * @param {String}[options.fontFamily='songti'] 标注字体名称
     * @param {Number}[options.skewXDeg=18] 倾斜角度（单位是角度）
     * @param {Boolean}[options.showStart=false] true则显示第一个标注值
     * @param {Boolean}[options.showEnd=false] true则显示最后一个标注值
     * 
     * @param {Object}[options.labelPadding]
     * @param {Number}[options.labelPadding.top]
     * @param {Number}[options.labelPadding.bottom]
     * @returns {Canvas} canvas
     * @returns {Object} canvas.options
     * @returns {Function} canvas.update
     * @example
     * 
        var colorMap = [
            [0, 5, [0, 0, 246, 255], "0~5"],
            [5, 10, [1, 160, 246, 255], "5~10"],
            [10, 15, [0, 236, 236, 255], "10~15"],
            [15, 20, [1, 255, 0, 255], "15~20"],
            [20, 25, [0, 200, 0, 255], "20~25"],
            [25, 30, [1, 144, 0, 255], "25~30"],
            [30, 35, [255, 255, 0, 255], "30~35"],
            [35, 40, [231, 192, 0, 255], "35~40"],
            [40, 45, [255, 144, 0, 255], "40~45"],
            [45, 50, [255, 0, 0, 255], "45~50"],
            [50, 55, [214, 0, 0, 255], "50~55"],
            [55, 60, [192, 0, 0, 255], "55~60"],
            [60, 65, [255, 0, 240, 255], "60~65"],
            [65, 70, [120, 0, 132, 255], "65~70"],
            [70, 100, [173, 144, 240, 255], ">70"]
        ]
    
        var cv = getLegendParallelogram({
            labelColor: "white",
            colorMap: colorMap,
            height: 30,
            fontFamily: "songti",
            fontSize: 12,
            width: 400,
            outline: false,
            lineWidth: 0.5,
            lineStyle: 'yellow',
            skewXDeg:18,
            labelPadding: {
                top: 4,
                bottom: 2
            }
        });
        cv.style = " background: black;"
        document.getElementById('app').appendChild(cv)
    
        setTimeout(function () {
            cv.options.width = 500;
            cv.options.height = 40;
            cv.options.fontSize = 15;
            cv.update()
        }, 3000)
    
     */

    static getLegendParallelogram(options): HTMLCanvasElement


    /**
    *提取图片中指定行或者列的颜色，自动生成图例数据
    *@param {String} imgUrl 图片路径
    *@param {Number} min 图例所表示数据范围的最小值
    *@param {Number} max 图例所表示数据范围的最大值
    *@param {Number} count 图例所表示数据范围分段数
    *@param {Number} unit 图例所表示数据单位
    *@param {Boolean} byRow 指示是否提取按行提取，true则提取中间图像中间行颜色，false则提取中间列颜色，
    *不传或者为undefined则根据图像宽高比决定（宽最大则按提取中间行，高最大则提取中间列）
    *@return {Promise.<GenerateColorMap>}
    *@memberof MeteoLib.Render.GridDataColorMap
    *@method fromImage
    *@static
    */
    static fromImage(imgUrl, min, max, count, unit, byRow): Promise<GenerateColorMap>
    /**
    *生成图例缩略图
    *@param {MeteoLib.Render.GridDataColorMap}colorMap
    *@param {Number}width
    *@param {Number}height
    */
    static getOverview(colorMap, width, height): HTMLCanvasElement
}

//utils
//data
import CoordinateHelper from '../../Source/Data/Radar/CoordinateHelper'
import MyLatLng from '../../Source/Data/Radar/MyLatLng'
/**
 * 封装提取三维等直面的三种方法
 */
declare module IsoSurfaceMesher {
    /**
     * MarchingCubes:Extracts an isosurface from `potential` using surface nets with resolution given by `dims`.
     * @param dims A 3D vector of integers representing the resolution of the isosurface
     * @param potential A scalar valued potential function taking 3 coordinates as arguments returning a scalar.
     * @param bounds A pair of 3D vectors `[lo, hi]` giving bounds on the potential to sample.  If not specified, default is `[[0,0,0], dims]`.
     */
    export function MC(dims: number[][], potential: (x: number, y: number, z: number) => number, bounds: number[][]): {
        /**
          * The coordinates of the vertices of the mesh
          */
        positions: number[][];
        /**
         * The faces of the mesh.
         */
        cells: any[][];
    }
    /**
     * SurfaceNets:Extracts an isosurface from `potential` using surface nets with resolution given by `dims`.
     * @param dims A 3D vector of integers representing the resolution of the isosurface
     * @param potential A scalar valued potential function taking 3 coordinates as arguments returning a scalar.
     * @param bounds A pair of 3D vectors `[lo, hi]` giving bounds on the potential to sample.  If not specified, default is `[[0,0,0], dims]`.
     */
    export function SN(dims: any, potential: any, bounds: any): {
        /**
           * The coordinates of the vertices of the mesh
           */
        positions: number[][];
        /**
         * The faces of the mesh.
         */
        cells: any[][];
    }
    /**
     * MarchingTetrahedra:Extracts an isosurface from `potential` using surface nets with resolution given by `dims`.
     * @param dims A 3D vector of integers representing the resolution of the isosurface
     * @param potential A scalar valued potential function taking 3 coordinates as arguments returning a scalar.
     * @param bounds A pair of 3D vectors `[lo, hi]` giving bounds on the potential to sample.  If not specified, default is `[[0,0,0], dims]`.
     */
    export function MT(dims: any, potential: any, bounds: any): {
        /**
         * The coordinates of the vertices of the mesh
         */
        positions: number[][];
        /**
         * The faces of the mesh.
         */
        cells: any[][];
    }


}

export {
    FileSystem,
    HttpFileSystem,
    FileInfo,
    Interpolate,
    GridData,
    StationData,
    d3Contour,
    SwanRadar,
    CoordinateHelper,
    MyLatLng,
    PupProductFormat,
    RasterData,
    AwxRasterHeader,
    AwxSateImageryProvider,
    RasterImageGenerator,
    RasterTileImageryProvider,
    GridDataImageryProvider,
    GridDataColorMap,
    RasterDataset,
    MeteoSign,
    IsoSurfaceMesher
}

declare module MeteoLib {

    export {
        FileSystem,
        HttpFileSystem,
        FileInfo,
        Interpolate,
        GridData,
        StationData,
        d3Contour,
        SwanRadar,
        CoordinateHelper,
        MyLatLng,
        PupProductFormat,
        RasterData,
        AwxRasterHeader,
        AwxSateImageryProvider,
        RasterImageGenerator,
        RasterTileImageryProvider,
        GridDataImageryProvider,
        GridDataColorMap,
        MeteoSign,
        IsoSurfaceMesher
    }
}
export as namespace MeteoLib;
export = MeteoLib