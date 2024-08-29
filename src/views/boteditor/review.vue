<template>
  <div class="app-container">
    <el-carousel :autoplay="false" type="card" height="575px">
      <el-carousel-item>
        <div style="width: 350px; margin-top: 150px; margin-left: 30%; border-radius: 9px;">
          <div class="small-chat-block">
            <div class="small-chat-window-welcome">
              <div class="small-chat-window-welcome-profile">
                <img :src="smallPageForm.iconUrl" class="small-chat-window-welcome-profile-icon">
                <div class="small-chat-window-welcome-profile-text">
                  <div class="small-chat-name">{{ smallPageForm.botName }}</div>
                  <div class="small-chat-title">{{ smallPageForm.dealerName }}</div>
                </div>
                <div class="small-chat-window-welcome-close-icon">
                  <img :src="smallPageForm.closeUrl" style="width: 15px; height: 15px; margin:7.5px;">
                </div>
              </div>
              <div class="small-chat-window-welcome-message">
                <div class="small-chat-window-welcome-message-text">
                  {{ smallPageForm.welcomeSentence }}
                </div>
                <Suggestions :small="true" :suggestions="getSuggestions()" :colors="colors" @sendSuggestion="_submitSuggestion" />
              </div>
            </div>
            <form :style="{background: colors.userInput.bg}" class="small-chat-window-input">
              <div
                ref="userInput"
                :placeholder="smallPageForm.placeholder"
                :style="{color: colors.userInput.text}"
                role="button"
                tabIndex="0"
                contentEditable="true"
                class="small-chat-window-input--text"
                @keydown="handleKey"
              />
              <div class="small-chat-window-input--buttons">
                <div class="small-chat-window-input--button">
                  <SendIcon :on-click="_submitText" :color="colors.userInput.text" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div style="background: white; width: 334px; margin-top:5px; margin-left: 30%; border-radius: 9px;">
          <ChatWindow
            ref="chatWindow"
            :message-list="chatPageForm.chatMessages"
            :on-user-input-submit="onMessageWasSent"
            :participants="chatPageForm.participants"
            :title="chatPageForm.chatWindowTitle"
            :title-image-url="chatPageForm.titleImageUrl"
            :is-open="chatPageForm.isChatOpen"
            :on-close="closeChat"
            :show-emoji="false"
            :show-file="false"
            :placeholder="chatPageForm.placeholder"
            :show-typing-indicator="chatPageForm.showTypingIndicator"
            :colors="colors"
            :always-scroll-to-bottom="chatPageForm.alwaysScrollToBottom"
            :message-styling="chatPageForm.messageStyling"
            :disable-user-list-toggle="chatPageForm.disableUserListToggle"
            :handle-bot-page-toggle="handleBotPageToggle"
            :show-tool-bar="true"
            :is-small="true"
            @scrollToTop="handleScrollToTop"
            @onType="handleOnType"
          />
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div style="background: white; width: 334px; margin-top:5px; margin-left: 30%; border-radius: 9px;">
          <WorkingHours :working-hours="dealerInfoForm.workingHours" :dealer-name="dealerInfoForm.mapName" />
        </div>
      </el-carousel-item>
    </el-carousel>
    <el-row :gutter="20" style="margin-top: 40px;">
      <el-col :span="10"><div class="col-divider-white" /></el-col>
      <el-col :span="4">
        <el-button type="primary" @click="centerDialogVisible = true">Publish</el-button>
      </el-col>
      <el-col :span="10"><div class="col-divider-white" /></el-col>
    </el-row>
    <el-dialog
      title="Warning"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>Press Confirm button to update bot to current settings.</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import WorkingHours from '@/components/BotPage/WorkingHours'
import ChatWindow from '@/components/BotUI/ChatWindow'
import Suggestions from '@/components/BotUI/Suggestions'
import SendIcon from '@/components/BotUI/SendIcon'
import { mapGetters } from 'vuex'
import { publishBotSetting } from '@/api/botSetting'

export default {
  name: 'ChatPageEditor',
  components: {
    WorkingHours,
    ChatWindow,
    Suggestions,
    SendIcon
  },
  data() {
    return {
      centerDialogVisible: false,
      colors: {
        header: {
          bg: '#1f95e7',
          text: '#ffffff'
        },
        launcher: {
          bg: '#1f95e7'
        },
        messageList: {
          bg: '#f5f5f5'
        },
        sentMessage: {
          bg: '#1f95e7',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#ffffff',
          text: '#222222'
        },
        userInput: {
          bg: '#ffffff',
          text: '#565867'
        },
        toolBar: {
          active: '#1296db',
          inactive: '#565867'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'smallPageForm', 'chatPageForm', 'dealerInfoForm', 'token', 'bot', 'dealerId'
    ])
  },
  methods: {
    getSuggestions() {
      return this.smallPageForm.quickReplies
    },
    _submitSuggestion(suggestion) {
      console.log(suggestion)
    },
    _submitText(event) {
      console.log('submitted')
    },
    submitForm() {
      publishBotSetting(this.token, this.dealerId, this.dealerId).then((resp) => {
        this.$message({
          showClose: true,
          message: 'Bot has been updated.',
          type: 'success'
        })
        this.centerDialogVisible = false
      }).catch(() => {
        this.$message({
          showClose: true,
          message: 'Failed to save. Please retry.',
          type: 'error'
        })
        this.centerDialogVisible = false
        return false
      })
    },
    handleKey(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this._submitText(event)
        event.preventDefault()
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    deleteRow(index, idx) {
      this.rowIndex.index = index
      this.rowIndex.idx = idx
      this.centerDialogVisible = true
    },
    handleDelete() {
      if (this.rowIndex.index === -1 || this.rowIndex.idx === -1) {
        this.centerDialogVisible = false
      } else {
        this.dealerInfoForm.workingHours.items[this.rowIndex.index].content.splice(this.rowIndex.idx, 1)
        this.centerDialogVisible = false
        this.rowIndex.index = -1
        this.rowIndex.idx = -1
      }
    },
    addRow(index) {
      this.dealerInfoForm.workingHours.items[index].content.push({ key: '', value: '' })
    },
    handleClick(tab, event) {
      console.log(tab, event)
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
    // getAllChats() {
    //   this.$store.dispatch('chat/getAllChats', 0)
    // },
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
      console.log('type')
      this.userIsTyping = true
    },
    handleTyping(text) {
      // Bug here
      console.log('typing')
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
      console.log('close')
    }
  }
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .col-divider-white {
    background-color: white;
    border-radius: 4px;
    min-height: 36px;
}
  .small-chat-block{
    width: 350px;
    height: 250px;
    display: flex;
    flex-direction: column;
    /* box-shadow: 0 20px 20px 0 rgba(26, 34, 40, 0.19); */
  }
.small-chat-window-welcome{
    height: 170px;
    display: flex;
    z-index: 10;
    flex-direction: column;
    background-color: white;
    border-radius: 9px;
    border: 1px solid rgba(0,0,0,0.1);
  }

  .small-chat-window-welcome-profile{
    height: 25%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .small-chat-window-welcome-profile-icon{
    margin: 15px 5px 15px 40px;
    width: 30px;
    height: 30px;
  }

  .small-chat-window-welcome-close-icon {
    margin-right: 10px;
    margin-top: 15px;
    background-color: #1f95e7;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    opacity: 0.5;
  }

  .small-chat-window-welcome-close-icon:hover {
    opacity: 1;
  }

  .small-chat-window-welcome-profile-text{
    margin: 15px 10px;
    font-size: 14px;
    text-align: left;
    width: 60%;
  }

  .small-chat-name {
    font-size: 14px;
  }

  .small-chat-title {
    font-size: 12px;
    color: rgba(0,0,0,0.4);
  }

  .small-chat-window-welcome-message{
    padding: 3px 20px;
    text-align: left;
  }

  .small-chat-window-welcome-message-text{
    margin: 10px 0px;
    max-height: 80px;
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .small-chat-window-welcome-message-text:hover{
    cursor: pointer;
  }

  .small-chat-window-input {
    height: 40px;
    margin:2px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 9px;
    background-color: rgba(0,0,0,0.1);
    display: flex;
  }
  .small-chat-window-input--text {
    width: 75%;
    height: 100%;
    padding: 10px 15px;
    resize: none;
    border: none;
    outline: none;
    box-sizing: border-box;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.33;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #565867;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    text-align: left;
  }

  .small-chat-window-input--text:empty:before {
    content: attr(placeholder);
    display: block;
    filter: contrast(15%);
    outline: none;
  }

  .small-chat-window-input--buttons{
    width: 15%;
    padding: 10px 15px;
  }
</style>
