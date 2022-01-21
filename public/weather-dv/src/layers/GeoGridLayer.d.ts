import ImageTileLayer from '@mesh-3d/earth/Source/layers/imagery/ImageTileLayer';
 
/**
 * @example
 * 
var mapContainer = document.getElementsByClassName('map-container')[0]

var gridLayer = new GeoGridLayer({
    zIndex: 1
})

earth = new Earth({
    container: mapContainer,
    creditContainer: document.createElement('div'),
    timeline: true,
    animation: true,
    infoBox: false,
    baseLayerPicker: false,
    imageryProvider: gridLayer.provider,
    contextOptions: {
        webgl: {
            alpha: true
        }
    }
})

earth.scene.skyAtmosphere.show = false
earth.scene.fog.enabled = false
earth.scene.skyBox.show = false
earth.scene.globe.baseColor = Cesium.Color.TRANSPARENT
earth.scene.backgroundColor = Cesium.Color.TRANSPARENT
earth.scene.sun.show = false
earth.scene.sunBloom = false
earth.scene.globe.showGroundAtmosphere = false

earth.addLayer(gridLayer)

viewer = earth.viewer; 
earth.addLayer(new TiandituImgLayer({
    maximumLevel:18
}))
 */
export default class GeoGridLayer extends ImageTileLayer {
    /**
     * 
     * @param options 
     * @example
     * 
var mapContainer = document.getElementsByClassName('map-container')[0]

var gridLayer = new GeoGridLayer({
    zIndex: 1
})

earth = new Earth({
    container: mapContainer,
    creditContainer: document.createElement('div'),
    timeline: true,
    animation: true,
    infoBox: false,
    baseLayerPicker: false,
    imageryProvider: gridLayer.provider,
    contextOptions: {
        webgl: {
            alpha: true
        }
    }
})

earth.scene.skyAtmosphere.show = false
earth.scene.fog.enabled = false
earth.scene.skyBox.show = false
earth.scene.globe.baseColor = Cesium.Color.TRANSPARENT
earth.scene.backgroundColor = Cesium.Color.TRANSPARENT
earth.scene.sun.show = false
earth.scene.sunBloom = false
earth.scene.globe.showGroundAtmosphere = false

earth.addLayer(gridLayer)

viewer = earth.viewer; 
earth.addLayer(new TiandituImgLayer({
    maximumLevel:18
}))
     */
    constructor(options?: {
        gridImage?: string | HTMLImageElement | HTMLCanvasElement
        bgColor?: string
        lightColor?: string
        darkColor?: string
        minimumLevel?: number
        maximumLevel?: number
    })
    readyPromise: Promise<this>
    provider: Cesium.GridImageryProvider
}