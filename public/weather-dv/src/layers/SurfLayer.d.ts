
import HfsFileLoader from "../HfsFileLoader";
import IHfsFileLayer from "./IHfsFileLayer";
import { ImageryLayer } from '@mesh-3d/cesium'

/**
 * 地面监测要素图层
 */
export default class SurfLayer extends IHfsFileLayer {
    /**
     * 地面监测要素图层
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
     * 降水要素：
     * * MAX_PRE_1h ：1小时最大降水量
     * * PRE_1h ：1小时降水量
     * * PRE_3h ：3小时降水量
     * * PRE_6h ：6小时降水量
     * * PRE_24h ：24小时降水量
     * 
     * 其他要素：
     * * TEM ：气温
     * * RHU ：相对湿度
     */
    element: "MAX_PRE_1h" | "PRE_1h" | "PRE_3h" | "PRE_6h" | "PRE_24h" | "TEM" | "RHU"
    textField: "Station_Id_C"|"Station_Name"

    showIsoLine: boolean
    fill: boolean
    showPoint: boolean
    showText: boolean
    showValue: boolean
}