 
import HfsFileLoader from "../HfsFileLoader";
import IHfsFileLayer from "./IHfsFileLayer";
import { ImageryLayer } from '@mesh-3d/cesium'

/**
 * 单站雷达PUP产品图层
 */
export default class PUPRadarLayer extends IHfsFileLayer {
    /**
     * 单站雷达PUP产品图层
     * @param {HfsFileLoader}  fileLoader
     */
    constructor(fileLoader: HfsFileLoader)

    /**
     * true表示当前时次数据加载完成，false表示未加载或者加载中
     */
    readonly ready: boolean
    readonly readyPromise: Promise<this>
    readonly imageryLayer: ImageryLayer
 
    //雷达站点名称
    station: string

    /**
     * 产品代码:
     * * 组合反射率： CR/38
     * * 回波顶高：ET/41
     * * 垂直积分液态含水量：VIL/57
     */
    prodCode: string

}