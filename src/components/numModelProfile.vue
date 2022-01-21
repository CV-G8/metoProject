<template>
    <div class="layer-panel numModelProfileMoveTarget">
          <div class="layer-panel-header numModelProfileDragTarget">
              <p>数字模式-垂直剖面图</p>
              <i class="iconfont icon-guanbi1" @click="close()"></i>
          </div>
          <div class="layer-panel-body">
            <canvas id="canvas" width="640px" height="320px"></canvas>
          </div>
      </div>
</template>

<script>
export default {
  data(){
    return{
      // 横轴纵轴数据
      xAxies:['10','20','30','40','50','60','70','80','90','100','110','120','130','140','150'],
      yAxies:['200hpa','400hpa','600hpa','800hpa','1000hpa','2000hpa','3000hpa'],
      // 主表数据
      mainTable:[]
    }
  },
  mounted(){
    // 拖拽
        let el = document.querySelector('.numModelProfileDragTarget')
        let Fel = document.querySelector('.numModelProfileMoveTarget')
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
    this.drawProfile()
  },
  methods:{
    drawProfile(){
      let canvas = document.querySelector('#canvas')
      let ctx = canvas.getContext('2d')
      // 画y轴
      for(let i=0;i<this.yAxies.length;i++){
        ctx.fillStyle= '#379bff34'
        ctx.fillRect(0,i * 33,38,32)
        ctx.beginPath()
        ctx.font='8px Verdana'
        ctx.strokeStyle= '#44D7B6 '
        ctx.strokeText(this.yAxies[i],2,i * 33 + 16)
      }
      // 画主表
      for(let i=1;i<=this.xAxies.length;i++){
        for(let j=0;j<this.yAxies.length;j++){
          ctx.fillStyle= '#379bff34'
          ctx.fillRect(i*39,j * 33,38,32)
        }
      }
      // 画x轴
      for(let i=1;i<=this.xAxies.length;i++){
        ctx.font='11px Verdana'
        ctx.strokeStyle= '#fff'
        ctx.strokeText(this.xAxies[i-1],i*39+10,250)
      }
      // 色标
      ctx.beginPath()
      ctx.font='11px Verdana'
      ctx.strokeStyle= '#fff'
      ctx.strokeText(0,300,280)
      ctx.beginPath()
      ctx.font='11px Verdana'
      ctx.strokeStyle= '#fff'
      ctx.strokeText(33,346,280)
      let gradient = ctx.createLinearGradient(300,290,358,307)
      gradient.addColorStop('0','#F5CC52')
      gradient.addColorStop('1','#AE0A0A ')
      ctx.fillStyle = gradient
      ctx.fillRect(300,290,58,17)
    },
    close(){
      this.$parent.closeNumModelProfile()
    }
  }
}
</script>

<style scoped>
.numModelProfileDragTarget{
    cursor: move;
}
.layer-panel{
    width: 676px;
    height: 386px;
    border-radius: 4px;
    overflow: hidden;
    position: absolute;
    background-color: #00517F;
    bottom: 300px;
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
  padding: 20px 0px 0px 20px;
  box-sizing: border-box;
}
</style>