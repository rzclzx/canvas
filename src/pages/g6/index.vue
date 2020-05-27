<template>
  <div class="graph" @click="allInit">
    <div class="header"></div>
    <div class="flex-between-start" style="position:relative">
      <div class="scroll">
        <el-slider
          v-model="size"
          vertical
          :min="0.2"
          :max="2"
          :step="0.2"
          height="200px"
          @input="scale"
        >
        </el-slider>
      </div>
      <div class="panel" id="mountNode"></div>
      <div>
        <el-card>
          <div slot="header">
            <span>图谱详情</span>
          </div>
          <el-table
            :data="tableData" 
            size="mini"
          >
            <el-table-column
              label="属性名称"
              align="center"
              prop="label"
            ></el-table-column>
            <el-table-column
              label="属性值"
              align="center"
              prop="value"
            ></el-table-column>
          </el-table>
        </el-card>
        <!-- <el-button @click="downloadImage">导出图片</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import options from './options';
export default {
  components: {},
  data () {
    return {
      size: 1,
      options,
      data: {},
      graph: {},
      tableData: [],
      state: false
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    scale () {
      if (this.graph.zoomTo) {
        this.graph.zoomTo(this.size, this.getCenter())
      }
    },
    getCenter () {
      let x = [];
      let y = [];
      let nodes = this.data.nodes || [];
      nodes.forEach(item => {
        x.push(item.x);
        y.push(item.y);
      })
      return {
        x: (Math.min.apply(null,x) + Math.max.apply(null,x))/2,
        y: (Math.min.apply(null,y) + Math.max.apply(null,y))/2
      }
    },
    async init () {
      const res = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json'
      );
      this.data = await res.json();
      this.graph = new G6.Graph(this.options);
      this.graph.data(this.data);
      this.graph.render();
      this.addEvent();
    },
    addEvent () {
      this.addHover();
      this.addNodeClick();
      this.addEdgeClick();
    },
    addHover () {
      this.graph.on('node:mouseenter', e => {
        const nodeItem = e.item; // 获取鼠标进入的节点元素对象
        this.graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
      });
      this.graph.on('node:mouseleave', e => {
        const nodeItem = e.item; // 获取鼠标离开的节点元素对象
        this.graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
      });
    },
    removeClick () {
      this.graph.findAllByState('node', 'click').forEach(cn => {
        this.graph.setItemState(cn, 'click', false);
      });
      this.graph.findAllByState('edge', 'click').forEach(ce => {
        this.graph.setItemState(ce, 'click', false);
      });
    },
    addNodeClick () {
      this.graph.on('node:click', e => {
        this.state = true;
        this.removeClick();
        this.hideAll();
        const nodeItem = e.item; // 获取被点击的节点元素对象
        const obj = nodeItem.getModel();
        this.showClick(obj.id);
        this.tableData = [];
        this.tableData.push({
          label: '名称',
          value: obj.label
        })
        this.graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
      });
    },
    hideAll () {
      this.data.nodes.forEach(item =>{
        this.graph.hideItem(item.id);
      })
    },
    allInit () {
      if (this.state) {
        this.state = false;
      } else {
        this.data.nodes.forEach(item =>{
          this.graph.showItem(item.id);
          this.removeClick();
        })
      }
    },
    showClick (id) {
      let list = [];
      list.push(id);
      this.data.edges.forEach(item =>{
        if (item.source == id) {
          list.push(item.target);
        }
        if (item.target == id) {
          list.push(item.source);
        }
      });
      list.forEach(item => {
        this.graph.showItem(item);
      })
    },
    addEdgeClick () {
      this.graph.on('edge:click', e => {
        this.state = true;
        this.removeClick();
        const edgeItem = e.item; // 获取被点击的边元素对象
        const obj = edgeItem.getModel();
        this.tableData = [];
        this.tableData.push({
          label: '名称',
          value: obj.label
        })
        this.graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
      });
    },
    downloadImage () {
      this.graph.downloadImage();
    }
  }
}
</script>

<style lang="less" scoped>
  .graph {
    width: 100%;
    height: 1080px;
    .header {
      height: 80px;
      background: #7CC8FB;
    }
  }
  .scroll {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 50px;
  }
</style>
