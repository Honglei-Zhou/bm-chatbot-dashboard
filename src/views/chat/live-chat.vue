<template>
  <div class="mixin-components-container">
    <el-row :gutter="20" style="margin-top:25px;">
      <el-col :span="6">
        <div v-loading="containerLoading" style="max-height: 650px; overflow-y: scroll;">
          <div
            v-for="(item, idx) in messageContainer"
            :key="idx"
            class="message-list-wrapper"
          >
            <div v-show="viewAllChats || onlineChats[item.groupId]===true" class="message-list" :class="{'clicked': item.groupId === currentSession}" @click="openChatWindow(item.groupId)">
              <div :key="randomKey" class="avatar-wrapper">
                <img :src="onlineChats[item.groupId]===true?UserAvatar:OfflineUserAvatar" class="avatar">
              </div>
              <div class="info">
                <div class="info-top">
                  <div :class="{'info-content-online': onlineChats[item.groupId] !== undefined && onlineChats[item.groupId], 'info-content-offline': onlineChats[item.groupId] === undefined || onlineChats[item.groupId] === false }">{{ onlineChats[item.groupId] | onlineStatusFilter }}</div>
                  <!-- <div v-if="onlineChats[item.groupId]" class="info-content-online">Online</div>
                  <div v-else class="info-content-offline">Offline</div> -->
                  <span class="from">{{ item.time | timeFilter }}</span>
                  <div class="info-close" @click="removeChatSession(item, idx)"><img :src="closeIcon" style="width:14px;height:14px; border-radius:50%;"></div>
                </div>
                <div class="info-middle">
                  <div class="message-content">{{ item.message | messageFilter }}
                  </div>
                  <div :key="item.unread" class="notification-wrapper">
                    <div v-show="item.unread > 0" class="notification">{{ item.unread | unreadFilter }}</div>
                  </div>
                </div>

                <div class="info-bottom">
                  <div class="message-content" style="color: #67C23A;">{{ chatLocations[item.groupId] | locationFilter }}
                  </div>
                  <div class="message-content" style="color: #67C23A;">{{ chatLocations[item.groupId] | deviceFilter }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 20px; padding: 0px 30px 0px 10px; display: flex; flex-direction: column;">
          <el-button type="primary" icon="el-icon-refresh" @click="refreshChats">Refresh</el-button>
        </div>
        <div style="margin-top: 20px; padding: 0px 30px 0px 10px; display: flex; flex-direction: column;">
          <el-button v-if="viewAllChats" type="success" icon="el-icon-mobile-phone" @click="toggleOnlineChats">View Online Chats</el-button>
          <el-button v-else type="warning" icon="el-icon-loading" @click="toggleOnlineChats">View All Chats</el-button>
        </div>
      </el-col>

      <el-col :span="8">
        <div v-loading="chatLoading" class="component-item" style="min-height: 500px; max-height:850px;">
          <ChatWindow
            ref="chatWindow"
            :message-list="chatMessages"
            :on-user-input-submit="onMessageWasSent"
            :participants="participants"
            :title="chatWindowTitle"
            :title-image-url="titleImageUrl"
            :is-open="isChatOpen"
            :on-close="closeChat"
            :show-emoji="false"
            :show-file="false"
            :placeholder="placeholder"
            :show-typing-indicator="showTypingIndicator"
            :colors="colors"
            :always-scroll-to-bottom="alwaysScrollToBottom"
            :message-styling="messageStyling"
            :disable-user-list-toggle="disableUserListToggle"
            :handle-bot-page-toggle="handleBotPageToggle"
            @scrollToTop="handleScrollToTop"
            @onType="handleOnType"
          />
          <div v-show="isChatOpen" class="chat-tool-bar">
            <el-button v-if="botMuted" type="success" round :disabled="sessionEnded" @click="unMuteBot">Unmute Bot</el-button>
            <el-button v-else type="warning" :disabled="sessionEnded" round @click="muteBot">Mute Bot</el-button>
            <el-button v-if="sessionEnded" type="info" round disabled>Chat Ended</el-button>
            <el-button v-else type="danger" round @click="endSession">End Chat</el-button>
          </div>
        </div>
      </el-col>

      <el-col :span="10">
        <div ref="botPage" class="component-item" style="min-height: 500px; max-height:750px; overflow-y: scroll;">
          <bot-page
            :participants="participants"
            :title="chatWindowTitle"
            :title-image-url="titleImageUrl"
            :is-open="isPageOpen"
            :on-close="closePage"
            :colors="colors"
            :disable-user-list-toggle="disableUserListToggle"
            @scrollUp="scrollUp"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import DropdownMenu from '@/components/Share/DropdownMenu'
import waves from '@/directive/waves/index.js' // 水波纹指令
import BotPage from '@/components/BotPage/BotPage'
import ChatWindow from '@/components/BotUI/ChatWindow'
import { mapGetters } from 'vuex'
// import ChatAvatar from '@/assets/icons/bmbot.png'
import UserAvatar from '@/assets/icons/user2.png'
import OfflineUserAvatar from '@/assets/icons/user3.png'
// import AdminAvatar from '@/assets/icons/admin.png'
import { chatService } from '@/api/chatService'
import { messageService } from '@/api/messageService'
// import { Loading } from 'element-ui'.
import moment from 'moment-timezone'
import closeIcon from '@/assets/icons/close-icon.png'
import { randomKey } from '@/utils/tools'
import { setTimeout } from 'timers'

export default {
  name: 'LiveChat',
  components: {
    BotPage,
    ChatWindow
  },
  directives: {
    waves
  },
  filters: {
    messageFilter(message) {
      // console.log(message)
      if (message.type === 'text') return message.data.text
      else return 'Multimedia Message...'
    },
    timeFilter(timestamp) {
      var curTime = moment.tz(timestamp, 'Europe/London')
      var localTime = curTime.clone().tz('America/Chicago')
      return localTime.format('MMM Do, h:mm a')
    },
    unreadFilter(unreadNum) {
      // console.log(unreadNum)
      if (unreadNum > 99) return '..'
      else return unreadNum
    },
    locationFilter(location) {
      if (location === undefined || location.city === 'NA') {
        return 'Click to view locations'
      } else {
        return location.city + ',' + location.state
      }
    },
    deviceFilter(location) {
      if (location === undefined || location.deviceType === 'NA') {
        return ''
      } else {
        return 'Device: ' + location.deviceType
      }
    },
    onlineStatusFilter(flag) {
      if (flag === undefined || flag === false) {
        return 'Offline'
      } else {
        return 'Online'
      }
    }
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('Please enter 6 characters.'))
      } else {
        callback()
      }
    }
    return {
      closeIcon: closeIcon,
      viewAllChats: true,
      chatLoading: false,
      // chatWindowTitle: 'Telle Chat',
      // titleImageUrl: '',
      isPageOpen: true,
      chatIdx: -1,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      placeholder: 'Enter your message',
      currentSession: '',
      disableUserListToggle: false,
      chatMessages: [],
      alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown),
      pageName: 'profile',

      demo: {
        title: ''
      },
      demoRules: {
        title: [{ required: true, trigger: 'change', validator: validate }]
      },
      botMuted: false,
      sessionEnded: false,
      unread: 0,
      UserAvatar: UserAvatar,
      OfflineUserAvatar: OfflineUserAvatar,
      containerLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'messageContainer', 'sessionMessages', 'token', 'participants', 'colors', 'sessionMeta',
      'mutedChats', 'onlineChats', 'chatLocations', 'dealerId', 'chatWindowTitle', 'titleImageUrl'
    ]),
    messagesWithRandomKey() {
      return this.messageContainer.map(message => { return { message, key: randomKey() } })
    },
    randomKey() {
      return randomKey()
    },
    onlineStatus(flag) {
      if (flag === undefined || flag === false) {
        return 'info-content-offline'
      } else {
        return 'info-content-online'
      }
    }
  },
  watch: {
    messageContainer() {
      this.getUnread()
    },
    sessionMessages() {
      // console.log(this.sessionMessages)
      this.chatMessages = this.sessionMessages[this.currentSession]
    },
    botMuted() {
      // console.log(this.botMuted)
      var data = { sessionId: this.currentSession, muted: this.botMuted === undefined ? false : this.botMuted }
      // console.log(data)
      this.$store.dispatch('chat/setMutedChat', data)
    }
  },
  created() {
    console.log('Created')
    if (this.token) {
      this.$store.dispatch('chat/getAllChats', { token: this.token, val: 0 })
    }
    this.$store.dispatch('bmbot/getAllCars', { pageNum: 1, dealerId: this.dealerId })
  },
  mounted() {
    console.log(this.$socket)
    console.log('Mounted')
  },
  methods: {
    refreshChats() {
      this.containerLoading = true
      if (this.token) {
        this.$store.dispatch('chat/getAllChats', { token: this.token, val: 0 })
      }
      setTimeout(() => {
        this.containerLoading = false
      }, 1000)
    },
    removeChatSession(item, idx) {
      this.$store.commit('chat/removeChatSession', idx)
      console.log(item)
      chatService.updateChatSession(this.token, item.groupId)
    },
    scrollUp() {
      this.$refs.botPage.scrollTop = 0
    },
    sendItem(item) {
      this.$refs.chatWindow.sendItem(item)
    },
    closePage() {
      console.log('Close')
    },
    onMessageWasSent(message) {
      // console.log(message)
      this.$store.dispatch('chat/sendMessage', { message: message, groupId: this.currentSession })
      // this.sendMessage(message)
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
      console.log('Scroll')
    },
    handleOnType() {
      this.$root.$emit('onType')
      this.userIsTyping = true
    },
    handleTyping(text) {
      // Bug here
      this.showTypingIndicator =
        text.length > 0
          ? this.participants[this.participants.length - 1].id
          : ''
    },
    openPage() {
      this.isPageOpen = true
    },
    handleBotPageToggle(item) {
      // console.log(this.$refs)
      this.pageName = item.name
      // console.log(this.pageName)
    },
    closeChat() {
      this.$store.commit('chat/resetCurrentGroupId')
      this.getUnread()
      this.isChatOpen = false
    },
    openChatWindow(groupId) {
      this.chatLoading = true
      this.botMuted = this.mutedChats[groupId]
      this.currentSession = groupId
      // console.log(this.currentSession)
      this.$store.dispatch('chat/getUserLocation', { token: this.token, groupId: groupId })
      if (this.sessionMessages[groupId] && this.sessionMessages[groupId].length > 0) {
        this.chatMessages = this.sessionMessages[this.currentSession]
        this.isChatOpen = true
        this.chatLoading = false
        this.resetAndGetUnread(groupId)
        setTimeout(() => {
          chatService.updateSessionMessages(this.token, groupId)
        }, 2000)
      } else {
        chatService.getSessionMessages(this.token, groupId).then((resp) => {
          const messages = resp.data
          // console.log(messages)
          if (messages.length > 0) {
            var results = []
            var parsedMessages = []
            messages.forEach((message) => {
            // console.log(message.message)
              var curTime = moment.tz(message.created, 'Europe/London')
              var localTime = curTime.clone().tz('America/Chicago')
              var sysMessage = {
                groupId: message.session_id,
                message: { type: 'system', author: 'support', data: { text: 'Received: ', meta: localTime.format('MMMM Do, h:mm a') }},
                unread: 0
              }
              // console.log(sysMessage)
              if (message.direction === 'incoming') {
                var customerMessage = JSON.parse(message.message)
                customerMessage.author = 'user'
                results.push(sysMessage)
                results.push({
                  groupId: message.session_id,
                  message: customerMessage,
                  unread: 0
                })
              } else if (message.from_bot === 0) {
                var adminMessage = JSON.parse(message.message)
                adminMessage.author = 'me'
                sysMessage.message.data.text = 'Sent'
                results.push(sysMessage)
                results.push({
                  groupId: message.session_id,
                  message: adminMessage,
                  unread: 0
                })
              } else {
                parsedMessages = messageService.parseMessage(message, 'support')
                results.push(sysMessage)
                parsedMessages.forEach(item => {
                  results.push(item)
                })
              }
            })
            // console.log(results.length)
            this.$store.dispatch('chat/getSessionMessages', { results: results, groupId: groupId })
            this.resetAndGetUnread(groupId)
            this.chatMessages = this.sessionMessages[this.currentSession]
            this.isChatOpen = true
            this.chatLoading = false
            setTimeout(() => {
              chatService.updateSessionMessages(this.token, groupId)
            }, 2000)
          // commit('pushSessionMessages', { results: results, groupId: groupId })
          }
        })
      }
    },
    resetAndGetUnread(groupId) {
      // console.log('resetAndGetUnread')
      this.$store.commit('chat/updateCurrentGroupId', groupId)
      this.$store.commit('chat/updateUnreadMessage', {
        groupId
      })
      this.getUnread()
    },
    // unread message number
    getUnread() {
      let unread = 0
      this.messageContainer.forEach(item => {
        unread += item.unread
      })
      this.unread = unread
    },
    updateChatStatus() {
      console.log(this.onlineChats)
    },
    muteBot() {
      this.botMuted = true
      // console.log('Muted')
      this.$store.dispatch('chat/setSessionMeta', { action: 'mute', groupId: this.currentSession, botMuted: this.botMuted, sessionEnded: this.sessionEnded })
    },
    unMuteBot() {
      this.botMuted = false
      // this.$store.dispatch('chat/setMutedChat', { sessionId: this.currentSession, muted: false })
      this.$store.dispatch('chat/setSessionMeta', { action: 'unmute', groupId: this.currentSession, botMuted: this.botMuted, sessionEnded: this.sessionEnded })
    },
    endSession() {
      this.sessionEnded = true
      this.$store.dispatch('chat/setSessionMeta', { action: 'end', groupId: this.currentSession, botMuted: this.botMuted, sessionEnded: this.sessionEnded })
    },
    toggleOnlineChats() {
      this.viewAllChats = !this.viewAllChats
    }
  }
}
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}

.component-item{
  /* height:420px; */
  background:#fff;
  /* min-height: 100px; */
}
.message-list-wrapper {
  cursor:pointer;
  width:100%;
  background:#fff;
  border-bottom:1px solid #eee;
}

/* .opened{
  background: #67C23A;
} */

.message-list{
  /* padding:4px 10px; */
  height:80px;
  line-height:80px;
  font-size:0;
  display: flex;
  flex-direction: row;
  justify-content: left;
}

.message-list-wrapper :hover {
  background: #409EFF;
}

.clicked {
  background: #b3d8ff;
}

.avatar-wrapper {
  width: 20%;
}

.avatar{
  width:50px;
  height:50px;
  border-radius:50%;
  margin-left: 5px;
  vertical-align:middle;
}

.info{
  height: 100%;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
}
.info-top {
  width: 100%;
  height: 33%;
  display: flex;
  vertical-align: middle;
  padding-top: 5px;
}

.info-content-online {
  color:#67C23A;
  width:30%;
  font-size:14px;
  line-height: 16px;
  font-weight: 700;
  height: 16px;
  overflow:hidden;  /*内容超出后隐藏*/
  text-overflow:ellipsis; /*当文本溢出时显示省略标记(...)*/
  white-space:nowrap;  /*文本不换行*/
  word-break:keep-all;
}

.info-content-offline {
  color:#666;
  width:30%;
  font-size:14px;
  line-height: 16px;
  font-weight: 700;
  height: 16px;
  overflow:hidden;  /*内容超出后隐藏*/
  text-overflow:ellipsis; /*当文本溢出时显示省略标记(...)*/
  white-space:nowrap;  /*文本不换行*/
  word-break:keep-all;
}

.info-content {
  color:#666;
  width:30%;
  font-size:14px;
  line-height: 16px;
  font-weight: 700;
  height: 16px;
  overflow:hidden;  /*内容超出后隐藏*/
  text-overflow:ellipsis; /*当文本溢出时显示省略标记(...)*/
  white-space:nowrap;  /*文本不换行*/
  word-break:keep-all;
}
.from{
  width: 60%;
  padding-right: 15px;
  color:#666;
  font-size:13px;
  line-height: 16px;
  height: 16px;
  text-align: right;
}
.info-close {
  width: 20px;
  height: 20px;
  vertical-align: top;
  background-color: #C0C4CC;
  border-radius: 50%;
  display:flex;
  justify-content: center;
  padding:3px;
  cursor: pointer;
}

.info-close:hover{
  background-color:#F56C6C;
}

.info-close img:hover{
  background-color:#F56C6C;
}

.info-middle {
  width: 100%;
  height: 33%;
  display: flex;
  vertical-align: middle;
  padding-top: 5px;
}
.info-bottom {
  width: 100%;
  height: 33%;
  display: flex;
  vertical-align: middle;
  padding-top: 5px;
}
.message-content{
  color:#666;
  width:64%;
  font-size:14px;
  line-height: 100%;
  height: 100%;
  overflow:hidden;  /*内容超出后隐藏*/
  text-overflow:ellipsis; /*当文本溢出时显示省略标记(...)*/
  white-space:nowrap;  /*文本不换行*/
  word-break:keep-all;
}
.notification-wrapper {
  width: 36%;
  padding-right: 15px;
  position: relative;
}
.notification{
  border-radius:50%;
  width:16px;
  height:16px;
  line-height: 16px;
  background:red;
  color:white;
  font-size:12px;
  text-align:center;
  position: absolute;
  right: 15px;
}

ul li:first-child{
      height:42px;
      line-height:42px;
      border:none;
      margin-top:2px
}

.chat-tool-bar {
  /* min-height: 55px; */
  height: 55px;
  margin: 0px;
  position: relative;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /* background-color: #f4f7f9; */
  box-shadow: 0 0 1px 1px rgba(0,0,0,0.2);
  /* border-top-left-radius: 9px; */
  /* border-top-right-radius: 9px; */
  background: #ffffff;
  /* border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px; */
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.chat-tool-bar--buttons {
  /* width: 100px; */
  width: 100%;
  /* position: absolute; */
  border-top: 1px solid rgba(0,0,0,0.1);
  height: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content:space-evenly;
}

</style>

