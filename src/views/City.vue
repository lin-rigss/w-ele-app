<template>
  <div class="city">
    <!-- 搜索  -->
    <div class="search_wrap">
      <div class="search">
        <i class="fa fa-search"></i>
        <input v-model="city_val" type="text" placeholder="输入城市名" />
      </div>
      <button @click="$router.push({name:'address',params:{city:city}})">取消</button>
    </div>

    <div style="height:100%" v-if="searchList.length ==0">
      <!-- 当前定位 Location组件  -->
      <div class="location">
        <Location @click="selectCity({name:city})" :address="city" />
      </div>

      <!-- 热门城市  和  A-Z 城市  组件 -->
      <Alphabet @selectCity="selectCity" ref="allcity" :cityInfo="cityInfo" :keys="keys" />
    </div>

    <!-- 搜索出的城市列表 -->
    <div class="search_list" v-else>
      <ul>
        <li @click="selectCity(item)" v-for="(item,index) in searchList" :key="index">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Location from "../components/Location";
import Alphabet from "../components/Alphabet";
export default {
  name: "City",
  data() {
    return {
      city_val: "", // input框中的搜索 值
      cityInfo: null, // 存储的是 所有城市数据
      keys: [], // 存储 的是 A-Z 字母
      allCities: [], // 存储所有的城市数据
      searchList: [] // 存储匹配到的城市
    };
  },
  computed: {
    // 从vuex 中获取的 城市名
    city() {
      return (
        this.$store.getters.location.addressComponent.city ||
        this.$store.getters.location.addressComponent.province
      );
    }
  },
  components: {
    Location,
    Alphabet
  },
  created() {
    this.getCityInfo();
  },
  watch: {
    // 监听这个搜索值
    city_val() {
      // console.log(this.city_val);
      this.searchCity();
    }
  },
  methods: {
    // 获取城市数据
    getCityInfo() {
      this.$axios("/api/posts/cities")
        .then(res => {
          this.cityInfo = res.data;
          console.log(this.cityInfo);

          // 只获取 A-Z 的属性名  使用  Object.keys(res.data)
          this.keys = Object.keys(res.data);
          // console.log(this.keys);  // 只获取 A-Z 的属性名
          // hotcities这个key移除掉
          this.keys.pop();
          // keys 排序 A-Z
          this.keys.sort();

          // 获取到城市数据后，执行初始化BScroll的方法。（使用ref获取组件，并通过refs的名称来获取组件中的BScroll的方法）
          this.$nextTick(() => {
            this.$refs.allcity.initScroll();
          });

          /**
           *
           *  通过key属性值  获取key属性值中对应的数据
           *
           *   1. 遍历所有的A-Z 得到每一个    然后 所有数据[key]  再遍历得到A数据里面的每一个
           */
          // 存储所有城市, 用来搜索过滤
          this.keys.forEach(key => {
            // console.log(key); // A-Z
            this.cityInfo[key].forEach(city => {
              // console.log(city); // A : [A1 -A2] ...
              // 存储所有的城市数据
              this.allCities.push(city);
              // console.log(this.allCities);
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击页面中所有的城市   都会执行的方法
    selectCity(city) {
      // console.log(city);
      this.$router.push({ name: "address", params: { city: city.name } });
    },

    // 监听 input 搜索值 时 执行的方法
    searchCity() {
      if (!this.city_val) {
        // 如果搜索框为空, 数组置空
        this.searchList = [];
      } else {
        // 根据输入框的关键字检索城市 并存入到searchList数组中
        this.searchList = this.allCities.filter(item => {
          /**
           *  判断  搜索值 是否存在 所有城市数据中
           *   =-1 是不存在，
           *  !=-1 是存在  true   , 就会将条件成立的那一项存储到 searchList 中
           * */

          return item.name.indexOf(this.city_val) != -1;
        });
        // console.log(this.searchList);
      }
    }
  }
};
</script>

<style scoped>
.city {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}
.search_wrap {
  position: fixed;
  top: 0;
  height: 45px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 3px 16px;
  display: flex;
  justify-content: space-between;
}
.search {
  background-color: #eee;
  border-radius: 10px;
  line-height: 40px;
  width: 85%;
  box-sizing: border-box;
  padding: 0 16px;
}
.search input {
  background: #eee;
  outline: none;
  border: none;
  margin-left: 5px;
}
.search_wrap button {
  outline: none;
  color: #009eef;
}

.location {
  background: #fff;
  padding: 8px 16px;
  height: 65px;
  box-sizing: border-box;
}

.search_list {
  background: #fff;
  padding: 5px 16px;
}
.search_list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>
