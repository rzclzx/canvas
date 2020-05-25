export default {
  container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
  width: 1600, // Number，必须，图的宽度
  height: 900, // Number，必须，图的高度
  layout: {                // Object，可选，布局的方法及其配置项，默认为 random 布局。
    type: 'radial',         // 指定为力导向布局
    preventOverlap: true,  // 防止节点重叠
    nodeSize: 100,      // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
    linkDistance: 100, // 指定边距离为100
  },
  modes: {
    default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
  },
  defaultNode: {
    size: 30,
    style: {
      lineWidth: 2,
      stroke: '#6BC1FA',
      fill: '#C6E5FF',
    },
  },
  defaultEdge: {
    size: 3,
    color: '#e2e2e2',
    style: {
      endArrow: {
        path: 'M 0,0 L 8,4 L 8,-4 Z',
        fill: '#e2e2e2'
      },
    },
  },
  nodeStateStyles: {
    // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
    hover: {
      fill: '#7CC8FB',
      stroke: '#7CC8FB'
    },
    // 鼠标点击节点，即 click 状态为 true 时的样式
    click: {
      fill: '#7CC8FB',
      stroke: '#7CC8FB'
    },
  },
  // 边不同状态下的样式集合
  edgeStateStyles: {
    // 鼠标点击边，即 click 状态为 true 时的样式
    click: {
      stroke: '#7CC8FB'
    },
  },
}