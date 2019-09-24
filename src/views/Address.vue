<template>
  <div class="address">
    <!-- 头部组件  设置左侧显示   并传入标题 -->
    <Header :isLeft="true" title="选择收货地址" />

    <!-- 中间搜索部分 -->
    <div class="city_search">
      <div class="search">
        <span class="city" @click="$router.push('/city')">
          {{city}}
          <i class="fa fa-angle-down"></i>
        </span>
        <i class="fa fa-search"></i>
        <input type="text" v-model="search_val" placeholder="小区/写字楼/学校等" />
      </div>

      <!-- 显示当前定位  独立封装成一个组件了 -->
      <Location @click="selectAddress" :address="address" />
    </div>

    <!-- 根据搜索的值 展示的列表 -->
    <div class="area">
      <ul class="area_list" v-for="(item,index) in areaList" :key="index">
        <li @click="selectAddress(item)">
          <h4>{{item.name}}</h4>
          <p>{{item.district}}{{item.address}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import Location from "../components/Location";
export default {
  name: "Address",
  data() {
    return {
      city: "", // 当前的城市  （是由路由传参，组件自己的守卫赋值 ）
      search_val: "", // input中 v-model 绑定的值
      areaList: [] // 存储搜索到的结果
    };
  },
  computed: {
    // 从vuex 中获取当前定位的地址
    address() {
      return this.$store.getters.location.formattedAddress;
    }
  },
  /**
   *   使用 vatch 监听input框中的值， 监听的方法中，执行某一个方法， 这个方法中就可以获取监听input框中的值。
   *
   */
  watch: {
    // 监听搜索框中的值，
    search_val() {
      // 执行 搜索地址的方法。
      this.searchPlace();
    }
  },
  methods: {
    //  这个方法中，就可以获取监听到的搜索框中的值
    searchPlace() {
      // console.log(this.search_val);

      const self = this; // 存储this指向
      AMap.plugin("AMap.Autocomplete", function() {
        // 实例化Autocomplete
        var autoOptions = {
          //city 限定城市，默认全国
          city: self.city // 限定城市 设置为当前获取（组件的city）
        };
        var autoComplete = new AMap.Autocomplete(autoOptions);
        // self.search_val 搜索框中的值
        autoComplete.search(self.search_val, function(status, result) {
          // 搜索成功时，result即是对应的匹配数据
          // console.log(result);
          self.areaList = result.tips; // 将获取到的地址赋值给 areaList
        });
      });
    },

    // 1. 选中搜索的来的地址，返回home   2. 点击当前定位地址，返回home
    selectAddress(item) {
      // 如果传入参数
      if (item) {
        // 将选中的新地址 更新到vuex中
        this.$store.dispatch(
          "setAddress",
          item.district + item.address + item.name
        );
      } else {
        // 如果没有传参，就没选中新地址，就还是将 当前定位 更新到vuex中
        this.$store.dispatch("setAddress", this.address);
      }

      // 跳转home
      this.$router.push("/home");
    }
  },
  components: {
    Header,
    Location
  },

  //  使用 beforeRouteEnter  组件内的路由守卫来获取  另一个页面通过路由传递过来的值（城市）。
  beforeRouteEnter(to, from, next) {
    // console.log(to.params.city + "test");
    next(vm => {
      // 获取路由上的参数 复制给当前实现上的city属性。
      vm.city = to.params.city;
    });
  }
};
</script>

<style scoped>
.address {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}

.city_search {
  background-color: #fff;
  padding: 10px 20px;
  color: #333;
}

.search {
  background-color: #eee;
  height: 40px;
  border-radius: 10px;
  box-sizing: border-box;
  line-height: 40px;
}
.search .city {
  padding: 0 10px;
}
.city i {
  margin-right: 10px;
}
.search input {
  margin-left: 5px;
  background-color: #eee;
  outline: none;
  border: none;
}

.area {
  margin-top: 16px;
  background: #fff;
}
.area li {
  border-bottom: 1px solid #eee;
  padding: 8px 16px;
  color: #aaa;
}
.area li h4 {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
</style>
