<template>
  <div
    class="sc-chat-window"
    :class="{opened: isOpen, closed: !isOpen, small: isSmall}"
  >
    <BotHeader
      :title="title"
      :image-url="titleImageUrl"
      :on-close="onClose"
      :colors="colors"
      :disable-user-list-toggle="disableUserListToggle"
      @userList="handleUserListToggle"
    />
    <UserList
      v-if="showUserList"
      :participants="participants"
    />
    <MessageList
      v-if="!showUserList"
      ref="messages"
      :messages="messages"
      :participants="participants"
      :show-typing-indicator="showTypingIndicator"
      :colors="colors"
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :message-styling="messageStyling"
      @scrollToTop="$emit('scrollToTop')"
      @sendItem="sendItem"
    />
    <UserInput
      v-if="!showUserList"
      ref="userInput"
      :show-emoji="showEmoji"
      :on-submit="onUserInputSubmit"
      :suggestions="getSuggestions()"
      :show-file="showFile"
      :placeholder="placeholder"
      :colors="colors"
      @onType="$emit('onType')"
    />
    <ToolBar
      v-if="showToolBar"
      ref="toolBar"
      :show-emoji="showEmoji"
      :on-submit="onUserInputSubmit"
      :suggestions="getSuggestions()"
      :show-file="showFile"
      :placeholder="placeholder"
      :handle-bot-page-toggle="handleBotPageToggle"
      :colors="colors"
      @onType="$emit('onType')"
    />
    <VueGallery v-show="showPreview" :images="slideImages" :index="index" @close="handleClose" />
  </div>
</template>

<script>
import BotHeader from '@/components/BotUI/Header.vue'
import MessageList from '@/components/BotUI/MessageList.vue'
import UserInput from '@/components/BotUI/UserInput.vue'
import UserList from '@/components/BotUI/UserList.vue'
import ToolBar from '@/components/BotUI/ToolBar'
import VueGallery from 'vue-gallery'

export default {
  name: 'Chat',
  components: {
    BotHeader,
    MessageList,
    UserInput,
    UserList,
    VueGallery,
    ToolBar
  },
  props: {
    isSmall: {
      type: Boolean,
      default: false
    },
    showEmoji: {
      type: Boolean,
      default: false
    },
    showFile: {
      type: Boolean,
      default: false
    },
    participants: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    titleImageUrl: {
      type: String,
      default: ''
    },
    onUserInputSubmit: {
      type: Function,
      required: true
    },
    handleBotPageToggle: {
      type: Function,
      required: true
    },
    onClose: {
      type: Function,
      required: true
    },
    messageList: {
      type: Array,
      default: () => []
    },
    isOpen: {
      type: Boolean,
      default: () => false
    },
    placeholder: {
      type: String,
      default: 'Write a reply'
    },
    showTypingIndicator: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    alwaysScrollToBottom: {
      type: Boolean,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    },
    disableUserListToggle: {
      type: Boolean,
      default: false
    },
    showToolBar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showUserList: false,
      showPreview: false,
      slideImages: [],
      index: null
    }
  },
  computed: {
    messages() {
      const messages = this.messageList

      return messages
    }
  },
  methods: {
    update() {
      this.$forceUpdate()
    },
    handleUserListToggle(showUserList) {
      this.showUserList = showUserList
    },
    getSuggestions() {
      // console.log(this.messages)
      return this.messages.length > 0 ? this.messages[this.messages.length - 1].message.suggestions : []
    },
    sendItem(item) {
      this._send(item)
    },
    _send(item) {
      this.$refs.userInput._submitSuggestion(item.payload)
    },
    scrollDown() {
      this.$refs.messages.scrollDown()
    },
    handleClose(event) {
      console.log('Image close clicked')
      // this.showPreview = false
      this.index = null
      console.log(event)
    },
    openPreview(message) {
      this.slideImages = message
      this.index = 0
    }
  }
}
</script>
<style scoped>
.sc-chat-window {
  width: 100%;
  height: 716px;
  /* width: 476px;
  height: 716px;
  bottom: 0px;
  right: 0px; */
  margin: 2px 2px 2px 0px;
  /* position: fixed; */
  box-sizing: border-box;
  box-shadow: 0 0 1px 1px rgba(0,0,0,0.2);
  /* border-top-left-radius: 9px; */
  /* border-top-right-radius: 9px; */
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.3s ease-in-out;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.sc-chat-window.small {
  height: 564px;
  border-radius: 9px;
}

.sc-chat-window.closed {
  opacity: 0;
  visibility: hidden;
}

.sc-message--me {
  text-align: right;
}
.sc-message--them {
  text-align: left;
}

@media (max-width: 480px) {
  .sc-chat-window {
    width: 476px;
    height: 716px;
    /* right: 0px;
    bottom: 0px; */
    margin: 2px;
    /* position: fixed; */
    /* border-top-left-radius: 9px; */
    /* border-top-right-radius: 9px; */
    box-shadow: 0 0 1px 1px rgba(0,0,0,0.2);
    /* box-shadow: 0 0 2px 2px rgba(0,0,0,0.4);  */
  }
  .sc-chat-window {
    transition: 0.1s ease-in-out;
  }
  .sc-chat-window.closed {
    bottom: 0px;
  }
}

@media (max-width: 420px) {
  .sc-chat-window {
    width: 100%;
    height: 100%;
    /* right: 0px;
    bottom: 0px;
    position: fixed; */
    border-radius: 0px;
  }
  .sc-chat-window {
    transition: 0.1s ease-in-out;
  }
  .sc-chat-window.closed {
    bottom: 0px;
  }
}
</style>
