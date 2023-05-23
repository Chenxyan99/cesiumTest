//模拟卫星的轨迹
const data = [
  {
    longitude: -25,
    dimension: -16,
    height: 700000,
    time: 0,
  },
  {
    longitude: -25,
    dimension: -20,
    height: 700000,
    time: 40,
  },
  {
    longitude: -25,
    dimension: -24,
    height: 700000,
    time: 80,
  },
  {
    longitude: -25,
    dimension: -28,
    height: 700000,
    time: 120,
  },
  {
    longitude: -25,
    dimension: -32,
    height: 700000,
    time: 160,
  },
  {
    longitude: -25,
    dimension: -36,
    height: 700000,
    time: 200,
  },
];

//圆锥的轨迹
var h = 100000;
var l = -22;
const data2 = [
  {
    longitude: l,
    dimension: -16,
    height: h,
    time: 0,
  },
  {
    longitude: l,
    dimension: -20,
    height: h,
    time: 40,
  },
  {
    longitude: l,
    dimension: -24,
    height: h,
    time: 80,
  },
  {
    longitude: l,
    dimension: -28,
    height: h,
    time: 120,
  },
  {
    longitude: l,
    dimension: -32,
    height: h,
    time: 160,
  },
  {
    longitude: l,
    dimension: -36,
    height: h,
    time: 200,
  },
];

var t = 200;

//根据轨迹和圆锥半径计算覆盖区域
var radius = 350; //单位千米
var data_position = new Array(); //记录边界
for (var i = 0; i < data2.length; i++) {
  data_position.push(data2[i].longitude - radius / 111.111 - 5);
  data_position.push(data2[i].dimension);
}
for (var i = data2.length - 1; i >= 0; i--) {
  data_position.push(data2[i].longitude + radius / 111.111 - 0.7);
  data_position.push(data2[i].dimension);
}

var d1 = -28.363059,
  d2 = -17.74247,
  d3 = -28.110533,
  d4 = -34.403555,
  d5 = -21.634864,
  d6 = -34.365498,
  d7 = -21.313545,
  d8 = -17.707058;
//卫星最大波束覆盖区域
var arr = [d1, d2, d3, d4, d5, d6, d7, d8];
var area = viewer.entities.add({
  show: true,
  polygon: {
    hierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray(arr)
    ),
    outline: true,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 4,
    material: Cesium.Color.RED.withAlpha(0.15),
  },
});
const redCorridor = viewer.entities.add({
  corridor: {
    positions: Cesium.Cartesian3.fromDegreesArray([
      data_position[0],
      data_position[1],
      data_position[(data2.length - 1) * 2],
      data_position[(data2.length - 1) * 2 + 1],
      data_position[(data2.length - 1) * 2 + 2],
      data_position[(data2.length - 1) * 2 + 3],
      data_position[data_position.length - 2],
      data_position[data_position.length - 1],
      data_position[0],
      (d2 = data_position[1]),
    ]),
    width: 382900.0,
    material: Cesium.Color.RED.withAlpha(0.15),
  },
});

// 创建viewModel对象
const viewModel = {
  yzhShow: "open",
  yzhShows: ["open", "close"],
  yzShow: "open",
  yzShows: ["open", "close"],
  coverArea: "open",
  coverAreas: ["open", "close"],
};
// 监测viewModel中的属性
Cesium.knockout.track(viewModel);
// 将viewModel与HTML控件进行绑定
const toolbar = document.getElementById("toolbar");
// Cesium.knockout.applyBindings(viewModel, toolbar);

// 起始时间
var start = viewer.clock.currentTime;
// 结束时间
var stop = Cesium.JulianDate.addSeconds(start, t, new Cesium.JulianDate());
// 设置始时钟始时间
viewer.clock.startTime = start.clone();
// 设置时钟当前时间
viewer.clock.currentTime = start.clone();
// 设置始终停止时间
viewer.clock.stopTime = stop.clone();
// 时间速率，数字越大时间过的越快
viewer.clock.multiplier = 10;
// 时间轴
viewer.timeline.zoomTo(start, stop);
// 循环执行
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

var property = computeFlight(data, 0);
var property_yz = computeFlight(data2, 0);
var _orientation = new Cesium.VelocityOrientationProperty(property);
// 添加卫星
var planeModel = viewer.entities.add({
  // 和时间轴关联
  availability: new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({
      start: start,
      stop: stop,
    }),
  ]),
  position: property,
  orientation: _orientation,
  model: {
    uri: "./models/wx3.glb",
    scale: 300,
  },
  path: {
    resolution: 1,
    material: new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.3,
      color: Cesium.Color.BLUE, //路径的颜色
    }),
    width: 10,
  },
});
planeModel.position.setInterpolationOptions({
  //设定位置的插值算法,可以让轨道平滑
  interpolationDegree: 5,
  interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
});

//添加圆锥
var entity_yz = viewer.entities.add({
  availability: new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({
      start: start,
      stop: stop,
    }),
  ]),
  position: property_yz,
  orientation: new Cesium.VelocityOrientationProperty(property_yz),
  cylinder: {
    HeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    length: 1500000,
    topRadius: 0, //顶部半径
    bottomRadius: 350000, //底部半径
    material: Cesium.Color.BLUE.withAlpha(0.5),
    outline: !0,
    numberOfVerticalLines: 0,
    outlineColor: Cesium.Color.BLUE.withAlpha(0.8),
  },
});
entity_yz.position.setInterpolationOptions({
  //轨道平滑
  interpolationDegree: 5,
  interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
});

function computeFlight(source, angle) {
  var property = new Cesium.SampledPositionProperty();
  for (var i = 0; i < source.length; i++) {
    var time = Cesium.JulianDate.addSeconds(
      start,
      source[i].time,
      new Cesium.JulianDate()
    );
    var position = Cesium.Cartesian3.fromDegrees(
      source[i].longitude,
      source[i].dimension,
      source[i].height
    );

    //创建旋转矩阵
    var theAngle = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(angle));
    var rotated = Cesium.Matrix3.multiplyByVector(
      theAngle,
      position,
      new Cesium.Cartesian3()
    );
    // 添加位置，和时间对应
    property.addSample(time, rotated);
  }
  return property;
}

//圆锥数组
var entity_yz_arr = new Array();
var flag = true; //用于表示定时生成的圆锥是否显示

//实时更新卫星和圆锥的角度
setInterval(function () {
  //获取卫星和圆锥当前的位置
  let wx_position = planeModel.position.getValue(viewer.clock.currentTime);
  let yz_position = entity_yz.position.getValue(viewer.clock.currentTime);
  const heading = Cesium.Math.toRadians(90);
  const pitch = Cesium.Math.toRadians(0);
  const roll = Cesium.Math.toRadians(30);
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  const orientation1 = Cesium.Transforms.headingPitchRollQuaternion(
    wx_position,
    hpr
  );
  const orientation2 = Cesium.Transforms.headingPitchRollQuaternion(
    yz_position,
    hpr
  );
  (planeModel.orientation = orientation1),
    (entity_yz.orientation = orientation2);

  //最后把圆锥清除
  if (
    viewer.clock.currentTime.secondsOfDay >=
    viewer.clock.stopTime.secondsOfDay - 0.7
  ) {
    for (var i = 0; i < entity_yz_arr.length; i++)
      viewer.entities.remove(entity_yz_arr[i]);
  }
});

//定时生成圆锥覆盖区域
setInterval(function () {
  if (viewer.clock.shouldAnimate == true) {
    //时间轴不暂停才生成
    let yz_position = entity_yz.position.getValue(viewer.clock.currentTime);
    const heading = Cesium.Math.toRadians(90);
    const pitch = Cesium.Math.toRadians(0);
    const roll = Cesium.Math.toRadians(30);
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation2 = Cesium.Transforms.headingPitchRollQuaternion(
      yz_position,
      hpr
    );

    var entity_tmp = viewer.entities.add({
      show: flag,
      position: yz_position,
      orientation: orientation2,
      cylinder: {
        HeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        length: 1500000,
        topRadius: 0, //顶部半径
        bottomRadius: 350000, //底部半径
        material: Cesium.Color.BLUE.withAlpha(0.03),
        outline: !0,
        numberOfVerticalLines: 0,
        outlineColor: Cesium.Color.BLUE.withAlpha(0.1),
      },
    });
    entity_yz_arr.push(entity_tmp);
  }
}, 251);
