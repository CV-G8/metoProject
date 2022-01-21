/**
 * 地形剖面分析
 */

import ui from '@mesh-3d/engine-ui/components/index.standalone'
import Vue from 'vue'
Vue.use(ui)
import {
    getLine,getPoint
} from '@mesh-3d/earth'

const {
    GridData,
    RasterDataset,
    HttpFileSystem,
    GridDataImageryProvider,
    RasterImageGenerator
}=MeteoLib
   
import * as rasterSampler from '../src/rasterSampler'
import TerrainProfile from './components/TerrainProfile.vue'

RasterImageGenerator.registerAll('../assets/pal/')

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(105, 24, 112, 32)
const hfs = new HttpFileSystem({
    config: {
        baseUrl: 'http://39.107.107.142:18880/hfs',
        auth: {
            uid: 'admin',
            pwd: 'Adnin@123456'
        }
    }
})

/**
 * @type {Cesium.Viewer}
 */
var viewer, entities
var terrainProvider = new Cesium.CesiumTerrainProvider({
    url: 'http://localhost:8666'
})
var gridDataLayer
var gridData = new GridData()
var rasterDataset = new RasterDataset()

var app = new Vue({
    el: '#app',
    data: {
        show: true,
        rasterProfile: null,
        progress: 0,
        interval: 100,
        continueSample: true,
        sampling: false,
        startPoint: null,
        stopPoint: null,
        units: 'm',

        pickPoint: null
    },
    components: {
        'me-terra-profile': TerrainProfile
    },
    mounted() {

        var mapContainer = this.$el.getElementsByClassName('map-container')[0]

        viewer = new Cesium.Viewer(mapContainer, {
            creditContainer: document.createElement('div'),
            timeline: false,
            animation: false,
            infoBox: false,
            // terrainProvider: terrainProvider
        })
        viewer.scene.fog.enabled = false

        hfs.readFile({
            dir: 'GZData',
            path: 'ECMWF_LR/RH/850',
            fileName: '18112420.024'
        }).then(buf => {
            if (gridData.loadByteArray(buf)) {
                rasterDataset.bands = [gridData.dataArray]
                rasterDataset.west = Cesium.Math.toRadians(gridData.bbox[0])
                rasterDataset.south = Cesium.Math.toRadians(gridData.bbox[1])
                rasterDataset.east = Cesium.Math.toRadians(gridData.bbox[2])
                rasterDataset.north = Cesium.Math.toRadians(gridData.bbox[3])
                rasterDataset.width = gridData.width
                rasterDataset.height = gridData.height;
                return gridData
            }
        }).then(gridData => {

            if (gridData.familyName) {
                var element = gridData.element
                /**
                 * @type {RasterImageGenerator}
                 */
                var imageGenerator = RasterImageGenerator.find(element);

                var breaks = []
                var { isolineStartValue, isolineEndValue, isolineSpace } = gridData
                for (let num = isolineStartValue; num <= isolineEndValue; num += isolineSpace) {
                    breaks.push(num);
                }

                var provider = new GridDataImageryProvider({
                    // minimumLevel: 1,
                    maximumLevel: 6,

                    isoLine: true,
                    breaks: breaks,
                    lineColorType: 'fillColor',
                    lineColor: 'rgba(40,40,40,0.8)',

                    isoValue: true,
                    // isoValueColor: Cesium.Color.fromBytes(0, 0, 0),
                    // isoValueBackColor: Cesium.Color.TRANSPARENT,
                    // isoValueStroke: true,
                    // isoValueStrokeWidth: 4,
                    // isoValueStrokeColor: Cesium.Color.fromBytes(228, 228, 228),
                    // isoValueFontSize: 12,
                    // isoValueFontFamily: 'heiti',
                    // isoValuePadding: 0,

                    point: false,
                    maxSamplePointLevel: 6,
                    value: false,

                    fill: true,
                    colorMap: imageGenerator.colorMap,
                    dataArray: gridData.dataArray,
                    width: gridData.width,
                    height: gridData.height,
                    interpolate: false,
                    rectangle: Cesium.Rectangle.fromDegrees(105, 24, 112, 32),
                    dataRectangle: Cesium.Rectangle.fromDegrees(gridData.bbox[0], gridData.bbox[1], gridData.bbox[2], gridData.bbox[3])
                })
                // provider.sync = true
                gridDataLayer = viewer.imageryLayers.addImageryProvider(provider)
                gridDataLayer.alpha = 0.85

            } else {
                $message.error('数据名称为空')
            }

        })

    },
    methods: {
        sample() {
            var _this = this
            _this.sampling = true

            function getLineCallback(line, lineEntities) {
                rasterSampler.lineSample(line, rasterDataset, {
                    interval: _this.interval,
                    onProgress(progress) {
                        _this.progress = progress
                    }
                }).then(res => {
                    _this.startPoint = res.start
                    _this.stopPoint = res.stop;
                    var heights = res.values
                    var distances = res.distances
                    _this.rasterProfile = {
                        distances, heights
                    }
                })

                _this.cancelCallback = null
                entities = []
                lineEntities.forEach(entity => {
                    entities.push(viewer.entities.add(entity))
                })
                if (_this.continueSample) continueClip()
                else _this.sampling = false
            }

            function continueClip() {

                _this.cancelCallback = getLine(
                    viewer,
                    getLineCallback,
                    {
                        pointColor: Cesium.Color.CYAN,
                        lineColor: Cesium.Color.CYAN,
                        onStart() {
                            if (entities) {
                                entities.forEach(entity => {
                                    viewer.entities.remove(entity)
                                })
                                entities = null
                            }
                        }
                    })
            }
            continueClip()
        },
        cancel() {
            if (this.cancelCallback) {
                this.cancelCallback()
                this.sampling = false
                if (entities) {
                    entities.forEach(entity => {
                        viewer.entities.remove(entity)
                    })
                    entities = null
                }
                this.cancelCallback = null
            }
        },
        pick() {

            this.cancel()

            getPoint(viewer, p => {
                var value = rasterDataset.selectPoint(0, p.longitude, p.latitude)
                this.pickPoint = {
                    longitude: Cesium.Math.toDegrees(p.longitude),
                    latitude: Cesium.Math.toDegrees(p.latitude),
                    value: value
                }
            }, {
                pointColor: Cesium.Color.CYAN,
                onMove: (p) => {
                    var value = rasterDataset.selectPoint(0, p.longitude, p.latitude)
                    this.pickPoint = {
                        longitude: Cesium.Math.toDegrees(p.longitude),
                        latitude: Cesium.Math.toDegrees(p.latitude),
                        value: value
                    }
                }
            })
        }
    }
})
