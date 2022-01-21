<template>
  <div class="container-warper">
    <img src="../assets/imgs/bj.png" alt="" />
    <div class="container">
      <div class="header">
        <img src="../assets/imgs/bt.jpg" alt="" />
        <p class="header-text">铜仁市梵净山保护区梯度气象监测系统</p>
        <div class="user">
          <i class="iconfont icon-shijian" style="margin-right:5px;font-size:23px"></i>
          <p class="now-date">{{ time }}</p>
        </div>
      </div>
      <div class="main">
        <div class="aside-left">
          <img src="../assets/imgs/left-bj.png" alt="" />
          <!-- 左侧边栏站点 -->
          <!-- 站点 -->
          <StationPanel v-show="stationPanelShow" ref="StationPanel"></StationPanel>
          <!-- 数值模式 -->
          <NumericalModel v-show="numericalModelShow" ref="NumericalModel"></NumericalModel>
          <!-- 实况监测 -->
          <DetectionLive v-show="detectionLiveShow" ref="DetectionLive"></DetectionLive>
          <!-- 检测警告 -->
          <DetectionWarning v-show="detectionWarningShow" ref="DetectionWarning"></DetectionWarning>
        </div>
        <div class="aside-right">
          <!-- 控制总图层面板显隐 -->
          <div v-show="!layerIsPanel" @click="layerIsPanel = true"
          style="position: absolute;left: -5px;top: 50%;transform: translateY(-50%);z-index: 2;cursor:pointer">
            <i style="font-size:40px;color:#2980b9" class="iconfont icon-zanting2"></i>
          </div>
          <div id="cesiumContainer" style="width:100%;height:calc(100% - 170px);position:absolute;left:0;top:0"></div>
          <div class="aside-right-main">
            <!-- billboard -->
            <div
              class="billboard"
              v-for="(item, index) in billboard"
              :key="index"
              :class="{ selectBillboard: index == num }"
              @click="showAsideLeft(index)"
            >
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </div>
          </div>

          <!-- 时间轴 -->
          <div class="aside-right-footer" v-if="timeLineIsShow">
            <div class="timeRange" @click.self="timeChooseShow = !timeChooseShow">
              时间范围
              <div class="timeChoose" v-show="timeChooseShow">
                <div style="text-align: left;display: flex;justify-content: space-between;">选择时间范围
                  <i class="iconfont icon-guanbi1" style="padding-right: 10px;cursor:pointer" @click="timeChooseShow=false"></i>
                </div>
                <el-date-picker
                  prefix-icon="el-icon-date"
                  v-model="value1"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  @change="getTimeRange(value1)">
                </el-date-picker>
              </div>
            </div>
            <div class="timeLine">
              <div style="position:absolute;z-index:30;top:-32px;width:180px;height:32px;line-height:32px;text-align:center;background:rgb(41, 128, 185)">日期：{{yearDate}}</div>
              <div class="timeBackMask">
                <div class="timeBack">
                  <div class="text" @click="value2 =index;updateTime(value2)" :style="{backgroundColor:(index>=insert && index<colorShowIndex+insert?'#2980b9':'')}"
                    v-for="(item,index) in timeLineData" :key="index" style="cursor:pointer">
                    <p>{{ item }}</p>
                    <p class="line"></p>
                  </div>
                   <!-- 进度条 -->
                  <el-slider v-model="value2" @change="updateTime(value2)" :max="maxProcessNum" :show-tooltip='false'></el-slider>
                </div>
              </div>
            </div>
          </div>
          <!-- 图层面板 -->
          <!-- 总图层 -->
          <div class="layer-panelC cloudLayerMoveTarget" v-show="layerIsPanel">
            <div class="layer-panel-header cloudLayerDragTarget">
                <p style="display:flex;align-items:center">
                  <i class="iconfont icon-zhengyan" style="cursor:pointer;font-size:20px"
                   @click="allShowOrClose('show')" v-if="allShowOrCloseIndex"></i>
                  <i class="iconfont icon-biyan" style="cursor:pointer;font-size:20px"
                   @click="allShowOrClose('close')" v-else></i>
                  图层
                </p>
                <i class="iconfont icon-guanbi1" style="cursor:pointer" @click="close()"></i>
            </div>
            <div class="layer-panel-body" v-for="(item,index) in layerList" :key="index" 
            :class="{openEyes:!item.isOpenEyes,layerSelect:layerSelect == index}">
                <p style="cursor:pointer" @click="conTime(item.value,index)">{{item.name}}</p>
                <div style="cursor:pointer">
                  <i class="iconfont icon-zhengyan" v-if="item.isOpenEyes" @click.self="layerIsShow(item)"></i>
                  <i class="iconfont icon-biyan" v-else @click.self="layerIsShow(item)"></i>
                </div>
            </div>
          </div>
          <!-- 预警图层 -->
          <WarningLayer v-show="warningLayerShow" ref="WarningLayer" />
          <!-- 数值模式 -->
          <!-- <NumModelLayer v-show="numModelLayerShow" ref="NumModelLayer" /> -->
          <!-- gis图层 -->
          <!-- <GisLayer v-show="gisLayerShow" ref="GisLayer"></GisLayer> -->
          <!-- 数值模式剖面图 -->
          <!-- <NumModelProfile v-show="numModelProfileShow" /> -->
          <!-- 指南针 -->
          <div class="compass" 
            :style="{'transform':'rotate(-'+heading+'rad)','-webkit-transform':'rotate(-'+heading+'rad)','-moz-transform':'rotate(-'+heading+'rad)'}">
              <p style="padding-bottom:20px">N</p>
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
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StationPanel from "../components/stationPanel.vue";
import NumericalModel from "../components/numericalModel.vue";
import DetectionWarning from "../components/detectionWarning.vue";
import DetectionLive from "../components/detectionLive.vue";
import WarningLayer from "../components/warningLayer.vue";
import NumModelLayer from "../components/numModelLayer.vue";
import GisLayer from "../components/gisLayer.vue";
import NumModelProfile from "../components/numModelProfile.vue";
import {
  Earth,TiandituLayer,HighlightPolygonLayer,AgnpLabel3dLayer
} from '@mesh-3d/weather-dv/src/index'

export default {
  components: {
    StationPanel,
    NumericalModel,
    DetectionWarning,
    DetectionLive,
    WarningLayer,
    NumModelLayer,
    GisLayer,
    NumModelProfile,
  },
  data() {
    return {
      yearDate:'',
      awxLayer:undefined,
      earth:undefined,
      sliderBar:undefined,
      value2:0,
      value1:'',
      name: "三维网格",
      // leftAside
      stationPanelShow: false,
      numericalModelShow: true,
      detectionLiveShow: true,
      detectionWarningShow: false,
      timeChooseShow:false,
      // billboard
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
      num: 0,
      //   站点数据
      stationCard: [
        {
          headerName: "梯度气象站",
          body: {
            photoUrl: "",
            bodyName: "",
          },
        },
      ],
      // Layer图层
      warningLayerShow: false,
      numModelLayerShow: false,
      numModelProfileShow: false,
      gisLayerShow: false,
      //   时间轴数据
      timeLineData: [],
      // 后台返回时间/小时
      layerIsPanel:true,
      // 图层总面板数据
      layerList:[],
      layerSelect:100000,
      numbericalModel:undefined,
      maxProcessNum:100,
      timeLineIsShow:false,
      colorMap:undefined,

      canvas:undefined,
      ctx:undefined,
      colorShowIndex:0,

      heading:0,
      // 向时间轴前后添加的时间数量
      insert:0,
      clipperLayer:undefined,
      cityLayer:undefined,
      time:'',
      terrain:undefined,
      allShowOrCloseIndex:true
    };
  },
  mounted(){
    this.getDate()
    // 总图层拖拽
    let el = document.querySelector('.cloudLayerDragTarget')
    let Fel = document.querySelector('.cloudLayerMoveTarget')
    el.onmousedown = function(e){
        Fel.style.bottom = null
        let posX = e.clientX
        let posY = e.clientY
        let x = Fel.offsetLeft
        let y = Fel.offsetTop
        document.onmousemove = function(e){
            if(x + e.clientX - posX>=0) Fel.style.left = x + e.clientX - posX + 'px'
            else Fel.style.left = 0
            if(y + e.clientY - posY>=0) Fel.style.top = y + e.clientY - posY + 'px'
            else Fel.style.top = 0
        }
        document.onmouseup = function(){
            document.onmousemove = null
        }
    }
    
    // 页面间传值
    if(this.$route.params.gisIndex){
      this.showAsideLeft(this.$route.params.gisIndex)
    } else {
      this.showAsideLeft(1)
    }
    
    if(screen.width<1920){
      this.$message.warning('当前显示器分辨率过小，请缩放网页以获得最佳观看体验')
    }


    // 添加地形
    this.terrain = new Cesium.CesiumTerrainProvider({
        url:'./assets/terrain/'
    })

    // 注册地球
    var mapContainer = document.querySelector('#cesiumContainer')
    var earth=new Earth({
      container: mapContainer,
      creditContainer: document.createElement('div'),
      timeline: true,
      animation: true,
      infoBox: false,
      geocoder:false,
      selectionIndicator : true,
      // terrainProvider:this. terrain,
      // 隐藏背景后去黑圈
      orderIndependentTranslucency: false,
      contextOptions: {
        webgl: {
            alpha: true,
        }
      },
    })
    earth.viewer.timeline.container.style.display='none'
    earth.viewer.animation.container.style.display='none'

    earth.addLayer(new HighlightPolygonLayer({
      maximumLevel:12,
      source:'./assets/vectorData/shp/边界数据2017版/BOUA省级行政区域.shp'
    }))
    earth.addLayer(new TiandituLayer({
      imageLayer:'img'
    }))
    earth.globe.showGroundAtmosphere=false
    earth.scene.fog.enabled=false

    this.earth = earth

    this.earth.viewer.scene.skyBox.show = false;
    // 背景透明
    this.earth.viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);

    // 默认看向铜仁区域
    this.earth.scene.camera.position = new Cesium.Cartesian3(-1933911.7711933923,5794997.39268203,3236578.2201692094)

    // home键回到指定位置
    this.earth.viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e)=> {
			e.cancel = true;
			//你要飞的位置	
		
      if(this.cityLayer.provider.ready){
        earth.flyTo(this.cityLayer.provider)
      }else{
          this.earth.viewer.camera.flyTo({
            destination: new Cesium.Cartesian3(-1933911.7711933923,5794997.39268203,3236578.2201692094),
          });
      }

		})

    // 添加gis剖切按钮
    // let toolBar = document.querySelector('.cesium-viewer-toolbar')
    // let search = document.querySelector('.cesium-toolbar-button')
    // let gis = document.createElement('div')
    // gis.setAttribute('class','gis')
    // window.clickFun = ()=>{
    //   this.gisLayerShow = !this.gisLayerShow
    // }
    // gis.innerHTML = `
    //   <div class="gisTool" onclick="clickFun()">
    //     <i class="iconfont icon-shuzhimoshi"></i>
    //   </div>`
    // toolBar.insertBefore(gis, search)
    

    // 添加色标canvas
    this.canvas = document.createElement('canvas')
    this.canvas.width = 100
    this.canvas.height = 0
    this.canvas.style.position = 'absolute'
    this.canvas.style.right = '0px'
    // this.canvas.style.background = '#fff'
    this.ctx = this.canvas.getContext('2d')
    this.ctx.font='12px Verdana'
    this.ctx.strokeStyle= '#fff'

    document.querySelector('#cesiumContainer').appendChild(this.canvas)
    let fullBotton = document.querySelector('.cesium-viewer-fullscreenContainer')
    fullBotton.style.zIndex = 10

    const { RasterImageGenerator } = MeteoLib
    RasterImageGenerator.registerAll('./assets/pal/')

    this.sliderBar = document.querySelector('.el-slider__bar')
 
    // this.earth.viewer.baseLayerPicker.viewModel.selectedImagery = this.earth.viewer.baseLayerPicker.viewModel.imageryProviderViewModels[8]
    // 传值给子组件
    // this.$refs.GisLayer.getCesium(this.earth);
    this.$refs.StationPanel.getCesium(this.earth);


    // 显示地名
    var label3dLayer3 = new AgnpLabel3dLayer({
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
                    fillColor: Cesium.Color.WHITE
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

    
    // 绑定指南针
    this.earth.viewer.scene.preRender.addEventListener(() => {
        this.heading = this.earth.viewer.camera.heading
    });


     //用于裁剪色斑图，只保留矢量面区域内的数据
    this.clipperLayer = new Vector2dLayer({
        source:  './assets/vectorData/geojson/行政区域-铜仁市.geojson',
        zIndex: 1000,
        defaultStyle:{
            fill:true,
            outline:false
        }
    })

    this.cityLayer=new Vector2dLayer({
      source:  './assets/vectorData/geojson/行政区域-铜仁市.geojson',
      zIndex: 1000,
      defaultStyle:{
          fill:false,
          outline:true,
          lineWidth:2,
          outlineColor:'#000'
      }
    })

    this.earth.addLayer(this.cityLayer)
    this.cityLayer.provider.readyPromise.then(() => {
        this.earth.updateOrder()
        earth.flyTo(this.cityLayer.provider)
    })

// this.$refs.NumericalModel.getCesium(this.earth,this.clipperLayer);
this.$refs.DetectionLive.getCesium(this.earth,this.clipperLayer);
  
    
    
  },
  methods: {
    getDate(){
      setInterval(() => {
          this.time = new Date().format("yyyy-MM-dd   hh:mm:ss")
      }, 1000);
    },
    // 控制左侧边栏显隐
    showAsideLeft(index) {
      this.num = index;
      // if (this.num == 0) {
      //   this.stationPanelShow = true;
      // } else {
      //   this.stationPanelShow = false;
      // }
      if(this.num == 0){
        this.$router.push({ path: '/'});
      }
      if (this.num == 1) {
        this.detectionLiveShow = true;
      } else {
        this.detectionLiveShow = false;
      }
      if (this.num == 2) {
        this.$router.push({
          path: '/numModel',
          name:'numModel',
        });
        // this.numericalModelShow = true;
        // this.numModelProfileShow = false;
        // this.numModelLayerShow = false;
      } else {
        this.numericalModelShow = false;
        this.numModelProfileShow = false;
        this.numModelLayerShow = false;
      }
      if (this.num == 3) {
        this.detectionWarningShow = true;
        this.warningLayerShow = false;
      } else {
        this.detectionWarningShow = false;
        this.warningLayerShow = false;
      }
    },
    // 处理后台返回时间生成时间轴
    dealTimeLineDate(timeList){
      let k = 21-timeList.length
      let timeArr = Object.assign([],timeList)

      if(timeList.length<=15){
        this.insert = 3
      }else if(timeList.length<=10){
        this.insert = 6
      }else if(timeList.length<=5){
        this.insert = 8
      }else if(timeList.length<=1){
        this.insert = 10
      } else{
        this.insert = 0
      }

      // 构建前后数组前后时间段
      if(k!=21){
        let num = this.insert
        let dateBefore = timeArr[0]
        let HB = new Date(dateBefore).getHours()
        let dateAfter = timeArr[timeArr.length-1]
        let HA = new Date(dateAfter).getHours()
        for(let i=0;i<k;i++){
          if(i<this.insert){
            HB-=num
            if(HB<0){
              HB = 24 + HB
            }
            if(HB<10) HB = '0' + HB
            timeArr.unshift(`${HB}:00`)
          } else{
            HA= (+HA)+num
            if(HA>=24){
              HA = 0
            }
            if(HA<10) HA = '0' + HA
            timeArr.push(`${HA}:00`)
          }
        }
      } else{
        let time = 0
        for(let i=0;i<21;i++){
          time= (+time)+1
          if(time<10) time = '0' + time
          timeArr.push(`${time}:00`)
        }
      }
      

      this.timeLineData = []
      timeArr.forEach((item,index)=>{
        var Rtime
        if(index>=this.insert && index<timeList.length+this.insert){
          let date = new Date(item)
          let h = date.getHours()
          let m = date.getMinutes()
          if(h<10) h = '0'+h
          if(m<10) m = '0'+m
          Rtime = h + ":"+ m
          this.timeLineData.push(Rtime)
        } else{
          this.timeLineData.push(item)
        }
      })

      this.maxProcessNum = this.timeLineData.length
    },
    close(){
      this.layerIsPanel = false
    },
    // 控制图层全选和取消
    allShowOrClose(value){
      if(value != 'show'){
        this.layerList.forEach((item)=>{
          item.value.show = true
          item.isOpenEyes = true
        })
        this.allShowOrCloseIndex = true
      } else {
        this.layerList.forEach((item)=>{
          item.value.show = false
          item.isOpenEyes = false
        })
        this.allShowOrCloseIndex = false
      }
      
    },
    // 控制图层显隐
    layerIsShow(layer){
      layer.isOpenEyes = !layer.isOpenEyes
      layer.value.show = layer.isOpenEyes
      if(layer.name=='数值模式') this.cityLayer.show = layer.isOpenEyes

      let num = 0
      this.layerList.forEach((item)=>{
        if(item.isOpenEyes == true){
          num+=1
        }
      })
      if(num==this.layerList.length)this.allShowOrCloseIndex = true
      else this.allShowOrCloseIndex = false
        
    },
    // 根据时间获取文件列表
    getTimeRange(timeRange){
      this.numbericalModel.updateList(timeRange[0],timeRange[1])
    },
    // 更新色斑图
    updateColorMap(layer){
      layer.onChange=(colorMap)=>{
        this.drawColorMap(colorMap)
      }
    },
    // 绘制色斑图
    drawColorMap(colorMap){
        this.ctx.clearRect(0,0,1000,1000)
        if(colorMap.length>=256){
          this.canvas.height = colorMap.length + 20
          this.canvas.style.bottom = '0'
        }else{
          this.canvas.height = colorMap.length*10 + 10
          this.canvas.style.bottom = '0'
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
        
    },
    // 点击图层选中并联系时间轴
    conTime(layer,index){
      if(this.layerSelect!=index){
        
        // 同步时间轴和进度条==css
        this.layerSelect = index

        // 进度条重新归0
        this.value2 = 0

        // 将当前点击图层数据赋值给时间轴操作
        this.numbericalModel = layer
        this.timeLineIsShow = true

        this.colorShowIndex = layer.timeList.length
        this.dealTimeLineDate(layer.timeList)
        if(this.numbericalModel.colorMap!=null&& this.numbericalModel.colorMap.length>0){
          this.drawColorMap(this.numbericalModel.colorMap)
        } else {
          this.canvas.height = 0
        }
      }
    },
    showYear(value){
      let date = new Date(value)
      let y = date.getFullYear()
      let m = date.getMonth()+1
      let d = date.getDate()
      this.yearDate =  y +'-'+ m +'-' + d
    },
    // 更新时间时更新文件
    updateTime(time){
      // time是时间数组得索引
      if(ElementChoose.updateTimeLine.type=='single'){
        this.numbericalModel.currentTime = this.numbericalModel.timeList[time - this.insert]
          this.showYear(this.numbericalModel.currentTime)
      } else {
        this.layerList.forEach(item=>{
          item.value.currentTime = this.numbericalModel.timeList[time - this.insert]
          this.showYear(item.value.currentTime)
        })
      }
    },
      
    // 给子组件得方法
    closeNumModel(){
      this.numModelLayerShow = false
    },
    closeNumModelProfile(){
      this.numModelProfileShow = false
    },
    closeWarningLayer(){
      this.warningLayerShow = false
    },
    sendCesium(){
      this.$refs.StationPanel.getCesium(this.earth);
      // this.$refs.GisLayer.getCesium(this.earth);
      this.$refs.DetectionLive.getCesium(this.earth,this.clipperLayer);
      // this.$refs.NumericalModel.getCesium(this.earth,this.clipperLayer);
    },
  },
};
</script>

<style>
/* cesium控件样式 */
.cesium-geocoder-searchButton{
  background: #04183D!important;
}
.cesium-geocoder-searchButton:focus{
  border: 1px solid #61E4FF!important;
}

.gis{
  background: #04183D!important;
  box-sizing: border-box;
  border: 1px solid #504f4f;
}
.gis:hover{
  border: 1px solid #61E4FF!important;
}

.cesium-toolbar-button{
  background: #04183D!important;
}
.cesium-toolbar-button:focus{
  border: 1px solid #61E4FF!important;
}

.cesium-sceneModePicker-wrapper{
  background: #04183D!important;
}
.cesium-sceneModePicker-wrapper:focus{
  border: 1px solid #61E4FF!important;
}

.cesium-sceneModePicker-button3D{
  background: #04183D!important;
}
.cesium-sceneModePicker-button3D:focus{
  border: 1px solid #61E4FF!important;
}
.cesium-geocoder-searchButton{
  background: #04183D!important;
}
.cesium-geocoder-searchButton:focus{
  border: 1px solid #61E4FF!important;
}






html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;
}
input[type=radio]{
  cursor: pointer;
}
/*scrollbar*/

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  width: 4px;
  background-color: #175892;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: #02D4FA;
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgb(255, 255, 255);
}

input,
select {
  outline: none;
}
option{
  background:#40a4d6;
  color:#fff;
}
* {
  font-size: 14px;
  user-select: none;
}
.timeChoose .el-date-editor{
    width: 220px!important;
    background: transparent;
    border: none;
    padding-left:0!important;
}
.timeChoose .el-range-input{
  background: none;
  color: rgba(255, 255, 255, 0.863)!important;
}
.timeChoose .el-range-separator{
  color: #fff!important;
  padding-right: 10px!important;
}

.container .main .aside-right .aside-right-footer .timeBack .el-slider{
  position: absolute!important;
  width: 100%;
  bottom: 17px;
}
.container .main .aside-right .aside-right-footer .timeBack .el-slider__runway{
    position: absolute!important;
    width: 100%!important;
    height: 2px!important;
}
.container .main .aside-right .aside-right-footer .timeBack .el-slider__bar{
    height: 2px!important;
    background-color: #18EAF3!important;
}
.container .main .aside-right .aside-right-footer .timeBack .el-slider__button{
    height: 16px!important;
    width: 16px!important;
    border: none!important;
    color: #18EAF3!important;
    transform: translate(50px,-2px);
}

.layer-panelC .layerSelect{
  background: #003452!important;
}

.gis{
  position: relative;
  display: inline-block;
  vertical-align: middle;
  background: #303336;
  width: 32px;
  height: 32px;
  border-radius: 2px;
  
}
.gis:hover::after{
  content: '剖切';
  position: absolute;
  bottom: -40px;
  right: -30px;
  width: 40px;
  line-height: 30px;
  border-radius: 2px;
  text-align: center;
  background: #303336;
  color:#fff
}
.gis .gisTool{
  cursor: pointer;
  line-height: 31px;

}
.gis .gisTool .iconfont{
  font-size: 39px;
  margin-left: -5px;
  color:#fff
}
</style>

<style scoped>
.container-warper p {
  padding: 0;
  margin: 0;
}

.container-warper {
  background-color: #000;
  height: 100%;
  width: 100%;
  position: relative;
  color: #fff;
  overflow: hidden;
}
.container-warper > img {
  position: absolute;
  width: 100%;
  height: 100%;
}
.container {
  position: absolute;
  width: 100%;
  height: 100%;
}
.container .header {
  width: 100%;
  height: 121px;
  position: relative;
}
.container .header > img {
  height: 100%;
  width: 100%;
}
.container .header .header-text {
  color: #fff;
  font-size: 36px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.container .header .user {
  display: flex;
  position: absolute;
  top: 90px;
  right: 0;
  height: 25px;
  align-items: center;
  text-align: center;
  margin-right: 10px;
}

.container .main {
  display: flex;
  justify-content: space-between;
  height: 100%;
  position: relative;
}


/* 左边主体部分 */
.container .main .aside-left {
  width: calc(390px + 13px);
  height: 775px;
  margin: 28px 0 19px 0px;
  overflow-y: auto;
  position: relative;
}
.container .main .aside-left > img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 右边主体部分 */
.container .main .aside-right {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
.container .main .aside-right-main {
  display: flex;
  position: absolute;
}
.container .main .compass{
  position: absolute;
  right: 30px;
  top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/* billboard */
.container .main .aside-right .billboard {
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
  z-index: 0;
}
.selectBillboard {
  background-image: url("../assets/imgs/选中-标题.png") !important;
}

/* 右边底部时间轴 */
.container .main .aside-right .aside-right-footer {
  bottom: 136px;
  position: absolute;
  left: 10px;
  width: 100%;
  height: 33px;
  display: flex;
  align-items: center;
}
.container .main .aside-right .aside-right-footer .timeRange {
  width: 75px;
  height: 33px;
  font-size: 12px;
  background-color: #18ecf37e;
  border-radius: 4px;
  line-height: 33px;
  text-align: center;
  flex-shrink: 0;
}
/* 时间轴 */
.container .main .aside-right .aside-right-footer .timeLine {
  width: 100%;
  height: 33px;
  background-color: #00517f;
  margin-left: 10px;
  position: relative;
}
.container .main .aside-right .aside-right-footer .timeBackMask{
  width: 100%;
  /* height: calc(33px + 10px); */
  height: 43px;
  overflow-y: visible;
  overflow-x: scroll;
  position: absolute;
  top: 0;
  left: 0;
}

.container .main .aside-right .aside-right-footer .timeBack{
  position: absolute;
  display: flex;
  flex-shrink: 0;
  /* left: 20px; */
}
.container .main .aside-right .aside-right-footer .timeLine .text {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  padding-bottom: 3px;
  box-sizing: border-box;
}
.container .main .aside-right .aside-right-footer .timeLine .text .line {
  height: 8px;
  width: 0;
  border: 1px solid #fff;
}
.container .main .aside-right .aside-right-footer .timeChoose {
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
.container .main .aside-right .aside-right-footer .process {
  width: 0px;
  height: 2px;
  left: 0;
  bottom: 0;
  position: absolute;
  background-color: #18eaf3;
}
.container .main .aside-right .aside-right-footer .process .button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #18eaf3;
  position: absolute;
  transform: translate(0, -50%);
}
.cloudLayerDragTarget{
    cursor: move;
}
.layer-panelC{
    width: 258px;
    height: 250px;
    border-radius: 4px;
    overflow: hidden;
    position: absolute;
    background-color: #00517F;
    left: 10px;
    bottom: 201px;
}
.layer-panelC .layer-panel-header{
    height: 50px;
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
.layer-panelC .layer-panel-body{
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #00517F;
}
.openEyes{
    background-color: rgba(255, 255, 255, 0.089)!important;
}
.layer-panelC .layer-panel-body .iconfont{
    font-size: 20px;
    margin-left: 10px;
}
</style>