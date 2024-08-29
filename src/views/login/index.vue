<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Email"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <!-- <div style="position:relative">

        <el-button class="thirdparty-button" type="success" @click="handleCreate">
          Register
        </el-button>
      </div> -->
    </el-form>

    <el-dialog title="Registration Form" :visible.sync="showDialog">
      <el-form ref="dataForm" :rules="registrationRules" :model="temp" label-position="left" label-width="140px" size="mini" class="registration-form">
        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" type="email" placeholder="Please enter email address." />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="temp.password" type="password" placeholder="Please enter your password." />
        </el-form-item>
        <el-form-item label="Confirm" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword" type="password" placeholder="Please confirm your password." />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="temp.name" placeholder="Please enter your name" />
        </el-form-item>
        <el-form-item label="Department" prop="dept">
          <!-- <el-input v-model="temp.dept" placeholder="Please enter department name" /> -->
          <el-select v-model="temp.dept" class="filter-item" placeholder="Please select">
            <el-option v-for="item in departmentOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="temp.role" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createData">
          Submit
        </el-button>
        <el-button @click="resetTemp">
          Reset
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { register } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }

    var validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.temp.password) {
        callback(new Error('Two inputs don\'t match!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      departmentOptions: ['Sales', 'Service', 'Management'],
      roleOptions: ['User', 'Admin'],
      temp: {
        id: undefined,
        email: '',
        password: '',
        conformPassword: '',
        name: '',
        dept: 'Sales',
        role: 'User'
      },
      registrationRules: {
        email: [{ required: true, message: 'Please enter your email', trigger: 'blur', validator: validateUsername }],
        password: [{ type: 'password', required: true, message: 'Please enter your password', trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ type: 'password', required: true, message: 'Please confirm your password', trigger: 'blur', validator: validateConfirmPass }],
        dept: [{ required: true, message: 'Please choose your department', trigger: 'change' }],
        role: [{ required: true, message: 'Please choose your role', trigger: 'change' }]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    window.addEventListener('load', function() {
      if (window.Notification && Notification.permission !== 'granted') {
        Notification.requestPermission(function(status) {
          if (Notification.permission !== status) {
            Notification.permission = status
          }
        })
      }
    })
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
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
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              console.log('Login....')
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch((err) => {
              console.error(err)
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        email: '',
        password: '',
        conformPassword: '',
        name: '',
        dept: 'Sales',
        role: 'User'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.showDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          register(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.showDialog = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.$nextTick(() => {
              this.loginForm = {
                username: this.temp.email,
                password: this.temp.password
              }
              this.$store.dispatch('user/login', this.loginForm)
                .then(() => {
                  this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                  this.loading = false
                })
            })
          })
        }
      })
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
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

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .registration-form {
    padding: 15px 10px;
    background: #2d3a4b;
    margin: 0 auto;
  }

  .el-form-item__label {
    display: inline-block;
    height: 47px;
    padding: 0 12px 0 10px;
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
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

  .thirdparty-button {
    // position: absolute;
    // right: 0;
    // bottom: 6px;
    width: 100%;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

</style>
