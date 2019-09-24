<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    // 执行获取定位的方法
    this.getLocation();
  },
  methods: {
    getLocation() {
      const self = this;
      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000
        });

        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);

        // 定位成功的方法
        function onComplete(data) {
          // data是具体的定位信息  精准定位
          // console.log(data);

          // 将获取的定位地址存储到 vuex 中
          self.$store.dispatch("setLocation", data);
          self.$store.dispatch("setAddress", data.formattedAddress);
        }
        // 定位失败的方法
        function onError(data) {
          // 定位出错    非精准定位
          // console.log(data);
          self.getLngLatLocation();
        }
      });
    },
    // 如果失败了执行 使用经纬度定位 PC 端的IP地址定位
    getLngLatLocation() {
      const self = this;
      AMap.plugin("AMap.CitySearch", function() {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function(status, result) {
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            console.log(result);
            AMap.plugin("AMap.Geocoder", function() {
              var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: result.adcode // 获得当前城市所在的编码 result.adcode
              });
              // 分解 经纬度
              var lnglat = result.rectangle.split(";")[0].split(",");

              geocoder.getAddress(lnglat, function(status, data) {
                if (status === "complete" && data.info === "OK") {
                  // result为对应的地理位置详细信息
                  // console.log(data);

                  // 如果失败了，就通过IP获取位置，然后存储到vuex中。
                  self.$store.dispatch("setLocation", {
                    addressComponent: {
                      city: result.city,
                      province: result.province
                    },
                    formattedAddress: data.regeocode.formattedAddress
                  });

                  self.$store.dispatch(
                    "setAddress",
                    data.regeocode.formattedAddress
                  );
                }
              });
            });
          }
        });
      });
    }
  }
};
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  font-size: 14px;
  background: #f1f1f1;
}
</style>
