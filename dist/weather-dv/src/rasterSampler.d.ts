
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