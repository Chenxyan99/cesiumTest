var viewer = new Cesium.Viewer("cesiumContainer", {
  //UI控制
  baseLayerPicker: false, //右上角的图层选择按钮
  animation: true, //左下角的动画仪表盘
  infoBox: true, //点击要素之后显示的信息
  geocoder: false, //搜索框
  homeButton: false, //home按钮
  sceneModePicker: true, //模式切换按钮
  timeline: true, //底部的时间轴
  fullscreenButton: true, //右下角的全屏按钮
  shouldAnimate: true,
  navigationHelpButton: false, //右上角的帮助按钮，
  selectionIndicator: false, //原生绿色选框
  terrainProvider: new Cesium.createWorldTerrain({
    requestWaterMask: true,
    requestVertexNormals: true,
  }),
  sceneMode: Cesium.SceneMode.SCENE2D,
});

//不显示太阳、关闭版权信息
{
  //viewer.scene.globe.enableLighting = true;
  //viewer.shadows = false;
  viewer.scene.sun.show = false; //不显示太阳
  viewer._cesiumWidget._creditContainer.style.display = "none"; //关闭底下的版权信息
  viewer._cesiumWidget._creditContainer.style.display = "none";

  viewer.clock.onTick.addEventListener(function () {
    if (viewer.camera.pitch > 0) {
      viewer.scene.screenSpaceCameraController.enableTilt = false;
    }
  });
}

//开启抗锯齿
{
  const scene = viewer.scene;
  if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    //判断是否支持图像渲染像素化处理
    viewer.resolutionScale = window.devicePixelRatio;
  }
  viewer.scene.fxaa = true;
  viewer.scene.postProcessStages.fxaa.enabled = true;
}

//开启地面深度检测，这样地下的就看不到了
viewer.scene.globe.depthTestAgainstTerrain = true;

// 状态结构体
function State() {
    this.lon = 0; // 经度
    this.lat = 0; // 纬度
    this.hei = 1100000; // 高度
    this.phei = 1100000 / 2; // 卫星轨道高度
    this.time = 0; // 对应的时间
  }
  
  // 六色选择
  var colors = [
    Cesium.Color.ORANGE,
    Cesium.Color.PINK,
    Cesium.Color.YELLOW,
    Cesium.Color.AQUA,
    Cesium.Color.GREEN,
    Cesium.Color.PURPLE,
  ];
  // 卫星实体集合
  var satellite_entities = new Array();
  
  // 卫星测试
  var SatelliteData = [
    { lon: 60, angle: 45, lat: 0 },
    { lon: 116, angle: 0, lat: 0 },
    { lon: 50, angle: -60, lat: 0 },
  ];


  // 任务测试
var segments = [
    [
      [60, 0],
      [80, 0],
      [100, 0],
      [150, 0],
      [200, 0],
    ],
    [
      [116, 0],
      [130, 0],
      [145, 0],
      [165, 0],
      [177, 0],
    ],
    [
      [50, 0],
      [70, 0],
      [90, 0],
      [150, 0],
    ],
  ];
  // 任务实体集合
  var segement_entities = new Array();
  // 任务标签实体集合
  var Label_entities = new Array();