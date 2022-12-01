<template>
  <div>
    INDEX HERE
    <el-button>push</el-button>
    <div class="demo-image__placeholder">
      <div class="block">
        <span class="demonstration">默认</span>
        <el-image :src="src"></el-image>
      </div>
      <div class="block">
        <span class="demonstration">自定义</span>
        <el-image :src="src">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script>
import {ElImage} from "element-plus"

export default {
  name: "Home",
  data(){
    return {
        src:require("../assets/images/2.jpg")
    }
  },
  components:{
    ElImage
  }
};
</script>

<style scoped>
div {
  color: deeppink;
  font-size: 30px;
  background-image: url("../assets/images/1.jpg");
  background-size: cover;
}
</style>