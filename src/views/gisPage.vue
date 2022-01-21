<template>
  <div
    style="
      position: relative;
      height: 100%;
      overflow: hidden;
      background-color: #001323;">
      <!-- 地球 -->
    <div id="gisContainer" style="height: calc(100% - 25vh)"></div>
    <!-- billboard -->
    <div class="headerBanner">
      <p class="header-text">铜仁市梵净山保护区梯度气象监测系统</p>
    </div>
    <div class="billboardBox">
      <div
        class="billboard"
        v-for="(item, index) in billboard"
        :key="index"
        :class="{ selectBillboard: index === num }"
        @click="showAsideLeft(index)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 梯度监测面板 -->
    <div class="detectionLive-card">
      <div class="detectionLive-card-header">
        <div style="display: flex; align-items: center">
          <p>梯度监测</p>
        </div>
        <i
          class="iconfont icon-arrow expand"
          style="
            transition: all 0.3s ease-in-out;
            cursor: pointer;
            color: #18eaf3;
          "
          @click="selectAnimation()"
        ></i>
      </div>
      <div class="detectionLive-card-body">
        <span>要素选择</span>
        <div style="display: flex; align-items: center">
          <select
            @change="surfLayer.element = element;drawColorMap();"
            v-model="element"
            style="
              width: 163px;
              height: 34px;
              background-color: #286989;
              color: #fff;
              border: none;
              text-indent: 1em;
            "
          >
            <option value="PRE_1h">1小时降雨量</option>
            <option value="PRE_3h">3小时最大降雨量</option>
            <option value="PRE_6h">6小时最大降雨量</option>
            <option value="PRE_24h">24小时最大降雨量</option>
            <option value="TEM">温度</option>
            <option value="RHU">相对湿度</option>
          </select>
        </div>
      </div>
      <!-- 属性显示隐藏 -->
      <div
        class="detectionLive-card-body"
        v-for="(item, index) in detectionLiveELE.surfLayer.isShowArr"
        :key="item.name + index"
      >
        <span>{{ item.name }}</span>
        <div style="display: flex; flex: 1; align-items: center">
          <label style="margin-right: 20px">
            <input
              v-model="item.value"
              type="radio"
              :name="item.name"
              :value="true"
              @change="surfLayer[item.type] = item.value"
            />是</label
          >
          <label>
            <input
              v-model="item.value"
              type="radio"
              :name="item.name"
              :value="false"
              @change="surfLayer[item.type] = item.value"
            />否</label
          >
        </div>
      </div>
    </div>
    <!-- 指南针 -->
    <div
      class="compass"
      :style="{
        transform: 'rotate(-' + heading + 'rad)',
        '-webkit-transform': 'rotate(-' + heading + 'rad)',
        '-moz-transform': 'rotate(-' + heading + 'rad)',
      }"
    >
      <p style="padding-bottom: 20px; color: #fff">N</p>
      <svg
        t="1634176780501"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="6575"
        width="100"
        height="99"
      >
        <path
          d="M512 5.171717l0.010343 462.713536H512a46.545455 46.545455 0 0 0-46.545455 46.545454H418.909091L512 5.171717z"
          fill="#FFA930"
          p-id="6576"
        ></path>
        <path
          d="M605.090909 514.430707l-93.090909 509.269333V560.976162a46.545455 46.545455 0 0 0 46.545455-46.545455h46.545454z"
          fill="#C4C1BC"
          p-id="6577"
        ></path>
        <path
          d="M512 5.171717l93.090909 509.25899H558.545455a46.545455 46.545455 0 0 0-46.545455-46.545454V5.171717z"
          fill="#DE8200"
          p-id="6578"
        ></path>
        <path
          d="M465.454545 514.430707a46.545455 46.545455 0 0 0 46.535112 46.545455L512 1023.70004l-93.090909-509.269333H465.454545z"
          fill="#D8D8D8"
          p-id="6579"
        ></path>
      </svg>
    </div>
    <!-- echarts页面 -->
    <div style="position:relative;width:100%;height:25vh">
      <div class="aside-right-footer" v-if="timeLineIsShow">
      <div class="timeRange" @click.self="timeChooseShow = !timeChooseShow">
        时间范围
        <div class="timeChoose" v-show="timeChooseShow">
          <div
            style="
              text-align: left;
              display: flex;
              justify-content: space-between;
            "
          >
            选择时间范围
            <i
              class="iconfont icon-guanbi1"
              style="padding-right: 10px; cursor: pointer"
              @click="timeChooseShow = false"
            ></i>
          </div>
          <el-date-picker
            prefix-icon="el-icon-date"
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="getTimeRange(value1)"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="timeLine">
        <div style="position:absolute;color:#fff;z-index:30;top:-32px;width:180px;height:32px;line-height:32px;text-align:center;background:rgb(41, 128, 185)">日期：{{yearDate}}</div>
        <div class="timeBackMask">
          <div class="timeBack">
            <div
              class="text"
              @click="
                value2 = index;
                updateTime(value2);
              "
              :style="{
                backgroundColor:
                  index >= insert && index < colorShowIndex + insert
                    ? '#2980b9'
                    : '',
              }"
              v-for="(item, index) in timeLineData"
              :key="index"
              style="cursor: pointer"
            >
              <p>{{ item }}</p>
              <p class="line"></p>
            </div>
            <!-- 进度条 -->
            <el-slider
              v-model="value2"
              @change="updateTime(value2)"
              :max="maxProcessNum"
              :show-tooltip="false"
            ></el-slider>
          </div>
        </div>
      </div>
      </div>
      <div style="position:absolute;top:-5px;z-index:11;color:#B9C3D2;left:60px">高度/m</div>
      <div class="layer-panel-echarts">
      <div id="echarts" style="width: 100%; height: 100%"></div>
      </div>
    </div>
    <!-- 地形剖切 -->
    <GisPro v-if="gisLayerShow" ref="GisPro"></GisPro>
  </div>
</template>

<script>
import * as echarts from "echarts";
import GisPro from "../components/gispro.vue";
import { 
  Label3dLayer,TiandituLayer,
  SurfLayer,Vector2dLayer,HighlightPolygonLayer
 } from '@mesh-3d/weather-dv/src/index'

export default {
  components: {
    GisPro,
  },
  data() {
    return {
      gisLayerShow:false,
      isShowArr: [
        {
          value: true,
          type: "showIsoLine",
          name: "柱状图",
        },
        {
          value: true,
          type: "fill",
          name: "散点图",
        },
        {
          value: true,
          type: "showPoint",
          name: "粒子动画",
        },
        {
          value: false,
          type: "showText",
          name: "三维地表",
        },
      ],
      yearDate:'',
      earth: undefined,
      timeLineIsShow: true,
      heading: 0,
      timeChooseShow: false,
      value1: 0,
      timeLineData: [],
      maxProcessNum: 100,
      value2: 0,
      colorShowIndex: 0,
      // 梯度监测
      graMonitoring: {
        name: "梯度监测",
        show: true,
        select: [
          {
            name: "温度",
            value: "tem",
          },
          {
            name: "高度",
            value: "height",
          },
        ],
        showStyle: "",
        showAnimation: "",
        map3D: true,
      },

      //   地面检测
      surfLayer: undefined,
      insert: 0,
      //
      billboard: [
        {
          name: "梯度监测",
          icon: "iconfont icon-zhandianxinxi",
        },
        {
          name: "实况监测",
          icon: "iconfont icon-shikuangjiance",
        },
        {
          name: "数值模式",
          icon: "iconfont icon-shuzhimoshi",
        },
        {
          name: "监测告警",
          icon: "iconfont icon-jiancegaojing",
        },
      ],
      billboardSelect: true,
      num: "",

      canvas:undefined,
      ctx:undefined,

      // echarts
      myChart: undefined,
      option: undefined,
      // 梯度监测
      element:'TEM',
      detectionLiveELE:'',
    };
  },
  created(){
    this.detectionLiveELE = ElementChoose.detectionLive
  },
  mounted() {
    // 注册地球
    var mapContainer = document.querySelector("#gisContainer");
    this.terrain=new Cesium.CesiumTerrainProvider({
        url:'./assets/terrain'
      })
    var earth=this.earth = new Earth({
      container: mapContainer,
      timeline: false,
      animation: false,
      infoBox: false,
      selectionIndicator: true,
      geocoder:false,
      terrainProvider:this.terrain,
      creditContainer:document.createElement('div')//去掉版权信息
    });

 earth.globe.showGroundAtmosphere=false
 earth.scene.fog.enabled=false
 earth.depthTestAgainstTerrain=true

var ttd = new TiandituLayer({
    imageLayer: 'img',
    maximumLevel: 18
})
earth.addLayer(ttd)


    earth.addLayer(new HighlightPolygonLayer({
      maximumLevel:12,
      source:'./assets/vectorData/shp/边界数据2017版/BOUA省级行政区域.shp'
    }))

    this.cityLayer=new Vector2dLayer({
      source:  './assets/vectorData/geojson/行政区域-铜仁市.geojson',
      zIndex: 1000,
      defaultStyle:{
          fill:false,
          outline:true,
          lineWidth:2,
          outlineColor:'#000',
      }
    }) 
    earth.addLayer(this.cityLayer)

    // 显示地名
    var label3dLayer3 = new Label3dLayer({
        url: './assets/vectorData/geojson/AGNP居民地地名.geojson',
        labelGraphics: {
            font: '14px',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            // outlineColor: Cesium.Color.fromBytes(10, 13, 44),
            outlineWidth: 2 * devicePixelRatio,
            fillColor: Cesium.Color.WHITE
        },
        styleFilter:function (feature) {
            const sGNID = feature.properties.GNID;
            /**
             * @type {import('./Source/layers/vector/Label3dLayer').Label3dLayerStyle}
             * @private
             */
            var style = {
                labelGraphics: Object.assign({
                    font: '9px',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineColor: Cesium.Color.fromBytes(160, 99, 57),
                    outlineWidth: 2 * devicePixelRatio,
                    fillColor: Cesium.Color.WHITE,
                    disableDepthTestDistance:Infinity
                }, this.labelGraphics || {})
            }
            if (!sGNID) {
                style.minimumLevel = 22
            }
            else if (sGNID.length > 6) {//村镇 
                style.minimumLevel = 22
            }
            else {
                var fGNID = parseInt(sGNID);

                if (fGNID % 10000 == 0) {//省级
                    if (feature.properties.CLASS == "AB") {
                        style.minimumLevel = 3
                        style.maximumLevel = 7
                        style.labelGraphics.font = '18px'
                    }
                    else if (fGNID == 0) {
                        style.minimumLevel = 22
                        style.maximumLevel = 22
                    }
                }
                else if (fGNID % 100 == 0) {//地市
                    style.minimumLevel = 7
                    style.maximumLevel = 9
                    style.labelGraphics.font = '14px'
                }
                else {//区县
                    style.minimumLevel = 9
                    style.maximumLevel = 16
                    style.labelGraphics.font = '12px'
                }
            }
            return style
        }
    })
    this.earth.addLayer(label3dLayer3)


    const { RasterImageGenerator } = MeteoLib;
    RasterImageGenerator.registerAll("./assets/pal/");

    // 绑定指南针
    this.earth.viewer.scene.preRender.addEventListener(() => {
      this.heading = this.earth.viewer.camera.heading;
    });
    // 地面检测
    this.monitoring();
    // 默认高亮显示第一个
    this.showAsideLeft(0);
    //
    this.myChart = echarts.init(document.getElementById("echarts"));
    this.drawEcharts();

    document.querySelector(".cesium-viewer-toolbar").style.top = "100px";

    // 添加色标canvas
    this.canvas = document.createElement('canvas')
    this.canvas.width = 100
    this.canvas.height = 0
    this.canvas.style.position = 'absolute'
    this.canvas.style.right = '100px'
    this.canvas.style.zIndex = 10
    this.canvas.style.bottom = 'calc(25vh + 60px)'
    // this.canvas.style.background = '#fff'
    this.ctx = this.canvas.getContext('2d')
    this.ctx.font='12px Verdana'
    this.ctx.strokeStyle= '#fff'

    document.querySelector('#gisContainer').appendChild(this.canvas)

    // 添加gis剖切
    let toolBar = document.querySelector('.cesium-viewer-toolbar')
    let search = document.querySelector('.cesium-toolbar-button')
    let gis = document.createElement('div')
    gis.setAttribute('class','gis')
    window.clickFun = ()=>{
      this.gisLayerShow = !this.gisLayerShow
    }
    gis.innerHTML = `
      <div class="gisTool" onclick="clickFun()">
        <i class="iconfont icon-shuzhimoshi"></i>
      </div>`
    toolBar.insertBefore(gis, search)

    let fullBotton = document.querySelector('.cesium-viewer-fullscreenContainer')
    fullBotton.style.zIndex = 20
    fullBotton.style.bottom = "23px"
    
  },
  methods: {
    sendCesium(){
      this.$refs.GisPro.getCesium(this.earth);
    },
    showAsideLeft(index) {
      this.num = index;
      if (index != 0) {
        this.$router.push({
          path: "/index",
          name: "index",
          params: {
            gisIndex: index,
          },
        });
      }
    },
    // 处理后台返回时间生成时间轴
    dealTimeLineDate(timeList) {
      let k = 21 - timeList.length;
      let timeArr = Object.assign([], timeList);

      if (timeList.length <= 15) {
        this.insert = 3;
      } else if (timeList.length <= 10) {
        this.insert = 6;
      } else if (timeList.length <= 5) {
        this.insert = 8;
      } else if (timeList.length <= 1) {
        this.insert = 10;
      } else {
        this.insert = 0;
      }

      // 构建前后数组前后时间段
      if (k != 21) {
        let num = this.insert;
        let dateBefore = timeArr[0];
        let HB = new Date(dateBefore).getHours();
        let dateAfter = timeArr[timeArr.length - 1];
        let HA = new Date(dateAfter).getHours();
        for (let i = 0; i < k; i++) {
          if (i < this.insert) {
            HB -= num;
            if (HB < 0) {
              HB = 24 + HB;
            }
            if (HB < 10) HB = "0" + HB;
            timeArr.unshift(`${HB}:00`);
          } else {
            HA = +HA + num;
            if (HA >= 24) {
              HA = 0;
            }
            if (HA < 10) HA = "0" + HA;
            timeArr.push(`${HA}:00`);
          }
        }
      } else {
        let time = 0;
        for (let i = 0; i < 21; i++) {
          time = +time + 1;
          if (time < 10) time = "0" + time;
          timeArr.push(`${time}:00`);
        }
      }

      this.timeLineData = [];
      timeArr.forEach((item, index) => {
        var Rtime;
        if (index >= this.insert && index < timeList.length + this.insert) {
          let date = new Date(item);
          let h = date.getHours();
          let m = date.getMinutes();
          if (h < 10) h = "0" + h;
          if (m < 10) m = "0" + m;
          Rtime = h + ":" + m;
          this.timeLineData.push(Rtime);
        } else {
          this.timeLineData.push(item);
        }
      });

      this.maxProcessNum = this.timeLineData.length;
    },
    showYear(){
      let date = new Date(this.surfLayer.currentTime)
      let y = date.getFullYear()
      let m = date.getMonth()+1
      let d = date.getDate()
      this.yearDate =  y +'-'+ m +'-' + d
    },
    updateTime(time) {
      this.surfLayer.currentTime = this.surfLayer.timeList[time - this.insert];
      this.showYear()
    },
    // 地面监测
    monitoring() {
      var surfLayer=this.surfLayer = new SurfLayer(hfsLoader);
      // surfLayer.clipperBBox=[
      //       108.52284055410892,
      //       27.642245321364133,
      //       108.85578708890267,
      //       28.106139815822313
      // ];

      surfLayer.imageryOptions.maximumLevel=13;
      surfLayer._labelGraphics.pixelOffset= { x: 0, y: 20 }
      surfLayer._labelGraphics.fillColor=Cesium.Color.WHITE
      surfLayer._labelGraphics.heightReference=Cesium.HeightReference.CLAMP_TO_GROUND
      surfLayer._pointGraphics.heightReference=Cesium.HeightReference.CLAMP_TO_GROUND
      surfLayer._disableDepthTestDistance=Infinity;

        this.surfLayer.clipperLayer = new Vector2dLayer({
          source:  './assets/vectorData/geojson/行政区域-铜仁市.geojson',
          defaultStyle:{
              fill:true,
              outline:false
          }
        })
        // this.clipperLayer;
      this.surfLayer.load(this.earth).then(() => {
        this.surfLayer.readyPromise.then(()=>{
          this.surfLayer.fill = false
          this.surfLayer.element = "TEM";
          this.drawColorMap()
        })
        this.surfLayer.currentTime = this.surfLayer.timeList[1];
        this.showYear()

        this.colorShowIndex = this.surfLayer.timeList.length;
        this.dealTimeLineDate(this.surfLayer.timeList);
      });
    },
    drawEcharts() {
      fetch("./assets/stations/ditu-zhan.json")
        .then((res) => {
          return res.json();
        })
        .then((res) => {

        const earth=this.earth;

        var stationPtLayer = new Label3dLayer({
            url: res.stations,
            labelField: 'Station_Name',
            minimumLevel: 10,
            pointGraphics: {
                pixelSize: 10,
                color: Cesium.Color.fromAlpha(Cesium.Color.YELLOWGREEN, 0.25),
                outlineColor: Cesium.Color.fromCssColorString('#18EAF3'),
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Infinity
            },
            labelGraphics: {
                font: '16px 500',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineColor: Cesium.Color.fromBytes(10, 13, 44),
                outlineWidth: 2 * devicePixelRatio,
                fillColor: Cesium.Color.WHITE,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                pixelOffset: { x: 0, y: -20 },
                disableDepthTestDistance: Infinity
            },
            styleFilter(f){
              if(f.properties.Station_Name=='梵净山'
              ||f.properties.Station_Name=='护国寺'
              ||f.properties.Station_Name=='实验场'
              ){
                var pixelSize=12;
                return {
                  pointGraphics: {
                      pixelSize: new Cesium.CallbackProperty(function(){
                        if(pixelSize>32){
                          pixelSize=12
                        }else{
                          pixelSize+=1/6;
                        }
                        return pixelSize;
                      },false),
                      color: Cesium.Color.fromAlpha(Cesium.Color.ORANGE, 0.45),
                      outlineColor: Cesium.Color.fromCssColorString('orange'),
                      outlineWidth: 2,
                      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                      disableDepthTestDistance: Infinity
                  },
                  labelGraphics: {
                      font: '20px 500',
                      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                      outlineColor: Cesium.Color.fromBytes(10, 13, 44),
                      outlineWidth: 2 * devicePixelRatio,
                      fillColor: Cesium.Color.WHITE,
                      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                      pixelOffset: { x: 0, y: -20 },
                      disableDepthTestDistance: Infinity
                  }
                }
              }
            }
        })

        earth.addLayer(stationPtLayer)
        earth.flyTo({
            rectangle: stationPtLayer.dataRectangle
        })
        earth.onHomeClick.addEventListener(e=>{
          e.cancel=true;
          earth.flyTo({
              rectangle: stationPtLayer.dataRectangle
          })
        })

          this.option = {
            textStyle: {
              color: "#B9C3D2", //'#B9C3D2'
            },
            grid: {
              left: "10px",
              right: "62px",
              top: "15px",
              bottom: "10px",
              containLabel: true,
            },
            xAxis: {
              name: "距离/m",
              type: "value",
              // boundaryGap:false,
              min: res.distances[0],
              max: res.distances[res.distances.length - 1],
              splitLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255, 255, 255, 0.15)",
                  width: 1,
                  type: "dotted",
                },
              },
            },
            yAxis: {
              type: "value",
              // name: "高度/m",
              splitLine: {
                show: true,
                lineStyle: {
                  color: "rgba(255, 255, 255, 0.15)",
                  width: 1,
                  type: "dotted",
                },
              },
              axisPointer:true
            },
            series: [
              {
                data: res.heights.map((h, i) => {
                  return [res.distances[i], h];
                }),
                type: "line",
                lineStyle: {
                  width: 0,
                },
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#18EAF3",
                      // 'rgba(128, 255, 165)'
                    },
                    {
                      offset: 1,
                      color: "rgba(95, 227, 252, 0.1)",
                      // 'rgba(1, 191, 236)'
                    },
                  ]),
                },
                showSymbol: false,
              },
              {
                data: res.keyheights.map((h, i) => {
                  return [res.keydistances[i], h];
                }),
                type: "line",
                lineStyle: {
                  color: "#18EAF3",
                  type: "dotted",
                },
                symbol: "circle",
                symbolSize: 10,
                itemStyle: {
                  normal: {
                    color: "#18EAF3",
                  },
                  emphasis:{
                    color: 'red',
                    borderColor: '#3aa7ff',
                  },
                },
                
                label: {
                  show: true,
                  position: "top",
                  color: "#fff",
                },
              },
            ],
          };
          this.myChart.setOption(this.option, true);
        });
      return;
    },
    // 绘制色斑图
    drawColorMap(){
      this.surfLayer.onChange = (colorMap)=>{
        this.ctx.clearRect(0,0,1000,1000)
        if(colorMap.length>=256){
          this.canvas.height = colorMap.length + 20
        }else{
          this.canvas.height = colorMap.length*10 + 10
        }
        
        for(let i=colorMap.length-1;i>=0;i--){
          if(colorMap.length>=256){
            this.ctx.fillStyle = 'rgba('+colorMap[i][2][0]+','+colorMap[i][2][1]+','+colorMap[i][2][2]+','+colorMap[i][2][3]+')'
            this.ctx.fillRect(2,colorMap.length-i-1+10,20,1)

            if(i==0 || i ==colorMap.length-1 || i%20==0){
              this.ctx.font='12px Verdana'
              this.ctx.strokeStyle= '#44D7B6'
              this.ctx.strokeText(colorMap[colorMap.length-i-1][3],27,i+15)
            }
          } else{
            this.ctx.fillStyle = 'rgba('+colorMap[i][2][0]+','+colorMap[i][2][1]+','+colorMap[i][2][2]+','+colorMap[i][2][3]+')'
            this.ctx.fillRect(2,10*(colorMap.length-i-1)+10,20,10)

            if(i==0 || i%3==0 || i==colorMap.length-1){
              this.ctx.font='12px Verdana'
              this.ctx.strokeStyle= '#44D7B6 '
              this.ctx.strokeText(colorMap[colorMap.length-1-i][3],27,i*10+20)
            }
          }
        }
      }
        
    },
  },
};
</script>

<style>
.timeChoose .el-date-editor {
  width: 220px !important;
  background: transparent;
  border: none;
  padding-left: 0 !important;
}
.timeChoose .el-range-input {
  background: none;
  color: rgba(255, 255, 255, 0.863) !important;
}
.timeChoose .el-range-separator {
  color: #fff !important;
  padding-right: 10px !important;
}
.aside-right-footer .timeBack .el-slider {
  position: absolute !important;
  width: 100%;
  bottom: 17px;
}
.aside-right-footer .timeBack .el-slider__runway {
  position: absolute !important;
  width: 100% !important;
  height: 2px !important;
}
.aside-right-footer .timeBack .el-slider__bar {
  height: 2px !important;
  background-color: #18eaf3 !important;
}
.aside-right-footer .timeBack .el-slider__button {
  height: 16px !important;
  width: 16px !important;
  border: none !important;
  color: #18eaf3 !important;
  transform: translate(50px, -2px);
}
</style>
<style scoped>
.compass {
  position: absolute;
  right: 30px;
  top: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.aside-right-footer {
  position: absolute;
  width: 100%;
  height: 53px;
  display: flex;
  align-items: center;
  /* bottom: 307px; */
  top: -59px;
}
.aside-right-footer .timeRange {
  width: 75px;
  height: 33px;
  font-size: 12px;
  background-color: #18ecf3;
  border-radius: 4px;
  line-height: 33px;
  text-align: center;
  flex-shrink: 0;
  color: #fff;
}
/* 时间轴 */
.aside-right-footer .timeLine {
  width: 100%;
  height: 40px;
  background-color: #00517f;
  margin-left: 10px;
  position: relative;
}
.aside-right-footer .timeBackMask {
  width: 100%;
  /* height: calc(33px + 10px); */
  height: 43px;
  overflow-y: hidden;
  overflow-x: scroll;
  position: absolute;
  top: 0;
  left: 0;
}

.aside-right-footer .timeBack {
  position: absolute;
  display: flex;
  flex-shrink: 0;
  color: #fff;
  /* left: 20px; */
}
.aside-right-footer .timeLine .text {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  padding-bottom: 3px;
  box-sizing: border-box;
}
.aside-right-footer .timeLine .text .line {
  height: 8px;
  width: 0;
  border: 1px solid #fff;
}
.aside-right-footer .timeChoose {
  position: absolute;
  top: -100px;
  width: 231px;
  height: 81px;
  background-color: #00517f;
  border: 1px solid #00a8ff;
  padding-left: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
}

/* 进度条 */
.aside-right-footer .process {
  width: 0px;
  height: 2px;
  left: 0;
  bottom: 0;
  position: absolute;
  background-color: #18eaf3;
}
.aside-right-footer .process .button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #18eaf3;
  position: absolute;
  transform: translate(0, -50%);
}
.cloudLayerDragTarget {
  cursor: move;
}

/* echarts页面 */
.gisLayerDragTarget {
  cursor: move;
  justify-content: center;
}
p {
  margin: 0;
  padding: 0;
}
.layer-panel-echarts {
  color: #fff;
  border-radius: 4px;
  overflow: hidden;
  position: absolute;
  background-color: #00517f;
  bottom: 0;
  height: 100%;
  width: 100%;
  padding-bottom: 10px;
}
/* billboard */
.billboard {
  width: 154px;
  height: 40px;
  background-image: url("../assets/imgs/未选中-标题.png");
  background-size: 154px 40px;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
  transform: translate(10vw, 10vh);
  cursor: pointer;
  color: #fff;
}
.selectBillboard {
  background-image: url("../assets/imgs/选中-标题.png") !important;
}
.billboardBox {
  width: 100%;
  position: absolute;
  top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-10%);
}

.headerBanner {
  height: 80px;
  width: 100%;
  position: absolute;
  top: 0;
  background: url("../assets/imgs/bt.jpg");
  background-size: 100%;
}
.header-text {
  color: #fff;
  font-size: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 梯度监测 */
.detectionLive-card-header {
  background-image: linear-gradient(to right, #02d4fa, #005763);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 37px;
  padding: 10px 29px 10px 29px;
  box-sizing: border-box;
}
.detectionLive-card {
  width: 100%;
  position: absolute;
  top: 200px;
  color: #fff;
  width: 300px;
  background: #001323;
}
first-child {
  margin-top: 22px;
}

/* body */
.detectionLive-card-body {
  height: 37px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.detectionLive-card-body span {
  width: 100px;
  text-align: right;
  margin-right: 15px;
  flex-shrink: 0;
}

.detectionLive-card-body .bounding-box-process > p {
  width: 128px;
  height: 2px;
  border-radius: 1px;
  background-color: #02d4fa;
}
.detectionLive-card-body .bounding-box-process > input {
  width: 40px;
  height: 30px;
  border-radius: 1px;
  background-color: #00447f;
  border: none;
  margin-left: 5px;
  color: #fff;
  text-align: center;
  outline: none;
}

/*  */
.detectionLive-card-body {
  height: 37px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.detectionLive-card-body span {
  width: 100px;
  text-align: right;
  margin-right: 15px;
  flex-shrink: 0;
}

.detectionLive-card-body .bounding-box-process > p {
  width: 128px;
  height: 2px;
  border-radius: 1px;
  background-color: #02d4fa;
}
.detectionLive-card-body .bounding-box-process > input {
  width: 40px;
  height: 30px;
  border-radius: 1px;
  background-color: #00447f;
  border: none;
  margin-left: 5px;
  color: #fff;
  text-align: center;
  outline: none;
}
.detectionLive-card-header {
  background-image: linear-gradient(to right, #02d4fa, #005763);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 37px;
  padding: 10px 29px 10px 29px;
  box-sizing: border-box;
}
.detectionLive-card {
  width: 300px;
  overflow: hidden;
  top: 80px;
  transition: all 0.3s ease-in-out;
}
</style>