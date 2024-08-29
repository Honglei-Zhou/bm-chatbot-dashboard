<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top: 40px;">
      <el-col :span="11">
        <el-form ref="pageForm" :model="pageForm" :rules="rules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="Chat Window Title" prop="chatWindowTitle">
            <el-input v-model="pageForm.chatWindowTitle" />
          </el-form-item>
          <el-form-item label="Logo" prop="logo">
            <el-upload
              ref="upload"
              action=""
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :before-upload="beforeImageUpload"
              :http-request="handleUpload"
              :multiple="false"
              :limit="1"
              :disabled="pageForm.uploaded"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="pageForm.dialogVisible">
              <img width="100%" :src="pageForm.dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('pageForm')">Save</el-button>
            <el-button @click="resetForm('pageForm')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2"><div class="col-divider-white" /></el-col>
      <el-col :span="11">
        <el-card shadow="always" :body-style="{height: '650px', width: '334px'}">
          <div style="width: 334px; height: 564px; border-radius: 9px; background: white;">
            <ChatWindow
              ref="chatWindow"
              :message-list="pageForm.chatMessages"
              :on-user-input-submit="onMessageWasSent"
              :participants="pageForm.participants"
              :title="pageForm.chatWindowTitle"
              :title-image-url="pageForm.titleImageUrl"
              :is-open="pageForm.isChatOpen"
              :on-close="closeChat"
              :show-emoji="false"
              :show-file="false"
              :placeholder="pageForm.placeholder"
              :show-typing-indicator="pageForm.showTypingIndicator"
              :colors="colors"
              :always-scroll-to-bottom="pageForm.alwaysScrollToBottom"
              :message-styling="pageForm.messageStyling"
              :disable-user-list-toggle="pageForm.disableUserListToggle"
              :handle-bot-page-toggle="handleBotPageToggle"
              :show-tool-bar="true"
              :is-small="true"
              @scrollToTop="handleScrollToTop"
              @onType="handleOnType"
            />
          </div>
        </el-card></el-col>
    </el-row>
  </div>
</template>
<script>
// import CloseURL from '@/assets/icons/close-icon.png'
// import IconURL from '@/assets/icons/bmbot.png'
import { promotionService } from '@/api/promotionService'
import ChatWindow from '@/components/BotUI/ChatWindow'
// import ChatAvatar from '@/assets/icons/bmbot.png'
// import UserAvatar from '@/assets/icons/user.png'
// import AdminAvatar from '@/assets/icons/admin.png'
import { updateBotSetting } from '@/api/botSetting'
import { mapGetters } from 'vuex'

export default {
  name: 'ChatPageEditor',
  components: {
    ChatWindow
  },
  data() {
    return {
      pageForm: {
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        valid: 0,
        uploaded: false,
        chatWindowTitle: 'Telle Chat',
        titleImageUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/bmbot.png',
        isPageOpen: true,
        chatIdx: -1,
        isChatOpen: true,
        showTypingIndicator: '',
        placeholder: 'Enter your message',
        currentSession: '',
        disableUserListToggle: true,
        chatMessages: [],
        alwaysScrollToBottom: true,
        messageStyling: true,
        participants: [
          {
            id: 'support',
            name: 'Telle Bot',
            imageUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/bmbot.png'
          },
          {
            id: 'user',
            name: 'Customer',
            imageUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/telle_ai.png'
          },
          {
            id: 'me',
            name: 'Admin',
            imageUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/admin.png'
          }
        ]
      },
      rules: {
        chatWindowTitle: [
          { required: true, message: 'Please input bot name', trigger: 'blur' }
        ]
      },
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
    ...mapGetters(['token', 'dealerId', 'chatPageForm'])
  },
  created() {
    console.log('chat page created')
  },
  methods: {
    update() {
      for (var key in this.chatPageForm) {
        this.pageForm[key] = this.chatPageForm[key]
      }
    },
    submitForm(formName) {
      console.log(this.pageForm.chatWindowTitle)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var botConfiguration = {
            botId: this.dealerId,
            dealerChatWindowTitle: this.pageForm.chatWindowTitle,
            dealerTitleImage: this.pageForm.titleImageUrl
          }
          updateBotSetting(this.token, botConfiguration).then((resp) => {
            this.$store.commit('bmbot/updateChatPageSet', this.pageForm)
            this.$message({
              showClose: true,
              message: 'Chat Page Setting has been saved.',
              type: 'success'
            })
          }).catch(() => {
            this.$message({
              showClose: true,
              message: 'Failed to save. Please retry.',
              type: 'error'
            })

            return false
          })
        } else {
          this.$message({
            showClose: true,
            message: 'Failed to save. Please retry.',
            type: 'error'
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleRemove(file, fileList) {
      console.log(file)
      promotionService.deleteFile(file.raw).then(resp => {
        console.log(resp)
        this.pageForm.imageUrl = ''
        this.pageForm.uploaded = false
        this.pageForm.titleImageUrl = 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/bmbot.png'
      })
    },
    handlePictureCardPreview(file) {
      this.pageForm.dialogImageUrl = file.url
      this.pageForm.dialogVisible = true
    },
    beforeImageUpload(file) {
    //   const isJPG = file.type === 'image/jpeg'
      const validTpyes = ['image/jpeg', 'image/png']
      //   const isJPG = file.type === 'image/jpeg'
      const isJPGPNG = validTpyes.includes(file.type)
      const isLt4M = file.size / 1024 < 4

      if (!isJPGPNG) {
        this.$message.error('Icon picture must be JPG format!')
      }
      if (!isLt4M) {
        this.$message.error('Icon picture size can not exceed 4KB!')
      }
      return isJPGPNG && isLt4M
    },
    handleUpload(file) {
      this.pageForm.uploaded = true
      promotionService.uploadFileToS3(file.file).then(resp => {
        // console.log(resp.request)
        this.pageForm.imageUrl = 'https://blissmotors-web-upload.s3.amazonaws.com/telle/' + file.file.name
        this.pageForm.uploaded = false
        this.pageForm.titleImageUrl = this.pageForm.imageUrl
      }).catch(err => {
        console.log(err)
        this.pageForm.uploaded = false
      })
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

<style scoped>
.col-divider-white {
    background-color: white;
    border-radius: 4px;
    min-height: 36px;
}
</style>
