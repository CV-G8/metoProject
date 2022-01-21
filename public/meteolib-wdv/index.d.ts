
//utils
import HttpFileSystem from '../../Source/Util/HttpFileSystem/HttpFileSystem'
import FileSystem from '../../Source/Util/FileSystem/index'
import FileInfo from '../../Source/Util/HttpFileSystem/FileInfo'
import Interpolate from '../../Source/Util/Interpolate'
import d3Contour from '../../Source/Util/d3Contour'
import MeteoSign from '../../Source/Util/MeteoSign'
//data
import GridData from '../../Source/Data/Micaps/GridData'
import StationData from '../../Source/Data/Micaps/StationData'
import SwanRadar from '../../Source/Data/SWAN/SwanRadar'
import CoordinateHelper from '../../Source/Data/Radar/CoordinateHelper'
import MyLatLng from '../../Source/Data/Radar/MyLatLng'
import PupProductFormat from '../../Source/Data/PUP/PupProductFormat'
import RasterData from '../../Source/Data/RasterData/index'
import AwxRasterHeader from '../../Source/Data/Awx/AwxRasterHeader'
import RasterDataset from '../../Source/Data/RasterDataset/RasterDataset'

import AwxSateImageryProvider from "../../Source/Scene/AwxSateImageryProvider"
import RasterTileImageryProvider from '../../Source/Scene/RasterTileImageryProvider'
import GridDataImageryProvider from '../../Source/Scene/GridDataImageryProvider'
import RasterImageGenerator from '../../Source/Render/RasterImageGenerator'
import GridDataColorMap from '../../Source/Render/GridDataColorMap'

/**
 * 封装提取三维等直面的三种方法
 */
declare module IsoSurfaceMesher {
    /**
     * MarchingCubes:Extracts an isosurface from `potential` using surface nets with resolution given by `dims`.
     * @param dims A 3D vector of integers representing the resolution of the isosurface
     * @param potential A scalar valued potential function taking 3 coordinates as arguments returning a scalar.
     * @param bounds A pair of 3D vectors `[lo, hi]` giving bounds on the potential to sample.  If not specified, default is `[[0,0,0], dims]`.
     */
    export function MC(dims: number[][], potential: (x: number, y: number, z: number) => number, bounds: number[][]): {
        /**
          * The coordinates of the vertices of the mesh
          */
        positions: number[][];
        /**
         * The faces of the mesh.
         */
        cells: any[][];
    }
    /**
     * SurfaceNets:Extracts an isosurface from `potential` using surface nets with resolution given by `dims`.
     * @param dims A 3D vector of integers representing the resolution of the isosurface
     * @param potential A scalar valued potential function taking 3 coordinates as arguments returning a scalar.
     * @param bounds A pair of 3D vectors `[lo, hi]` giving bounds on the potential to sample.  If not specified, default is `[[0,0,0], dims]`.
     */
    export function SN(dims: any, potential: any, bounds: any): {
        /**
           * The coordinates of the vertices of the mesh
           */
        positions: number[][];
        /**
         * The faces of the mesh.
         */
        cells: any[][];
    }
    /**
     * MarchingTetrahedra:Extracts an isosurface from `potential` using surface nets with resolution given by `dims`.
     * @param dims A 3D vector of integers representing the resolution of the isosurface
     * @param potential A scalar valued potential function taking 3 coordinates as arguments returning a scalar.
     * @param bounds A pair of 3D vectors `[lo, hi]` giving bounds on the potential to sample.  If not specified, default is `[[0,0,0], dims]`.
     */
    export function MT(dims: any, potential: any, bounds: any): {
        /**
         * The coordinates of the vertices of the mesh
         */
        positions: number[][];
        /**
         * The faces of the mesh.
         */
        cells: any[][];
    }


}

export {
    FileSystem,
    HttpFileSystem,
    FileInfo,
    Interpolate,
    GridData,
    StationData,
    d3Contour,
    SwanRadar,
    CoordinateHelper,
    MyLatLng,
    PupProductFormat,
    RasterData,
    AwxRasterHeader,
    AwxSateImageryProvider,
    RasterImageGenerator,
    RasterTileImageryProvider,
    GridDataImageryProvider,
    GridDataColorMap,
    RasterDataset,
    MeteoSign,
    IsoSurfaceMesher
}

declare module MeteoLib {

    export {
        FileSystem,
        HttpFileSystem,
        FileInfo,
        Interpolate,
        GridData,
        StationData,
        d3Contour,
        SwanRadar,
        CoordinateHelper,
        MyLatLng,
        PupProductFormat,
        RasterData,
        AwxRasterHeader,
        AwxSateImageryProvider,
        RasterImageGenerator,
        RasterTileImageryProvider,
        GridDataImageryProvider,
        GridDataColorMap,
        MeteoSign,
        IsoSurfaceMesher
    }
}
export as namespace MeteoLib;
export = MeteoLib