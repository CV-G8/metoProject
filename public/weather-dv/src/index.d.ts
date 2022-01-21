import HfsFileLoader from "./HfsFileLoader";
import * as rasterSampler from './rasterSampler'
import * as terrainSampler from './terrainSampler'
import splitLine from "./splitLine";
import IHfsFileLayer from "./layers/IHfsFileLayer";
import MicapsECLayer from "./layers/MicapsECLayer";
import PUPRadarLayer from "./layers/PUPRadarLayer";
import SateCloudLayer from "./layers/SateCloudLayer";
import SwanRadarLayer from "./layers/SwanRadarLayer";
import MicapsUpAirLayer from "./layers/MicapsUpAirLayer";
import SurfLayer from './layers/SurfLayer'
import VectorLayerGroup from './layers/VectorLayerGroup'
import GeoGridLayer from './layers/GeoGridLayer'

import {
    Earth, LocalSkyBox, LocalSkyBoxAnimation,
    ILayer, ImageTileLayer, TiandituLayer, TiandituImgLayer, TiandituTerLayer, TiandituVecLayer,
    Vector2dLayer, HighlightPolygonLayer, SealandVec2dLayer,
    HighlightMarkerLayer, LabelVec2dLayer, CountryVec2dLayer,
    // Vector2RasterLayer
    Vector3dLayer,
    C3DTilesLayer, OsgbLayer,
    GeoMesh, GeoPolygonMesh, GeoPolylineMesh, GeoWaterMesh,
    GeoPolylineGeometry, GeoPolygonGeometry,
    ExtrudedPolygonGeometry, SolidWireframeGeometry, VectorPolygonGeometry,
    SolidWireframeMaterial,
    interactive, getPoint, getLine, getPolyline, getRactangle, pickPosition
} from '@mesh-3d/earth/index'

import {
    MeshVisualizer, CameraUtils, GeometryUtils, RendererUtils
} from '@mesh-3d/core/index'

declare module WeatherDV {
    export {
        HfsFileLoader,
        rasterSampler,
        terrainSampler,
        splitLine,
        IHfsFileLayer,
        MicapsECLayer,
        PUPRadarLayer,
        SateCloudLayer,
        SwanRadarLayer,
        MicapsUpAirLayer,
        VectorLayerGroup,
        SurfLayer,
        GeoGridLayer,

        //core

        MeshVisualizer, CameraUtils, GeometryUtils, RendererUtils,

        //earth

        Earth, LocalSkyBox, LocalSkyBoxAnimation,
        ILayer, ImageTileLayer, TiandituLayer, TiandituImgLayer, TiandituTerLayer, TiandituVecLayer,
        Vector2dLayer, HighlightPolygonLayer, SealandVec2dLayer,
        HighlightMarkerLayer, LabelVec2dLayer, CountryVec2dLayer,
        // Vector2RasterLayer
        Vector3dLayer,
        C3DTilesLayer, OsgbLayer,
        GeoMesh, GeoPolygonMesh, GeoPolylineMesh, GeoWaterMesh,
        GeoPolylineGeometry, GeoPolygonGeometry,
        ExtrudedPolygonGeometry, SolidWireframeGeometry, VectorPolygonGeometry,
        SolidWireframeMaterial,
        interactive, getPoint, getLine, getPolyline, getRactangle, pickPosition
    }
}

export as namespace WeatherDV;
export = WeatherDV