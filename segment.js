// 创建任务实体
function createSegmentEntity(i, angle, index) {
  var satelliteStateArray = [];
  for (var j = segments[index][i][0]; j <= segments[index][i + 1][0]; j += 1) {
    var state = new State();
    state.lon = j;
    state.lat = segments[index][i][1];
    state.time = j - segments[index][i][0];
    satelliteStateArray.push(state);
  }
  // 创建一个SampledPositionProperty对象
  var sampledPositions = computeSampledPosition(satelliteStateArray, angle);

  var Segment_entity = viewer.entities.add({
    name: "卫星" + index + "-任务" + i,
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
    position: sampledPositions,
    path: {
      resolution: 1,
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: colors[i],
        outlineWidth: 0,
        outlineColor: null,
      }),
      width: 4,
      height: 2000, // 设置路径高度
      extrudedHeight: 2000, // 设置路径挤压高度
    },
    description: "<p>" + "任务" + i + "</p>",
  });
  // 差值器
  Segment_entity.position.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
  });
  segement_entities.push(Segment_entity);
}

// 创建标签实体
function createLabelEntity(i, angle, index) {
  var position1 = Cesium.Cartesian3.fromDegrees(
    segments[index][i][0],
    segments[index][i][1],
    1100000 / 2
  );
  var theAngle = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(angle));
  var rotated = Cesium.Matrix3.multiplyByVector(
    theAngle,
    position1,
    new Cesium.Cartesian3()
  );
  var LabelEntity = viewer.entities.add({
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
    position: rotated,
    label: {
      text: "卫星" + index + "-任务" + i,
      font: "14px sans-serif",
      showBackground: true,
      style: Cesium.LabelStyle.FILL,
      outlineWidth: 30,
      backgroundColor: new Cesium.Color.fromCssColorString("#8b8784"),
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER, //对齐方式
      pixelOffset: new Cesium.Cartesian2(50, -50), //设置偏移量
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        2000000,
        20000000
      ),
    },
  });
  Label_entities.push(LabelEntity);
}

// 任务详情显示
viewer.screenSpaceEventHandler.setInputAction(function onMouseClick(movement) {
  var pickedObject = viewer.scene.pick(movement.position);

  for (var i = 0; i < segement_entities.length; i++) {
    var segement = segement_entities[i];
    if (Cesium.defined(pickedObject) && pickedObject.id === segement) {
      // 当前 Polyline 被选中，将其高亮显示，并显示详情infobox
      segement.path.material.outlineWidth = 2;
      segement.path.material.outlineColor = Cesium.Color.RED;

      viewer.selectedEntity = segement;
    } else {
      // 当前 Polyline 已经被选中，恢复到默认状态
      segement.path.material.outlineWidth = 0;
      segement.path.material.outlineColor = null;
    }
  }
  // 选中未定义目标不显示infobox
  if (!Cesium.defined(pickedObject)) {
    viewer.selectedEntity = null;
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);