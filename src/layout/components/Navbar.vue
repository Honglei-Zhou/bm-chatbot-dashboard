<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="mailBox" class="user-avatar">
          <div v-show="notifications.message > 0 || notifications.leads > 0" class="notification">{{ unread }}</div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-show="notifications.message > 0">
            <span style="display:block;" @click="viewMessages">Your have {{ notifications.message }} new messages</span>
          </el-dropdown-item>
          <el-dropdown-item v-show="notifications.leads > 0">
            <span style="display:block;" @click="viewLeads">Your have {{ notifications.leads }} new leads</span>
          </el-dropdown-item>
          <el-dropdown-item v-show="notifications.message == 0 && notifications.leads == 0">No new messages</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <avatar username="Administrator" :size="40" />
          <!-- <div v-show="notifications.message > 0 || notifications.leads > 0" class="notification">{{ notifications.message + notifications.leads }}</div> -->
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link> -->
          <!-- <router-link v-show="notifications.message > 0" to="/chats/live-chat">
            <el-dropdown-item>Your have {{ notifications.message }} new messages.</el-dropdown-item>
          </router-link>
          <router-link v-show="notifications.leads > 0" to="/leads/leads-list">
            <el-dropdown-item>Your have {{ notifications.leads }} new leads.</el-dropdown-item>
          </router-link> -->
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import Avatar from 'vue-avatar'
import mailBox from '@/assets/icons/mailbox.png'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    Avatar
  },
  data() {
    return {
      mailBox: mailBox
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'notifications'
    ]),
    unread() {
      var val = this.notifications.message + this.notifications.leads
      console.log(val)
      return val
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      console.log(this.$socket)
      if (this.$socket) {
        this.$socket.disconnect()
      }
    },
    viewLeads() {
      console.log('clicked')
      this.$store.commit('chat/resetLeadsNotification')
      this.$router.push('/leads/leads-list')
    },
    viewMessages() {
      this.$store.commit('chat/resetMessageNotification')
      this.$router.push('/chats/live-chat')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

      .notification{
          border-radius:50%;
          width:18px;
          height:18px;
          line-height: 18px;
          background:red;
          color:white;
          font-size:12px;
          text-align:center;
          position: absolute;
          right: -5px;
          top: 0px;
      }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
