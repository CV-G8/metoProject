<template>
      <div class="layer-panel numModelLayerMoveTarget">
            <div class="layer-panel-header numModelLayerDragTarget">
                <p>当前时间</p>
                <p>{{time}}</p>
                <i class="iconfont icon-guanbi1" @click="close()"></i>
            </div>
            <div class="layer-panel-body">
                <p>等值线</p>
                <div class="numModelLayer-list">
                    <div class="numModelLayer-list-item">
                        <input type="checkbox">
                        <span style="margin:0 10px">显示</span>
                        <span>数值</span>
                        <input style="width:63px;height:34px;margin-left:10px;border-radius:2px" type="text" placeholder="请输入">
                    </div>
                    <div class="numModelLayer-list-item">
                        <input type="checkbox">
                        <span style="margin:0 10px">颜色</span>
                        <input style="width:63px;height:34px;background:none" type="color">
                        <label style="margin:0 10px">
                            <input type="checkbox">
                            <span>使用调色板</span>
                        </label>
                    </div>
                    <div class="numModelLayer-list-item">
                        <label>
                            <input name="line" type="radio">实线
                        </label>
                        <label style="margin:0 30px">
                            <input name="line" type="radio">点线
                        </label>
                        <label>
                            <input name="line" type="radio">虚线
                        </label>
                    </div>
                    <div class="numModelLayer-list-item">
                        <label>
                            <input type="checkbox"><span style="margin-left:10px">标注</span>
                        </label>
                    </div>
                    <div class="numModelLayer-list-item">
                        <span style="margin:0 10px">线值</span>
                        <input style="width:235px;height:34px;border-radius:2px" type="text">
                    </div>
                </div>
                <p>颜色填充</p>
                <div class="numModelLayer-list">
                    <div class="numModelLayer-list-item">
                        <input type="checkbox">
                        <span style="margin:0 10px">显示</span>
                    </div>
                    <div class="numModelLayer-list-item">
                        <label>
                            <input name="type" type="radio">栅格显示
                        </label>
                        <label style="margin:0 30px">
                            <input name="type" type="radio">等值线显示
                        </label>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
export default {
    data(){
        return{
            time:'2021年12月23日 12:21'
        }
    },
    mounted(){
        // 拖拽
        let el = document.querySelector('.numModelLayerDragTarget')
        let Fel = document.querySelector('.numModelLayerMoveTarget')
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
            this.$parent.closeNumModel()
        }
    }
}
</script>

<style scoped>
.layer-panel{
    width: 348px;
    overflow: hidden;
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
.numModelLayerDragTarget{
    cursor: move;
}
</style>