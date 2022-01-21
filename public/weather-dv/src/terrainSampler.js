
import GenericWorker from '@mesh-3d/utils/Source/GenericWorker'
import splitLine from './splitLine';

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
export async function rectangleSample(rectangle, terrainProvider, options) {
    const { Rectangle, Cartesian2, Cartographic } = Cesium, _Math = Cesium.Math;
    options = options || {}
    var tileSize = options.tileSize || 128;
    var level = options.level || 13;
    var maxWidth = options.maxWidth || 14000
    var maxHeight = options.maxHeight || 14000
    var onProgress = options.onProgress

    var nw = Rectangle.northwest(rectangle)
    var se = Rectangle.southeast(rectangle)
    var startTile = terrainProvider.tilingScheme.positionToTileXY(nw, level, {})
    var endTile = terrainProvider.tilingScheme.positionToTileXY(se, level, {})
    var tileNum = Cartesian2.subtract(endTile, startTile, {})

    var width = tileNum.x * tileSize
    var height = tileNum.y * tileSize
    if (width > maxWidth || height > maxHeight) {
        throw new Error('范围太大，请调整范围')
    }

    var buffer = new Float32Array(width * height);
    var tiles = [];

    for (let y = startTile.y; y < endTile.y; y++) {
        for (let x = startTile.x; x <= endTile.x; x++) {
            tiles.push({
                x, y
            })
        }
    }

    var worker = new GenericWorker(tiles, tile => {
        return new Promise((resolve, reject) => {
            terrainProvider.requestTileGeometry(tile.x, tile.y, level)
                .then(terrainData => {
                    var tileRect = terrainProvider.tilingScheme.tileXYToRectangle(tile.x, tile.y, level)
                    var deltX = tileRect.width / (tileSize - 1);
                    var deltY = tileRect.height / (tileSize - 1);
                    var y0 = (tile.y - startTile.y) * tileSize
                    var x0 = (tile.x - startTile.x) * tileSize
                    for (var i = 0; i < tileSize; i++) {
                        var y = y0 + i;
                        for (var j = 0; j < tileSize; j++) {
                            var x = x0 + j;
                            var index = y * width + x;
                            var position = new Cartographic(
                                tileRect.west + j * deltX,
                                tileRect.north - i * deltY
                            );
                            var height = terrainData.interpolateHeight(tileRect, position.longitude, position.latitude);
                            buffer[index] = height;
                        }
                    }
                    resolve()
                }).otherwise(err => {
                    resolve()
                })
        })
    })

    await worker.run(onProgress)

    return {
        width: width,
        height: height,
        data: buffer,
        bbox: [
            _Math.toDegrees(rectangle.west),
            _Math.toDegrees(rectangle.south),
            _Math.toDegrees(rectangle.east),
            _Math.toDegrees(rectangle.north)
        ]
    }
}

/**
 * 生成地形剖面数据
 * @param {Cesium.Cartographic[]} line 
 * @param {Cesium.CesiumTerrainProvider} terrainProvider 
 * @param {object}[options]
 * @param {(progress:number)=>void} [options.onProgress]
 * @param {number}[options.interval]
 * @param {number}[options.level=13]
 * @param {'degrees'|'radians'|'miles'|'kilometers'|'meters'} [options.units='meters'] 
 */
export async function lineSample(line, terrainProvider, options) {
    const { sampleTerrain } = Cesium;
    options = options || {}
    var level = options.level || 13;
    var onProgress = options.onProgress
    var sampleLine = splitLine(line, options.units, options.interval);
    var positions = sampleLine.positions

    //按点所在瓦片分批次
    var byTiles = [], tiles = {};
    for (const position of positions) {
        var tile = terrainProvider.tilingScheme.positionToTileXY(position, level)
        tile = [tile.x, tile.y].join(',')
        var idx = tiles[tile]
        if (idx == undefined) {
            idx = byTiles.length;
            tiles[tile] = idx
            byTiles[idx] = []
        }
        byTiles[idx].push(position)
    }

    //开始逐个批次采样
    var worker = new GenericWorker(byTiles, samplePositions => {
        return new Promise(resolve => {
            sampleTerrain(terrainProvider, level, samplePositions)
                .then(resolve).otherwise(resolve)
        })
    })
    await worker.run(onProgress)

    sampleLine.values = positions.map(p => {
        return p.height
    })
    return sampleLine;
}
