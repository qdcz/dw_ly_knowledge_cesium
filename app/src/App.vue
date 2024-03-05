<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Viewer } from "cesium";


onMounted(() => {
  const viewer = new Viewer("cesiumContainer");
})


</script>

<template>
  <div class="container" id="cesiumContainer">

  </div>
</template>

<style scoped></style>
