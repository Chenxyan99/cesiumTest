// 得到Cesium.SampledPositionProperty数据
function computeSampledPosition(satelliteStateArray, angle) {
  var property = new Cesium.SampledPositionProperty();
  for (var i = 0; i < satelliteStateArray.length; i++) {
    // 1.使用start即一开始就运动 2.使用viewer.clock.currentTime，即从当前时间方便交互加入卫星
    var time = Cesium.JulianDate.addSeconds(
      viewer.clock.currentTime,
      satelliteStateArray[i].time,
      new Cesium.JulianDate()
    );
    // 获取位置
    var position = Cesium.Cartesian3.fromDegrees(
      satelliteStateArray[i].lon,
      satelliteStateArray[i].lat,
      satelliteStateArray[i].phei
    );
    // 绕y轴旋转角度的位置
    var theAngle = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(angle));

    var rotated = Cesium.Matrix3.multiplyByVector(
      theAngle,
      position,
      new Cesium.Cartesian3()
    );
    // 添加位置与时间
    property.addSample(time, rotated);
  }
  return property;
}

// 创建卫星实体
function createSatelliteEntity(satelliteStateArray, angle, index) {
  // 卫星
  var satellite_entity_p = computeSampledPosition(satelliteStateArray, angle);
  var satellite_entity = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: viewer.clock.currentTime,
        stop: Cesium.JulianDate.addSeconds(
          viewer.clock.currentTime,
          360,
          new Cesium.JulianDate()
        ),
      }),
    ]),
    position: satellite_entity_p,
    orientation: new Cesium.VelocityOrientationProperty(satellite_entity_p),
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

  // if (index == 0) {
  //   // 创建时钟对象
  //   var clock = viewer.clock;

  //   // 获取当前时刻的卫星位置信息
  //   var intervalId = setInterval(function () {
  //     var position = satellite_entity.position.getValue(clock.currentTime);
  //     var cartographic = Cesium.Cartographic.fromCartesian(position);
  //     var longitude = Cesium.Math.toDegrees(cartographic.longitude);
  //     var latitude = Cesium.Math.toDegrees(cartographic.latitude);
  //     var altitude = cartographic.height;

  //     // 输出卫星位置信息到控制台
  //     console.log("Satellite position: ", longitude, latitude, altitude);
  //   }, 10000);
  // }

  // 差值器
  satellite_entity.position.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
  });
  satellite_entities.push(satellite_entity);
  for (var i = 0; i < segments[index].length - 1; i++) {
    createSegmentEntity(i, angle, index);
    createLabelEntity(i, angle, index);
  }
}

// 添加卫星
function addSatellite(set, index) {
  // 首先得到运行轨迹
  var satelliteStateArray = [];
  for (var i = set.lon; i <= 360 + set.lon; i += 30) {
    var state = new State();
    state.lon = i;
    state.lat = set.lat;
    state.time = i - set.lon;
    satelliteStateArray.push(state);
  }
  // 创建实体
  createSatelliteEntity(satelliteStateArray, set.angle, index);
}

// 初始化卫星
for (let x = 0; x < SatelliteData.length; x++) {
  addSatellite(SatelliteData[x], x);
}
