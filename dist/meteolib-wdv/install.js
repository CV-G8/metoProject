
const path = require('path');
const fs = require('fs');

var projRoot = path.resolve('.')
var cesiumPaths = [
    path.join(projRoot, 'node_modules/cesium'),
    path.join(projRoot, 'node_modules/@mesh-3d/cesium')
];
var workerPaths = ['Build/Cesium/Workers', 'Build/CesiumUnminified/Workers'];

if (projRoot == require.main.path) {
    projRoot = path.resolve('../../../')
}

var srcWorkerDir = path.join(require.main.path, 'Workers')
var workerFiles = fs.readdirSync(srcWorkerDir)
for (let file of workerFiles) {
    for (const cesiumPath of cesiumPaths) {
        for (const destDir of workerPaths) {
            var destWorkerDir = path.join(cesiumPath, destDir);
            if (!fs.existsSync(destWorkerDir)) {
                continue;
            }
            var srcFile = path.join(srcWorkerDir, file),
                destFile = path.join(destWorkerDir, file);
            // console.log('copy ', srcFile, '=>', destFile);
            fs.copyFileSync(srcFile, destFile)
        }
    }
}
console.log('@mesh-3d/meteolib installed.');