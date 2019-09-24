<template>
  <div class="area" ref="area_scroll" v-if="cityInfo">
    <div class="scroll_wrap">
      <!-- 热门城市 -->
      <div class="hot_wrap citylist">
        <div class="title">热门城市</div>
        <ul class="hot_city">
          <li
            @click="$emit('selectCity',item)"
            v-for="(item,index) in cityInfo.hotCities"
            :key="index"
          >{{item.name}}</li>
        </ul>
      </div>

      <!-- 所有城市 -->
      <div class="city_wrap">
        <!-- 循环按字母排序的key -->
        <div class="city_content citylist" v-for="(item,index) in keys" :key="index">
          <div class="title">{{item}}</div>
          <!-- 根据字母key展示城市名 -->
          <ul>
            <li
              @click="$emit('selectCity',city)"
              v-for="(city,index) in cityInfo[item]"
              :key="index"
            >{{city.name}}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 右侧 字母导航 -->
    <div class="area_keys">
      <ul>
        <li @click="selectKey(0)">#</li>
        <li @click="selectKey(index+1)" v-for="(item,index) in keys" :key="index">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
/**
 * 1. 安装 better-scroll
 * 2. 引入
 * 3. 设置初始值  scroll:null
 * 4. 使用ref 获取需要滚动的元素
 * 5. 初始化 initScroll()方法
 * 6. 在获取此组件数据的地方（也许是其它组件中），执行 initScroll()方法
 * （使用ref获取组件 ，成功获取数据后    this.$nextTick(() => {
                                            this.$refs.allcity.initScroll();
                                       });）   
 * 
 * 
 */
import BScroll from "better-scroll";
export default {
  name: "Alphabet",
  data() {
    return {
      // 设置初始值  scroll
      scroll: null
    };
  },
  props: {
    cityInfo: Object,
    keys: Array
  },
  methods: {
    // 初始货 BScroll
    initScroll() {
      // 使用 refs获取元素，使元素有滚动效果
      this.scroll = new BScroll(this.$refs.area_scroll, {
        click: true
      });
    },

    // 点击字母导航执行的方法  （接收索引）
    selectKey(index) {
      // console.log(index);
      // console.log(this.$refs.area_scroll.getElementsByClassName("citylist"));

      // 获取元素，通过获取真实DOM ，并给元素添加类名， 通过获取类名获取所有的DOM元素
      const citylist = this.$refs.area_scroll.getElementsByClassName(
        "citylist"
      );
      // 根据下标,滚动到相对应的元素上
      let el = citylist[index];

      // 实例的方法实现滚动到对应索引的元素上
      // el 滚动的元素   250 需要运动的时间
      this.scroll.scrollToElement(el, 250);
    }
  }
};
</script>
<style scoped>
.area {
  margin-top: 10px;
  box-sizing: border-box;
  padding: 0 16px;
  background: #fff;
  height: calc(100% - 65px);
  overflow: hidden;
}
.scroll_wrap {
  background: #fff;
  overflow: auto;
}
.title {
  color: #aaa;
  padding: 15px 0;
}
.hot_city {
  padding: 0 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.hot_city li {
  width: 30%;
  background: #f1f1f1;
  margin: 0 10px 10px 0;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
}
.city_content li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.area_keys {
  position: fixed;
  right: 0;
  top: 25%;
  color: #aaa;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
  padding: 0 5px;
}
</style>
