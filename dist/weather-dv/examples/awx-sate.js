
/**
 * 卫星云图可视化示例
 */

import ui from '@mesh-3d/engine-ui/components/index.standalone'
import { SimpleDropzone } from '@mesh-3d/engine-ui/lib/SimpleDropzone'
import Vue from 'vue'
Vue.use(ui)
import { saveArrayBuffer } from '@mesh-3d/utils/Source/saver'


const { RasterImageGenerator,AwxSateImageryProvider,GridDataColorMap } = MeteoLib;

// import AwxSateImageryProvider from '@mesh-3d/meteolib/Source/Scene/AwxSateImageryProvider';
// import RasterImageGenerator from '@mesh-3d/meteolib/Source/Render/RasterImageGenerator';
// import GridDataColorMap from '@mesh-3d/meteolib/Source/Render/GridDataColorMap';

import * as base64 from 'base64-js'
import { Earth, HighlightPolygonLayer } from '@mesh-3d/earth' 

RasterImageGenerator.registerAll('../assets/pal/')

var simpleDropzone = new SimpleDropzone(document.body, 'hidden-file-input');
var viewer, awxLayer, earth;
  
var app = new Vue({
    el: '#app',
    data: {
        show: true
    },
    mounted() {
        var mapContainer = this.$el.getElementsByClassName('map-container')[0]

        earth = new Earth({
            container: mapContainer,
            creditContainer: document.createElement('div'),
            timeline: true,
            animation: true,
            infoBox: false
        })
        earth.globe.enableLighting = false
        earth.scene.highDynamicRange = false;
        earth.postProcessStages.fxaa.enabled = false;
        viewer = earth.viewer;

        earth.onHomeClick.addEventListener(e => {
            if (awxLayer) {
                viewer.camera.flyTo({
                    destination: awxLayer.imageryProvider._dataRectangle
                })
                e.cancel = true;
            }
        })

        //

        var theme = 'dark'
        var geoDataServerUrl = '../assets' //`${location.protocol}//${location.hostname}:8668`

        var provinceLayer = new HighlightPolygonLayer({
            source: geoDataServerUrl + '/vectorData/省界/省界.shp',
            focusAdminNames: ['52'],
            focusPropertyName: '省域代码',
            theme: theme,
            zIndex: 999
        })
        earth.addLayer(provinceLayer)
        provinceLayer.provider.readyPromise.then(() => {
            earth.updateOrder()
        })

        //
        simpleDropzone.on('drop', e => {
            this.showLocalFile(e.files)
        })

    },
    methods: {
        clear() {
            if (awxLayer) {
                viewer.imageryLayers.remove(awxLayer)
                awxLayer = null
            }
        },
        //打开本地文件
        openFile() {
            simpleDropzone.inputEl.value = null
            simpleDropzone.open(e => {
                this.showLocalFile(e.files)
            }, {
                multiple: false
            })
        },
        //加载所打开的本地文件
        showLocalFile(files) {

            var files = Array.from(files);
            var file = files[0][1];
            var imgProvider = new AwxSateImageryProvider({
                fileName: file,
                hdrFileName: file
            })

            //加载完成时，绘制图例
            var legendContainer = this.$el.getElementsByClassName('legend-container')[0]
            legendContainer.innerHTML = ''
            imgProvider.readyPromise.then(() => {
                /**
                 * @type {RasterImageGenerator}
                 */
                var imageGenerator = imgProvider.imageGenerator
                var legendCv = GridDataColorMap.getLegendParallelogram({
                    colorMap: imageGenerator.colorMap,
                    showStart: true,
                    width: 512,
                    showEnd: true,
                    label: false,
                    labelColor: 'white'
                })
                legendContainer.appendChild(legendCv)

                viewer.camera.flyTo({
                    destination: imgProvider._dataRectangle
                })
            })
            //鼠标点击拾取
            imgProvider.onFeaturesPicked = (pointData, x, y, level, longitude, latitude) => {
                $message.alert(`
                    longitude:${longitude},
                    latitude:${latitude},
                    data:${pointData[0]}
                    `, '拾取结果')
            }

            //添加到地图
            if (awxLayer) {
                viewer.imageryLayers.remove(awxLayer)
                awxLayer = null
            }
            awxLayer = viewer.imageryLayers.addImageryProvider(imgProvider)
            imgProvider.zIndex=1
            earth.updateOrder()
        },
        //导出图片
        exportImage() {
            if (awxLayer) {
                /**
                 * @type {AwxSateImageryProvider}
                 */
                var imgProvider = awxLayer.imageryProvider
                /**
                 * @type {RasterImageGenerator}
                 */
                var imageGenerator = imgProvider.imageGenerator

                imgProvider.requestTileData(imgProvider._dataRectangle, 1).then(function (tileData) {
                    var image, xBufferSize, yBufferSize;
                    if (tileData.length && tileData.length > 1) {
                        xBufferSize = tileData[0].width;
                        yBufferSize = tileData[0].height;
                    } else {
                        xBufferSize = tileData.width;
                        yBufferSize = tileData.height;
                    }
                    image = imageGenerator.generate(tileData.data, xBufferSize, yBufferSize);
                    var url = image.toDataURL('image/jpeg')
                    var u8arr = base64.toByteArray(url.replace('data:image/jpeg;base64,', ''))
                    var fileName = imgProvider.fileName.name || imgProvider.fileName
                    saveArrayBuffer(u8arr.buffer, fileName + '.jpg')
                })

                
            }
        }
    }
})