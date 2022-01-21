

/**
 * micaps格点格式的EC数值模式图层
 */
import HfsFileLoader from "../HfsFileLoader";
import IHfsFileLayer from "./IHfsFileLayer";

/**
 * swan格点格式的雷达拼图图层
 */
export default class SwanRadarLayer extends IHfsFileLayer {
    /**
     *  swan格点格式的雷达拼图图层
     * @param {HfsFileLoader}  fileLoader
     */
    constructor(fileLoader)

    /**
     * true表示当前时次数据加载完成，false表示未加载或者加载中
     */
     readonly ready: boolean
     readonly readyPromise: Promise<this>
     readonly imageryLayer: ImageryLayer
     
    //层次

    /**
     * 获取拼图总层数
     */
    levelCount: number
    /**
     * 获取或设置层次索引
     */
    level: number
 
}