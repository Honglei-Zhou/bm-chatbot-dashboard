<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top: 40px;">
      <el-col :span="11">
        <el-form ref="smallPageForm" :model="smallPageForm" :rules="rules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="Bot Name" prop="botName">
            <el-input v-model="smallPageForm.botName" />
          </el-form-item>
          <el-form-item label="Customer Specialist" prop="adminName">
            <el-input v-model="smallPageForm.adminName" />
          </el-form-item>
          <el-form-item label="Dealer Name" prop="dealerName">
            <el-input v-model="smallPageForm.dealerName" />
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
              :disabled="smallPageForm.uploaded"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="smallPageForm.dialogVisible">
              <img width="100%" :src="smallPageForm.dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>

          <el-form-item label="Welcome Sentence" prop="welcomeSentence">
            <el-input v-model="smallPageForm.welcomeSentence" />
          </el-form-item>
          <el-form-item label="Quick Replies" prop="quickReplies">
            <el-checkbox-group v-model="smallPageForm.quickReplies">
              <el-checkbox label="trade in" name="type" />
              <el-checkbox label="service" name="type" />
              <el-checkbox label="new car sales" name="type" />
              <el-checkbox label="used car sales" name="type" />
              <el-checkbox label="dealer information" name="type" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('smallPageForm')">Save</el-button>
            <el-button @click="resetForm('smallPageForm')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2"><div class="col-divider-white" /></el-col>
      <el-col :span="11">
        <el-card shadow="always" :body-style="{height: '300px', width: '200px'}">
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
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Suggestions from '@/components/BotUI/Suggestions'
import SendIcon from '@/components/BotUI/SendIcon'
import CloseURL from '@/assets/icons/close-icon.png'
import IconURL from '@/assets/icons/bmbot.png'
import { promotionService } from '@/api/promotionService'
import TelephoneIcon from '@/assets/icons/telephone.png'
import SalesIcon from '@/assets/icons/sales.png'
import ServiceIcon from '@/assets/icons/tools.png'
import PartsIcon from '@/assets/icons/parts.png'
import { updateBotSetting } from '@/api/botSetting'
import { mapGetters } from 'vuex'
import { getBotSetting } from '@/api/botSetting'

export default {
  name: 'SmallPageEditor',
  components: {
    Suggestions,
    SendIcon
  },
  data() {
    return {
      smallPageForm: {
        closeUrl: CloseURL,
        placeholder: 'Enter your message',
        botName: 'Telle',
        adminName: 'Emily',
        dealerName: 'Telle AI',
        dialogImageUrl: '',
        iconUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/bmbot.png',
        dialogVisible: false,
        imageUrl: '',
        valid: 0,
        uploaded: false,
        keywordsSelect: true,
        imageUpload: false,
        welcomeSentence: 'Hi, this is Henri, how can I help you?',
        quickReplies: ['trade in', 'service', 'new car sales', 'used car sales', 'dealer information']
      },
      rules: {
        botName: [
          { required: true, message: 'Please input bot name', trigger: 'blur' }
        ],
        adminName: [
          { required: true, message: 'Please input admin name', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: 'Please input dealer name', trigger: 'blur' }
        ],
        welcomeSentence: [
          { required: true, message: 'Please input welcome sentence', trigger: 'blur' }
        ],
        quickReplies: [
          { type: 'array', required: true, message: 'Please select at least one quick reply keywords', trigger: 'change' }
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
          bg: '#ffffff'
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
    ...mapGetters(['token', 'dealerId'])
  },
  created() {
    getBotSetting(this.token, this.dealerId).then(resp => {
      console.log
      var data = {
        smallPageForm: {
          closeUrl: CloseURL,
          placeholder: 'Enter your message',
          botName: 'Telle',
          adminName: 'Emily',
          dealerName: 'Telle AI',
          dialogImageUrl: '',
          iconUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/bmbot.png',
          dialogVisible: false,
          imageUrl: '',
          valid: 0,
          uploaded: false,
          keywordsSelect: true,
          imageUpload: false,
          welcomeSentence: 'Hi, this is Henri, how can I help you?',
          quickReplies: ['trade in', 'service', 'new car sales', 'used car sales', 'dealer information']
        },
        chatPageForm: {
          closeIcon: CloseURL,
          dialogImageUrl: '',
          iconUrl: IconURL,
          dialogVisible: false,
          imageUrl: '',
          valid: 0,
          uploaded: false,
          keywordsSelect: true,
          couponUpload: false,
          viewAllChats: true,
          chatLoading: false,
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
        dealerInfoForm: {
          title: 'Telle AI',
          address: '160 E Grand Ave, Chicago, IL-60611',
          workingHours: {
            contact: {
              title: 'Telle AI',
              address: '160 E Grand Ave, Chicago, IL-60611'
            },
            items: [
              { name: 'Phone Numbers',
                key: 'Department',
                value: 'Phone Number',
                icon: TelephoneIcon,
                content: [
                  { key: 'Main:', value: '(312) 500-8535' },
                  { key: 'Sales:', value: '(312) 500-8535' },
                  { key: 'Service:', value: '(312) 265-8535' },
                  { key: 'Parts:', value: '(312) 267-8525' }
                ]
              },
              { name: 'Sales Hours',
                key: 'Date',
                value: 'Hours',
                icon: SalesIcon,
                content: [
                  { key: 'Mon - Thu:', value: '9:00 AM - 8:00 PM' },
                  { key: 'Fri - Sat:', value: '9:00 AM - 6:00 PM' },
                  { key: 'Sun:', value: 'Closed' }
                ]
              },
              { name: 'Service Hours',
                key: 'Date',
                value: 'Hours',
                icon: ServiceIcon,
                content: [
                  { key: 'Mon - Thu:', value: '7:00 AM - 7:00 PM' },
                  { key: 'Fri - Sat:', value: '7:00 AM - 6:00 PM' },
                  { key: 'Sun:', value: 'Closed' }
                ]
              },
              { name: 'Parts Hours',
                key: 'Date',
                value: 'Hours',
                icon: PartsIcon,
                content: [
                  { key: 'Mon - Thu:', value: '8:00 AM - 6:00 PM' },
                  { key: 'Fri - Sat:', value: '8:00 AM - 5:00 PM' },
                  { key: 'Sun:', value: 'Closed' }
                ]
              }
            ]
          }
        }
      }
      // Small Page
      if (resp.dealer_bot_name) {
        data.smallPageForm.botName = resp.dealer_bot_name
      }
      if (resp.admin_name) {
        data.smallPageForm.adminName = resp.admin_name
      }
      if (resp.dealer_name) {
        data.smallPageForm.dealerName = resp.dealer_name
      }
      if (resp.support_image) {
        data.smallPageForm.iconUrl = resp.support_image
      }
      if (resp.bot_init_text) {
        data.smallPageForm.welcomeSentence = resp.bot_init_text
      }
      if (resp.quickReplies) {
        data.smallPageForm.welcomeSentence = resp.quickReplies.split(',')
      }
      // Chat Page
      if (resp.dealer_chat_window_title) {
        data.chatPageForm.chatWindowTitle = resp.dealer_chat_window_title
      }
      if (resp.dealer_title_image) {
        data.chatPageForm.titleImageUrl = resp.dealer_title_image
      }
      // Dealer Info
      if (resp.dealer_latitude) {
        data.dealerInfoForm.latitude = resp.dealer_latitude
      }
      if (resp.dealer_longitude) {
        data.dealerInfoForm.longitude = resp.dealer_longitude
      }
      if (resp.dealer_name) {
        data.dealerInfoForm.title = resp.dealer_name
        data.dealerInfoForm.workingHours.contact.title = resp.dealer_name
      }
      if (resp.dealer_address) {
        data.dealerInfoForm.address = resp.dealer_address
        data.dealerInfoForm.workingHours.contact.address = resp.dealer_address
      }
      if (resp.phone_numbers) {
        data.dealerInfoForm.phoneNumbers = []
        resp.phone_numbers.split(',').forEach(item => {
          var vals = item.split('|')
          data.dealerInfoForm.phoneNumbers.push({
            key: vals[0], value: vals[1]
          })
        })
      }
      if (resp.sales_hours) {
        data.dealerInfoForm.salesHours = []
        resp.sales_hours.split(',').forEach(item => {
          var vals = item.split('|')
          data.dealerInfoForm.salesHours.push({
            key: vals[0], value: vals[1]
          })
        })
      }
      if (resp.service_hours) {
        data.dealerInfoForm.serviceHours = []
        resp.service_hours.split(',').forEach(item => {
          var vals = item.split('|')
          data.dealerInfoForm.serviceHours.push({
            key: vals[0], value: vals[1]
          })
        })
      }
      if (resp.parts_hours) {
        data.dealerInfoForm.partsHours = []
        resp.parts_hours.split(',').forEach(item => {
          var vals = item.split('|')
          data.dealerInfoForm.partsHours.push({
            key: vals[0], value: vals[1]
          })
        })
      }
      this.$store.commit('bmbot/updateBot', data)
      console.log(resp)
      console.log(data)
      for (var key in data.smallPageForm) {
        this.smallPageForm[key] = data.smallPageForm[key]
      }
    })
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var botConfiguration = {
            botId: this.dealerId,
            dealerBotName: this.smallPageForm.botName,
            adminName: this.smallPageForm.adminName,
            supportImage: this.smallPageForm.iconUrl,
            botInitText: this.smallPageForm.welcomeSentence,
            botInitSuggestions: this.smallPageForm.quickReplies.toString()
          }
          updateBotSetting(this.token, botConfiguration).then((resp) => {
            this.$store.commit('bmbot/updateSmallPageSet', this.smallPageForm)
            this.$message({
              showClose: true,
              message: 'Small Page Setting has been saved.',
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
    getSuggestions() {
      return this.smallPageForm.quickReplies
    },
    _submitSuggestion(suggestion) {
      console.log(suggestion)
    },
    _submitText(event) {
      console.log('submitted')
    },
    handleKey(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this._submitText(event)
        event.preventDefault()
      }
    },
    handleRemove(file, fileList) {
      console.log(file)
      promotionService.deleteFile(file.raw).then(resp => {
        console.log(resp)
        this.smallPageForm.imageUrl = ''
        this.smallPageForm.uploaded = false
        this.smallPageForm.iconUrl = 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/bmbot.png'
      })
    },
    handlePictureCardPreview(file) {
      this.smallPageForm.dialogImageUrl = file.url
      this.smallPageForm.dialogVisible = true
    },
    beforeImageUpload(file) {
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
      this.smallPageForm.uploaded = true
      promotionService.uploadFileToS3(file.file).then(resp => {
        // console.log(resp.request)
        this.smallPageForm.imageUrl = 'https://blissmotors-web-upload.s3.amazonaws.com/telle/' + file.file.name
        this.smallPageForm.iconUrl = this.smallPageForm.imageUrl
        this.smallPageForm.uploaded = false
      }).catch(err => {
        console.log(err)
        this.smallPageForm.uploaded = false
      })
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
