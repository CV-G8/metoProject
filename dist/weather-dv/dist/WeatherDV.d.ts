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
 */declare class HfsFileLoader {
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
// import RasterDataset from "@mesh-3d/meteolib/Source/Data/RasterDataset/RasterDataset"; 
import { RasterDataset } from '@mesh-3d/meteolib-wdv'

/**
 * 
 * @param {Cesium.Cartographic[]} line 
 * @param {RasterDataset}dataset 
 * @param {object}[options]
 * @param {(progress:number)=>void} [options.onProgress]
 * @param {number}[options.interval]
 * @param {'degrees'|'radians'|'miles'|'kilometers'|'meters'} [options.units='meters'] 
 */
export function lineSample(line: Cartographic[], dataset: RasterDataset, options: {
    onProgress?: (progress: number) => void;
    interval?: number;
    units?: 'degrees' | 'radians' | 'miles' | 'kilometers' | 'meters';
}): Promise<{
    /**
     * 从起点到终点，各点距起点的距离，单位由units指定
     */
    distances: number[]
    /**
     * 从起点到终点，各点的高度，单位为米
     */
    values: number[]
    /**
     * 从起点到终点，各点地理坐标（弧度）
     */
    positions: Cesium.Cartographic[]
    /**
     * 起点地理坐标（角度）
     */
    start: {
        longitude: number;
        latitude: number;
    }
    /**
     * 终点地理坐标（角度）
     */
    stop: {
        longitude: number;
        latitude: number;
    }
    /**
     * 距离和采样间距单位
     */
    units: 'degrees' | 'radians' | 'miles' | 'kilometers' | 'meters'
    /**
     * 采样间距，单位由units指定
     */
    interval: number
}>
import Cesium from "cesium";

/**
 * 从给定地形数据源中导出指定矩形范围内的地形高度数据
 * @param {Cesium.Rectangle} rectangle 
 * @param {Cesium.TerrainProvider} terrainProvider 
 * @param {object} options 
 * @param {(progress:number)=>void} [options.onProgress]
 * @param {number} [options.tileSize=128]
 * @param {number} [options.level=13]
 * @param {number} [options.maxWidth=14000]
 * @param {number} [options.maxHeight=14000]
 * @returns {Promise<{
 *  width: number;
 *  height: number;
 *  data: Float32Array;
 *  bbox:number[]
 * }>}
 */
export function rectangleSample(
    rectangle: Cesium.Rectangle,
    terrainProvider: Cesium.CesiumTerrainProvider,
    options?: {
        onProgress?: (progress: number) => void
        /**
         * @default 128
         */
        tileSize?: number
        /**
         * @default 13
         */
        level: number
        /**
         * @default 14000
         */
        maxWidth?: number
        /**
         * @default 14000
         */
        maxHeight?: number
    }): Promise<{
        width: number;
        height: number;
        data: Float32Array;
        bbox: number[]
    }>

/**
 * 
 * @param {Cesium.Cartographic[]} line 
 * @param {Cesium.CesiumTerrainProvider} terrainProvider 
 * @param {object}[options]
 * @param {(progress:number)=>void} [options.onProgress]
 * @param {number}[options.interval]
 * @param {number}[options.level=13]
 * @param {'degrees'|'radians'|'miles'|'kilometers'|'meters'} [options.units='meters'] 
 */
export function lineSample(
    line,
    terrainProvider,
    options?: {
        /**
         * @param {number}progress 采样进度，0～100 
         */
        onProgress?: (progress: number) => void
        interval?: number
        /**
         * @default 13
         */
        level?: number
        /**
         * @default 'meters'
         */
        units?: 'degrees' | 'radians' | 'miles' | 'kilometers' | 'meters'
    }
): Promise<{
    /**
     * 从起点到终点，各点距起点的距离，单位由units指定
     */
    distances: number[]
    /**
     * 从起点到终点，各点的高度，单位为米
     */
     values: number[]
    /**
     * 从起点到终点，各点地理坐标（弧度）
     */
    positions: Cesium.Cartographic[]
    /**
     * 起点地理坐标（角度）
     */
    start: {
        longitude: number;
        latitude: number;
    }
    /**
     * 终点地理坐标（角度）
     */
    stop: {
        longitude: number;
        latitude: number;
    }
    /**
     * 距离和采样间距单位
     */
    units: 'degrees' | 'radians' | 'miles' | 'kilometers' | 'meters'
    /**
     * 采样间距，单位由units指定
     */
    interval: number
}>

/**
 * 卫星云图图层
 */


import { Earth, ILayer } from "@mesh-3d/earth";
import { FileInfo } from "@mesh-3d/meteolib-wdv";
import { Rectangle } from "@mesh-3d/cesium";

/**
 * 定义hfs文件数据图层接口，实现基本的加载流程
 */declare class IHfsFileLayer extends ILayer {
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
/**
 * micaps格点格式的EC数值模式图层
 */

import { Vector2dLayer } from "..";
/**
 * micaps格点格式的EC数值模式图层
 */declare class MicapsECLayer extends IHfsFileLayer {
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
import { ImageryLayer } from '@mesh-3d/cesium'

/**
 * 单站雷达PUP产品图层
 */declare class PUPRadarLayer extends IHfsFileLayer {
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
import { Earth } from "@mesh-3d/earth";
import FileInfo from "@mesh-3d/meteolib/Source/Util/HttpFileSystem/FileInfo";
import { IHfsFileLayer } from "../../dist/WeatherDV";

/**
 * 卫星云图图层
 */declare class SateCloudLayer extends IHfsFileLayer{
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
/**
 * micaps格点格式的EC数值模式图层
 */
/**
 * swan格点格式的雷达拼图图层
 */declare class SwanRadarLayer extends IHfsFileLayer {
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
/**
 * 高空填图图层
 */declare class MicapsUpAirLayer extends IHfsFileLayer {
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
/**
 * 地面监测要素图层
 */declare class SurfLayer extends IHfsFileLayer {
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
import { Earth } from '@mesh-3d/earth/index';
import {
    HighlightPolygonLayer, SealandVec2dLayer,
    HighlightMarkerLayer, LabelVec2dLayer, CountryVec2dLayer
} from '@mesh-3d/earth/Source/layers/vector/Vector2dLayer';

/**
 * 矢量图层组：国界、省界、市界、项目所在市的县界、行政区地名、自然地名、居民地地名
 */declare class VectorLayerGroup {
    constructor(options?: {
        /**
         * @default 'dark'
         */
        theme?: 'dark' | 'light'
        /**
         * @default './Assets'
         */
        url?: string
    })

    show: boolean

    readonly sealandLayer: SealandVec2dLayer
    readonly provinceLayer: HighlightPolygonLayer
    readonly countyLayer: HighlightPolygonLayer
    readonly placeNameLayer: HighlightMarkerLayer
    readonly placeName2Layer: LabelVec2dLayer
    readonly placeName3Layer: LabelVec2dLayer
    readonly countryLayer: CountryVec2dLayer

    load(earth: Earth): Promise<this>
}
import ImageTileLayer from '@mesh-3d/earth/Source/layers/imagery/ImageTileLayer';
 
/**
 * @example
 * 
var mapContainer = document.getElementsByClassName('map-container')[0]

var gridLayer = new GeoGridLayer({
    zIndex: 1
})

earth = new Earth({
    container: mapContainer,
    creditContainer: document.createElement('div'),
    timeline: true,
    animation: true,
    infoBox: false,
    baseLayerPicker: false,
    imageryProvider: gridLayer.provider,
    contextOptions: {
        webgl: {
            alpha: true
        }
    }
})

earth.scene.skyAtmosphere.show = false
earth.scene.fog.enabled = false
earth.scene.skyBox.show = false
earth.scene.globe.baseColor = Cesium.Color.TRANSPARENT
earth.scene.backgroundColor = Cesium.Color.TRANSPARENT
earth.scene.sun.show = false
earth.scene.sunBloom = false
earth.scene.globe.showGroundAtmosphere = false

earth.addLayer(gridLayer)

viewer = earth.viewer; 
earth.addLayer(new TiandituImgLayer({
    maximumLevel:18
}))
 */declare class GeoGridLayer extends ImageTileLayer {
    /**
     * 
     * @param options 
     * @example
     * 
var mapContainer = document.getElementsByClassName('map-container')[0]

var gridLayer = new GeoGridLayer({
    zIndex: 1
})

earth = new Earth({
    container: mapContainer,
    creditContainer: document.createElement('div'),
    timeline: true,
    animation: true,
    infoBox: false,
    baseLayerPicker: false,
    imageryProvider: gridLayer.provider,
    contextOptions: {
        webgl: {
            alpha: true
        }
    }
})

earth.scene.skyAtmosphere.show = false
earth.scene.fog.enabled = false
earth.scene.skyBox.show = false
earth.scene.globe.baseColor = Cesium.Color.TRANSPARENT
earth.scene.backgroundColor = Cesium.Color.TRANSPARENT
earth.scene.sun.show = false
earth.scene.sunBloom = false
earth.scene.globe.showGroundAtmosphere = false

earth.addLayer(gridLayer)

viewer = earth.viewer; 
earth.addLayer(new TiandituImgLayer({
    maximumLevel:18
}))
     */
    constructor(options?: {
        gridImage?: string | HTMLImageElement | HTMLCanvasElement
        bgColor?: string
        lightColor?: string
        darkColor?: string
        minimumLevel?: number
        maximumLevel?: number
    })
    readyPromise: Promise<this>
    provider: Cesium.GridImageryProvider
}
import splitLine from "./splitLine";
import {
    Earth, LocalSkyBox, LocalSkyBoxAnimation,
    ILayer, ImageTileLayer, TiandituLayer, TiandituImgLayer, TiandituTerLayer, TiandituVecLayer,
    Vector2dLayer, HighlightPolygonLayer, SealandVec2dLayer,
    HighlightMarkerLayer, LabelVec2dLayer, CountryVec2dLayer,
    // Vector2RasterLayer
    Vector3dLayer,
    C3DTilesLayer, OsgbLayer,
    GeoMesh, GeoPolygonMesh, GeoPolylineMesh, GeoWaterMesh,
    GeoPolylineGeometry, GeoPolygonGeometry,
    ExtrudedPolygonGeometry, SolidWireframeGeometry, VectorPolygonGeometry,
    SolidWireframeMaterial,
    interactive, getPoint, getLine, getPolyline, getRactangle, pickPosition
} from '@mesh-3d/earth/index'

import {
    MeshVisualizer, CameraUtils, GeometryUtils, RendererUtils
} from '@mesh-3d/core/index'

declare module WeatherDV {
    export {
        HfsFileLoader,
        rasterSampler,
        terrainSampler,
        splitLine,
        IHfsFileLayer,
        MicapsECLayer,
        PUPRadarLayer,
        SateCloudLayer,
        SwanRadarLayer,
        MicapsUpAirLayer,
        VectorLayerGroup,
        SurfLayer,
        GeoGridLayer,

        //core

        MeshVisualizer, CameraUtils, GeometryUtils, RendererUtils,

        //earth

        Earth, LocalSkyBox, LocalSkyBoxAnimation,
        ILayer, ImageTileLayer, TiandituLayer, TiandituImgLayer, TiandituTerLayer, TiandituVecLayer,
        Vector2dLayer, HighlightPolygonLayer, SealandVec2dLayer,
        HighlightMarkerLayer, LabelVec2dLayer, CountryVec2dLayer,
        // Vector2RasterLayer
        Vector3dLayer,
        C3DTilesLayer, OsgbLayer,
        GeoMesh, GeoPolygonMesh, GeoPolylineMesh, GeoWaterMesh,
        GeoPolylineGeometry, GeoPolygonGeometry,
        ExtrudedPolygonGeometry, SolidWireframeGeometry, VectorPolygonGeometry,
        SolidWireframeMaterial,
        interactive, getPoint, getLine, getPolyline, getRactangle, pickPosition
    }
}

export as namespace WeatherDV;
export = WeatherDV