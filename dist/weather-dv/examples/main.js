import * as WeatherDV from '../src/index.js'

// import {
//     HfsFileLoader, SateCloudLayer,
//     MicapsECLayer, PUPRadarLayer, SwanRadarLayer,MicapsUpAirLayer,SurfLayer,
//     Earth, HighlightPolygonLayer,getLine,splitLine
// } from '../src/index.js'

const {
    HfsFileLoader, SateCloudLayer,
    MicapsECLayer, PUPRadarLayer, SwanRadarLayer, MicapsUpAirLayer, SurfLayer,
    Earth, HighlightPolygonLayer, getLine, splitLine, GeoGridLayer, Vector2dLayer, TiandituImgLayer
} = WeatherDV;

const { RasterImageGenerator } = MeteoLib;
RasterImageGenerator.registerAll('../assets/pal/')

var viewer, earth;

var hfsLoader = new HfsFileLoader({
    baseUrl: 'http://192.168.0.18:8081/hfs',
    // baseUrl: 'http://39.107.107.142:18880/hfs',
    auth: {
        uid: 'admin',
        pwd: 'Adnin@123456'
    }
})

var mapContainer = document.getElementsByClassName('map-container')[0]

earth = new Earth({
    container: mapContainer,
    creditContainer: document.createElement('div'),
    timeline: true,
    animation: true,
    infoBox: false,
    contextOptions: {
        webgl: {
            alpha: true
        }
    }
})

viewer = earth.viewer;
earth.addLayer(new TiandituImgLayer({
    maximumLevel: 18
}))
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

// var ecLayer = new MicapsECLayer(hfsLoader)
// ecLayer.load(earth).then(() => {
//     ecLayer.currentTime = ecLayer.latestTime;
// })

var sateLayer = new SateCloudLayer(hfsLoader)
sateLayer.channel='C002'
sateLayer.load(earth).then(() => {
    sateLayer.currentTime = sateLayer.latestTime;
})

var pupRadarLayer = new PUPRadarLayer(hfsLoader)
pupRadarLayer.load(earth).then(() => {
    pupRadarLayer.currentTime = pupRadarLayer.latestTime;
})

var swanRadarLayer = new SwanRadarLayer(hfsLoader)
swanRadarLayer.load(earth).then(() => {
    swanRadarLayer.currentTime = swanRadarLayer.latestTime;
})

var micapsUpAirLayer = new MicapsUpAirLayer(hfsLoader)
micapsUpAirLayer.load(earth).then(() => {
    micapsUpAirLayer.currentTime = micapsUpAirLayer.latestTime;
})

var surfLayer = new SurfLayer(new HfsFileLoader({
    baseUrl: 'http://192.168.0.8:18099/hfs',
    auth: {
        uid: 'admin',
        pwd: 'Adnin@123456'
    }
}))
surfLayer.load(earth).then(() => {
    surfLayer.currentTime = surfLayer.latestTime;
})
