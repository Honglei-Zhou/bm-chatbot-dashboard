<template>
  <div ref="scrollList" class="sc-message-list" :style="{backgroundColor: colors.messageList.bg}" @scroll="handleScroll">

    <Message v-for="(message, idx) in messages" :key="idx" :message="message.message" :chat-image-url="chatImageUrl(message.message.author)" :author-name="authorName(message.message.author)" :colors="colors" :message-styling="messageStyling" @sendItem="sendItem" />
    <!-- <Message v-for="(message, idx) in messages" :key="idx" :message="message" :chat-image-url="chatImageUrl(message.author)" :author-name="authorName(message.author)" :colors="colors" :message-styling="messageStyling" @sendItem="sendItem" /> -->
    <Message v-show="showTypingIndicator !== ''" :message="{author: showTypingIndicator, type: 'typing'}" :chat-image-url="chatImageUrl(showTypingIndicator)" :colors="colors" :message-styling="messageStyling" @sendItem="sendItem" />
  </div>
</template>
<script>
import Message from './Message.vue'
import chatIcon from '@/assets/icons/chat-icon.svg'

export default {
  components: {
    Message
  },
  props: {
    participants: {
      type: Array,
      required: true
    },
    messages: {
      type: Array,
      required: true
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
    }
  },
  computed: {
    defaultChatIcon() {
      return chatIcon
    }
  },
  mounted() {
    this._scrollDown()
  },
  updated() {
    if (this.shouldScrollToBottom()) { this.$nextTick(this._scrollDown()) }
  },
  methods: {
    scrollDown() {
      this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight
    },
    _scrollDown() {
      this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight
    },
    handleScroll(e) {
      if (e.target.scrollTop === 0) {
        this.$emit('scrollToTop')
      }
    },
    shouldScrollToBottom() {
      return this.alwaysScrollToBottom || (this.$refs.scrollList.scrollTop > this.$refs.scrollList.scrollHeight - 600)
    },
    profile(author) {
      const profile = this.participants.find(profile => profile.id === author)

      // A profile may not be found for system messages or messages by 'me'
      return profile || { imageUrl: '', name: '' }
    },
    chatImageUrl(author) {
      return this.profile(author).imageUrl
    },
    authorName(author) {
      // console.log(this.profile(author).name)
      return this.profile(author).name
    },
    sendItem(item) {
      this.$emit('sendItem', item)
    }
  }
}
</script>

<style scoped>
.sc-message-list {
  height: 100%;
  overflow-y: auto;
  background-size: 100%;
  padding: 40px 0px;
}
</style>
