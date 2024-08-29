<template>
  <div class="app-container">
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane label="Set Small Page">
        <SmallPageEditor />
      </el-tab-pane>
      <el-tab-pane label="Set Chat Page"><ChatPageEidtor ref="chatPage" /></el-tab-pane>
      <el-tab-pane label="Set Dealer Info"><DealerInfoEditor ref="dealerInfo" /></el-tab-pane>
      <el-tab-pane label="Review and Publish"><Review /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SmallPageEditor from '@/views/boteditor/smallPage'
import ChatPageEidtor from '@/views/boteditor/chatPage'
import DealerInfoEditor from '@/views/boteditor/dealerInfo'
import Review from '@/views/boteditor/review'
// import { getBotSetting } from '@/api/botSetting'
// import { mapGetters } from 'vuex'

export default {
  name: 'BotEditor',
  components: {
    SmallPageEditor,
    ChatPageEidtor,
    DealerInfoEditor,
    Review
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab)
      if (tab.index === '1') {
        // console.log(this.$refs.chatPage)
        this.$refs.chatPage.update()
      }
      if (tab.index === '2') {
        this.$refs.dealerInfo.update()
      }
    }
  }
}
</script>

