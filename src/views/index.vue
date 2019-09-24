<template>
  <div class="index">
    <!-- 视图区域 -->
    <router-view></router-view>
    <!-- 底部导航 -->
    <TabBar :data="tabbarData" />
  </div>
</template>

<script>
import TabBar from "../components/TabBar";
export default {
  name: "index",
  data() {
    return {
      // 初始化底部导航数据  （因为有跳转功能 所以要加path属性）
      tabbarData: [
        { title: "首页", icon: "home", path: "/home" },
        { title: "订单", icon: "file-text-o", path: "/order" },
        { title: "我的", icon: "user", path: "/me" }
      ]
    };
  },
  components: {
    TabBar
  }
};
</script>

<style scoped>
.index {
  width: 100%;
  /* calc() 函数用于动态计算长度值。 */
  height: calc(100% - 45px);
}
</style>
