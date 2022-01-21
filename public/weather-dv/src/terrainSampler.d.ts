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
