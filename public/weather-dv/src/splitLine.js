
import * as turf from '@turf/helpers'
import along from '@turf/along'
import distance from '@turf/distance'
 
/**
 * 细分线段，如果未给定间距（interval），则默认拆分64段
 * @param {Cesium.Cartographic[]} line 
 * @param {'degrees'|'radians'|'miles'|'kilometers'|'meters'} [units='meters'] 
 * @param {number} [interval] 
 * @returns 
 */
export default function splitLine(line, units, interval) {
    const { Cartographic } = Cesium, _Math = Cesium.Math;

    interval = interval;
    units = units || 'meters';
    var computeUnits = units == 'meters' ? 'kilometers' : units;
    var distScale = units == 'meters' ? 1000 : 1;
    //计算线段总距离

    var coordinates = line.map(p => {
        return [_Math.toDegrees(p.longitude), _Math.toDegrees(p.latitude)]
    })
    var lineString = turf.lineString(coordinates)
    var lineDist = distance(coordinates[0], coordinates[1], { units: computeUnits });

    //拆分成多个线段
    var positions = [line[0]], distances = [0];
    var num = 64;
    if (interval && interval > 0) {
        interval = interval / distScale
        num = lineDist / interval;
    } else {
        interval = lineDist / num
    }
    if (num % 1 == 0) num -= 1;
    for (let i = 1; i < num; i++) {
        var d = i * interval;
        var p = along(lineString, d, { units: computeUnits })
        distances.push(d * distScale)
        var pointCoord = p.geometry.coordinates
        positions.push(Cartographic.fromDegrees(pointCoord[0], pointCoord[1]))
    }
    positions.push(line[1]), distances.push(lineDist * distScale)

    interval *= distScale;

    return {
        positions,
        distances,
        units,
        interval,
        start: {
            /**
             * 经度，单位为角度
             * @type {number} 
             */
            longitude: coordinates[0][0],
            /**
             * 纬度，单位为角度
             * @type {number} 
             */
            latitude: coordinates[0][1]
        },
        stop: {
            /**
             * 经度，单位为角度
             * @type {number} 
             */
            longitude: coordinates[1][0],
            /**
             * 纬度，单位为角度
             * @type {number} 
             */
            latitude: coordinates[1][1]
        },
        /**
         * @type {number[]}
         */
        values: []
    }
}