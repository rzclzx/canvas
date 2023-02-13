<template>
  <div class="graph">
    <div class="header"></div>
    <div class="flex-between-start" style="position:relative">
      <div class="panel" id="mountNode"></div>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import options from './options'
import './style.css'
export default {
  components: {},
  data() {
    return {
      options,
      data: {},
      tableData: [],
      // 节点宽度
      nodeWidth: 100,
      // 节点高度
      nodeHeight: 50,
      // 泳道宽度
      pipWidth: 200
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * 初始化，自定义图的节点类型，数据初始化，绘制
     */
    init() {
      // 定义泳道节点
      G6.registerNode('dom-pip', {
        draw: (cfg, group) => {
          const keyShape = group.addShape('rect', {
            attrs: {
              width: cfg.size[0],
              height: cfg.size[1],
              fill: `${cfg.index % 2 === 0 ? '#bebebe' : '#fff'}`,
              opacity: 0.3
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
            name: 'dom-pip-header'
          })
          group.addShape('text', {
            attrs: {
              text: cfg.label,
              fill: '#fff',
              y: 20,
              x: 0
            },
            name: 'dom-pip-header'
          })
          return keyShape
        }
      })
      // 定义tree节点
      G6.registerNode('dom-node', {
        draw: (cfg, group) => {
          const keyShape = group.addShape('rect', {
            attrs: {
              width: cfg.size[0],
              height: cfg.size[1],
              fill: '#409EFF'
            },
            name: 'dom-node'
          })
          group.addShape('text', {
            attrs: {
              text: cfg.label,
              fill: '#fff',
              y: 30,
              x: 20
            },
            name: 'dom-pip-header'
          })
          return keyShape
        }
      })
      // 结果节点定义
      G6.registerNode('dom-result', {
        draw: (cfg, group) => {
          const keyShape = group.addShape('rect', {
            attrs: {
              width: cfg.size[0],
              height: cfg.size[1],
              fill: '#fff'
            },
            name: 'dom-result'
          })
          group.addShape('rect', {
            attrs: {
              text: cfg.label,
              fill: '#C4723C',
              width: 10,
              height: 10,
              y: 20,
              x: 10
            },
            name: 'dom-result-icon'
          })
          group.addShape('text', {
            attrs: {
              text: cfg.label,
              fill: '#000',
              y: 32,
              x: 40
            },
            name: 'dom-result-text'
          })
          return keyShape
        }
      })
      // 初始化graph
      this.graph = new G6.Graph(this.options)
      // 数据初始化
      this.dataInit()
      // 绘制
      this.graph.read(this.data)
      // 点击事件
      this.addEvent()
    },
    /**
     * 数据初始化
     */
    dataInit() {
      /**
       * mock数据
       */
      this.data = { nodes: [], edges: [] }
      // 5条泳道
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
      // 节点和边
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
              [1, 0.5] // 右侧中间
            ],
            x: (i === 5 ? 6 : i) * this.pipWidth - this.pipWidth + 40,
            size: [this.nodeWidth, this.nodeHeight]
          })
          if (i <= 3) {
            for (let q = 1; q <= 2; q++) {
              this.data.edges.push({
                type: 'polyline',
                source: `${i}-${j}`,
                target: `${i + 1}-${2 * j - (2 - q)}`
              })
            }
          }
        }
      }
      // 获取顶点，然后计算布局位置
      const node = this.data.nodes.find(item => item.id === '1-1')
      this.setPosLoop(this.data, node, 50, { index: 0 })
      // 结果列数据
      let list = this.data.nodes.filter(
        item => item.label.indexOf('node4') >= 0
      )
      list.forEach((item, index) => {
        this.data.nodes.push({
          id: `${5}-${index + 1}`,
          type: 'dom-result',
          label: `node${5}-${index + 1}`,
          anchorPoints: [
            [0, 0.5], // 左侧中间
            [1, 0.5] // 右侧中间
          ],
          x: 5 * this.pipWidth - this.pipWidth + 40,
          y: item.y,
          size: [this.nodeWidth, this.nodeHeight]
        })
        this.data.edges.push({
          type: 'polyline',
          source: item.id,
          target: `${5}-${index + 1}`
        })
      })
      // 单造一条由2到5的数据
      this.data.nodes.push({
        id: `test-2`,
        type: 'dom-node',
        label: `nodetest-2`,
        anchorPoints: [
          [0, 0.5], // 左侧中间
          [1, 0.5] // 右侧中间
        ],
        x: 2 * this.pipWidth - this.pipWidth + 40,
        y: 850,
        size: [this.nodeWidth, this.nodeHeight]
      })
      this.data.nodes.push({
        id: `test-5`,
        type: 'dom-result',
        label: `nodetest-5`,
        anchorPoints: [
          [0, 0.5], // 左侧中间
          [1, 0.5] // 右侧中间
        ],
        x: 5 * this.pipWidth - this.pipWidth + 40,
        y: 850,
        size: [this.nodeWidth, this.nodeHeight]
      })
      this.data.edges.push({
        type: 'polyline',
        source: `1-1`,
        target: `test-2`
      })
      this.data.edges.push({
        type: 'polyline',
        source: `test-2`,
        target: `test-5`
      })
      console.log(`图的全量数据:`, this.data)
    },
    /**
     * tree间隔合理性计算，该方法会为每一个节点添加一个合理的y值
     * @param data tree数据
     * @param parent tree的顶点
     * @param top 最顶部的节点距离图顶部的间距
     * @param pos 传固定对象 { index: 0 }, 用于函数内部计数
     */
    setPosLoop(data, parent, top, pos) {
      const children = data.edges.filter(edge => edge.source === parent.id)
      if (children.length) {
        let h, start, end
        children.forEach((child, index) => {
          const node = data.nodes.find(node => node.id === child.target)
          let val = this.setPosLoop(data, node, top, pos)
          if (index === 0) {
            start = val
          }
          if (index === children.length - 1) {
            end = val
          }
        })
        h = (start + end + this.nodeHeight) / 2 - this.nodeHeight / 2
        parent.y = h
        return h
      } else {
        let h = pos.index * (this.nodeHeight * 2) + top
        pos.index++
        parent.y = h
        return h
      }
    },
    /**
     * 事件初始化
     */
    addEvent() {
      this.addHover()
      this.addNodeClick()
      this.addEdgeClick()
    },
    /**
     * 鼠标hover 进入、离开钩子
     */
    addHover() {
      this.graph.on('node:mouseenter', e => {
        // 节点数据
        const model = e.item.getModel()
      })
      this.graph.on('node:mouseleave', e => {
        // 节点数据
        const model = e.item.getModel()
      })
    },
    /**
     * 通过状态，获取所有点击状态的节点或边
     */
    findAllByState() {
      this.graph.findAllByState('node', 'click').forEach(nodeItem => {
        // 节点数据
        const model = nodeItem.getModel()
        // 将处于点击状态下的移除点击状态
        this.graph.setItemState(nodeItem, 'click', false)
      })
      this.graph.findAllByState('edge', 'click').forEach(nodeItem => {
        // 将处于点击状态下的移除点击状态
        this.graph.setItemState(nodeItem, 'click', false)
      })
    },
    /**
     * 点击了节点
     */
    addNodeClick() {
      this.graph.on('node:click', e => {
        // 先处理一些逻辑，移除所有点击状态的节点样式等等
        this.findAllByState()
        // 节点原数据
        const nodeItem = e.item
        // 节点数据
        const model = nodeItem.getModel()
        // 通过原数据设置节点处于点击状态，方便后续捕获
        this.graph.setItemState(nodeItem, 'click', true)
        console.log(model)
      })
    },
    /**
     * 点击了连线
     */
    addEdgeClick() {
      this.graph.on('edge:click', e => {
        // 先处理一些逻辑，移除所有点击状态的节点样式等等
        this.findAllByState()
        // 原数据
        const nodeItem = e.item
        // 数据
        const model = nodeItem.getModel()
        // 通过原数据设置处于点击状态，方便后续捕获
        this.graph.setItemState(nodeItem, 'click', true)
        console.log(model)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.graph {
  width: 100%;
  height: 1080px;
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
}
</style>
