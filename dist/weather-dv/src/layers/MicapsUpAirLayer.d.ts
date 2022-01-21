
import HfsFileLoader from "./HfsFileLoader";
import IHfsFileLayer from "./IHfsFileLayer";

/**
 * 高空填图图层
 */
export default class MicapsUpAirLayer extends IHfsFileLayer {
    constructor(fileLoader: HfsFileLoader)
    /**
    * true表示当前时次数据加载完成，false表示未加载或者加载中
    */
    readonly ready: boolean
    readonly readyPromise: Promise<this>
    readonly imageryLayer: ImageryLayer
    level: string
    /**
     * 符号图片大小
     * @default 80
     */
    symbolSize:number
    /**
     * 风向符号类型
     * * windShaft：风羽
     * * arrow：箭头
     * @default 'windShaft'
     */
    windSymbolType: 'windShaft' | 'arrow'
    /**
     * 风向符号大小
     * @default 32
     */
    windSymbolSize:number
}