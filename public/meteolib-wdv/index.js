
var MeteoLib = {
    version: 'wdv1.0.0'
}
require('../../Source/Util/ExtendMethod')
//utils
MeteoLib.HttpFileSystem = require('../../Source/Util/HttpFileSystem/HttpFileSystem');
MeteoLib.FileSystem = require('../../Source/Util/FileSystem');
MeteoLib.FileInfo = require('../../Source/Util/HttpFileSystem/FileInfo');
MeteoLib.Interpolate = require('../../Source/Util/Interpolate')
MeteoLib.d3Contour = require('../../Source/Util/d3Contour')
MeteoLib.MeteoSign = require('../../Source/Util/MeteoSign')
//data
MeteoLib.GridData = require('../../Source/Data/Micaps/GridData');
MeteoLib.StationData = require('../../Source/Data/Micaps/StationData');
MeteoLib.SwanRadar = require('../../Source/Data/SWAN/SwanRadar');
MeteoLib.CoordinateHelper = require('../../Source/Data/Radar/CoordinateHelper');
MeteoLib.MyLatLng = require('../../Source/Data/Radar/MyLatLng');
MeteoLib.PupProductFormat = require('../../Source/Data/PUP/PupProductFormat')
MeteoLib.RasterData = require('../../Source/Data/RasterData')
MeteoLib.RasterDataset = require('../../Source/Data/RasterDataset/RasterDataset')
MeteoLib.AwxRasterHeader = require('../../Source/Data/Awx/AwxRasterHeader')
MeteoLib.GridDataColorMap = require('../../Source/Render/GridDataColorMap')

var IsoSurface = require('isosurface')
var MarchingCubes = IsoSurface.marchingCubes;
var SurfaceNets = IsoSurface.surfaceNets;
var MarchingTetrahedra = IsoSurface.marchingTetrahedra;
MeteoLib.IsoSurfaceMesher = {
    MC: MarchingCubes,
    SN: SurfaceNets,
    MT: MarchingTetrahedra
}

//scene & render
if (typeof Cesium != 'undefined') {
    MeteoLib.AwxSateImageryProvider = require("../../Source/Scene/AwxSateImageryProvider")
    MeteoLib.RasterTileImageryProvider = require('../../Source/Scene/RasterTileImageryProvider')
    MeteoLib.GridDataImageryProvider = require('../../Source/Scene/GridDataImageryProvider')
    MeteoLib.RasterImageGenerator = require('../../Source/Render/RasterImageGenerator')
}

module.exports = MeteoLib