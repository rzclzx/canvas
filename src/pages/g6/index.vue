<template>
  <div>
    <div id="mountNode"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import options from './options';
export default {
  components: {
    
  },
  data () {
    return {
      options,
      data: {}
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    async init () {
      const res = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json'
      );
      this.data = await res.json();
      const graph = new G6.Graph(this.options);
      graph.data(this.data);
      graph.render();
      this.addEvent(graph)
    },
    addEvent (graph) {
      graph.on('node:mouseenter', e => {
        const nodeItem = e.item; // 获取鼠标进入的节点元素对象
        graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
      });

      // 鼠标离开节点
      graph.on('node:mouseleave', e => {
        const nodeItem = e.item; // 获取鼠标离开的节点元素对象
        graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
      });

      // 点击节点
      graph.on('node:click', e => {
        // 先将所有当前是 click 状态的节点置为非 click 状态
        const clickNodes = graph.findAllByState('node', 'click');
        clickNodes.forEach(cn => {
          graph.setItemState(cn, 'click', false);
        });
        const nodeItem = e.item; // 获取被点击的节点元素对象
        graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
      });

      // 点击边
      graph.on('edge:click', e => {
        // 先将所有当前是 click 状态的边置为非 click 状态
        const clickEdges = graph.findAllByState('edge', 'click');
        clickEdges.forEach(ce => {
          graph.setItemState(ce, 'click', false);
        });
        const edgeItem = e.item; // 获取被点击的边元素对象
        graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
      });
    }
  }
}
</script>

<style scoped>
  
</style>
