<template>
  <canvas width="600" height="600" ref="chart">您的浏览器不支持HTML5，请使用最新谷歌浏览器</canvas>
</template>

<script>

export default {
  name: 'DemoChart',
  data () {
    return {
      chart: {},
      ctx: {},
    }
  },
  mounted () {
    this.chart = this.$refs.chart;
    this.ctx = this.chart.getContext("2d");
    // this.line(this.ctx, 20, 'green', {
    //   sx: 0, sy: 0, ex: 600, ey: 600
    // });
    // this.rect(this.ctx, 5, 'red', {
    //   x: 150, y: 150, w: 300, h: 300
    // });
    this.circle(this.ctx, 5, 'red', {
      x: 300, y: 300, r: 100, s: 0, e: Math.PI
    }, false);
  },
  methods: {
    // 直线线宽，颜色，起点、终点
    line (ctx, width, color, pos) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.moveTo(pos.sx, pos.sy);
      ctx.lineTo(pos.ex, pos.ey);
      ctx.stroke();
    },
    // 矩形线宽，颜色，左上点x，y，宽，高
    rect (ctx, width, color, pos) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.rect(pos.x, pos.y, pos.w, pos.h)
      ctx.stroke();
    },
    // 圆线宽，颜色，圆心，半径，起角，终角（Math.PI计算 顺时针默认），是否实心
    circle (ctx, width, color, pos, fill) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.arc(pos.x, pos.y, pos.r, pos.s, pos.e, pos.d);
      if (fill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }
  },
  computed: {
    
  }
}
</script>

<style lang="less" scoped>

</style>
