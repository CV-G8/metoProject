<template>
  <div  style="position:absolute;width:100%;overflow:auto">
      <div class="detectionWarning-info">
        <div class="detectionWarning-card">
            <div class="detectionWarning-card-header">
                <div style="display:flex;align-items: center;">
                    <p>{{name}}</p>
                </div>
                <!-- <i class="iconfont icon-arrow"></i> -->
            </div>
            <div class="detectionWarning-card-body">
                <span>要素</span>
                <div style="display:flex;align-items:center">
                    <select style="width:170px;height:34px;background-color:#286989;color:#fff;border:none;text-indent:1em">
                        <option value="请选择">请选择123</option>
                    </select>
                </div>
            </div>
            <div class="detectionWarning-card-body">
                <span>警告级别</span>
                <div style="display:flex;align-items:center">
                    <select style="width:170px;height:34px;background-color:#286989;color:#fff;border:none;text-indent:1em">
                        <option value="请选择">请选择123</option>
                    </select>
                </div>
            </div>
            <div class="detectionWarning-card-body">
                <span>输入阈值</span>
                <div style="display:flex;align-items:center">
                    <select style="width:170px;height:34px;background-color:#286989;color:#fff;border:none;text-indent:1em">
                        <option value="请选择">请选择123</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- 预警 -->
        <div class="detectionWarning-card">
            <table class="detectionWarning-table">
                <thead>
                    <td colspan='6' style="font-size:18px;text-align:left;">预警</td>
                </thead>
                <tr class="header" style="text-align:center">
                    <td>站名</td>
                    <td>编号</td>
                    <td>区县</td>
                    <td>要素名称</td>
                    <td>要素值</td>
                    <td>警告级别</td> 
                </tr>
                <tr class="list" v-for="item in 5" :key="item">
                    <td title="三维网格"><div style="width:42px">阿百川</div></td>
                    <td><div style="width:36px">12</div></td>
                    <td><div style="width:56px">观山湖区</div></td>
                    <td><div style="width:56px">温度</div></td>
                    <td><div style="width:42px">12</div></td>
                    <td><div style="width:56px">2级</div></td>
                </tr>
            </table>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            name:'监测警告',
        }
    }
}
</script>

<style scoped>
.detectionWarning-info{
    width: calc(100% - 20px);
    height: calc(100% -42px);
    margin-left: 10px;
    background-color: #00447f44;
    margin-bottom: 2px;
    overflow: hidden;
}
.detectionWarning-info:first-child{
    margin-top: 22px;
}
.detectionWarning-info .detectionWarning-card{
    width: 100%;
}
.detectionWarning-info .detectionWarning-card-header{
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    display:flex;
    justify-content: space-between;
    align-items: center;
    height:37px;
    padding: 10px;
    box-sizing: border-box;
}


.detectionWarning-card-body{
    height:37px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
}
.detectionWarning-card-body span{
    width: 100px;
    text-align: right;
    margin-right: 15px;
    flex-shrink: 0;
}

.detectionWarning-table{
    width: 100%;
    background-color: #00517F;
    margin-top: 30px;
}
.detectionWarning-table thead{
    background-image: linear-gradient(to right,#02D4FA ,#005763);
    height:37px;
}
.detectionWarning-table td{
    border: none;
    padding: 5px 0;
}
.detectionWarning-table .list td div{
    height: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #44D7B6 ;
    text-align: center ;
}
</style>