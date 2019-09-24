<template>
  <div class="login">
    <div class="logo">
      <img src="../assets/logo.jpg" alt="my login image" />
    </div>
    <!-- 手机号 -->
    <InputGroup
      type="number"
      v-model="phone"
      placeholder="手机号"
      :btnTitle="btnTitle"
      :disabled="disabled"
      :error="errors.phone"
      @btnClick="getVerifyCode"
    />
    <!-- 验证码 -->
    <InputGroup type="number" v-model="verifyCode" placeholder="验证码" :error="errors.code" />

    <!-- 用户服务协议 -->
    <div class="login_des">
      <p>
        新用户登录即自动注册，表示已同意
        <span>《用户服务协议》</span>
      </p>
    </div>
    <!-- 登录按钮 -->
    <div class="login_btn">
      <!-- 使用 isClick的true或false 来判断 登录是否是禁用状态-->
      <button :disabled="isClick" @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script>
import InputGroup from "../components/InputGroup";
export default {
  name: "login",
  data() {
    return {
      phone: "",
      verifyCode: "",
      errors: {}, // 初始错误对象 ，因为有手机错误，或验证码错误
      btnTitle: "获取验证码",
      disabled: false
    };
  },
  computed: {
    // 控制登录按纽的禁用状态， 当手机号和验证码都不为空时，为true,
    isClick() {
      if (!this.phone || !this.verifyCode) return true;
      else return false;
    }
  },
  methods: {
    handleLogin() {
      // 清空错误提醒
      this.errors = {};
      // 发送请求  因为axios 放在原型链上了，所以此处使用this.$axios
      this.$axios
        .post("/api/posts/sms_back", {
          phone: this.phone,
          code: this.verifyCode
        })
        .then(res => {
          // console.log(res);
          // 检验成功 设置登录状态并且跳转到/
          localStorage.setItem("ele_login", true);
          this.$router.push("/");
        })
        .catch(err => {
          // 返回错误信息
          this.errors = {
            code: err.response.data.msg
          };
        });
    },
    // 获取验证码的方法，首先要判断手机号是否符合要求
    getVerifyCode() {
      if (this.validatePhone()) {
        // 执行例计时方法
        this.validateBtn();

        // 发送网络请求
        this.$axios
          .post("/api/posts/sms_send", {
            tpl_id: "136729",
            key: "795be723dd9e88c3ea98e2b6713ab795",
            phone: this.phone
          })
          .then(res => {
            console.log(res);
          });
      }
    },
    // 验证码倒计时方法   （当执行获取验证码方法时，就同时执行 倒计时的方法）
    validateBtn() {
      let time = 60;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          this.btnTitle = "获取验证码";
          this.disabled = false;
        } else {
          // 倒计时
          this.btnTitle = time + "秒后重试";
          this.disabled = true;
          time--;
        }
      }, 1000);
    },

    // 验证手机号的方法    符合就返回true,  不符合就返回false
    validatePhone() {
      // 1. 验证手机号码不能为空
      if (!this.phone) {
        this.errors = {
          phone: "手机号码不能为空"
        };
        return false;
      } else if (!/^1[345678]\d{9}$/.test(this.phone)) {
        // 2. 验证正确手机号
        this.errors = {
          phone: "请填写正确的手机号码"
        };
        return false;
      } else {
        // 3. 符合的，返回true
        this.errors = {};
        return true;
      }
    }
  },
  components: {
    InputGroup
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  background: #fff;
}

.logo {
  text-align: center;
}
.logo img {
  width: 150px;
}
.text_group,
.login_des,
.login_btn {
  margin-top: 20px;
}
.login_des {
  color: #aaa;
  line-height: 22px;
}
.login_des span {
  color: #4d90fe;
}
.login_btn button {
  width: 100%;
  height: 40px;
  background-color: #48ca38;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  border: none;
  outline: none;
}

/* 当登录状态有 disabled样式名时， 让背景色变淡 */
.login_btn button[disabled] {
  background-color: #8bda81;
}
</style>
