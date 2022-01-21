/**
 * micaps站点数据可视化示例 
 */

import ui from '@mesh-3d/engine-ui/components/index.standalone'
import { SimpleDropzone } from '@mesh-3d/engine-ui/lib/SimpleDropzone'
import Vue from 'vue'
Vue.use(ui)
import { saveArrayBuffer } from '@mesh-3d/utils/Source/saver'

import Micaps from '@mesh-3d/meteolib/Source/Data/Micaps/Micaps'
import FileSystem from '@mesh-3d/meteolib/Source/Util/FileSystem'
import HttpFileSystem from '@mesh-3d/meteolib/Source/Util/HttpFileSystem/HttpFileSystem'

var hfs = new HttpFileSystem({
    config: {
        baseUrl: 'http://39.107.107.142:18880/hfs',
        auth: {
            uid: 'admin',
            pwd: 'Adnin@123456'
        }
    }
})
const fs = new FileSystem();

var simpleDropzone = new SimpleDropzone(document.body, 'hidden-file-input');
var viewer
var app = new Vue({
    el: '#app',
    data: {
        show: true
    },
    mounted() {
        var mapContainer = this.$el.getElementsByClassName('map-container')[0]
        var terrainProvider = new Cesium.CesiumTerrainProvider({
            url:
                'https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path'
                // 'http://192.168.0.7:8666'
        })

        viewer = new Cesium.Viewer(mapContainer, {
            creditContainer: document.createElement('div'),
            timeline: false,
            animation: false,
            infoBox: false,
            terrainProvider: terrainProvider
        })
        viewer.scene.fog.enabled = false
 
        simpleDropzone.on('drop', e => {
            this.showLocalFile(e.files)
        })
    },
    methods: {
        clear() {

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
            fs.readFile(file).then(buf => {
                var stationData = new Micaps.StationData()
                var gridData = new Micaps.GridData()
                if (gridData.loadByteArray(buf)) {
                    console.log(gridData);
                } else if (stationData.loadByteArray(buf)) {
                    console.log(stationData);
                }
            })
        },
        //导出图片
        exportImage() {

        }
    }
})