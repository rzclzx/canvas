export default {
  container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
  width: 1400, // Number，必须，图的宽度
  height: 700, // Number，必须，图的高度
  modes: {
    default: ['zoom-canvas', 'drag-canvas'], // 允许拖拽画布、拖拽节点
  }
}