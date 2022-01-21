<template>
  <div  style="position:absolute;width:100%;overflow:auto">
      <div class="numericalModel-info">
        <div class="numericalModel-card">
            <div class="numericalModel-card-header">
                <div style="display:flex;align-items: center;">
                    <p>{{name}}</p>
                </div>
                <i class="iconfont icon-arrow expand" style="transition:all 0.3s ease-in-out;cursor:pointer;color:#18EAF3" @click="selectAnimation()"></i>
            </div>
            <div class="numericalModel-card-body">
                <div class="bounding-box">
                    <span>垂直分布展示</span>
                    <div style="flex:1;display:flex">
                        <select style="width:130px;height:34px;border:none;background-color:#286989 ">
                            <option value="剖面" selected>剖面</option>
                        </select>
                        <div class="button1" style="cursor:pointer" @click="turnNumModel()">跳转</div>
                    </div>
                </div>
                <!-- <div class="bounding-box">
                    <span>选择时间</span>
                    <div class="bounding-box-date">
                        <i class="iconfont icon-rili"></i>
                        <p style="margin-left:5px">开始时间</p>
                        <p style="margin:0 10px;color:#fff">至</p>
                        <p>结束时间</p>
                    </div>
                </div> -->
                <!-- <div class="bounding-box">
                    <span></span>
                    <div style="flex:1">
                        <div class="button2">获取文件</div>
                    </div>
                </div> -->
                <!-- <div class="bounding-box">
                    <span>预报时间</span>
                    <div style="flex:1;display:flex;position:relative">
                        <i class="iconfont icon-rili" style="position:absolute;left:10px;top:10px"></i>
                        <select style="width:183px;height:34px;border:none;background-color:#286989;text-indent:30px">
                            <option value="请选择" selected>请选择</option>
                        </select>
                    </div>
                </div> -->
                <!-- 要素 -->
                <div class="bounding-box">
                    <span>要素</span>
                    <div style="flex:1;display:flex;">
                        <select v-model="numbericalModelELE.Layer.selectValue" 
                        @change="ecLayer.element = numbericalModelELE.Layer.selectValue;updateTimeColor()" 
                        style="width:183px;height:34px;border:none;background-color:#286989;">
                            <option v-for="(item,index) in numbericalModelELE.Layer.element" :key="index" 
                            :value="item.value">{{item.text}}</option>
                        </select>
                    </div>
                </div>
                <!-- <div class="bounding-box">
                    <span>预报层次</span>
                    <div style="flex:1;display:flex;">
                        <select v-model="numbericalModelELE.Layer.leveValue" 
                        @change="ecLayer.level = numbericalModelELE.Layer.leveValue;updateTimeColor()" 
                        style="width:183px;height:34px;border:none;background-color:#286989;">
                            <option  v-for="(item,index) in numbericalModelELE.Layer.level" :key="index" 
                            :value="item.value">{{item.text}}</option>
                        </select>
                    </div>
                </div> -->
                <div class="bounding-box">
                    <span>层次</span>
                    <div style="flex:1;display:flex;">
                        <select v-model="numbericalModelELE.Layer.leveValue" 
                        @change="dataBox.visibleLevelId = numbericalModelELE.Layer.leveValue;updateTimeColor()" 
                        style="width:183px;height:34px;border:none;background-color:#286989;">
                            <option  v-for="(item,index) in dataBox.levelIds" :key="index+item" 
                            :value="item.value">{{item.label}}</option>
                        </select>
                    </div>
                </div>
                <!-- 是否显示 -->
                <!-- <div class="bounding-box" v-for="(item,index) in numbericalModelELE.Layer.isShow" :key="'num'+index">
                    <span>{{item.text}}</span>
                    <div style="display:flex;flex:1;align-items:center;">
                        <label style="margin-right:20px">
                            <input type="radio" v-model="item.value" :id="item.text" :value="true"
                            @change="ecLayer[item.type] = item.value">是</label>
                        <label>
                            <input type="radio" v-model="item.value" :id="item.text" :value="false" 
                            @change="ecLayer[item.type] = item.value">否</label>
                    </div>
                </div>
                <div class="bounding-box">
                    <span>透明度</span>
                    <div style="flex:1;display:flex;position:relative" class="bounding-box-process">
                        <el-slider v-model="value1" show-input :max="15" :min="1"></el-slider>
                    </div>
                </div>
                <div class="bounding-box">
                    <span>垂直剖面图</span>
                    <div style="flex:1">
                        <input type="checkbox">
                    </div>
                </div> -->
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import DataBox from '@mesh-3d/weather-dv/src/DataBox'
import  {filterData,interpDataset} from '@mesh-3d/weather-dv/src/SurfCalc'

export default {
    data(){
        return{
            earth:undefined,
            value1:10,
            name:'数值模式',
            element:'TMP',
            level:850,
            ecLayer:undefined,
            showIsoLine:true,
            fill:true,
            cityLayer:undefined,
            clipperLayer:undefined,

            numbericalModelELE:undefined,
            // 该图层在总图层的位置索引
            index:undefined,
            dataBox:{levelIds:''}
        }
    },
    created(){
        this.numbericalModelELE = ElementChoose.numbericalModel
    },
    mounted(){
        this.InitializeHeight()
        this.$parent.sendCesium()
    },
    methods:{
        // 跳转到数字模式剖切页面
        turnNumModel(){
            this.$router.push({ path: '/numModel'});
        },
        getCesium(earth,clipperLayer){
            if(earth){
                this.earth = earth
                this.clipperLayer = clipperLayer
                if(this.ecLayer==undefined) this.numModel()
            }
        },
        // 初始化高度
        InitializeHeight(){
            let el = document.querySelectorAll('.numericalModel-card')
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
        // 数值模式填图
        numModel(){
//             this.ecLayer = new MicapsECLayer(hfsLoader)
//             var earth=this.earth;
//             var localScene=earth.addLocalScene({})

//             var maxH = 100000;
//             var numLevel = 10;
//             var dH = maxH / numLevel;
//             var bbox= [
//                 108.52284055410892,
//                 27.642245321364133,
//                 108.85578708890267,
//                 28.106139815822313
//             ]

//             var levels = [];
//             for (let i = 0; i < numLevel; i++) {
//                 levels.push({
//                     height: dH * (i + 0.25)
//                 })
//             }

//             var dataBox = new DataBox({
//                 rectangle: bbox,
//                 levels: levels,
//                 upAxis: 'y',
//                 boxHeight: maxH + dH * 0.25,
//                 granularity: 0.05,
//                 lineColor: 'lightblue'//'rgb(10,13,44)'
//             })
//             localScene.add(dataBox.root)

//             earth.flyTo(dataBox)

//             earth.onHomeClick.addEventListener(e => {
//                 earth.flyTo(dataBox)
//                 e.cancel = true
//             })


// var imageGeneratorTEM = new MeteoLib.RasterImageGenerator({
//     name: 'TEM',
//     colorMap: [
//         [-66666666, -30, [0, 0, 255, 255], '<-30'],
//         [-30, -28, [0, 20, 255, 255], '-30~-28'],
//         [-28, -24, [0, 70, 255, 255], '-28~-24'],
//         [-24, -22, [0, 100, 255, 255], '-24~-22'],
//         [-22, -20, [0, 170, 255, 255], '-22~-20'],
//         [-20, -18, [0, 200, 255, 255], '-20~-18'],
//         [-18, -16, [0, 230, 255, 255], '-18~-16'],
//         [-16, -14, [0, 255, 245, 255], '-16~-14'],
//         [-14, -12, [0, 255, 215, 255], '-14~-12'],
//         [-12, -10, [0, 255, 175, 255], '-12~-10'],
//         [-10, -8, [0, 255, 145, 255], '-10~-8'],
//         [-8, -6, [0, 255, 110, 255], '-8~-6'],
//         [-6, -4, [0, 255, 80, 255], '-6~-4'],
//         [-4, -2, [0, 255, 45, 255], '-4~-2'],
//         [-2, 0, [0, 255, 15, 255], '-2~0'],
//         [0, 2, [20, 255, 0, 255], '0~2'],
//         [2, 4, [50, 255, 0, 255], '2~4'],
//         [4, 6, [90, 255, 0, 255], '4~6'],
//         [6, 8, [120, 255, 0, 255], '6~8'],
//         [8, 10, [155, 255, 0, 255], '8~10'],
//         [10, 12, [185, 255, 0, 255], '10~ 12'],
//         [12, 14, [220, 255, 0, 255], '12~14'],
//         [14, 16, [255, 255, 0, 255], '14~16'],
//         [16, 18, [255, 225, 0, 255], '16~ 18'],
//         [18, 20, [255, 195, 0, 255], '18~20'],
//         [20, 22, [255, 160, 0, 255], '20~ 22'],
//         [22, 24, [255, 130, 0, 255], '20~ 22'],
//         [24, 26, [255, 100, 0, 255], '24~ 26'],
//         [26, 28, [255, 65, 0, 255], '26~ 28'],
//         [28, 30, [255, 45, 0, 255], '28~ 30'],
//         [30, 33, [255, 37, 0, 255], '30~ 33'],
//         [33, 35, [255, 20, 0, 255], '33~35'],
//         [35, 666666666, [255, 0, 0, 255], '35>']
//     ]
// })
//             hfsLoader.readFile({
//                 dir:'GZData',
//                 path:'SURF',
//                 fileName:'SURF_CHN_MUL_HOR/surf_20201030050000.json'
//             },{
//                 responseType:'json'
//             }).then(res=>{
//                     //过滤数据
//                     var ds = filterData(res.DS, bbox)
//                     //散点插值
//                     interpDataset(ds, 'TEM', bbox, 256, 256).then(dataArray => {
//                         //绘制色斑图
//                         var img = imageGeneratorTEM.generate(dataArray, 256, 256)
//                         dataBox.levels.forEach(level => {
//                             level.setImage(img)
//                         })
//                     })
//             })

//             this.dataBox=dataBox;

//             this.$parent.layerList.add({name:'数值模式',value:this.ecLayer,isOpenEyes:true})
//             this.$parent.layerList.forEach((item,index)=>{
//                 if(item.name == '数值模式'){
//                     this.index = index
//                 }
//             }) 

            this.ecLayer =  new MicapsECLayer(hfsLoader)
//    return
            console.log(this.clipperLayer)
            this.ecLayer.clipperLayer=this.clipperLayer
            this.ecLayer.load(this.earth).then(() => {
                this.ecLayer.currentTime = this.ecLayer.timeList[0]
                this.$parent.layerList.add({name:'数值模式',value:this.ecLayer,isOpenEyes:true})
                this.$parent.layerList.forEach((item,index)=>{
                    if(item.name == '数值模式'){
                        this.index = index
                    }
                })
            }) 
        },
        // 要素变化时更新时间轴和colormap
        updateTimeColor(){
            this.$parent.conTime(this.ecLayer,this.index)
        }
    }
}
</script>

<style scoped>
.expand{
    transform: rotateZ(90deg);
    transition: all 0.3s ease-in-out;
}
.numericalModel-info{
    width: calc(100% - 20px);
    height: calc(100% -42px);
    margin-left: 10px;
    background-color: #00447f44;
    margin-bottom: 2px;
}
.numericalModel-info .numericalModel-card{
    width: 100%;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
}
.numericalModel-info .numericalModel-card-header{
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    display:flex;
    justify-content: space-between;
    align-items: center;
    height:37px;
    padding: 10px 29px 10px 29px;
    box-sizing: border-box;
}
.numericalModel-info:first-child{
    margin-top: 22px;
}
.numericalModel-info .numericalModel-card-header{
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    display:flex;
    justify-content: space-between;
    align-items: center;
    height:37px;
    padding: 10px 20px 10px 10px;
    box-sizing: border-box;
}
.numericalModel-info .numericalModel-card-body{
    width: 100%;
    overflow: hidden;
}
.numericalModel-info .numericalModel-card-body .bounding-box{
    display: flex;
    height: 34px;
    width: 320px;
    align-items: center;
    margin: 10px 0;
    overflow: hidden;
}
.numericalModel-info .numericalModel-card-body .bounding-box>span{
    width: 100px;
    text-align: right;
    margin-right: 15px;
}
.numericalModel-info .numericalModel-card-body .bounding-box .button1{
    width: 48px;
    height: 34px;
    text-align: center;
    background-color: #18EAF3;
    line-height: 34px;
    border-radius: 2px;
    margin-left: 4px;
}
.numericalModel-info .numericalModel-card-body .bounding-box .button2{
    width: 183px;
    height: 34px;
    text-align: center;
    background-color: #18EAF3;
    line-height: 34px;
    border-radius: 2px;
}
.numericalModel-info .numericalModel-card-body .bounding-box select{
    color: rgba(255, 255, 255, 0.438);
}
.numericalModel-info .numericalModel-card-body .bounding-box .bounding-box-date{
    display:flex;
    color:rgba(255, 255, 255, 0.507);
    align-items:center;
    font-size:14px;
    width: 183px;
    background-color:#286989;
    justify-content: center;
}
.numericalModel-info .numericalModel-card-body .bounding-box .bounding-box-process>p{
    width: 135px;
    height: 2px;
    border-radius: 1px;
    background-color: #02D4FA;
}
.numericalModel-info .numericalModel-card-body .bounding-box .bounding-box-process>input{
    width: 40px;
    height: 34px;
    border-radius: 1px;
    background-color: #00447F ;
    border: none;
    margin-left: 5px;
    color: #fff;
    text-align: center;
    outline: none;
}
</style>