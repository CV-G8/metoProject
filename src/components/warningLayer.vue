<template>
    <div class="warningLayer-info moveTarget">
    <!-- 预警 -->
    <div class="warningLayer-card">
        <table class="warningLayer-table">
            <thead class="dragTarget">
                <td colspan='5' style="font-size:18px;text-align:left;text-indent:10px">预警</td>
                <td style="text-align:right"><i class="iconfont icon-guanbi1" style="margin-right:10px;font-size:18px" @click="close()"></i></td>
            </thead>
            <tr class="header" style="text-align:center">
                <td>站名</td>
                <td>编号</td>
                <td>区县</td>
                <td>要素名称</td>
                <td>要素值</td>
                <td>警告级别</td> 
            </tr>
            <tr class="list" v-for="item in 10" :key="item">
                <td><div style="width:42px">阿百川</div></td>
                <td><div style="width:36px">1221</div></td>
                <td><div style="width:56px">观山湖区</div></td>
                <td><div style="width:56px">温度</div></td>
                <td><div style="width:42px">12</div></td>
                <td><div style="width:56px">2级</div></td>
            </tr>
        </table>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            name:'监测警告',
        }
    },
    mounted(){
        // 拖拽
        let el = document.querySelector('.dragTarget')
        let Fel = document.querySelector('.moveTarget')
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
        close(){
            this.$parent.closeWarningLayer()
        }
    }
}
</script>

<style scoped>
.warningLayer-info{
    width: 346px;
    background-color: #00447f44;
    margin-bottom: 2px;
    position: absolute;
    left: 10px;
}
.warningLayer-table{
    width: 100%;
    background-color: #00517F;
    border-collapse:collapse;
}
.warningLayer-table thead{
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    height:37px;
}
.warningLayer-table td{
    border: none;
    padding: 5px 0;
}
.warningLayer-table .list td div{
    height: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #44D7B6 ;
    text-align: center ;
}
.dragTarget{
    cursor: move;
}
</style>