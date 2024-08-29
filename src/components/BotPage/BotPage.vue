<template>
  <div
    class="sc-bot-page"
    :class="{opened: isOpen, closed: !isOpen}"
  >
    <InventoryList ref="inventoryList" :key="randomKey" :messages="inventoryElements" @scrollUp="$emit('scrollUp')" />
    <!-- <WorkingHours v-if="showWorkingHours" ref="workingHours" /> -->
  </div>
</template>

<script>
import InventoryList from '@/components/BotPage/InventoryList'
// import WorkingHours from '@/components/BotPage/WorkingHours'

export default {
  name: 'BotPage',
  components: {
    InventoryList
    // WorkingHours
  },
  props: {
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
    onClose: {
      type: Function,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: () => false
    },
    colors: {
      type: Object,
      required: true
    },
    disableUserListToggle: {
      type: Boolean,
      default: false
    },
    showWorkingHours: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showUserList: false,
      inventoryElements: []
    }
  },
  computed: {
    messages() {
      const messages = this.messageList
      return messages
    },
    randomKey() {
      var length = 5
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    }
  },
  methods: {
    handleUserListToggle(showUserList) {
      this.showUserList = showUserList
    },
    // sendItem(item) {
    //   this.$emit('sendItem', item)
    // },
    _showInventory() {
      this.$refs.inventoryList.show()
    },
    _hideInventory() {
      this.$refs.inventoryList.hide()
    },
    _showHours() {
      this.$refs.workingHours.show()
    },
    _hideHours() {
      this.$refs.workingHours.hide()
    },
    _hideAll() {
      this._hideInventory()
      this._hideHours()
    },
    pageHandler(name) {
      this._hideAll()
      if (name === 'hours') {
        this._showHours()
      } else if (name === 'inventory') {
        this._showInventory()
      }
    }
  }
}
</script>
<style scoped>
.sc-bot-page {
  box-sizing: border-box;
  box-shadow: 0 0 1px 1px rgba(0,0,0,0.2);
  border-top-left-radius: 9px;
  /* border-top-right-radius: 9px; */
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

}

.sc-bot-page.closed {
  opacity: 0;
  visibility: hidden;
}

.sc-message--me {
  text-align: right;
}
.sc-message--them {
  text-align: left;
}
</style>
