<template>
  
  <div class="root"> 
      <Home></Home>
  </div>
</template>

<script>
import Home from "./Home/index.vue"
export default {
    name:"APP",
    components:{
        Home
    }
}
</script>

<style>

.root{
    background-color: pink;
}

</style>