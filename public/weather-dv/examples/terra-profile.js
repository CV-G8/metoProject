/**
 * 地形剖面分析
 */

import ui from '@mesh-3d/engine-ui/components/index.standalone'
import Vue from 'vue'
Vue.use(ui)
import { saveArrayBuffer } from '@mesh-3d/utils/Source/saver'
import {
    getLine,
    getPolyline,
    getRactangle
} from '@mesh-3d/earth/Source/interactive'
import * as terrainSampler from '../src/terrainSampler'
import TerrainProfile from './components/TerrainProfile.vue'
import Viewer3js from './components/Viewer3js.vue'
import MeBaseViewer from '@mesh-3d/core/Source/MeBaseViewer'
import * as THREE from '@mesh-3d/three'
import TerrainTile from './components/TerrainTile'
window.THREE=THREE;

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(105, 24, 112, 32)
/**
 * @type {Cesium.Viewer}
 */
var viewer, entities
var terrainProvider = new Cesium.CesiumTerrainProvider({
    url: 'http://localhost:8666'
})
/**
 * @type {MeBaseViewer}
 */
var viewer3js
/**
 * @type {THREE.Mesh}
 */
var terrainMesh;

var app = new Vue({
    el: '#app',
    data: {
        show: true,
        terrainProfile: null,
        progress: 0,
        interval: 100,
        continueSample: true,
        sampling: false,
        startPoint: null,
        stopPoint: null,
        units: 'm',
        viewer3js: {
            controlType: 'map'
        }
    },
    components: {
        'me-terra-profile': TerrainProfile,
        'me-viewer3js': Viewer3js
    },
    mounted() {
        var mapContainer = this.$el.getElementsByClassName('map-container')[0]

        viewer = new Cesium.Viewer(mapContainer, {
            creditContainer: document.createElement('div'),
            timeline: false,
            animation: false,
            infoBox: false,
            terrainProvider: terrainProvider
        })
        viewer.scene.fog.enabled = false

    },
    methods: {
        onViewer3jsReady(inViewer3js) {
            viewer3js = inViewer3js
        },
        areaSample() {
            var _this = this
            getRactangle(viewer, rectangle => {
                terrainSampler.rectangleSample(rectangle, terrainProvider, {
                    onProgress(progress) {
                        _this.progress = progress
                    },
                }).then(res => {
                    if (terrainMesh) {
                        terrainMesh = viewer3js.remove(terrainMesh);
                    }
                    terrainMesh = new TerrainTile(res);
                    viewer3js.add(terrainMesh)
                    viewer3js.lookAt(terrainMesh)

                })
            })
        },
        sample() {
            var _this = this
            _this.sampling = true

            function continueClip() {

                _this.cancelCallback = getLine(viewer, (line, lineEntities) => {
                    entities = []
                    lineEntities.forEach(entity => {
                        entities.push(viewer.entities.add(entity))
                    })

                    _this.cancelCallback = null
                    terrainSampler.lineSample(line, terrainProvider, {
                        onProgress(progress) {
                            _this.progress = progress
                        },
                        interval: _this.interval
                    }).then(res => {
                        _this.progress = 0;
                        _this.startPoint = res.start
                        _this.stopPoint = res.stop;
                        var heights = res.values
                        var distances = res.distances
                        _this.terrainProfile = {
                            distances, heights
                        }
                        if (_this.continueSample) continueClip()
                        else _this.sampling = false
                    })
                }, {
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
            }
        }
    }
})
