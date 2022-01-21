<template>
    <div class="layer-panel cloudLayerMoveTarget">
        <div class="layer-panel-header cloudLayerDragTarget">
            <p>图层</p>
            <i class="iconfont icon-guanbi1" @click="close()"></i>
        </div>
        <div class="layer-panel-body" v-for="(item,index) in list" :key="index" :class="{openEyes:!item.isOpenEyes}">
            <p>{{item.name}}</p>
            <div>
            <i class="iconfont icon-zhengyan" v-show="item.isOpenEyes" @click="item.isOpenEyes=false"></i>
            <i class="iconfont icon-biyan" v-show="!item.isOpenEyes" @click="item.isOpenEyes=true"></i>
            <i class="iconfont icon-shanchu1" @click="deleteLayer(index)"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list:[
                {
                    name:'图层一',
                    isOpenEyes:true
                },
                {
                    name:'图层二',
                    isOpenEyes:true
                },
                {
                    name:'图层三',
                    isOpenEyes:false
                },
                {
                    name:'图层四',
                    isOpenEyes:true
                }
            ]
        }
    },
    mounted(){
        // 拖拽
        let el = document.querySelector('.cloudLayerDragTarget')
        let Fel = document.querySelector('.cloudLayerMoveTarget')
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
    },
    methods:{
        // 关闭图层
        close(){
            this.$parent.closeCloud()
        },
        // 删除图层
        deleteLayer(tar){
            this.list.forEach((item,index)=>{
                if(index === tar){
                    this.list.splice(index,1)
                }
            })
        }
    }
}
</script>

<style scoped>
.cloudLayerDragTarget{
    cursor: move;
}
.layer-panel{
    width: 258px;
    height: 210px;
    border-radius: 4px;
    overflow: hidden;
    position: absolute;
    background-color: #00517F;
    left: 10px;
}
.layer-panel .layer-panel-header{
    height: 50px;
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
.layer-panel .layer-panel-body{
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
.layer-panel .layer-panel-body .iconfont{
    font-size: 20px;
    margin-left: 10px;
}
</style>