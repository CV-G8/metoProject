<template>
  <div style="height: 273px"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "me-terra-profile",
  data() {
    return {
      m_dataset: false
    };
  },
  props: {
    dataset: {
      type: Object,
      //   default() {
      //     return {
      //       distances: [],
      //       heights: [],
      //     };
      //   },
    }
  },
  watch: {
    dataset() {
      this.m_dataset = this.dataset;
      if (this.m_dataset) {
        this.showDataset();
      }
    },
  },
  mounted() {
    this.m_chart = echarts.init(this.$el, {
    //   with: "100%",
    //   height: "100%",
    });
    if (this.m_dataset) {
      this.showDataset();
    }
  },
  destroyed() {
    if (this.m_dataset) {
      this.m_dataset.heights = null;
      this.m_dataset.distances = null;
    }
    this.m_chart = this.m_charts && this.m_chart.dispose();
  },
  methods: {
    showDataset() {
      var m_chart = this.m_chart;
      var option = {
        xAxis: {
          type: "category",
          name:'距离/m',
          boundaryGap: true,
          data: this.m_dataset.distances,
        },
        yAxis: {
          type: "value",
          name:'高度/m'
        },
        series: [
          {
            data: this.m_dataset.heights,
            type: "line",
            areaStyle: {},
          },
        ],
      };

      m_chart.setOption(option);
    },
  },
};
</script>

<style>
</style>