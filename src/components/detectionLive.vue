<template>
  <div  style="position:absolute;width:100%;overflow:auto">
      <div class="detectionLive-info">
          <!-- 梯度监测 -->
        <div class="detectionLive-card" v-show="graMonitoring.show">
            <div class="detectionLive-card-header">
                <div style="display:flex;align-items: center;">
                    <p>{{graMonitoring.name}}</p>
                </div>
                <i class="iconfont icon-arrow expand" style="transition:all 0.3s ease-in-out;cursor:pointer;color:#18EAF3" @click="selectAnimation()"></i>
            </div>
            <div class="detectionLive-card-body">
                <span>展示方式</span>
                <div style="display:flex;flex:1;align-items:center;">
                    <label style="margin-right:20px"><input type="radio" value="zhu" v-model="graMonitoring.showStyle">柱状图</label>
                    <label><input type="radio" value="san" v-model="graMonitoring.showStyle">散点图</label>
                </div>
            </div>
            <div class="detectionLive-card-body">
                <span>显示粒子动画</span>
                <div style="display:flex;flex:1;align-items:center;">
                    <label style="margin-right:47px"><input type="radio" value="true" v-model="graMonitoring.showAnimation">是</label>
                    <label><input type="radio" value="false" v-model="graMonitoring.showAnimation">否</label>
                </div>
            </div>
            <div class="detectionLive-card-body">
                <span>三维地表图</span>
                <div style="display:flex;flex:1;align-items:center;">
                    <input type="checkbox" v-model="graMonitoring.map3D">
                </div>
            </div>
        </div>
        <!-- 卫星云图 -->
            <div class="detectionLive-card">
                <div class="detectionLive-card-header">
                    <div style="display:flex;align-items: center;">
                        <p>{{satellite.name}}</p>
                    </div>
                    <i class="iconfont icon-arrow" style="transition:all 0.3s ease-in-out;cursor:pointer;color:#18EAF3" @click="selectAnimation()"></i>
                </div>
                <div class="detectionLive-card-body">
                    <span>通道</span>
                    <div style="display:flex;flex:1;align-items:center;">
                        <label><input type="radio" value="C012" v-model="detectionLiveELE.sateLayer.channel" 
                        @change="sateLayer.channel = detectionLiveELE.sateLayer.channel">红外</label>
                        <label><input type="radio" value="C008" v-model="detectionLiveELE.sateLayer.channel" 
                        @change="sateLayer.channel = detectionLiveELE.sateLayer.channel">水汽</label>
                        <label><input type="radio" value="C002" v-model="detectionLiveELE.sateLayer.channel" 
                        @change="sateLayer.channel = detectionLiveELE.sateLayer.channel">可见光</label>
                    </div>
                </div>
                <div class="detectionLive-card-body">
                    <span>透明度</span>
                    <div style="flex:1;display:flex;position:relative" class="bounding-box-process">
                        <el-slider v-model="value2" show-input :max="15" :min="1"></el-slider>
                    </div>
                </div>
            </div>
        <!-- 地表监测 -->
            <div class="detectionLive-card">
                <div class="detectionLive-card-header">
                    <div style="display:flex;align-items: center;">
                        <p>地面监测</p>
                    </div>
                    <i class="iconfont icon-arrow expand" style="transition:all 0.3s ease-in-out;cursor:pointer;color:#18EAF3" @click="selectAnimation()"></i>
                </div>
                <div class="detectionLive-card-body">
                    <span>要素选择</span>
                    <div style="display:flex;align-items:center">
                        <select @change="surfLayer.element = element;updataColor()" v-model="element" 
                        style="width:170px;height:34px;background-color:#286989;color:#fff;border:none;text-indent:1em">
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
                <div class="detectionLive-card-body" v-for="(item,index) in detectionLiveELE.surfLayer.isShowArr" :key="item.name+index">
                    <span>{{item.name}}</span>
                    <div style="display:flex;flex:1;align-items:center;">
                        <label style="margin-right:20px">
                            <input v-model="item.value" type="radio" :name="item.name" :value="true" 
                            @change="surfLayer[item.type] = item.value">是</label>
                        <label>
                            <input v-model="item.value" type="radio" :name="item.name" :value="false" 
                            @change="surfLayer[item.type] = item.value">否</label>
                    </div>
                </div>
                <!-- <div class="detectionLive-card-body">
                    <span>显示方式</span>
                    <div style="display:flex;align-items:center">
                        <select style="width:170px;height:34px;background-color:#286989;color:#fff;border:none;text-indent:1em">
                            <option value="请选择">请选择</option>
                        </select>
                    </div>
                </div> -->
            </div>
        <!-- 雷达监测 -->
            <div class="detectionLive-card">
                <div class="detectionLive-card-header">
                    <div style="display:flex;align-items: center;">
                        <p>雷达监测</p>
                    </div>
                    <i class="iconfont icon-arrow" style="transition:all 0.3s ease-in-out;cursor:pointer;color:#18EAF3" @click="selectAnimation()"></i>
                </div>
                <div class="detectionLive-card-body">
                    <span>产品类型</span>
                    <div style="display:flex;flex:1;align-items:center;">
                        <label><input type="radio" name="type" value="single" v-model="swanType">单站基数据</label>
                        <label><input type="radio" name="type" value="puzzle" v-model="swanType">雷达拼图</label>
                    </div>
                </div>
                <!-- 雷达拼图 -->
                <!-- <div class="detectionLive-card-body" v-show="swanType=='puzzle'">
                    <span>选取层级</span>
                    <div style="display:flex;align-items:center">
                        <select v-model="detectionLiveELE.swanRadarLayer.level" 
                        @change="swanRadarLayer.level = detectionLiveELE.swanRadarLayer.level-1" 
                        style="width:170px;height:34px;background-color:#286989;color:#fff;border:none;text-indent:1em">
                            <option :value="item" v-for="item in levelCount" :key="item">第{{item}}层</option>
                        </select>
                    </div>
                </div> -->
                <div class="detectionLive-card-body" v-show="swanType=='puzzle'">
                    <span>选取层级</span>
                    <div style="flex:1;display:flex;align-items:center;position:relative" class="bounding-box-process">
                        <el-slider v-model="detectionLiveELE.swanRadarLayer.level" :max="levelCount"
                        :min="1" :show-tooltip='false' show-input
                        @change="swanRadarLayer.level = detectionLiveELE.swanRadarLayer.level-1"></el-slider>
                    </div>
                </div>
                <!-- 单站雷达 -->
                <div class="detectionLive-card-body" v-show="swanType=='single'">
                    <span>雷达站点名称</span>
                    <div style="display:flex;align-items:center">
                        <select v-model="detectionLiveELE.pupRadarLayer.stationValue" 
                        style="width:170px;height:34px;background-color:#286989;color:#fff;border:none;text-indent:1em">
                            <option v-for="(item,index) in detectionLiveELE.pupRadarLayer.stationName" :key="item.name+index"
                            :value="item.name">{{item.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="detectionLive-card-body" v-show="swanType=='single'">
                    <span>产品代码</span>
                    <div style="display:flex;align-items:center">
                        <select v-model="detectionLiveELE.pupRadarLayer.value" 
                        @change="pupRadarLayer.prodCode = detectionLiveELE.pupRadarLayer.value" 
                        style="width:170px;height:34px;background-color:#286989;color:#fff;border:none;text-indent:1em">
                            <option v-for="(item,index) in detectionLiveELE.pupRadarLayer.prodCode" :key="item.value+index"
                            :value="item.value">{{item.name}}</option>
                        </select>
                    </div>
                </div>


                <div class="detectionLive-card-body">
                    <span>透明度</span>
                    <div style="flex:1;display:flex;align-items:center;position:relative" class="bounding-box-process">
                        <el-slider v-model="value2" show-input :max="15" :min="1"></el-slider>
                    </div>
                </div>
            </div>
        <!-- 高空监测 -->
            <div class="detectionLive-card">
                <div class="detectionLive-card-header">
                    <div style="display:flex;align-items: center;">
                        <p>高空监测</p>
                    </div>
                    <i class="iconfont icon-arrow" style="transition:all 0.3s ease-in-out;cursor:pointer;color:#18EAF3" @click="selectAnimation()"></i>
                </div>
                <div class="detectionLive-card-body">
                    <span>符号图片大小</span>
                    <div style="display:flex;flex:1;align-items:center;">
                       <input style="height:34px;border:none;color:#fff;background:rgb(40, 105, 137);text-indent: 1em"
                       v-model="detectionLiveELE.micapsUpAirLayer.symbolSize" 
                       @change="micapsUpAirLayer.symbolSize = detectionLiveELE.micapsUpAirLayer.symbolSize" type="text">
                    </div>
                </div>
                <div class="detectionLive-card-body">
                    <span>风向符号类型</span>
                    <div style="display:flex;align-items:center">
                        <select v-model="detectionLiveELE.micapsUpAirLayer.windSymbolType" 
                        style="width:170px;height:34px;background-color:#286989;color:#fff;border:none;text-indent:1em"
                        @change="micapsUpAirLayer.windSymbolType = detectionLiveELE.micapsUpAirLayer.windSymbolType">
                            <option value="windShaft">风羽</option>
                            <option value="arrow">箭头</option>
                        </select>
                    </div>
                </div>
                <div class="detectionLive-card-body">
                    <span>风向符号大小</span>
                    <div style="display:flex;flex:1;align-items:center;">
                       <input  style="height:34px;border:none;color:#fff;background:rgb(40, 105, 137);text-indent: 1em"
                       v-model="detectionLiveELE.micapsUpAirLayer.windSymbolSize" 
                       @change="micapsUpAirLayer.windSymbolSize = detectionLiveELE.micapsUpAirLayer.windSymbolSize" type="text">
                    </div>
                </div>
            </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            detectionLiveELE:'',
            element:'TEM',
            value1:10,
            value2:10,
            earth:undefined,
            name:'实况监测',
            // 梯度监测数据
            graMonitoring:{
                name:'梯度监测',
                show:false,
                select:[
                    {
                        name:'温度',
                        value:'tem'
                    },
                    {
                        name:'高度',
                        value:'height'
                    },
                    
                ],
                showStyle:'',
                showAnimation:'',
                map3D:true
            },
            // 卫星云图数据
            satellite:{
                name:'卫星云图',
                channel:'C002',
                select:[
                    {
                        name:'一时',
                        value:'tem'
                    },
                    {
                        name:'二十',
                        value:'height'
                    },
                    
                ],
                opacity:1,
            },
            isShowArr:[
                {
                    value:true,
                    name:'等值线'
                },
                {
                    value:true,
                    name:'色斑图'
                },
                {
                    value:true,
                    name:'散点'
                },
                {
                    value:true,
                    name:'站名'
                },
                {
                    value:true,
                    name:'要数值'
                },
                // {
                //     value:'',
                //     name:'是否显示风场动画'
                // },
            ],
            surfLayer:undefined,
            sateLayer:undefined,
            swanRadarLayer:undefined,
            levelCount:undefined,
            level:1,
            // 单站雷达
            pupRadarLayer:undefined,
            swanType:'puzzle',
            stationName:'贵阳',
            prodCode:'CR/38',
            // 高空监测
            micapsUpAirLayer:undefined,
            symbolSize:80,
            windSymbolType:'windShaft',
            windSymbolSize:32,
            clipperLayer:undefined

        }
    },
    created(){
        this.detectionLiveELE = ElementChoose.detectionLive
    },
    mounted(){
        this.InitializeHeight()
        this.$parent.sendCesium()
        
    },
    methods:{
        // 更新色标
        updataColor(){
            this.$parent.updateColorMap(this.surfLayer)
        },
        getCesium(earth,clipperLayer){
            if(earth){
                this.earth = earth
                this.clipperLayer = clipperLayer
                if(this.sateLayer==undefined) this.chooseChannel()
                if(this.surfLayer==undefined) this.monitoring()
                if(this.swanRadarLayer==undefined) this.swanRadar()
                if(this.pupRadarLayer==undefined) this.pupRadar()
                if(this.micapsUpAirLayer==undefined) this.micapsUpAir()
            }
        },
        // 初始化高度
        InitializeHeight(){
            let el = document.querySelectorAll('.detectionLive-card')
            let long = 0
            el.forEach(item=>{
                if(item.children[0].children[1].classList.contains('expand')){
                    long = 0
                    item.childNodes.forEach((item1)=>{
                        if (item1.nodeName === "DIV") {
                            long += item1.offsetHeight
                        }
                    })
                    item.style.height = long + 'px'
                } else {
                    item.style.height = item.children[0].offsetHeight + 'px'
                }
            })
        },
        selectAnimation(e){
            e = e || window.event
            let el = e.target.parentNode.parentNode
            let long = 0
            if(!e.target.classList.contains('expand')){
                // 控制同时只有一个下拉框展开
                let tar = document.querySelectorAll('.detectionLive-card .expand')
                if(tar){
                    tar.forEach(item=>{
                        item.classList.remove('expand')
                        item.parentNode.parentNode.style.height = item.parentNode.parentNode.children[0].offsetHeight + 'px'
                    })
                }
                e.target.classList.add('expand')
                el.childNodes.forEach((item)=>{
                        if (item.nodeName === "DIV") {
                            long += item.offsetHeight
                        }
                    })
                el.style.height = long + 'px'
            } else {
                e.target.classList.remove('expand')
                el.style.height = el.children[0].offsetHeight + 'px'
            }
        },
        // 卫星云图
        chooseChannel(){
            this.sateLayer = new SateCloudLayer(hfsLoader)
            this.sateLayer.channel = 'C002'
            this.sateLayer.load(this.earth).then(() => {
                this.sateLayer.currentTime = this.sateLayer.latestTime
                this.$parent.layerList.add({name:'卫星云图',value:this.sateLayer,isOpenEyes:true})
            })
        },
        // 地面监测
        monitoring(){
            var surfLayer=this.surfLayer = new SurfLayer(hfsLoader)
            surfLayer.imageryOptions.maximumLevel=13;
    //   surfLayer._labelGraphics.pixelOffset= { x: 0, y: 20 }
      surfLayer._labelGraphics.fillColor=Cesium.Color.WHITE
      surfLayer._labelGraphics.heightReference=Cesium.HeightReference.CLAMP_TO_GROUND
      surfLayer._pointGraphics.heightReference=Cesium.HeightReference.CLAMP_TO_GROUND
    //   surfLayer._disableDepthTestDistance=Infinity;

            this.surfLayer.clipperLayer=this.clipperLayer
            this.surfLayer.load(this.earth).then(() => {
                this.surfLayer.currentTime = this.surfLayer.timeList[0];
                this.surfLayer.readyPromise.then(()=>{
                this.surfLayer.element = this.element
                this.surfLayer.fill = false
                this.$parent.layerList.add({name:'地面监测',value:this.surfLayer,isOpenEyes:true})
                this.$parent.layerList.forEach((item,index)=>{
                    if(item.name == '地面监测'){
                        this.$parent.conTime(item.value,index)
                        this.$parent.showYear(item.value.currentTime)
                    }
                })
                })
                
            })
        },
        // 拼图雷达
        swanRadar(){
            this.swanRadarLayer = new SwanRadarLayer(hfsLoader)
            this.swanRadarLayer.zIndex = 999
            this.swanRadarLayer.readyPromise.then(()=>{
                this.levelCount = this.swanRadarLayer.levelCount
            })
            this.swanRadarLayer.load(this.earth).then(() => {
                this.swanRadarLayer.currentTime = this.swanRadarLayer.latestTime
                this.$parent.layerList.add({name:'雷达拼图',value:this.swanRadarLayer,isOpenEyes:true})
            })
        },
        // 单站雷达
        pupRadar(){
            this.pupRadarLayer = new PUPRadarLayer(hfsLoader)
            this.pupRadarLayer.load(this.earth).then(() => {
                this.pupRadarLayer.currentTime = this.pupRadarLayer.latestTime
                this.pupRadarLayer.readyPromise.then(()=>{
                })
                this.$parent.layerList.add({name:'单站雷达',value:this.pupRadarLayer,isOpenEyes:true})
            })
        },
        // 单站雷达
        micapsUpAir(){
            this.micapsUpAirLayer = new MicapsUpAirLayer(hfsLoader)
            this.micapsUpAirLayer.load(this.earth).then(() => {
                this.micapsUpAirLayer.currentTime = this.micapsUpAirLayer.latestTime
                this.$parent.layerList.add({name:'高空填图',value:this.micapsUpAirLayer,isOpenEyes:true})
            })
        },
    }
}
</script>

<style>
.el-slider__runway{
    width: 128px!important;
    height: 2px!important;
}
.el-slider__bar{
    height: 2px!important;
    background-color: #18EAF3!important;
}
.el-slider__button{
    height: 20px!important;
    width: 20px!important;
    border: none!important;
    color: #18EAF3!important;
    transform: translateY(-2px);
}
.bounding-box-process .el-slider{
    width: 170px;
}
.bounding-box-process .el-input__inner{
    padding: 0!important;
    color: #fff;
    background: #00447F!important;
    border: none;
    border-radius: 2px;
}
.bounding-box-process .el-input-number__increase,.bounding-box-process .el-input-number__decrease{
    display: none!important;
}
.bounding-box-process .el-slider__input{
    width: 36px!important;
}
</style>


<style scoped>
*{
    font-size: 14px;
}
.expand{
    transform: rotateZ(90deg);
    transition: all 0.3s ease-in-out;
}
.detectionLive-info{
    width: calc(100% - 20px);
    height: calc(100% -42px);
    margin-left: 10px;
    background-color: #00447f44;
    margin-bottom: 2px;
}
.detectionLive-info .detectionLive-card-header{
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    display:flex;
    justify-content: space-between;
    align-items: center;
    height:37px;
    padding: 10px 29px 10px 29px;
    box-sizing: border-box;
}
.detectionLive-info .detectionLive-card{
    width: 100%;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
}
.detectionLive-info:first-child{
    margin-top: 22px;
}

/* body */
.detectionLive-card-body{
    height:37px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.detectionLive-card-body span{
    width: 100px;
    text-align: right;
    margin-right: 15px;
    flex-shrink: 0;
}

.detectionLive-card-body .bounding-box-process>p{
    width: 128px;
    height: 2px;
    border-radius: 1px;
    background-color: #02D4FA;
}
.detectionLive-card-body .bounding-box-process>input{
    width: 40px;
    height: 30px;
    border-radius: 1px;
    background-color: #00447F ;
    border: none;
    margin-left: 5px;
    color: #fff;
    text-align: center;
    outline: none;
}
.opacity{
    position:absolute;
    top:0;
    /* left: 0; */
    width:20px!important;
    height:20px;
    border-radius:50%;
    background-color:#18EAF3;
    transform:translateY(-50%);
    margin: 0!important;
}
</style>