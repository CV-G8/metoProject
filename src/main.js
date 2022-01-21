import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './assets/iconfont/iconfont.css'
import '../public/Cesium/Widgets/widgets.css'

// Vue.prototype.Cesium = Cesium
// Vue.use(Cesium)

window.Cesium=Cesium;
 
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

// 引入要素json文件
// import element from '../public/json/element.json'
// window.ElementChoose = element

// import element from '../public/js/element.js'
// window.ElementChoose = element
// console.log(element)

// import * as MeteoLib from '@mesh-3d/meteolib-wdv'
// window.MeteoLib = MeteoLib


// import * as WeatherDV from '@mesh-3d/weather-dv'
import * as WeatherDV from '@mesh-3d/weather-dv/src/index'
import * as THREE from '@mesh-3d/three'
window.THREE=THREE


const {
  HfsFileLoader,IHfsFileLayer, SateCloudLayer,
  MicapsECLayer, PUPRadarLayer, SwanRadarLayer,
  Earth, HighlightPolygonLayer ,getLine,MicapsUpAirLayer,
  SurfLayer,Vector2dLayer,Label3dLayer,AgnpLabel3dLayer
} = WeatherDV; 
window.WeatherDV=WeatherDV
window.HfsFileLoader=HfsFileLoader;
window.IHfsFileLayer=IHfsFileLayer;
window.SateCloudLayer=SateCloudLayer;
window.MicapsECLayer=MicapsECLayer;
window.PUPRadarLayer=PUPRadarLayer;
window.SwanRadarLayer=SwanRadarLayer;
window.MicapsUpAirLayer=MicapsUpAirLayer;
window.SurfLayer=SurfLayer;
window.Label3dLayer=Label3dLayer;
window.AgnpLabel3dLayer=AgnpLabel3dLayer;
window.Vector2dLayer=Vector2dLayer;
window.Earth=Earth;
window.HighlightPolygonLayer=HighlightPolygonLayer;
window.lineSample=WeatherDV.terrainSampler.lineSample;
window.getLine=getLine;
 
var hfsLoader = new HfsFileLoader({
  baseUrl: ElementChoose.internet.Url,
  // baseUrl: 'http://39.107.107.142:18880/hfs',
  // baseUrl: 'http://192.168.0.110:8081/hfs',
  auth: {
      uid: 'admin',
      pwd: 'Adnin@123456'
  }
})
window.hfsLoader = hfsLoader




Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
