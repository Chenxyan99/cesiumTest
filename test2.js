var positions = new Array();

var xhr = new XMLHttpRequest();

xhr.open("GET", "./CircularSat_LLA_Position.txt", true);

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var fileContent = xhr.responseText;
    var reader = new FileReader();
    reader.readAsText(new Blob([fileContent]));

    reader.onload = function (e) {
      var fileContent = e.target.result;
      var lines = fileContent.split("\n");
      for (var i = 4; i < lines.length; i++) {
        var line = lines[i];
        var numbers = line.match(/-?\d+\.\d+/g);
        if (numbers !== null) {
          // console.log(lon + " " + lat + " " + alt);
          var lat = parseFloat(numbers[1]);
          var lon = parseFloat(numbers[2]);
          var alt = parseFloat(numbers[3]);
          positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, alt));
        }
      }
    };
  }
};

xhr.send();

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

// var polyline = new Cesium.PolylineGraphics({
//   positions: positions,
//   width: 5,
//   material: Cesium.Color.RED,
// });

// viewer.entities.add({
//   polyline: polyline,
// });

setTimeout(function () {
  var positionProperty = new Cesium.SampledPositionProperty();

  var TimeInterval = 60;
  for (var i = 0; i < positions.length; i++) {
    var time = Cesium.JulianDate.addSeconds(
      viewer.clock.currentTime,
      i * TimeInterval,
      new Cesium.JulianDate()
    );
    var position = positions[i];
    positionProperty.addSample(time, position);
  }

  var satelliteEntity = new Cesium.Entity({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: viewer.clock.currentTime,
        stop: Cesium.JulianDate.addSeconds(
          viewer.clock.currentTime,
          60 * 60 * 24,
          new Cesium.JulianDate()
        ),
      }),
    ]),
    position: positionProperty,
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
    // 卫星模型
    model: {
      uri: "./models/wx3.glb",
      scale: 300,
    },
    path: {
      resolution: 1,
      material: Cesium.Color.WHITE,
      width: 0.5,
    },
  });

  // 插值器
  satelliteEntity.position.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
  });

  // 将卫星实体添加到Cesium的Viewer中显示
  viewer.entities.add(satelliteEntity);
}, 1000);
