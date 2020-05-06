<template>
  <canvas width="600" height="600" ref="chart">您的浏览器不支持HTML5，请使用最新谷歌浏览器</canvas>
</template>

<script>

export default {
  name: 'BarChart',
  data () {
    return {
      chart: {},
      ctx: {},
    }
  },
  mounted () {
    this.chart = this.$refs.chart;
    this.ctx = this.chart.getContext("2d");
  },
  methods: {
    
  },
  computed: {
    
  }
}
</script>

<style lang="less" scoped>

</style>
