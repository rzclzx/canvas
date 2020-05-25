<template>
  <div class="box">
    <el-button  style="margin-top: 10px" type="primary" @click="$router.push({ path:'/canvas/0' })">canvas</el-button>
    <el-button  style="margin-top: 10px" type="primary" @click="$router.push({ path:'/g6' })">g6</el-button>
  </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
  .box {
    width: 70%;
    margin: 20px auto;
  }
</style>
