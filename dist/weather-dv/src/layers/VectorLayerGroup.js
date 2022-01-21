
import {
    HighlightPolygonLayer, SealandVec2dLayer,
    HighlightMarkerLayer, LabelVec2dLayer, CountryVec2dLayer
} from '@mesh-3d/earth/Source/layers/vector/Vector2dLayer';

/**
 * 矢量图层组：国界、省界、市界、项目所在市的县界、行政区地名、自然地名、居民地地名
 */
export default class VectorLayerGroup {
    constructor(options) {
        this._theme = options.theme || 'dark'
        this._geoDataServerUrl = options.url || './Assets' //`${location.protocol}//${location.hostname}:8668`
        this._show = true;
    }

    get show() {
        return this._show;
    }
    set show(val) {
        if (this._show != val) {
            var { sealandLayer,
                provinceLayer,
                countyLayer,
                placeNameLayer,
                placeName2Layer,
                placeName3Layer,
                countryLayer
            } = this;

            sealandLayer && (sealandLayer.show = val);
            provinceLayer && (provinceLayer.show = val);
            countyLayer && (countyLayer.show = val);
            placeNameLayer && (placeNameLayer.show = val);
            placeName2Layer && (placeName2Layer.show = val);
            placeName3Layer && (placeName3Layer.show = val);
            countryLayer && (countryLayer.show = val);
        }
    }

    load(earth) {
        var sealandLayer
        var provinceLayer
        var countyLayer
        var placeNameLayer
        var placeName2Layer
        var placeName3Layer
        var countryLayer

        sealandLayer = new SealandVec2dLayer({
            source: geoDataServerUrl + '/vectorData/geojson/sealand.geojson',
            theme: theme
        })

        var readyPromise = sealandLayer.provider.readyPromise.then(() => {
            provinceLayer = new HighlightPolygonLayer({
                source: geoDataServerUrl + '/vectorData/shp/边界数据2017版/BOUA省级行政区域.shp',
                focusAdminNames: ['52'],
                focusPropertyName: '省域代码',
                theme: theme
            })
            return provinceLayer.provider.readyPromise
        }).then(() => {
            countyLayer = new HighlightPolygonLayer({
                source: geoDataServerUrl + '/vectorData/shp/铜仁市/县界（铜仁）/县界（铜仁）.shp',
                focusAdminNames: ['520621'],
                focusPropertyName: 'PAC',
                theme: theme,
                minimumLevel: 6
            })
            return countyLayer.provider.readyPromise
        }).then(() => {
            placeNameLayer = new HighlightMarkerLayer({
                source: geoDataServerUrl + '/vectorData/geojson/placeName.geojson',
                focusAdminNames: ['贵州'],
                focusPropertyName: 'NAME',
                theme: theme
            })
            return placeNameLayer.provider.readyPromise
        }).then(() => {
            placeName2Layer = new LabelVec2dLayer({
                source: geoDataServerUrl + '/vectorData/shp/边界数据2017版/AGNP居民地地名.shp',
                minimumLevel: 12
            })
            return placeName2Layer.provider.readyPromise
        }).then(() => {
            placeName3Layer = new LabelVec2dLayer({
                source: geoDataServerUrl + '/vectorData/shp/边界数据2017版/AANP自然地名.shp',
                minimumLevel: 12
            })
            return placeName3Layer.provider.readyPromise
        }).then(() => {
            countryLayer = new CountryVec2dLayer({
                source: geoDataServerUrl + '/vectorData/shp/边界数据2017版/BOUL国界线.shp',
                theme: theme
            })
            return countryLayer.provider.readyPromise
        }).then(() => {
            earth.addLayer(sealandLayer)
            earth.addLayer(provinceLayer)
            earth.addLayer(countyLayer)
            earth.addLayer(placeNameLayer)
            earth.addLayer(placeName2Layer)
            earth.addLayer(placeName3Layer)
            earth.addLayer(countryLayer)

            sealandLayer.show=this.show
            provinceLayer.show=this.show
            countyLayer.show=this.show
            placeNameLayer.show=this.show
            placeName2Layer.show=this.show
            placeName3Layer.show=this.show
            countryLayer.show=this.show
        })

        Object.defineProperties(this, {
            sealandLayer: {
                get() {
                    return sealandLayer
                }
            },
            provinceLayer: {
                get() {
                    return provinceLayer
                }
            },
            countyLayer: {
                get() {
                    return countyLayer
                }
            },
            placeNameLayer: {
                get() {
                    return placeNameLayer
                }
            },
            placeName2Layer: {
                get() {
                    return placeName2Layer
                }
            },
            placeName3Layer: {
                get() {
                    return placeName3Layer
                }
            },
            countryLayer: {
                get() {
                    return countryLayer
                }
            }
        })

        return readyPromise;
    }
}