import ImageTileLayer from '@mesh-3d/earth/Source/layers/imagery/ImageTileLayer';

function createSymbolImage(options) {
    options = options || {};

    var cv = document.createElement('canvas')
    cv.width = 64;
    cv.height = 64;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = options.bgColor || "#00061a"//"#394252"
    ctx.fillRect(0, 0, cv.width, cv.height)

    ctx.fillStyle = options.lightColor || '#5076b1'

    var size = 1
    ctx.fillRect(0, 0, size, size)
    ctx.fillRect(63, 0, size, size)
    ctx.fillRect(0, 63, size, size)
    ctx.fillRect(63, 63, size, size)

    var xSize = 16, ySize = 16;
    var dx = cv.width / (xSize + 1)
    var dy = cv.height / (ySize + 1)
    var y = dy, x = dx;
    for (let i = 0; i < ySize; i++) {
        ctx.fillRect(x, 0, size, size)
        ctx.fillRect(x, cv.height, size, size)
        x += dx
    }
    for (let i = 0; i < xSize; i++) {
        ctx.fillRect(0, y, size, size)
        ctx.fillRect(cv.width, y, size, size)
        y += dy
    }

    ctx.fillStyle = options.darkColor || '#435a7c'

    y = 0, x = 0;
    var off = 4, size = 1
    for (let i = 0; i < ySize; i++) {
        x = 0;
        for (let j = 0; j < xSize; j++) {
            ctx.fillRect(x + off, y + off, size, size)
            x += dx;
        }
        y += dy;
    }
    return cv;
}

function createGridImage(options) {
    var symbol = createSymbolImage(options)

    var cv = document.createElement('canvas')
    cv.width = 256;
    cv.height = 256;
    var ctx = cv.getContext('2d');
    var y = 0
    for (let i = 0; i <= 4; i++) {
        var x = 0;
        for (let j = 0; j <= 4; j++) {
            ctx.drawImage(symbol, x, y)
            x += 64;
        }
        y += 64
    }

    return cv;
}

export default class GeoGridLayer extends ImageTileLayer {
    constructor(options) {
        options = options || {}

        super(options)

        var gridImg = options.gridImage || createGridImage({
            bgColor: options.bgColor,
            lightColor: options.lightColor,
            darkColor: options.darkColor
        })
        var ready = false;
        var deferred = {}
        this.readyPromise = new Promise((resolve, reject) => {
            deferred.resolve = resolve;
            deferred.reject = reject;
        })
        
        Object.defineProperties(this, {
            ready: {
                get() {
                    return ready
                }
            }
        })

        if (typeof gridImg != 'string') {
            ready = true;
            deferred.resolve(this)
        }

        var provider = new Cesium.GridImageryProvider({
            minimumLevel: options.minimumLevel,
            maximumLevel: options.maximumLevel
        })

        provider.requestImage = function (x, y, level, request) {
            if (ready) return gridImg;
            return Cesium.Resource.fetchImage(gridImg).then((img) => {
                gridImg = img
                ready = true
                deferred.resolve(this)
                return img
            }).otherwise(deferred.reject)

        }

        this.provider = provider
    }

}