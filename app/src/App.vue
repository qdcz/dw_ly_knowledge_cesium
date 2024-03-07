<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Viewer,
  buildModuleUrl,
  viewerCesium3DTilesInspectorMixin,
  Cesium3DTileset,
  HeadingPitchRange,
  Cesium3DTileStyle,
  defined,
  CustomShader,
  VaryingType,
  TextureUniform,
  UniformType
} from "cesium";
// buildModuleUrl.setBaseUrl('cesium');

const init = async () => {
  const viewer = new Viewer("cesiumContainer", {
    // 是否显示动画控件，默认为 true
    animation: false,
    // 是否显示底图图层选择控件，默认为 true
    baseLayerPicker: true,
    // 是否显示全屏按钮，默认为 true
    fullscreenButton: true,
    // 是否显示 VR 模式按钮，默认为 true
    vrButton: false,
    // 是否显示回到初始位置按钮，默认为 true
    homeButton: true,
    // 是否显示信息框，默认为 true
    infoBox: true,
    // 是否显示场景模式选择器，默认为 true
    sceneModePicker: true,
    // 是否显示选择指示器，默认为 true
    selectionIndicator: true,
    // 是否显示时间轴，默认为 true
    timeline: false,
    // 是否显示导航帮助按钮，默认为 true
    navigationHelpButton: false,
    // 指定是否仅显示 3D 场景，默认为 false
    scene3DOnly: false,
    // 指定时钟视图模型
    clockViewModel: undefined,
    // 指定选择的图像提供者视图模型
    selectedImageryProviderViewModel: undefined,
    // 指定图像提供者视图模型数组
    imageryProviderViewModels: undefined,
    // 指定选择的地形提供者视图模型
    selectedTerrainProviderViewModel: undefined,
    // 指定地形提供者视图模型数组
    terrainProviderViewModels: undefined,
    // 指定图像提供者
    imageryProvider: undefined,
    // 指定地形提供者
    terrainProvider: undefined,
    // 指定天空盒
    skyBox: undefined,
    // 指定大气层
    skyAtmosphere: undefined,
    // 指定用于全屏的元素
    fullscreenElement: undefined,
    // 指定是否使用默认的渲染循环，默认为 true
    useDefaultRenderLoop: true,
    // 指定目标帧率
    targetFrameRate: undefined,
    // 指定是否显示渲染循环错误，默认为 true
    showRenderLoopErrors: true,
  });

  viewer.extend(viewerCesium3DTilesInspectorMixin);
  const inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;

  const tilesetUrl =
    "https://81.69.20.73:3000/static/cdn/cesium/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json";
  const tileset = await Cesium3DTileset.fromUrl(tilesetUrl, {
    enableDebugWireframe: true,
    // maximumScreenSpaceError: 128, // 默认值16 用于提高细节细化级别的最大屏幕空间错误
    maximumNumberOfLoadedTiles: 10000000
  });
  viewer.scene.primitives.add(tileset);
  inspectorViewModel.tileset = tileset;
  viewer.zoomTo(
    tileset,
    new HeadingPitchRange(
      0,
      -2.0,
      Math.max(100.0 - tileset.boundingSphere.radius, 0.0)
    )
  );

  const properties = tileset.properties;
  if (defined(properties) && defined(properties.Height)) {
    tileset.style = new Cesium3DTileStyle({
      color: {
        conditions: [
          ["${Height} >= 83", "color('purple', 0.5)"],
          ["${Height} >= 80", "color('red')"],
          ["${Height} >= 70", "color('orange')"],
          ["${Height} >= 12", "color('yellow')"],
          ["${Height} >= 7", "color('lime')"],
          ["${Height} >= 1", "color('cyan')"],
          ["true", "color('blue')"],
        ],
      },
      // show: "${Height} >= 70" // 当高度大于等于70时显示瓦片，否则隐藏
      scaleByDistance: {
        near: 100.0,
        nearValue: 100.0,
        far: 1000.0,
        farValue: 0.5
      },
      // specular: "${Height} * 0.1", // 根据温度属性调整镜面反射强度
      normalTexture: "texture(https://81.69.20.73:3000/static/cdn/cesium/image/checkerboard.png)" // 使用法线贴图增强表面细节
      // rotation: "360.0 * fract(${Id} * 0.9)", // 根据瓦片ID创建旋转动画效果
    });
  }

  // 给建筑设置自定义贴图
  var customShader = new CustomShader({
    //  lightingModel: Cesium.LightingModel.PBR, // 光照会覆盖模式
    // 顶点传片元
    varyings: {
      v_normalMC: VaryingType.VEC3,
      v_st: VaryingType.VEC3
    },
    // 通用
    uniforms: {
      u_texture: {
        value: new TextureUniform({
          url: 'https://81.69.20.73:3000/static/cdn/cesium/image/checkerboard.png'
        }),
        type: UniformType.SAMPLER_2D
      },
      u_texture1: {
        value: new TextureUniform({
          url: 'https://81.69.20.73:3000/static/cdn/cesium/image/checkerboard.png'
        }),
        type: UniformType.SAMPLER_2D
      }
    },
    //贴纹理
    //顶点着色器
    //将法向量从顶点着色器设置变量传给片元着色器
    vertexShaderText: `
      void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
        // vsInput 中的属性 normalMC 表示顶点的法线向量，这里将其赋值给 v_normalMC。
        v_normalMC = vsInput.attributes.normalMC;
        // vsInput 中的属性 positionMC 表示顶点的位置，这里将其赋值给 v_st，通常用于纹理映射。
        v_st=vsInput.attributes.positionMC ;   
      }
    `,
    //片元着色器
    fragmentShaderText: /*glsl*/ `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        vec3 positionMC = fsInput.attributes.positionMC;
        //这里是设置要贴图的图片的尺寸，设置小了会重复
        float width = 37.0;
        float height = 40.0;
        vec3 rgb;
        //这是是设置了屋顶的颜色，当和法向量平行时，就是屋顶，这里设置0.95，相当于垂直，建筑物四周开始贴图
        if (dot(vec3(0.0, 1.0, 0.0), v_normalMC) > 0.95) {
          material.diffuse = vec3(1.0, 0.0, 0.0);
        } else {
          float textureX = 0.0;
          float dotYAxis = dot(vec3(0.0, 0.0, 1.0), v_normalMC);
          // cos(45deg) 约等于 0.71，这里是建筑物四周的向量与法向量会大于四十五度夹角
          if (dotYAxis > 0.71 || dotYAxis < -0.71) {
            //x代表的是前后面
            textureX = mod(positionMC.x, width) / width;
          } else {
            //z代表的是左右面
            textureX = mod(positionMC.z, width) / width;
          }
          float textureY = mod(positionMC.y, height) / height;
          //我这里是根据建筑物高度贴了两张不同的图片
          if (positionMC.y > 30.0) {
              rgb = texture(u_texture1, vec2(textureX, textureY)).rgb;       
          } else {
              rgb = texture(u_texture, vec2(textureX, textureY)).rgb;
          }
          material.diffuse = rgb;
        }
      }
    `
  })
  tileset.customShader = customShader
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<style scoped></style>
