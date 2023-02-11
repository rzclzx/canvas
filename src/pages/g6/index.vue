<template>
  <div class="graph" @click="allInit">
    <div class="header"></div>
    <div class="flex-between-start" style="position:relative">
      <!-- <div class="scroll">
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
      </div> -->
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
import './style.css'
export default {
  components: {},
  data () {
    return {
      size: 1,
      options,
      data: {},
      graph: {},
      tableData: [],
      state: false,
      // 节点宽度
      nodeWidth: 100,
      // 节点高度
      nodeHeight: 50,
      // 泳道宽度
      pipWidth: 200
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    scale () {
      if (this.graph.zoomTo) {
        // this.graph.zoomTo(this.size, this.getCenter())
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
      // const res = await fetch(
      //   'https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json'
      // );
      // this.data = await res.json();
      G6.registerNode(
        'dom-pip',
        {
          draw: (cfg, group) => {
            const keyShape = group.addShape('rect', {
              attrs: {
                width: cfg.size[0],
                height: cfg.size[1],
                fill: `${cfg.index%2 === 0 ? '#bebebe' : '#fff'}`,
                opacity: .3
              },
              name: 'dom-pip',
              capture: false
            })
            group.addShape('rect', {
              attrs: {
                width: this.pipWidth,
                height: 30,
                fill: `#606266`,
                y: 0,
                x: 0
              },
              name: 'dom-pip-header',
            })
            group.addShape('text', {
              attrs: {
                text: cfg.label,
                fill: '#fff',
                y: 20,
                x: 0
              },
              name: 'dom-pip-header',
            })
            return keyShape
          },
        }
      )
      G6.registerNode(
        'dom-node',
        {
          draw: (cfg, group) => {
            const keyShape = group.addShape('rect', {
              attrs: {
                width: cfg.size[0],
                height: cfg.size[1],
                fill: '#409EFF'
              },
              name: 'dom-node',
            })
            group.addShape('text', {
              attrs: {
                text: cfg.label,
                fill: '#fff',
                y: 30,
                x: 20,
              },
              name: 'dom-pip-header',
            })
            return keyShape
          },
        }
      )
      this.graph = new G6.Graph(this.options);
      this.dataInit();
      this.graph.data(this.data);
      this.graph.render();
      this.addEvent();
    },
    dataInit () {
      this.data = { nodes: [], edges: [] }
      for (let i = 1; i <= 5; i++) {
        this.data.nodes.push({
          id: i + '',
          type: 'dom-pip',
          label: i + '',
          index: i,
          x: i * this.pipWidth - this.pipWidth,
          y: 0,
          size: [this.pipWidth, 3000]
        })
      }
      for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= Math.pow(2, i - 1); j++) {
          if (i === 5) {
            break
          }
          this.data.nodes.push({
            id: `${i}-${j}`,
            type: 'dom-node',
            label: `node${i}-${j}`,
            anchorPoints: [
              [0, 0.5], // 左侧中间
              [1, 0.5], // 右侧中间
            ],
            x: (i === 5 ? 6 : i)*this.pipWidth - this.pipWidth + 40,
            size: [this.nodeWidth, this.nodeHeight]
          })
          if (i <= 3) {
            for (let q = 1; q <= 2; q++) {
              this.data.edges.push({
                type: 'polyline',
                source: `${i}-${j}`,
                target: `${i + 1}-${2*j - (2 - q)}`
              })
            }
          }
        }
      }
      const node = this.data.nodes.find(item => item.id === '1-1')
      this.setYpos(this.data, node, { index: 0 })
      // mock 结果列
      let list = this.data.nodes.filter(item => item.label.indexOf('node4') >= 0)
      list.forEach((item, index) => {
        this.data.nodes.push({
          id: `${5}-${index + 1}`,
          type: 'dom-node',
          label: `${5}-${index + 1}`,
          anchorPoints: [
            [0, 0.5], // 左侧中间
            [1, 0.5], // 右侧中间
          ],
          x: 5*this.pipWidth - this.pipWidth + 40,
          y: item.y,
          size: [this.nodeWidth, this.nodeHeight]
        })
        this.data.edges.push({
          type: 'polyline',
          source: item.id,
          target: `${5}-${index + 1}`
        })
      })
      console.log(this.data)
    },
    setYpos(data, parent, pos) {
      const children = data.edges.filter(edge => edge.source === parent.id)
      if (children.length) {
        let h, start, end
        children.forEach((child, index) => {
          const node = data.nodes.find(node => node.id === child.target)
          let val = this.setYpos(data, node, pos)
          if (index === 0) {
            start = val
          }
          if (index === children.length - 1) {
            end = val
          }
        })
        h = (start + end + this.nodeHeight)/2 - this.nodeHeight/2
        parent.y = h
        return h
      } else {
        let h = pos.index * (this.nodeHeight*2) + 50
        pos.index++
        parent.y = h
        return h
      }
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
  }
  .scroll {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 50px;
  }
  .panel {
    border: solid 1px #bebebe;
  }
  .pip {
    height: 600px;
    width: 100px;
  }
</style>
