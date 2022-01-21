/**
 * 卫星云图图层
 */


import { Earth, ILayer } from "@mesh-3d/earth";
import { FileInfo } from "@mesh-3d/meteolib-wdv";
import HfsFileLoader from "../HfsFileLoader";
import { Rectangle } from "@mesh-3d/cesium";

/**
 * 定义hfs文件数据图层接口，实现基本的加载流程
 */
export default class IHfsFileLayer extends ILayer {
    /**
     *   
     * @param {HfsFileLoader}  fileLoader
     */
    constructor(fileLoader: HfsFileLoader, options: {
        zIndex: number
        /**
        * 数据根目录名称，映射到服务端一个具体的物理路径
        */
        dir: string
        /**
         * 数据目录相对于根目录的路径
         */
        path: string
        /**
         * 数据文件后缀
         */
        ext?: string
        /**
         * true则从入库结果中查询，false则直接从文件系统中读取
         */
        fromDb?: boolean
        /**
         * 文件名的时间格式，默认为“yyyyMMddhhmmss”
         */
        timeRegex?: string
    })
    protected readonly channelPath:string 
    protected _fileLoader: HfsFileLoader
    /**
     * 获取文件列表
     */
    readonly fileList: FileInfo[]
    /**
     * 获取时间列表
     */
    readonly timeList: Date[]
    /**
     * 获取最新时次时间
     */
    readonly latestTime: Date
    /**
     * 获取或设置图层显示/隐藏
     */
    show: boolean
    /**
     * 获取或设置系统当前时间，通知更新图层
     */
    currentTime: Date
    readonly currentFile: FileInfo

    /**
     * true表示当前时次数据加载完成，false表示未加载或者加载中
     */
    readonly ready: boolean
    readonly readyPromise: Promise<this>

    /**
     * 获取图层数据配置项
     */
    readonly options: {
        /**
         * 数据根目录名称，映射到服务端一个具体的物理路径
         */
        dir: string
        /**
         * 数据目录相对于根目录的路径
         */
        path: string
        /**
         * 数据文件后缀
         */
        ext: string
        /**
         * true则从入库结果中查询，false则直接从文件系统中读取
         */
        fromDb: boolean
        /**
         * 文件名的时间格式，默认为“yyyyMMddhhmmss”
         */
        timeRegex: string
    }
    /**
     * 获取当前图层所用的调色板对象，ready为false时返回undefined
     */
    readonly colorMap: any[]
    /**
     * 获取图层四至范围
     */
    readonly rectangle: Rectangle

    /**
     * 更新时次列表
     * @param startTime 
     * @param endTime 
     */
    updateList(startTime?: string | Date, endTime?: string | Date): Promise<this>

    load(earth: Earth): Promise<this>

    //子类需要实现的接口

    updateLayer(layer:IHfsFileLayer) { }
    unload(earth: Earth) {
        this.earth = null;
        throw new Error('IHfsFileLayer：卸载方法未实现')
    }
    onError(err:Error|string) { }
    onListUpdate(layer:IHfsFileLayer) { }
}