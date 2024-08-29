<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row style="margin-bottom:32px;">
        <el-col :xs="16" :sm="16" :lg="12">
          <el-date-picker
            v-model="datePeriod"
            style="min-width: 450px;"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :picker-options="pickerOptions"
          />
        </el-col>

        <el-button v-waves class="filter-item" type="warning" @click="submitQuery">
          Submit
        </el-button>
      </el-row>

      <el-input v-model="filterQuery.sessionId" placeholder="Session ID" style="width: 200px;" class="filter-item" />
      <el-select v-model="filterQuery.status" placeholder="Status" clearable style="width: 100px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.key" :value="item.value" />
      </el-select>
      <el-select v-model="filterQuery.direction" placeholder="Direction" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in directionOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="filterHandler">
        Filter
      </el-button>
      <el-button v-waves class="filter-item" type="success" icon="el-icon-refresh" @click="resetFilter">
        Reset
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- ID -->
      <el-table-column label="ID" prop="id" sortable="custom" align="center" type="index" :index="indexMethod">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template> -->
      </el-table-column>

      <!-- CREATED -->
      <el-table-column label="CREATED" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_time | timeFilter }}</span>
        </template>
      </el-table-column>

      <!-- Session ID -->
      <el-table-column label="CHAT SESSION" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.session_id }}</span>
        </template>
      </el-table-column>

      <!-- MESSAGE -->
      <el-table-column label="MESSAGE" min-width="190" align="center">
        <template slot-scope="scope">
          <Message :message="scope.row.message" :chat-image-url="chatImageUrl(scope.row.message.author)" :author-name="authorName(scope.row.message.author)" :colors="colors" :message-styling="messageStyling" @sendItem="sendItem" />
          <!-- {{ scope.row.message | messageFilter }}</span> -->
        </template></el-table-column>

      <!-- DIRECTION -->
      <el-table-column label="DIRECTION" align="center">
        <template slot-scope="{row}">
          <span>{{ row.direction }}</span>
        </template>
      </el-table-column>

      <!-- HANDLED BY -->
      <el-table-column label="HANDLED BY" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.from_user">{{ scope.row.from_user | fromUserFilter(scope.row.from_user) }}</span>
          <span v-else>BM Bot</span>
        </template>
      </el-table-column>

      <!-- STATUS -->
      <el-table-column label="STATUS" class-name="status-col" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.is_read | statusFilter(row.is_read)">
            {{ row.is_read === 0? 'Unread': 'Read' }}
          </el-tag>
          <!-- <el-tag v-else :type="row.status | statusFilter">
            Delivered
          </el-tag> -->
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="filterQuery.page" :limit.sync="filterQuery.limit" @pagination="getNextPage" />
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getMessageList" /> -->

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchMessageList } from '@/api/chats'
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'
import Message from '@/components/BotUI/Message'
// import ChatAvatar from '@/assets/icons/bmbot.png'
// import UserAvatar from '@/assets/icons/user.png'
// import AdminAvatar from '@/assets/icons/admin.png'
import { messageService } from '@/api/messageService'

const directionOptions = [
  { key: 'incoming', display_name: 'Incoming' },
  { key: 'outgoing', display_name: 'Outgoing' }
]

export default {
  name: 'Messages',
  components: { Pagination, Message },
  directives: { waves },
  filters: {
    statusFilter(status) {
      // console.log(status)
      if (status) {
        // const statusMap = {
        //   Delivered: 'success',
        //   Failed: 'danger'
        // }
        const statusMap = ['danger', 'success']
        return statusMap[status]
      } else {
        return 'danger'
      }
    },
    timeFilter(timestamp) {
      if (timestamp) {
        var curTime = moment.tz(timestamp, 'Europe/London')
        var localTime = curTime.clone().tz('America/Chicago')
        return localTime.format('MMMM Do, h:mm a')
      } else {
        return 'NA'
      }
    },
    fromUserFilter(data) {
      data = data.trim()
      if (data === 'customer') return 'Customer'
      else if (data === 'bot') return 'BM Bot'
      else return 'Admin'
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listData: [],
      messageData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        direction: undefined,
        session_id: undefined,
        sort: '-id'
      },
      filterQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        direction: undefined,
        session_id: undefined
      },
      messageStyling: true,
      directionOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [{ key: 'Read', value: 1 }, { key: 'Unread', value: 0 }],
      downloadLoading: false,
      datePeriod: ['', ''],
      earliestDate: '2019-05-01',
      pickerOptions: {
        shortcuts: [{
          text: 'Last week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 3 months',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    ...mapGetters(
      ['token', 'participants', 'colors', 'dealerId']
    )
  },
  created() {
    this.initSessionDates()
    this.getMessageList()
  },
  methods: {
    filterHandler() {
      this.listData = this.listData.filter(item => {
        if (this.filterQuery.direction !== undefined && item.direction !== this.filterQuery.direction) return false
        else if (this.filterQuery.status !== undefined && item.is_read !== this.filterQuery.status) return false
        else if (this.filterQuery.session_id !== undefined && item.session_id.toUpperCase().includes(this.filterQuery.session_id.toUpperCase()) === false) return false
        return true
      })
      this.filterQuery.page = 1
      this.getPage()
    },
    resetFilter() {
      this.filterQuery = {
        page: 1,
        limit: 20,
        status: undefined,
        direction: undefined,
        session_id: undefined
      }
      this._updateMessageList()
    },
    indexMethod(index) {
      return index + 1 + (this.filterQuery.page - 1) * this.filterQuery.limit
    },
    initSessionDates() {
      const end = new Date()
      const start = new Date(end.getFullYear(), end.getMonth(), 1)
      this.datePeriod = [start, end]
    },
    submitQuery() {
      this.listLoading = true
      var s = Date.parse(this.datePeriod[0])
      var earliest = Date.parse(this.earliestDate)
      if (s < earliest) {
        this.getMessageList()
      } else {
        this._updateMessageList()
      }
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    getNextPage() {
      this.getPage()
    },
    getPage() {
      var start = (this.filterQuery.page - 1) * this.filterQuery.limit
      this.list = this.listData.slice(start, start + this.filterQuery.limit)
      this.total = this.listData.length
      console.log(this.total)
    },
    _updateMessageList() {
      try {
        this.filterQuery = {
          page: 1,
          limit: 20,
          status: undefined,
          direction: undefined,
          session_id: undefined
        }
        var s = Date.parse(this.datePeriod[0])
        var e = Date.parse(this.datePeriod[1])
        this.listData = []
        this.messageData.forEach((item, index) => {
          var c = Date.parse(item.created_time + ' UTC')
          // console.log(item.created_time)
          if (s <= c && c <= e) {
            this.listData.push(item)
          }
        })
        this.getPage()
      } catch (err) {
        console.log(err)
      }
    },
    getMessageList() {
      this.listLoading = true
      console.log(this.dealerId)
      fetchMessageList(this.token, this.listQuery, this.dealerId).then((resp) => {
        console.log(resp)
        // this.list = resp.data
        // this.total = resp.total
        var messages = resp.data
        var results = []
        messages.forEach((message) => {
          // console.log(message)
          if (message.direction === 'incoming') {
            var customerMessage = JSON.parse(message.message)
            customerMessage.author = 'user'
            message.message = customerMessage
            results.push(message)
          } else if (message.from_bot === 0) {
            var adminMessage = JSON.parse(message.message)
            adminMessage.author = 'admin'
            message.message = adminMessage
            results.push(message)
          } else {
            // console.log(message)
            var parsedMessages = messageService.parseMessage(message, 'support')
            parsedMessages.forEach(item => {
              message.message = item.message
              results.push(message)
            })
          }
        })
        this.messageData = results
        this._updateMessageList()
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getMessageList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', 'CREATED', 'CHAT SESSION', 'MESSAGE', 'DIRECTION', 'HANDLED BY', 'STATUS']
        const filterVal = ['id', 'created', 'sessionId', 'message', 'direction', 'handledBy', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'messages-table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    profile(author) {
      if (author === 'admin') {
        author = 'me'
      }
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
      console.log('clicked')
    }
  }
}
</script>
