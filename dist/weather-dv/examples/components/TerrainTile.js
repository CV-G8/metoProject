
export default class TerrainTile {
    /**
     * 
     * @param {{
     *  width: number;
     *  height: number;
     *  data: Float32Array;
     *  bbox:number[]
     * }} terrainData 
     */
    constructor(terrainData) {
        this.tileWidth = terrainData.width;
        this.tileHeight = terrainData.height;
        this.heights = terrainData.data;
        this.bbox = terrainData.bbox;
        this.terrainMesh = this.createMesh()
        this.boundingSphere = this.terrainMesh.geometry.boundingSphere
    }

    createGeometry() {
        var { tileHeight, tileWidth, heights } = this
        var geometry = new THREE.BufferGeometry()

        var positions = new Float32Array(tileHeight * tileWidth * 3);
        var uvs = new Float32Array(tileHeight * tileWidth * 2);

        let ptr1 = 0, ptr2 = 0, ptr3 = 0;
        var deltLon = (this.bbox[2] - this.bbox[0]) / tileWidth
        var deltLat = (this.bbox[1] - this.bbox[3]) / tileHeight

        for (let i = 0; i < tileHeight; i++) {
            var u = i / (tileHeight - 1);
            var lat = i * deltLat + this.bbox[3]
            for (let j = 0; j < tileWidth; j++) {
                var v = j / (tileWidth - 1);
                var lon = j * deltLon + this.bbox[0]
                var alt = heights[ptr2++];
                 
                var cart3 = Cesium.Cartesian3.fromDegrees(lon, lat, alt)
                positions[ptr1++] = cart3.x
                positions[ptr1++] = cart3.z
                positions[ptr1++] = cart3.y

                uvs[ptr3++] = u;
                uvs[ptr3++] = v
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3,false))
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2,false))

        var indices = [];
        for (let i = 1; i < tileHeight; i++) {
            for (let j = 1; j < tileWidth; j++) {
                var i0 = (i - 1) * tileWidth + j - 1;
                var i1 = i * tileWidth + j - 1;
                var i2 = i * tileWidth + j;
                var i3 = (i - 1) * tileWidth + j;
                indices.push(
                    i0, i1, i2,
                    i0, i2, i3
                );
            }
        }

        geometry.setIndex(indices);
        geometry.computeBoundingSphere()

        return geometry
    }

    createMesh() {
        var geometry = this.createGeometry();
        var material = new THREE.MeshBasicMaterial({
            wireframe: true,
            side: THREE.DoubleSide
        })
        var mesh = new THREE.Mesh(geometry, material)
        return mesh
    }

    render(frameState, renderList) {
        renderList.push(this.terrainMesh)
    }

    onRemove(visualizer) {
        visualizer.remove(this.terrainMesh)
    }
}