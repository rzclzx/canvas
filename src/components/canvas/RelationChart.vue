<template>
  <canvas 
    @mousedown="clickDown" 
    @mousemove="downIng && move($event)"
    @mouseup="clickUp"
    @mouseleave="leave"
    width="600" 
    height="600" 
    ref="chart"
  >您的浏览器不支持HTML5，请使用最新谷歌浏览器</canvas>
</template>

<script>
export default {
  name: 'RelationChart',
  data () {
    return {
      width: 600,
      height: 600,
      downIng: false,
      currentItem: null,
      localItem: {x:0,y: 0,w: 0, h: 0},
      chart: {},
      ctx: {},
      timer: null,
      images: {},
      imageList: [
        {
          name: 'user'
        },
        {
          name: 'email'
        },
        {
          name: 'phone'
        },
        {
          name: 'address'
        }
      ],
      data: {
        point: [
          {
            id: '0',
            label: '手机',
            type: 'phone'
          },
          {
            id: '1',
            label: '邮件',
            type: 'email'
          },
          {
            id: '2',
            label: '证件',
            type: 'user'
          },
          {
            id: '3',
            label: '地址',
            type: 'address'
          }
        ],
        line: [
          {
            id: 0,
            start: '2',
            end: '0'
          },
          {
            id: 1,
            start: '2',
            end: '1'
          },
          {
            id: 3,
            start: '2',
            end: '3'
          },
          {
            id: 4,
            start: '2',
            end: '1'
          }
        ],
      }
    }
  },
  mounted () {
    this.chart = this.$refs.chart;
    this.ctx = this.chart.getContext("2d");
    this.imageInit(this.imageList, this.images).then(res => {
      this.init();
      this.draw();
    });
  },
  methods: {
    imageInit (list, obj) {
      let count = 0;
      return new Promise((resolve, reject) => {
        list.forEach(item => {
        obj[item.name] = new Image();
        obj[item.name].src = require(`@/assets/images/${item.name}.jpg`);
        obj[item.name].onload = function () {
            count++;
            if (count >= list.length) {
              resolve();
            }
          }
        })
      })
    },
    init () {
      this.posInit();
    },
    draw () {
      this.ctx.clearRect(0,0,this.width,this.height);
      this.drawImgs();
      this.drawLines();
    },
    drawLines () {
      this.data.line.forEach(item => {
        let startPoint = this.getPoint(item.start, this.data.point)
        let endPoint = this.getPoint(item.end, this.data.point)
        this.line(this.ctx, 5, '#bebebe', {
          sx: startPoint.pos.x, sy: startPoint.pos.y, ex: endPoint.pos.x, ey: endPoint.pos.y
        });
      })
    },
    posInit () {
      this.data.point.forEach(item => {
        item.size = this.getSize(item.type);
        item.pos = this.getPos(item, this.data.point);
      })
    },
    drawImgs () {
      // this.data.point.forEach(item => {
      //   item.weight = this.getWeight(item.id, this.data.line);
      // });
      // 需要二次循环确定size的大小在所有icon中的权重
      this.data.point.forEach(item => {
        this.ctx.beginPath();
        this.ctx.drawImage(this.images[item.type],item.pos.x-item.size.w/2,item.pos.y-item.size.h/2,item.size.w,item.size.h);
      })
    },
    getPos (item, list) {
      // let masters = list.filter(item => item.type == 'user')
      // let center = Math.sqrt(masters.length)*(this.item.size.w+100);
    },
    getWeight (id, list) {
      // 待确认需求
      // let weight = 0;
      // list.forEach(item => {
      //   if (item.start == id || item.end == id) weight++;
      // })
      // return weight;
    },
    getSize (type) {
      return type == 'user' ? {w: 40, h: 40} : {w: 30, h: 30}
    },
    getPoint (id, list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) return list[i];
      }
    },
    line (ctx, width, color, pos) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.moveTo(pos.sx, pos.sy);
      ctx.lineTo(pos.ex, pos.ey);
      ctx.stroke();
    },
    clickDown (e) {
      this.downIng = true;
      this.currentItem = this.clickPoint(e.offsetX, e.offsetY, this.data.point)
      if (this.currentItem) {
        this.localItem.w = this.currentItem.size.w;
        this.localItem.h = this.currentItem.size.h;
        this.localItem.x = this.currentItem.pos.x;
        this.localItem.y = this.currentItem.pos.y;
        this.currentItem.size.w*=1.5;
        this.currentItem.size.h*=1.5;
        this.draw()
      }
    },
    clickPoint (x,y,list) {
      for (let i = 0; i< list.length; i++) {
        if ((Math.abs(list[i].pos.x - x) <= list[i].size.w/2) && (Math.abs(list[i].pos.y-y) <= list[i].size.h/2)) {
          return list[i]
        }
      }
      list.forEach(item => {
        if ((Math.abs(item.pos.x - x) <= item.size.w/2) && (Math.abs(item.pos.y-y) <= item.size.h/2)) {
          return item
        }
      })
    },
    clickLine (x,y,list) {
      for (let i = 0; i< list.length; i++) {
        if ((Math.abs(list[i].pos.x - x) <= list[i].size.w/2) && (Math.abs(list[i].pos.y-y) <= list[i].size.h/2)) {
          return list[i]
        }
      }
      list.forEach(item => {
        if ((Math.abs(item.pos.x - x) <= item.size.w/2) && (Math.abs(item.pos.y-y) <= item.size.h/2)) {
          return item
        }
      })
    },
    move (e) {
      //console.log(e)
      if (!this.currentItem || !this.downIng) return
      this.currentItem.pos.x = e.offsetX;
      this.currentItem.pos.y = e.offsetY;
      this.draw();
    },
    clickUp (e) {
      if (!this.currentItem) return
      //console.log(e)
      this.currentItem.size.w = this.localItem.w;
      this.currentItem.size.h = this.localItem.h;
      this.currentItem = null;
      this.draw()
      this.downIng = false
    },
    leave () {
      if (!this.currentItem) return
      this.currentItem.size.w = this.localItem.w;
      this.currentItem.size.h = this.localItem.h;
      this.currentItem = null;
      this.draw();
      this.downIng = false;
    }
  },
  computed: {
    
  }
}
</script>

<style lang="less" scoped>

</style>
