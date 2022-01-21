<template>
  <div style="position: relative; width: 100%; height: 100%; overflow: hidden">
    <div id="numModelPage" style="width: 100%; height: 100%"></div>
    <div
      style="
        position: absolute;
        width: 100%;
        top: 99px;
        z-index: 10;
        width: 300px;
        color: #fff;
      "
    >
      <div class="numericalModel-info">
        <div class="numericalModel-card">
          <div class="numericalModel-card-header">
            <div style="display: flex; align-items: center">
              <p>{{ name }}</p>
            </div>
          </div>
          <div class="numericalModel-card-body">
            <!-- 要素 -->
            <div class="bounding-box">
              <span>要素</span>
              <div style="flex: 1; display: flex">
                <select
                  v-model="numbericalModelELE.Layer.selectValue"
                  @change="ecLayer.element = numbericalModelELE.Layer.selectValue;drawColorMap()"
                  style="
                    width: 153px;
                    height: 34px;
                    border: none;
                    background-color: #286989;
                  "
                >
                  <option
                    v-for="(item, index) in numbericalModelELE.Layer.element"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
              </div>
            </div>
            <div class="bounding-box">
              <span>层次</span>
              <div style="flex: 1; display: flex">
                <select
                  v-model="numbericalModelELE.Layer.leveValue"
                  @change="
                    dataBox.visibleLevelId = numbericalModelELE.Layer.leveValue;
                  "
                  style="
                    width: 153px;
                    height: 34px;
                    border: none;
                    background-color: #286989;
                  "
                >
                  <option
                    v-for="(item, index) in dataBox.levelIds"
                    :key="index + item"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </option>
                </select>
              </div>
            </div>
            <div class="bounding-box">
              <span>叠加云图</span>
              <div style="flex: 1; display: flex">
                <input type="checkbox" v-model="sateLayerIsShow" @change="sateLayer.show=sateLayerIsShow">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- billboard -->
    <div class="headerBanner">
      <p class="header-text">铜仁市梵净山保护区梯度气象监测系统</p>
    </div>
    <div class="billboardBox">
      <div
        class="billboard"
        v-for="(item, index) in billboard"
        :key="index"
        :class="{ selectBillboard: index === num }"
        @click="showAsideLeft(index)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 指南针 -->
    <div
      class="compass"
      :style="{
        transform: 'rotate(-' + heading + 'rad)',
        '-webkit-transform': 'rotate(-' + heading + 'rad)',
        '-moz-transform': 'rotate(-' + heading + 'rad)',
      }"
    >
      <p style="padding-bottom: 20px; color: #fff">N</p>
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
    <!-- 时间轴 -->
    <div class="aside-right-footer" v-if="timeLineIsShow">
      <div class="timeRange" @click.self="timeChooseShow = !timeChooseShow">
        时间范围
        <div class="timeChoose" v-show="timeChooseShow">
          <div
            style="
              text-align: left;
              display: flex;
              justify-content: space-between;
            "
          >
            选择时间范围
            <i
              class="iconfont icon-guanbi1"
              style="padding-right: 10px; cursor: pointer"
              @click="timeChooseShow = false"
            ></i>
          </div>
          <el-date-picker
            prefix-icon="el-icon-date"
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="getTimeRange(value1)"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="timeLine">
        <div
          style="
            position: absolute;
            color: #fff;
            z-index: 30;
            top: -32px;
            width: 180px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: rgb(41, 128, 185);
          "
        >
          日期：{{ yearDate }}
        </div>
        <div class="timeBackMask">
          <div class="timeBack">
            <div
              class="text"
              @click="
                value2 = index;
                updateTime(value2);
              "
              :style="{
                backgroundColor:
                  index >= insert && index < colorShowIndex + insert
                    ? '#2980b9'
                    : '',
              }"
              v-for="(item, index) in timeLineData"
              :key="index"
              style="cursor: pointer"
            >
              <p>{{ item }}</p>
              <p class="line"></p>
            </div>
            <!-- 进度条 -->
            <el-slider
              v-model="value2"
              @change="updateTime(value2)"
              :max="maxProcessNum"
              :show-tooltip="false"
            ></el-slider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataBox from "@mesh-3d/weather-dv/src/DataBox";
import { filterData, interpDataset } from "@mesh-3d/weather-dv/src/SurfCalc";

export default {
  data() {
    return {
      sateLayerIsShow:false,
      earth: undefined,
      value1: 10,
      name: "数值模式",
      element: "TMP",
      level: 850,
      ecLayer: undefined,
      showIsoLine: true,
      fill: true,
      cityLayer: undefined,
      clipperLayer: undefined,

      numbericalModelELE: undefined,
      // 该图层在总图层的位置索引
      index: undefined,
      dataBox: { levelIds: "" },
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
      num: "",
      // 时间轴
      yearDate: "",
      earth: undefined,
      timeLineIsShow: true,
      // 指南针
      heading: 0,
      timeChooseShow: false,
      value1: 0,
      timeLineData: [],
      maxProcessNum: 100,
      value2: 0,
      colorShowIndex: 0,
      insert:undefined,
      canvas:undefined,
      ctx:undefined,
      sateLayer:undefined
    };
  },
  created() {
    this.numbericalModelELE = ElementChoose.numbericalModel;
  },
  mounted() {
    // 注册地球
    var mapContainer = document.querySelector("#numModelPage");
    var earth = (this.earth = new Earth({
      container: mapContainer,
      timeline: false,
      animation: false,
      infoBox: false,
      selectionIndicator: true,
      geocoder: false,
      creditContainer: document.createElement("div"), //去掉版权信息
    }));

    earth.globe.showGroundAtmosphere = false;
    earth.scene.fog.enabled = false;
    earth.depthTestAgainstTerrain = true;

    // 默认高亮显示第三个
    this.showAsideLeft(2);

    // 绑定指南针
    this.earth.viewer.scene.preRender.addEventListener(() => {
      this.heading = this.earth.viewer.camera.heading;
    });
    document.querySelector(".cesium-viewer-toolbar").style.top = "150px";

    // 添加色标canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = 100;
    this.canvas.height = 0;
    this.canvas.style.position = "absolute";
    this.canvas.style.right = "100px";
    this.canvas.style.bottom = "53px";
    this.canvas.style.zIndex = 10;
    // this.canvas.style.background = '#fff'
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "12px Verdana";
    this.ctx.strokeStyle = "#fff";

    document.querySelector("#numModelPage").appendChild(this.canvas);

    this.numModel()
    this.stateCludeMap()

  },
  methods: {
    stateCludeMap(){
        this.sateLayer = new SateCloudLayer(hfsLoader)
        this.sateLayer.channel = 'C002'
        this.sateLayer.load(this.earth).then(() => {
            this.sateLayer.currentTime = this.sateLayer.latestTime
            this.sateLayer.show = false
        })
    },
    // 处理后台返回时间生成时间轴
    dealTimeLineDate(timeList) {
      let k = 21 - timeList.length;
      let timeArr = Object.assign([], timeList);

      if (timeList.length <= 15) {
        this.insert = 3;
      } else if (timeList.length <= 10) {
        this.insert = 6;
      } else if (timeList.length <= 5) {
        this.insert = 8;
      } else if (timeList.length <= 1) {
        this.insert = 10;
      } else {
        this.insert = 0;
      }

      // 构建前后数组前后时间段
      if (k != 21) {
        let num = this.insert;
        let dateBefore = timeArr[0];
        let HB = new Date(dateBefore).getHours();
        let dateAfter = timeArr[timeArr.length - 1];
        let HA = new Date(dateAfter).getHours();
        for (let i = 0; i < k; i++) {
          if (i < this.insert) {
            HB -= num;
            if (HB < 0) {
              HB = 24 + HB;
            }
            if (HB < 10) HB = "0" + HB;
            timeArr.unshift(`${HB}:00`);
          } else {
            HA = +HA + num;
            if (HA >= 24) {
              HA = 0;
            }
            if (HA < 10) HA = "0" + HA;
            timeArr.push(`${HA}:00`);
          }
        }
      } else {
        let time = 0;
        for (let i = 0; i < 21; i++) {
          time = +time + 1;
          if (time < 10) time = "0" + time;
          timeArr.push(`${time}:00`);
        }
      }

      this.timeLineData = [];
      timeArr.forEach((item, index) => {
        var Rtime;
        if (index >= this.insert && index < timeList.length + this.insert) {
          let date = new Date(item);
          let h = date.getHours();
          let m = date.getMinutes();
          if (h < 10) h = "0" + h;
          if (m < 10) m = "0" + m;
          Rtime = h + ":" + m;
          this.timeLineData.push(Rtime);
        } else {
          this.timeLineData.push(item);
        }
      });

      this.maxProcessNum = this.timeLineData.length;
    },
    showYear() {
      let date = new Date(this.ecLayer.currentTime);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      this.yearDate = y + "-" + m + "-" + d;
    },
    updateTime(time) {
      this.ecLayer.currentTime = this.ecLayer.timeList[time - this.insert];
      this.showYear();
    },
    // 绘制色斑图
    drawColorMap() {
        // let colorMap = this.ecLayer.colorMap
        this.ecLayer.onChange = (colorMap)=>{
            if(colorMap!=null){
            this.ctx.clearRect(0, 0, 1000, 1000);
            if (colorMap.length >= 256) {
            this.canvas.height = colorMap.length + 20;
            } else {
            this.canvas.height = colorMap.length * 10 + 10;
            }

            for (let i = colorMap.length - 1; i >= 0; i--) {
            if (colorMap.length >= 256) {
                this.ctx.fillStyle =
                "rgba(" +
                colorMap[i][2][0] +
                "," +
                colorMap[i][2][1] +
                "," +
                colorMap[i][2][2] +
                "," +
                colorMap[i][2][3] +
                ")";
                this.ctx.fillRect(2, colorMap.length - i - 1 + 10, 20, 1);

                if (i == 0 || i == colorMap.length - 1 || i % 20 == 0) {
                this.ctx.font = "12px Verdana";
                this.ctx.strokeStyle = "#44D7B6";
                this.ctx.strokeText(
                    colorMap[colorMap.length - i - 1][3],
                    27,
                    i + 15
                );
                }
            } else {
                this.ctx.fillStyle =
                "rgba(" +
                colorMap[i][2][0] +
                "," +
                colorMap[i][2][1] +
                "," +
                colorMap[i][2][2] +
                "," +
                colorMap[i][2][3] +
                ")";
                this.ctx.fillRect(2, 10 * (colorMap.length - i - 1) + 10, 20, 10);

                if (i == 0 || i % 3 == 0 || i == colorMap.length - 1) {
                this.ctx.font = "12px Verdana";
                this.ctx.strokeStyle = "#44D7B6 ";
                this.ctx.strokeText(
                    colorMap[colorMap.length - 1 - i][3],
                    27,
                    i * 10 + 20
                );
                }
            }
            }
        }
        }
        
      
    },
    showAsideLeft(index) {
      this.num = index;
      if (index == 0) {
        this.$router.push({
          path: "/",
          name: "gis",
          params: {
            gisIndex: index,
          },
        });
      } else if (index != 2) {
        this.$router.push({
          path: "/index",
          name: "index",
          params: {
            gisIndex: index,
          },
        });
      }
    },
    // 数值模式填图
    numModel() {
      this.ecLayer = new MicapsECLayer(hfsLoader);
        this.ecLayer.load(this.earth).then(() => {
        this.ecLayer.currentTime = this.ecLayer.timeList[0]
        this.drawColorMap()
        this.colorShowIndex = this.ecLayer.timeList.length;
        this.dealTimeLineDate(this.ecLayer.timeList);
        this.showYear(this.ecLayer.timeList[0])
      }) 
      var earth = this.earth;
      var localScene = earth.addLocalScene({});

      var maxH = 100000;
      var numLevel = 10;
      var dH = maxH / numLevel;
      var bbox = [
        108.52284055410892, 27.642245321364133, 108.85578708890267,
        28.106139815822313,
      ];

      var levels = [];
      for (let i = 0; i < numLevel; i++) {
        levels.push({
          height: dH * (i + 0.25),
        });
      }

      var dataBox = new DataBox({
        rectangle: bbox,
        levels: levels,
        upAxis: "y",
        boxHeight: maxH + dH * 0.25,
        granularity: 0.05,
        lineColor: "lightblue", //'rgb(10,13,44)'
      });
      localScene.add(dataBox.root);

      earth.flyTo(dataBox);

      earth.onHomeClick.addEventListener((e) => {
        earth.flyTo(dataBox);
        e.cancel = true;
      });

      var imageGeneratorTEM = new MeteoLib.RasterImageGenerator({
        name: "TEM",
        colorMap: [
          [-66666666, -30, [0, 0, 255, 255], "<-30"],
          [-30, -28, [0, 20, 255, 255], "-30~-28"],
          [-28, -24, [0, 70, 255, 255], "-28~-24"],
          [-24, -22, [0, 100, 255, 255], "-24~-22"],
          [-22, -20, [0, 170, 255, 255], "-22~-20"],
          [-20, -18, [0, 200, 255, 255], "-20~-18"],
          [-18, -16, [0, 230, 255, 255], "-18~-16"],
          [-16, -14, [0, 255, 245, 255], "-16~-14"],
          [-14, -12, [0, 255, 215, 255], "-14~-12"],
          [-12, -10, [0, 255, 175, 255], "-12~-10"],
          [-10, -8, [0, 255, 145, 255], "-10~-8"],
          [-8, -6, [0, 255, 110, 255], "-8~-6"],
          [-6, -4, [0, 255, 80, 255], "-6~-4"],
          [-4, -2, [0, 255, 45, 255], "-4~-2"],
          [-2, 0, [0, 255, 15, 255], "-2~0"],
          [0, 2, [20, 255, 0, 255], "0~2"],
          [2, 4, [50, 255, 0, 255], "2~4"],
          [4, 6, [90, 255, 0, 255], "4~6"],
          [6, 8, [120, 255, 0, 255], "6~8"],
          [8, 10, [155, 255, 0, 255], "8~10"],
          [10, 12, [185, 255, 0, 255], "10~ 12"],
          [12, 14, [220, 255, 0, 255], "12~14"],
          [14, 16, [255, 255, 0, 255], "14~16"],
          [16, 18, [255, 225, 0, 255], "16~ 18"],
          [18, 20, [255, 195, 0, 255], "18~20"],
          [20, 22, [255, 160, 0, 255], "20~ 22"],
          [22, 24, [255, 130, 0, 255], "20~ 22"],
          [24, 26, [255, 100, 0, 255], "24~ 26"],
          [26, 28, [255, 65, 0, 255], "26~ 28"],
          [28, 30, [255, 45, 0, 255], "28~ 30"],
          [30, 33, [255, 37, 0, 255], "30~ 33"],
          [33, 35, [255, 20, 0, 255], "33~35"],
          [35, 666666666, [255, 0, 0, 255], "35>"],
        ],
      });
      hfsLoader
        .readFile(
          {
            dir: "GZData",
            path: "SURF",
            fileName: "SURF_CHN_MUL_HOR/surf_20201030050000.json",
          },
          {
            responseType: "json",
          }
        )
        .then((res) => {
          //过滤数据
          var ds = filterData(res.DS, bbox);
          //散点插值
          interpDataset(ds, "TEM", bbox, 256, 256).then((dataArray) => {
            //绘制色斑图
            var img = imageGeneratorTEM.generate(dataArray, 256, 256);
            dataBox.levels.forEach((level) => {
              level.setImage(img);
            });
          });
        });

      this.dataBox = dataBox;
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
  padding: 0;
}
.expand {
  transform: rotateZ(90deg);
  transition: all 0.3s ease-in-out;
}
.numericalModel-info {
  width: calc(100% - 20px);
  height: calc(100% -42px);
  margin-left: 10px;
  background-color: #00447f;
  margin-bottom: 2px;
}
.numericalModel-info .numericalModel-card {
  width: 100%;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}
.numericalModel-info .numericalModel-card-header {
  background-image: linear-gradient(to right, #02d4fa, #005763);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 37px;
  padding: 10px 29px 10px 29px;
  box-sizing: border-box;
}
.numericalModel-info:first-child {
  margin-top: 22px;
}
.numericalModel-info .numericalModel-card-header {
  background-image: linear-gradient(to right, #02d4fa, #005763);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 37px;
  padding: 10px 20px 10px 10px;
  box-sizing: border-box;
}
.numericalModel-info .numericalModel-card-body {
  width: 100%;
  overflow: hidden;
}
.numericalModel-info .numericalModel-card-body .bounding-box {
  display: flex;
  height: 34px;
  width: 320px;
  align-items: center;
  margin: 10px 0;
  overflow: hidden;
}
.numericalModel-info .numericalModel-card-body .bounding-box > span {
  width: 100px;
  text-align: right;
  margin-right: 15px;
}
.numericalModel-info .numericalModel-card-body .bounding-box .button1 {
  width: 48px;
  height: 34px;
  text-align: center;
  background-color: #18eaf3;
  line-height: 34px;
  border-radius: 2px;
  margin-left: 4px;
}
.numericalModel-info .numericalModel-card-body .bounding-box .button2 {
  width: 183px;
  height: 34px;
  text-align: center;
  background-color: #18eaf3;
  line-height: 34px;
  border-radius: 2px;
}
.numericalModel-info .numericalModel-card-body .bounding-box select {
  color: rgba(255, 255, 255, 0.438);
}
.numericalModel-info
  .numericalModel-card-body
  .bounding-box
  .bounding-box-date {
  display: flex;
  color: rgba(255, 255, 255, 0.507);
  align-items: center;
  font-size: 14px;
  width: 183px;
  background-color: #286989;
  justify-content: center;
}
.numericalModel-info
  .numericalModel-card-body
  .bounding-box
  .bounding-box-process
  > p {
  width: 135px;
  height: 2px;
  border-radius: 1px;
  background-color: #02d4fa;
}
.numericalModel-info
  .numericalModel-card-body
  .bounding-box
  .bounding-box-process
  > input {
  width: 40px;
  height: 34px;
  border-radius: 1px;
  background-color: #00447f;
  border: none;
  margin-left: 5px;
  color: #fff;
  text-align: center;
  outline: none;
}
/* billboard */
.billboard {
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
  color: #fff;
}
.selectBillboard {
  background-image: url("../assets/imgs/选中-标题.png") !important;
}
.billboardBox {
  width: 100%;
  position: absolute;
  top: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-10%);
}

.headerBanner {
  height: 121px;
  width: 100%;
  position: absolute;
  top: 0;
  background: url("../assets/imgs/bt.jpg");
  background-size: 100%;
}
.header-text {
  color: #fff;
  font-size: 36px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.compass {
  position: absolute;
  right: 30px;
  top: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.aside-right-footer {
  position: absolute;
  width: 100%;
  height: 53px;
  display: flex;
  align-items: center;
  bottom: 0px;
}
.aside-right-footer .timeRange {
  width: 75px;
  height: 33px;
  font-size: 12px;
  background-color: #18ecf3;
  border-radius: 4px;
  line-height: 33px;
  text-align: center;
  flex-shrink: 0;
  color: #fff;
}
/* 时间轴 */
.aside-right-footer .timeLine {
  width: 100%;
  height: 40px;
  background-color: #00517f;
  margin-left: 10px;
  position: relative;
}
.aside-right-footer .timeBackMask {
  width: 100%;
  /* height: calc(33px + 10px); */
  height: 43px;
  overflow-y: hidden;
  overflow-x: scroll;
  position: absolute;
  top: 0;
  left: 0;
}

.aside-right-footer .timeBack {
  position: absolute;
  display: flex;
  flex-shrink: 0;
  color: #fff;
  /* left: 20px; */
}
.aside-right-footer .timeLine .text {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  padding-bottom: 3px;
  box-sizing: border-box;
}
.aside-right-footer .timeLine .text .line {
  height: 8px;
  width: 0;
  border: 1px solid #fff;
}
.aside-right-footer .timeChoose {
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
.aside-right-footer .process {
  width: 0px;
  height: 2px;
  left: 0;
  bottom: 0;
  position: absolute;
  background-color: #18eaf3;
}
.aside-right-footer .process .button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #18eaf3;
  position: absolute;
  transform: translate(0, -50%);
}
.cloudLayerDragTarget {
  cursor: move;
}
</style>
<style>
.timeChoose .el-date-editor {
  width: 220px !important;
  background: transparent;
  border: none;
  padding-left: 0 !important;
}
.timeChoose .el-range-input {
  background: none;
  color: rgba(255, 255, 255, 0.863) !important;
}
.timeChoose .el-range-separator {
  color: #fff !important;
  padding-right: 10px !important;
}
.aside-right-footer .timeBack .el-slider {
  position: absolute !important;
  width: 100%;
  bottom: 17px;
}
.aside-right-footer .timeBack .el-slider__runway {
  position: absolute !important;
  width: 100% !important;
  height: 2px !important;
}
.aside-right-footer .timeBack .el-slider__bar {
  height: 2px !important;
  background-color: #18eaf3 !important;
}
.aside-right-footer .timeBack .el-slider__button {
  height: 16px !important;
  width: 16px !important;
  border: none !important;
  color: #18eaf3 !important;
  transform: translate(50px, -2px);
}
</style>