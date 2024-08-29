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

      <el-input v-model="filterQuery.note" placeholder="Note" style="width: 200px;" class="filter-item" />
      <el-select v-model="filterQuery.importance" placeholder="Priority" clearable style="width: 100px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="filterQuery.department" placeholder="Department" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in departmentOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>

      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-menu" @click="showColumn = !showColumn">
        Edit Column
      </el-button>

      <el-row v-if="showColumn" style="margin-top: 32px; margin-bottom:32px;">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-checkbox-group v-model="checkColumns">
              <el-checkbox v-for="(label, index) in columns" :key="index" :label="label" />
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row style="margin-top: 32px;">
          <el-col :xs="24" :sm="24" :lg="24">
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary">
              Save Changes
            </el-button>

          </el-col>
        </el-row>

      </el-row>

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
      <el-table-column v-if="checkColumns.indexOf('ID') >= 0" label="ID" prop="id" align="center" type="index" :index="indexMethod">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template> -->
      </el-table-column>

      <!-- CUSTOMER -->
      <el-table-column v-if="checkColumns.indexOf('CUSTOMER') >= 0" label="CUSTOMER" width="195" align="center">
        <template slot-scope="scope">
          <div style="display: flex; margin-left: 10px;">
            <div style="width: 35px; ">
              <avatar :username="scope.row.customer" :size="30" />
            </div>
            <div style="width: 160px; line-height: 30px; text-align: center;">
              {{ scope.row.customer }}
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- CREATED -->
      <el-table-column v-if="checkColumns.indexOf('CREATED') >= 0" label="CREATED" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created | timeFilter }}</span>
        </template>
      </el-table-column>

      <!-- CONTACT
      <el-table-column label="CONTACT" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.contact }}</span>
        </template>
      </el-table-column> -->

      <!-- Email -->
      <el-table-column v-if="checkColumns.indexOf('EMAIL') >= 0" label="EMAIL" prop="email" sortable align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.email | emailFilter }}</span>
        </template>
      </el-table-column>

      <!-- Phone -->
      <el-table-column v-if="checkColumns.indexOf('PHONE') >= 0" label="PHONE" prop="phone" sortable align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.phone | phoneFilter }}</span>
        </template>
      </el-table-column>

      <!-- NOTES -->
      <el-table-column v-if="checkColumns.indexOf('TRANSCRIPTS') >= 0" label="TRANSCRIPTS" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="retrieveTranscripts(row)">
            View
          </el-button>
        </template>
      </el-table-column>

      <!-- <el-table-column v-if="checkColumns.indexOf('NOTES') >= 0" label="NOTES" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.note }}</span>
        </template>
      </el-table-column> -->

      <!-- APPOINTMENT -->
      <el-table-column v-if="checkColumns.indexOf('APPOINTMENT') >= 0" label="APPOINTMENT" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appt | timeFilter }}</span>
        </template>
      </el-table-column>

      <!-- DEPARTMENT -->
      <el-table-column v-if="checkColumns.indexOf('DEPT') >= 0" label="DEPT" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dept }}</span>
        </template>
      </el-table-column>

      <!-- PRIORITY -->
      <el-table-column v-if="checkColumns.indexOf('PRIORITY') >= 0" label="PRIORITY" align="center">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <!-- STATUS -->
      <el-table-column v-if="checkColumns.indexOf('STATUS') >= 0" label="STATUS" class-name="status-col" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- ACTIONS -->
      <el-table-column v-if="checkColumns.indexOf('ACTIONS') >= 0" label="ACTIONS" align="center" width="190" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status === 'Closed'" size="mini" type="info" disabled>
            Close
          </el-button>
          <el-button v-else size="mini" type="danger" @click="handleModifyStatus(row,'Closed')">
            Close
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="filterQuery.page" :limit.sync="filterQuery.limit" @pagination="getNextPage" />

    <el-dialog :center="true" :lock-scroll="false" :visible.sync="showTranscripts">
      <div slot="title">
        <el-button v-if="transcriptsView.showRichMessages" type="primary" @click="viewText">
          Text Only
        </el-button>
        <el-button v-else disabled @click="viewText">
          Text Only
        </el-button>

        <el-button v-if="transcriptsView.showRichMessages" disabled @click="viewText">
          Rich Messages
        </el-button>
        <el-button v-else type="primary" @click="viewRichMessages">
          Rich Messages
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="exportTranscripts">
          Export
        </el-button>

      </div>
      <MessageList
        v-show="transcriptsView.showRichMessages"
        ref="messages"
        :messages="transcriptsView.chatMessages"
        :participants="participants"
        :show-typing-indicator="transcriptsView.showTypingIndicator"
        :colors="colors"
        :always-scroll-to-bottom="transcriptsView.alwaysScrollToBottom"
        :message-styling="true"
        @scrollToTop="scrollToTop"
        @sendItem="sendItem"
      />
      <div v-show="!transcriptsView.showRichMessages">
        <p v-for="(item, idx) in transcriptsView.textMessages" :key="idx"><span>{{ '[' + item.created + ']' }}</span><span><b>&nbsp;&nbsp;From</b>：&nbsp;{{ item.owner }}</span><b>&nbsp;&nbsp;Message</b>：&nbsp;<span>{{ item.text }}</span></p>
      </div>
      <div slot="footer">
        <el-pagination
          :current-page.sync="transcriptsView.page"
          :page-size="transcriptsView.limit"
          layout="total, prev, pager, next"
          :total="transcriptsView.total"
          @size-change="handleSizeChange"
          @current-change="getNextPageMessages"
        />
        <!-- <pagination :total="transcriptsView.total" :page.sync="transcriptsView.page" :limit.sync="transcriptsView.limit" @pagination="getNextPageMessages" /> -->
      </div>

    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Name" prop="customer">
          <el-input v-model="temp.customer" type="text" placeholder="Name: Annie West" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" placeholder="Email Address" />
        </el-form-item>

        <el-form-item label="Phone" prop="phone">
          <el-input v-model="temp.phone" placeholder="Phone Number" />
        </el-form-item>

        <el-form-item label="APPT" prop="appt">
          <el-date-picker v-model="temp.appt" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="DEPT" prop="dept">
          <el-input v-model="temp.dept" placeholder="Please enter department name" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Priority">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Note">
          <el-input v-model="temp.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please enter note." />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Avatar from 'vue-avatar'
import { fetchLeadsList, createLeads } from '@/api/leads'
import { validEmail } from '@/utils/validate'
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'
import { compareValues } from '@/api/tools'
import { chatService } from '@/api/chatService'
import { messageService } from '@/api/messageService'
import MessageList from '@/components/BotUI/MessageList.vue'

const departmentOptions = [
  { key: 'service', display_name: 'Service' },
  { key: 'sales', display_name: 'Sales' }
]

const columnOptions = ['ID', 'CUSTOMER', 'CREATED', 'EMAIL', 'PHONE', 'TRANSCRIPTS', 'APPOINTMENT', 'DEPT', 'PRIORITY', 'STATUS', 'ACTIONS']

export default {
  name: 'Leads',
  components: { Pagination, Avatar, MessageList },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Success: 'success',
        New: 'danger',
        Closed: 'info'
      }
      return statusMap[status]
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
    emailFilter(email) {
      if (email === 'default@telle.ai') {
        return ''
      } else {
        return email
      }
    },
    phoneFilter(phone) {
      if (phone === '8008008000') {
        return ''
      } else {
        return phone
      }
    }
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      listData: [],
      leadsData: [],
      total: 0,
      checkColumns: ['ID', 'CUSTOMER', 'EMAIL', 'PHONE', 'TRANSCRIPTS', 'DEPT', 'STATUS', 'ACTIONS'],
      columns: columnOptions,
      showColumn: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        note: undefined,
        department: undefined,
        sort: '-id'
      },
      filterQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        note: undefined,
        department: undefined
      },
      importanceOptions: [1, 2, 3],
      departmentOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['New', 'Success', 'Closed'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        note: '',
        appt: new Date(),
        customer: '',
        email: '',
        phone: '',
        contact: '',
        dept: '',
        status: 'New'
      },
      transcriptsView: {
        showTypingIndicator: '',
        currentSession: '',
        disableUserListToggle: false,
        totalMessages: [],
        chatMessages: [],
        totalTextMessages: [],
        textMessages: [],
        alwaysScrollToBottom: true,
        messageStyling: true,
        total: 0,
        page: 1,
        limit: 20,
        showRichMessages: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        customer: [{ required: true, message: 'customer name is required', trigger: 'blur' }],
        email: [{ required: false, message: 'email format is incorrect', trigger: 'blur', validator: validateEmail }]
      },
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
      },
      showTranscripts: false
    }
  },
  computed: {
    ...mapGetters([
      'token', 'colors', 'participants', 'dealerId'
    ])
  },
  created() {
    this.initSessionDates()
    this.getLeadsList()
  },
  methods: {
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
        this.getLeadsList()
      } else {
        this._updateLeadList()
      }
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    getNextPage() {
      // this.filterQuery.page += 1
      this.getPage()
    },
    getPage() {
      var start = (this.filterQuery.page - 1) * this.filterQuery.limit
      this.list = this.listData.slice(start, start + this.filterQuery.limit)
      this.total = this.listData.length
      console.log(this.total)
    },
    _updateLeadList() {
      try {
        this.filterQuery = {
          page: 1,
          limit: 20,
          importance: undefined,
          note: undefined,
          department: undefined
        }
        var s = Date.parse(this.datePeriod[0])
        var e = Date.parse(this.datePeriod[1])
        this.listData = []

        this.leadsData.forEach((item, index) => {
          var c = Date.parse(item.created + ' UTC')
          if (s <= c && c <= e) {
            this.listData.push(item)
            // if (index < this.filterQuery.page * this.filterQuery.limit) { this.list.push(item) }
          }
        })
        this.getPage()
      } catch (err) {
        console.log(err)
      }
    },
    getLeadsList() {
      this.listLoading = true
      fetchLeadsList(this.token, this.listQuery, this.dealerId).then((resp) => {
        // console.log(resp.data.length)
        this.list = []
        this.leadsData = []
        resp.data.forEach((item) => {
          if (item.status.trim() !== 'Invalid' && (item.email !== 'default@telle.ai' || item.phone !== '8008008000')) {
            // console.log(item)
            this.leadsData.push({
              id: item.id,
              sessionId: item.session_id,
              importance: item.priority,
              note: item.notes_offer,
              appt: item.appointment,
              customer: item.customer_name,
              created: item.created,
              email: item.email === 'default@telle.ai' ? '' : item.email,
              phone: item.phone === '8008008000' ? '' : item.phone,
              contact: item.email + ';' + item.phone,
              dept: item.department,
              transcripts: [],
              textTranscripts: [],
              status: item.status.trim()
            })
          }
        })

        this._updateLeadList()

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getLeadsList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: 'Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'email') {
        if (order === 'descending') {
          this.listData = this.listData.sort(compareValues('email', 'desc'))
        } else {
          this.listData = this.listData.sort(compareValues('email', 'asc'))
        }
      } else if (prop === 'phone') {
        if (order === 'descending') {
          this.listData = this.listData.sort(compareValues('phone', 'desc'))
        } else {
          this.listData = this.listData.sort(compareValues('phone', 'asc'))
        }
      }
      this.getPage()
    },
    filterHandler() {
      // console.log(this.filterQuery)
      this.listData = this.listData.filter(item => {
        // console.log(item.dept)
        if (this.filterQuery.importance && item.importance !== this.filterQuery.importance) return false
        else if (this.filterQuery.department && item.dept !== this.filterQuery.department) return false
        else if (this.filterQuery.note && item.note.toUpperCase().includes(this.filterQuery.note.toUpperCase()) === false) return false
        return true
      })
      this.filterQuery.page = 1
      this.getPage()
    },
    resetFilter() {
      this.filterQuery = {
        page: 1,
        limit: 20,
        importance: undefined,
        note: undefined,
        department: undefined
      }
      this._updateLeadList()
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        note: '',
        appt: new Date(),
        customer: '',
        email: '',
        phone: '',
        contact: '',
        dept: '',
        status: 'New'
      }
    },
    retrieveTranscripts(row) {
      this.transcriptsView.total = 0
      this.transcriptsView.page = 1

      if (row.transcripts.length === 0) {
        this.listLoading = true
        chatService.getSessionMessages(this.token, row.sessionId).then((resp) => {
          const messages = resp.data
          // console.log(messages)
          if (messages.length > 0) {
            var results = []
            var parsedMessages = []
            var textResults = []
            messages.forEach((message) => {
              // console.log(message)
              // console.log(message.created_time)
              var curTime = moment.tz(message.created, 'Europe/London')
              var localTime = curTime.clone().tz('America/Chicago')

              var sysMessage = {
                groupId: message.session_id,
                message: { type: 'system', author: 'support', data: { text: 'Received: ', meta: localTime.format('MMMM Do, h:mm a') }},
                unread: 0
              }
              // console.log(message)
              if (message.direction === 'incoming') {
                var customerMessage = JSON.parse(message.message)
                // console.log(customerMessage.data.text)
                customerMessage.author = 'user'
                results.push(sysMessage)
                results.push({
                  groupId: message.session_id,
                  message: customerMessage,
                  unread: 0
                })
                textResults.push({
                  groupId: message.session_id,
                  direction: 'Incoming',
                  created: localTime.format('MMMM Do YYYY, h:mm a'),
                  owner: 'customer',
                  text: customerMessage.data.text === undefined ? customerMessage.data : customerMessage.data.text
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

                textResults.push({
                  groupId: message.session_id,
                  direction: 'Outgoing',
                  created: localTime.format('MMMM Do YYYY, h:mm a'),
                  owner: 'admin',
                  text: adminMessage.data.text === undefined ? adminMessage.data : adminMessage.data.text
                })
              } else {
                parsedMessages = messageService.parseMessage(message, 'support')
                results.push(sysMessage)
                parsedMessages.forEach(item => {
                  // console.log(item.message)
                  results.push(item)
                  if (item.message.type === 'list') {
                    item.message.data.elements.forEach((element) => {
                      textResults.push({
                        groupId: message.session_id,
                        direction: 'Outgoing',
                        created: localTime.format('MMMM Do YYYY, h:mm a'),
                        owner: 'bot',
                        text: element.subtitle === undefined ? element.title : element.title + ' ' + element.subtitle
                      })
                    })
                  } else if (item.message.type === 'text') {
                    textResults.push({
                      groupId: message.session_id,
                      direction: 'Outgoing',
                      created: localTime.format('MMMM Do YYYY, h:mm a'),
                      owner: 'bot',
                      text: item.message.data.text
                    })
                  }
                })
              }
            })
            this.transcriptsView.totalMessages = results
            this.transcriptsView.totalTextMessages = textResults
            // this.transcriptsView.total = results.length
            this.listData.forEach((element, index) => {
              if (row.sessionId === element.sessionId) {
                this.listData[index].transcripts = results
                this.listData[index].textTranscripts = textResults
              }
            })
            this.leadsData.forEach((element, index) => {
              if (row.sessionId === element.sessionId) {
                this.leadsData[index].transcripts = results
                this.leadsData[index].textTranscripts = textResults
              }
            })
            this.listLoading = false
            this.getNextPageMessages()
            this.showTranscripts = true
          } else {
            this.listLoading = false
            this.getNextPageMessages()
            this.showTranscripts = true
          }
        }).catch((err) => {
          console.log(err)
          this.listLoading = false
        })
      } else {
        this.getNextPageMessages()
        this.showTranscripts = true
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createLeads(this.token, this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.appt = new Date(this.temp.appt)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['CUSTOMER', 'CREATED', 'EMAIL', 'PHONE', 'NOTES', 'APPOINTMENT', 'DEPARTMENT', 'PRIORITY', 'STATUS']
        const filterVal = ['customer', 'created', 'email', 'phone', 'note', 'appt', 'dept', 'importance', 'status']
        const downloadData = this.listData.filter(item => {
          if (this.filterQuery.importance && item.importance !== this.filterQuery.importance) return false
          else if (this.filterQuery.department && item.dept !== this.filterQuery.department) return false
          else if (this.filterQuery.note && item.note.toUpperCase().includes(this.filterQuery.note.toUpperCase()) === false) return false
          return true
        })
        // const data = this.formatJson(filterVal, this.listData)
        const data = this.formatJson(filterVal, downloadData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'leads-table-list'
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
    scrollToTop() {
      console.log('scroll')
    },
    sendItem(item) {
      console.log('scroll')
    },
    getNextPageMessages(val) {
      var start = (this.transcriptsView.page - 1) * this.transcriptsView.limit
      if (this.transcriptsView.showRichMessages) {
        this.transcriptsView.chatMessages = this.transcriptsView.totalMessages.slice(start, start + this.transcriptsView.limit)
        this.transcriptsView.total = this.transcriptsView.totalMessages.length
      } else {
        this.transcriptsView.textMessages = this.transcriptsView.totalTextMessages.slice(start, start + this.transcriptsView.limit)
        this.transcriptsView.total = this.transcriptsView.totalTextMessages.length
      }

      // this.total = this.transcriptsView.totalMessages.length
    },
    handleSizeChange(val) {
      this.transcriptsView.limit = val
    },
    viewText() {
      this.transcriptsView.showRichMessages = false
      this.transcriptsView.page = 1
      this.getNextPageMessages(1)
    },
    viewRichMessages() {
      this.transcriptsView.showRichMessages = true
      this.transcriptsView.page = 1
      this.getNextPageMessages(1)
    },
    exportTranscripts() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Time', 'Owner', 'Direction', 'Message']
        const filterVal = ['created', 'owner', 'direction', 'text']
        const downloadData = this.transcriptsView.totalTextMessages
        // const data = this.formatJson(filterVal, this.listData)
        const data = this.formatJson(filterVal, downloadData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'leads-chat-transcript-list'
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>
