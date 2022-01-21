/**
 * micaps格点格式的EC数值模式图层
 */

import { Vector2dLayer } from "..";
import HfsFileLoader from "../HfsFileLoader";
import IHfsFileLayer from "./IHfsFileLayer";

/**
 * micaps格点格式的EC数值模式图层
 */
export default class MicapsECLayer extends IHfsFileLayer {
    /**
     *  micaps格点格式的EC数值模式图层
     * @param {HfsFileLoader}  fileLoader
     */
    constructor(fileLoader: HfsFileLoader)

    /**
     * true表示当前时次数据加载完成，false表示未加载或者加载中
     */
    readonly ready: boolean
    readonly readyPromise: Promise<this>
    readonly imageryLayer: ImageryLayer

    /**
     * 要素
     */
    element: string
    /**
     * 层次
     */
    level: string

    /**
     * 预报时间
     */
    forecastTime:string

    /**
     * 是否显示等值线
     */
    showIsoLine: boolean
    /**
     * 是否显示色斑图/填充颜色
     */
    fill: boolean
    /**
     * true则色斑图基于插值结果数据集绘制（结果与等值线相吻合），false则使用原始数据绘制（原始分辨率较低，所以马赛克比较严重）
     */
    interpolate:boolean
    /**
     * 用于裁剪的矢量图层。矢量数据必须包含面要素，且样式开启填充颜色功能
     */
    clipperLayer:Vector2dLayer
}