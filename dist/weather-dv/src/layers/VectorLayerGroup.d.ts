 
import { Earth } from '@mesh-3d/earth/index';
import {
    HighlightPolygonLayer, SealandVec2dLayer,
    HighlightMarkerLayer, LabelVec2dLayer, CountryVec2dLayer
} from '@mesh-3d/earth/Source/layers/vector/Vector2dLayer';

/**
 * 矢量图层组：国界、省界、市界、项目所在市的县界、行政区地名、自然地名、居民地地名
 */
export default class VectorLayerGroup {
    constructor(options?: {
        /**
         * @default 'dark'
         */
        theme?: 'dark' | 'light'
        /**
         * @default './Assets'
         */
        url?: string
    })

    show: boolean

    readonly sealandLayer: SealandVec2dLayer
    readonly provinceLayer: HighlightPolygonLayer
    readonly countyLayer: HighlightPolygonLayer
    readonly placeNameLayer: HighlightMarkerLayer
    readonly placeName2Layer: LabelVec2dLayer
    readonly placeName3Layer: LabelVec2dLayer
    readonly countryLayer: CountryVec2dLayer

    load(earth: Earth): Promise<this>
}