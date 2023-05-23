// 隐藏/显示图层
var showEntitiesDiv = new Vue({
  el: "#entities",
  data: {
    checked1: true,
    checked2: true,
    checked3: true,
    checked4: true,
    checked5: true,
    checked6: false,
    checked7: true,
  },
  methods: {
    showSatellite(check) {
      if (check) {
        satellite_entities.forEach((element) => {
          element.model.show = true;
        });
      } else {
        satellite_entities.forEach((element) => {
          element.model.show = false;
        });
      }
    },
    showOrbit(check) {
      if (check) {
        satellite_entities.forEach((element) => {
          element.show = true;
        });
      } else {
        satellite_entities.forEach((element) => {
          element.show = false;
        });
      }
    },
    showSegment(check) {
      if (check) {
        segement_entities.forEach((element) => {
          element.show = true;
        });
        Label_entities.forEach((element) => {
          element.show = true;
        });
      } else {
        segement_entities.forEach((element) => {
          element.show = false;
        });
        Label_entities.forEach((element) => {
          element.show = false;
        });
      }
    },
    showHistoryBeam(check) {
      if (check) {
        entity_yz_arr.forEach((element) => {
          element.show = true;
          flag = true;
        });
      } else {
        entity_yz_arr.forEach((element) => {
          element.show = false;
          flag = false;
        });
      }
    },
    showBeam(check) {
      if (check) {
        entity_yz.show = true;
      } else {
        entity_yz.show = false;
      }
    },
    showBeamMaxArea(check) {
      if (check) {
        (area.show = true), (redCorridor.show = true);
      } else {
        (area.show = false), (redCorridor.show = false);
      }
    },
  },
});

var setting = new Vue({
  el: "#setting",
});
