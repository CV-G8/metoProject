// module.exports =  { 
window.ElementChoose = {
    // 数据资源来源地址
    "internet": {
        "name": "测试地址更换",
        "Url": "http://192.168.0.110:8081/hfs"
        // "Url": "http://172.20.10.2:8081/hfs"
    },
    // 控制点击时间轴时更改所有图层当前时间为所点击时间或者仅控制当前图层时间变更
    updateTimeLine: {
        // 可选 single || both 
        type: 'both'
    },
    // 实况监测
    "detectionLive": {
        "sateLayer": {
            "NAME": "卫星云图",
            "channel": "C002"
        },
        "surfLayer": {
            "NAME": "地面监测",
            "channel": "C002",
            "isShowArr": [
                {
                    "value": true,
                    "type": "showIsoLine",
                    "name": "等值线"
                },
                {
                    "value": false,
                    "type": "fill",
                    "name": "色斑图"
                },
                {
                    "value": true,
                    "type": "showPoint",
                    "name": "散点"
                },
                {
                    "value": false,
                    "type": "showText",
                    "name": "站名"
                },
                {
                    "value": true,
                    "type": "showValue",
                    "name": "要数值"
                }
            ]
        },
        "swanRadarLayer": {
            "NAME": "雷达拼图",
            level: 1
        },
        "pupRadarLayer": {
            "NAME": "单站雷达",
            // 单站雷达站名绑定值
            stationValue: '贵阳',
            // 单站雷达站名可选值
            "stationName": [
                {
                    name: '贵阳'
                },
            ],
            // 单站雷达产品代码绑定值
            value: 'CR/38',
            // 单站雷达产品代码可选值
            "prodCode": [
                {
                    value: 'CR/38',
                    name: '组合反射率'
                },
                {
                    value: 'ET/41',
                    name: '回波顶高'
                },
                {
                    value: 'ET/41',
                    name: '液态含水量'
                },
            ]
        },
        "micapsUpAirLayer": {
            "NAME": "高空监测",
            "symbolSize": 80,
            "windSymbolType": "windShaft",
            "windSymbolSize": 32
        }
    },
    // 数值模式
    "numbericalModel": {
        "Layer": {
            "NAME": "数值模式",
            "selectValue": "TMP",
            "element": [
                {
                    "text": "温度",
                    "value": "TMP"
                },
                {
                    "text": "高度",
                    "value": "HGT"
                }
            ],
            "leveValue": 10,
            "level": [
                {
                    "text": "200hpa",
                    "value": "200"
                },
                {
                    "text": "500hpa",
                    "value": "500"
                },
                {
                    "text": "700hpa",
                    "value": "700"
                },
                {
                    "text": "850hpa",
                    "value": "850"
                }
            ],
            "isShow": [
                {
                    "value": true,
                    "text": "等值线",
                    "type": "showIsoLine"
                },
                {
                    "value": true,
                    "text": "色斑图",
                    "type": "fill"
                }
            ]
        }
    }
}

