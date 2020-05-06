<template>
  <div class="flex-start-start">
    <div style="height: 100vh;overflow: scroll;width: 200px">
      <el-menu
        :default-active="$route.params.id"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item 
          :index="index.toString()" 
          v-for="(item, index) in menus" 
          :key="item.name"
           @click="$router.push({path: '/canvas/' + index})"
        >
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="box border">
      <component :is="coms[$route.params.id]"></component>
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/canvas/BarChart';
import PieChart from '@/components/canvas/PieChart';
import DemoChart from '@/components/canvas/DemoChart';
import RelationChart from '@/components/canvas/RelationChart';
export default {
  name: 'Index',
  components: {
    DemoChart,
    BarChart,
    PieChart,
    RelationChart
  },
  data () {
    return {
      coms: {
        '0': 'DemoChart',
        '1': 'BarChart',
        '2': 'PieChart',
        '3': 'RelationChart'
      },
      menus: [
        { name: '示例' },
        { name: '柱状图' },
        { name: '饼图' },
        { name: '关系图' }
      ]
    }
  },
  created () {
    
  },
  mounted () {
    
  },
  methods: {
    
  },
  computed: {
    
  }
}
</script>

<style scoped>
  .box {
    width: 600px;
    height: 600px;
    margin-left: 20px;
  }
</style>
