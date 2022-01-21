import splitLine from "./splitLine";
// import RasterDataset from "@mesh-3d/meteolib/Source/Data/RasterDataset/RasterDataset";
import GenericWorker from '@mesh-3d/utils/Source/GenericWorker'
const { RasterDataset } = MeteoLib
 
/**
 * 
 * @param {Cesium.Cartographic[]} line 
 * @param {RasterDataset}dataset 
 * @param {object}[options]
 * @param {(progress:number)=>void} [options.onProgress]
 * @param {number}[options.interval]
 * @param {'degrees'|'radians'|'miles'|'kilometers'|'meters'} [options.units='meters'] 
 */
export function lineSample(line, dataset, options) {

    options = options || {};
    var onProgress = options.onProgress;

    var sampleLine = splitLine(line, options.units, options.interval)

    //分批进行采样，避免页面卡顿
    var batch = [], batches = [batch], batchSize = 100;
    sampleLine.positions.forEach(p => {
        if (batch.length == batchSize) {
            batch = [];
            batches.push(batch)
        }
        batch.push(p);
    })

    var worker = new GenericWorker(batches, batch => {
        for (const p of batch) {
            p.value = dataset.selectPoint(0, p.longitude, p.latitude)
        }
    })

    return worker.run(onProgress).then(() => {
        sampleLine.values = sampleLine.positions.map(p => {
            var val = p.value;
            delete p.value
            return val
        })
        return sampleLine
    })
}