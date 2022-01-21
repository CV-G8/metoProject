<template>
    <div class="layer-panel gisLayerMoveTarget">
        <div class="layer-panel-header gisLayerDragTarget">
            <p>当前时间</p>
            <p>地形剖面分析</p>
            <i class="iconfont icon-guanbi1" @click="close()" style="cursor:pointer"></i>
        </div>
        <div class="layer-panel-body">
            <p style="padding:10px 0">参数设置</p>
            <div class="numModelLayer-list">
                <div class="numModelLayer-list-item">
                    <span style="margin:0 10px">采样间距</span>
                    <input style="width:183px;border-radius:2px;height:34px;margin:0 10px" type="text" placeholder="请输入" v-model="interval">
                    <p style="margin:0 10px">连续分析</p>
                    <label>
                        <input @change="gisEnd()" name="line" type="radio" :value='true' v-model="continuousAnalysis">是
                    </label>
                    <label style="margin:0 20px">
                        <input @change="gisEnd()" name="line" type="radio" :value='false' v-model="continuousAnalysis">否
                    </label>
                    <div style="position:relative;width:86px;line-height:34px;background:#00517F;color:#18EAF3;text-align:center;border:1px solid #18EAF3;margin:0 10px"
                     @click="gisCutting();num=0" :style="{background:(num==0?'#18EAF3':'#00517F'),color:(num==0?'#fff':'#18EAF3')}">开始
                     <p style="position:absolute;top:-1px;left:-1px;height:100%;background:#909090;border:1px solid #909090;opacity:.7"
                     :style="{width:cutProcess+'%',display:cutProcess==100 ||cutProcess==0?'none':'block'}"></p></div>
                    <p style="width:86px;line-height:34px;background:#00517F;color:#18EAF3;text-align:center;border:1px solid #18EAF3"
                     @click="gisEnd();num=1" :style="{background:(num==1?'#18EAF3':'#00517F'),color:(num==1?'#fff':'#18EAF3')}">结束</p>
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 20px">
                <div>起点&emsp;:&emsp;{{start}} </div>
                <div>终点&emsp;:&emsp;{{stop}}</div>
            </div>
            <div class="numModelLayer-list">
                <div style="position:relative">
                    <div id="echarts" style="width:695px;height:211px;"></div>
                    <p style="position:absolute;top:10px;left:20px">{{unitY}}</p>
                    <p style="position:absolute;bottom:-11px;right:0px">{{unitX}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data(){
        return{
            num:'',
            interval:64,
            intervalX:0,
            earth:undefined,
            start:'',
            stop:'',
            unitX:'',
            unitY:'',
            continuousAnalysis:true,
            echartsDateX:[100,200,100,200,300],
            echartsDateY:[100,200,100,200,300],
            myChart:undefined,
            cutProcess:0,
            option:undefined

        }
    },
    mounted(){
        this.$parent.sendCesium()
        // 拖拽
        let el = document.querySelector('.gisLayerDragTarget')
        let Fel = document.querySelector('.gisLayerMoveTarget')
        el.onmousedown = function(e){
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
        // 
        this.myChart = echarts.init(document.getElementById('echarts'));
        this.drawEcharts()
    },
    methods:{
        drawEcharts(){
            // 指定图表的配置项和数据
            this.option = {
                textStyle:{
                    color:'#fff'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: this.echartsDateX,
                        axisLabel:{
                            interval:this.intervalX
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            width: 0
                        },
                        showSymbol: false,
                        areaStyle: {
                            opacity: 0.8,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgba(128, 255, 165)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(1, 191, 236)'
                                }
                            ])
                        },
                        data: this.echartsDateY
                    },
                ]
            }
            this.myChart.setOption(this.option,true)
        },
        close(){
            this.$parent.gisLayerShow = false
        },
        getCesium(earth){
            this.earth = earth
        },
        // 剖切
        Analysis(terrain){
            let that = this
            this.echartsDateX = []
            this.echartsDateY = []
            getLine(this.earth.viewer,(line, lineEntities)=>{
                lineSample(line,terrain,{
                    interval:this.interval,
                    onProgress(progress) {
                        that.cutProcess = progress
                    },
                }).then((res)=>{
                    console.log(res)
                    for(let i=0;i<res.distances.length;i++){
                        this.echartsDateX.push(Math.floor(res.distances[i]))
                        this.echartsDateY.push(Math.floor(res.values[i]))
                    }

                    this.start = Math.floor(res.start.longitude) +','+ Math.floor(res.start.latitude)
                    this.stop = Math.floor(res.stop.longitude) +','+ Math.floor(res.stop.latitude)
                    this.unitX = 'X/M'
                    this.unitY = 'Y/M'

                    
                    this.intervalX = Math.floor(res.values.length/10)

                    this.drawEcharts()
                    if(this.continuousAnalysis && this.cutProcess==100) this.gisCutting()
                    else return
                })
            })
        },
        gisCutting(){
            let ready = this.earth.scene.terrainProvider.ready
            console.log(this.earth.scene.terrainProvider)
            if(ready){
                this.Analysis(this.earth.scene.terrainProvider)
            } else {
                this.earth.scene.terrainProvider.readyPromise.then(()=>{
                this.Analysis(this.$parent.terrain)
                })
            }
        },
        // 结束剖切
        gisEnd(){
            this.earth.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },
    }
}
</script>

<style scoped>
.gisLayerDragTarget{
    cursor: move;
}
p{
    margin: 0;
    padding: 0;
}
 .layer-panel{
    width: 724px;
    border-radius: 4px;
    overflow: hidden;
    position: absolute;
    background-color: #00517F;
    left: 10px;
    padding-bottom: 10px;
}
 .layer-panel .layer-panel-header{
    height: 39px;
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
 .layer-panel .layer-panel-body{
    padding: 0 10px;
}
 .layer-panel .numModelLayer-list{
    background-color: #0F5B86;
    padding: 10px;
    border-radius: 4px;
}
 .layer-panel .numModelLayer-list-item{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
 .layer-panel .numModelLayer-list-item input{
    border: none;
    text-align: center;
}
 .layer-panel .numModelLayer-list-item label{
    display: flex;
    align-items: center;
    cursor: pointer;
}
</style>