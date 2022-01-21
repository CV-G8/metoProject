


import { Earth } from "@mesh-3d/earth";
import FileInfo from "@mesh-3d/meteolib/Source/Util/HttpFileSystem/FileInfo";
import HfsFileLoader from "../HfsFileLoader";
import { Rectangle } from "@mesh-3d/cesium";
import { IHfsFileLayer } from "../../dist/WeatherDV";

/**
 * 卫星云图图层
 */
export default class SateCloudLayer extends IHfsFileLayer{
    /**
     * 卫星云图图层
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
     * 获取或设置云图通道 
     * * 可见光：C002
     * * 红外：C012
     * * 水汽：C008 
     */
    channel: string
    
}