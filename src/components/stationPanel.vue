<template>
  <div  style="position:absolute;width:100%;overflow:auto">
      <div class="station-info">
        <div class="station-card" v-for="(item,index) in stationData" :key="index">
            <div class="station-card-header">
                <div style="display:flex;align-items: center;">
                    <input type="checkbox" style="margin-right:10px" v-model="item.select" @change="chooseSelect(item);entitiesShow()">
                    <p>{{item.name}}</p>
                </div>
                <i class="iconfont icon-arrow expand" style="transition:all 0.3s ease-in-out;cursor:pointer;color:#18EAF3" @click="selectAnimation()"></i>
            </div>
            <div class="station-card-body" v-for="(item1,index1) in item.list" :key="index1">
                <div style="display:flex;align-items:center;cursor:pointer" @dblclick="turnPos(item1.Code)">
                    <i class='iconfont icon-zhandian1' style="margin-right:10px;color:#E9C46A"></i>
                    <p style="padding:0;margin:0">{{item1.Name}}</p>
                </div>
                <input type="checkbox" v-model="item1.select" @change="singSelect(item,item1);entitiesShow()">
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import stationDataJson from '../../public/json/radar.json'

export default {
    data(){
        return{
            name:'三维网格',
            num:'',
            // 站点数据
            stationData:[],
        }
    },
    mounted(){
        this.InitializeHeight()
        this.$parent.sendCesium()
    },
    methods:{
        // 初始化高度--处理下拉动画第一帧没有动画效果的问题
        InitializeHeight(){
            let el = document.querySelectorAll('.station-card')
            let long = 0
            el.forEach(item=>{
                if(item.children[0].children[1].classList.contains('expand')){
                    long = 0
                    item.childNodes.forEach((item)=>{
                        if (item.nodeName === "DIV") {
                            long += item.offsetHeight
                        }
                    })
                    item.style.height = long + 'px'
                } else {
                    item.style.height = el.children[0].offsetHeight + 'px'
                }
            })
        },
        // 下拉动画
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
        // 全选多选
        chooseSelect(target){
            if(target.select==true){
                target.list.forEach(item=>{
                    item.select =true
                })
            } else {
                target.list.forEach(item=>{
                    item.select = false
                })
            }
        },
        singSelect(Ftarget,Ctarget){
            let length = Ftarget.list.length
            let num = 0
            if(Ctarget.select==false) Ftarget.select=false
            else {
                Ftarget.list.forEach(item=>{
                    if(item.select == true) num += 1
                    else return
                })
                if (length==num) Ftarget.select=true
                else Ftarget.select=false
            }
        },
        // 获取json数据
        setData (json,name){
            let arr = []
            let obj = {}
            this.stationData = []
            Object.keys(json).forEach(item=>{
                if(json[item].Province == '贵州'){
                    obj[item] = Object.assign({},json[item])
                    obj[item].select = true
                    arr.push(obj[item])
                }
            })
            obj.name = name
            obj.select = true
            obj.list = arr
            this.stationData.push(obj)
        },
        dealJson(){
            // 构建数据格式
            this.setData(stationDataJson,'雷达站')
            this.makeEntity()
        },
        // 使用entity构建站点数据
        getCesium(earth){
            if(earth){
                this.earth = earth
                this.dealJson()
            }
        },
        // 双击跳转到该点位置
        makeEntity(){
            // 站点标签
            // this.stationData[0].list.forEach(item=>{
            //     this.earth.viewer.entities.add({
            //         position:Cesium.Cartesian3.fromDegrees(item.Longitude,item.Latitude),
            //         id:item.Code,
            //         label:{
            //             text: item.Name,
            //             font: '12pt monospace',
            //             pixelOffset: new Cesium.Cartesian2(0, -30),
            //             showBackground:true,
            //             backgroundColor:new Cesium.Color('#0C96E4',0.5),
            //             // scaleByDistance:new Cesium.NearFarScalar ( 0 , 1 , 0.1 , 2e6 ),
            //             distanceDisplayCondition:new Cesium.DistanceDisplayCondition(0.0, 2e6),
            //             heightReference:Cesium.CLAMP_TO_GROUND,
            //         },
            //         billboard:{
            //             image:'./assets/imgs/radar.png',
            //             width:20,
            //             height:20,
            //             distanceDisplayCondition:new Cesium.DistanceDisplayCondition(0.0, 2e6),
            //             heightReference:Cesium.CLAMP_TO_GROUND,
            //         }
            //     })
            // })
        },
        // 双击跳转
        turnPos(entity){
            // let target = this.earth.viewer.entities.getById(entity)
            // this.earth.viewer.flyTo(target)
        },
        // 选中取消显示和隐藏entity
        entitiesShow(){
            this.stationData[0].list.forEach((item)=>{
                if(item.select ==false){
                    this.earth.viewer.entities.getById(item.Code).show = false
                } else{
                    this.earth.viewer.entities.getById(item.Code).show = true
                }
            })
        }
    }
}
</script>

<style scoped>
.station-info{
    width: calc(100% - 58px);
    height: calc(100% -42px);
    margin-left: 29px;
    background-color: #00447f44;
    margin-bottom: 2px;
}
.station-info:first-child{
    margin-top: 22px;
}
.station-info .station-card-header{
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    display:flex;
    justify-content: space-between;
    align-items: center;
    height:37px;
    padding: 10px 29px 10px 29px;
    box-sizing: border-box;
}
.station-info .station-card-body{
    display:flex;
    justify-content: space-between;
    align-items: center;
    height:57px;
    padding: 10px 29px 10px 29px;
    box-sizing: border-box;
}

.station-info .station-card{
    width: 100%;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
}
.station-info{
    width: calc(100% - 58px);
    height: calc(100% -42px);
    margin-left: 29px;
    background-color: #00447f44;
    margin-bottom: 2px;
}
.station-info:first-child{
    margin-top: 22px;
}
.station-info .station-card-header{
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    display:flex;
    justify-content: space-between;
    align-items: center;
    height:37px;
    padding: 10px 29px 10px 29px;
    box-sizing: border-box;
}
.station-info .station-card-body{
    display:flex;
    justify-content: space-between;
    align-items: center;
    height:40px;
    padding: 10px 29px 10px 29px;
    box-sizing: border-box;
}
.station-info .station-card-body:hover{
    background-color: #00447f;
}

.station-info .station-card{
    width: 100%;
}

.expand{
    transform: rotateZ(90deg);
    transition: all 0.3s ease-in-out;
}

</style>