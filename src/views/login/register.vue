<template>
  <div class="login-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerForm" class="register-form" auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">汽车租赁管理系统</h3>
      </div>


      <div style="display: flex;justify-content: space-between;">
        <el-form-item prop="custname" class="half">
            <span class="svg-container">
              <svg-icon icon-class="user"/>
            </span>
          <el-input
            ref="custname"
            v-model="registerForm.custname"
            placeholder="姓名"
            name="custname"
            type="text"
            tabindex="2"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="sex" class="half">
          <el-radio v-model="registerForm.sex" label="1">男</el-radio>
          <el-radio v-model="registerForm.sex" label="0">女</el-radio>
        </el-form-item>
      </div>

      <div style="display: flex;justify-content: space-between;">
        <el-form-item prop="phone" class="half">
            <span class="svg-container">
              <svg-icon icon-class="user"/>
            </span>
          <el-input
            ref="phone"
            v-model="registerForm.phone"
            placeholder="电话"
            name="phone"
            type="text"
            tabindex="5"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="career" class="half">
            <span class="svg-container">
              <svg-icon icon-class="user"/>
            </span>
          <el-input
            ref="career"
            v-model="registerForm.career"
            placeholder="职业"
            name="career"
            type="text"
            tabindex="6"
            auto-complete="on"
          />
        </el-form-item>
      </div>
      <el-form-item prop="identity">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
        <el-input
          ref="identity"
          v-model="registerForm.identity"
          placeholder="身份证号码"
          name="identity"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="address">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
        <el-input
          ref="address"
          v-model="registerForm.address"
          placeholder="地址"
          name="address"
          type="text"
          tabindex="4"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="address">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
        <el-input
          ref="password"
          v-model="registerForm.password"
          placeholder="密码"
          name="password"
          type="password"
          tabindex="4"
          auto-complete="on"
        />
      </el-form-item>

      <div style="display: flex;;">
        <el-form-item prop="email" class="email">
            <span class="svg-container">
              <svg-icon icon-class="user"/>
            </span>
          <el-input
            ref="email"
            v-model="registerForm.email"
            placeholder="电子邮箱"
            name="email"
            type="text"
            tabindex="7"
            auto-complete="on"
          />
        </el-form-item>
        <div
          style="width: 10%;display:flex;padding:12px 3px;color:#fff;background:rgba(0,0,0,0.1);border: 1px solid rgba(255, 255, 255, 0.1);border-radius: 5px;height:52px">
        </div>
      </div>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:0px;" @click="handleback">注册完成
      </el-button>
      <div style="display: flex;justify-content: space-between;">
      </div>

    </el-form>
    <!--  底部  -->
    <div class="el-login-footer" align="center">
      <span>Copyright © 2017-2021 lidawazi All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>

  import customer from '@/api/customer'

  export default {
    name: 'register',
    data() {
      const validateUsername = (rule, value, callback) => {
        callback()
      }
      const validatePassword = (rule, value, callback) => {
        callback()
      }
      const validateUserType = (rule, value, callback) => {
        callback()
      }
      return {
        registerForm: {
          identity: '',
          custname: '',
          sex: '',
          address: '',
          phone: '',
          career: '',
          email: '',
          password: ''
        },
        registerRules: {
          identity: '',
          custname: '',
          sex: '',
          address: '',
          phone: '',
          career: '',
          email: '',
          password: ''
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleback() {
        // 请求后端接口
        customer.add(this.registerForm).then(response => {
          this.$message({
            type: 'success',
            message: '注册成功，即将跳转到登陆页面'
          })
          this.$router.go(-1)
        }).error(error => {
          console.log(error)
          this.$message({
            type: 'warning',
            message: '注册失败!'
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .half {
      width: 48%;
      display: inline-block;
    }

    .email {
      width: 90%;
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .register-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 70px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .el-login-footer {
      height: 40px;
      line-height: 40px;
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: center;
      color: #fff;
      font-family: Arial;
      font-size: 12px;
      letter-spacing: 1px;
    }
  }
</style>

