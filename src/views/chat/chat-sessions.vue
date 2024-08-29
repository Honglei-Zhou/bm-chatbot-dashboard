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

      <el-input v-model="filterQuery.session_id" placeholder="Session ID" style="width: 200px;" class="filter-item" />
      <!-- <el-input v-model="listQuery.handleBy" placeholder="Handled By" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-select v-model="filterQuery.status" placeholder="Status" clearable style="width: 100px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="filterQuery.dept" placeholder="Department" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in departmentOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>

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
          <span class="link-type" @click="handleMessages(scope.row.sessionId)">{{ index }}</span>
        </template> -->
      </el-table-column>

      <!-- CUSTOMER -->
      <el-table-column label="CUSTOMER" width="190" align="center">
        <template v-if="scope.row.customer" slot-scope="scope">
          <div style="display: flex; margin-left: 10px;">
            <div style="width: 35px; ">
              <avatar :username="scope.row.customer" :size="30" />
            </div>
            <div style="width: 160px; line-height: 30px; text-align: center;">
              {{ scope.row.customer }}
            </div>
          </div>
        </template>
        <template v-else slot-scope="scope">
          <span>{{ scope.row.customer }}</span>
        </template>
      </el-table-column>

      <!-- SESSION -->
      <el-table-column label="SESSION" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleMessages(scope.row.sessionId)">{{ scope.row.sessionId }}</span>
        </template>
      </el-table-column>

      <!-- STARTED -->
      <el-table-column label="STARTED" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created | timeFilter }}</span>
        </template>
      </el-table-column>

      <!-- DURATION -->
      <!-- <el-table-column label="DURATION" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.duration }}</span>
        </template>
      </el-table-column> -->

      <!-- LEAD -->
      <el-table-column label="LEADS ID" align="center">
        <template slot-scope="{row}">
          <span v-if="row.leadsId" class="link-type" @click="handleUpdate(row.leadsId)">{{ row.leadsId }}</span>
          <el-button v-else class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-edit" @click="handleCreate">
            Add
          </el-button>
        </template>
      </el-table-column>

      <!-- HANDLED BY -->
      <el-table-column label="HANDLED BY" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.handledBy }}</span>
        </template>
      </el-table-column>

      <!-- DEALERSHIP -->
      <el-table-column label="DEALERSHIP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dealerShip }}</span>
        </template>
      </el-table-column>

      <!-- DEPT -->
      <el-table-column label="DEPT" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dept }}</span>
        </template>
      </el-table-column>

      <!-- STATUS -->
      <el-table-column label="STATUS" class-name="status-col" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getChatsList" /> -->
    <pagination v-show="total>0" :total="total" :page.sync="filterQuery.page" :limit.sync="filterQuery.limit" @pagination="getNextPage" />

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

    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Name" prop="customer">
          <el-input v-model="temp.customer" type="text" placeholder="Please enter customer name." />
        </el-form-item>
        <el-form-item label="Contact" prop="contact">
          <el-input v-model="temp.contact" placeholder="Please enter customer contact information." />
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
    </el-dialog> -->

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Avatar from 'vue-avatar'
import { fetchChatList } from '@/api/chats'
import { fetchLeads } from '@/api/leads'
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'

const departmentOptions = [
  { key: 'service', display_name: 'Service' },
  { key: 'sales', display_name: 'Sales' }
]

export default {
  name: 'ChatSessions',
  components: { Pagination, Avatar },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Answered: 'success',
        Missed: 'danger'
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
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listData: [],
      total: 0,
      sessionData: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        dept: undefined,
        handledBy: undefined,
        sort: '-id'
      },
      filterQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        dept: undefined,
        session_id: undefined
      },
      departmentOptions,
      handledByOptions: [{ display_name: 'BM Bot', key: 'BM Bot' }, { display_name: 'Annie West', key: 'Annie West' }],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['Missed', 'Answered'],
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        customer: [{ required: true, message: 'type is required', trigger: 'change' }]
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
      }
    }
  },
  computed: {
    ...mapGetters([
      'token', 'dealerId'
    ])
  },
  created() {
    this.initSessionDates()
    this.getChatsList()
  },
  methods: {
    filterHandler() {
      this.listData = this.listData.filter(item => {
        // console.log(item)
        // console.log(item.sessionId.toUpperCase().includes(this.filterQuery.session_id.toUpperCase()))
        // console.log(this.filterQuery.status)
        if (this.filterQuery.dept !== undefined && item.dept.toLowerCase() !== this.filterQuery.dept.toLowerCase()) return false
        else if (this.filterQuery.status !== undefined && item.status.toLowerCase() !== this.filterQuery.status.toLowerCase()) return false
        else if (this.filterQuery.session_id !== undefined && item.sessionId.toUpperCase().includes(this.filterQuery.session_id.toUpperCase()) === false) return false
        return true
      })
      this.filterQuery.page = 1
      this.getPage()
    },
    resetFilter() {
      this.filterQuery = {
        status: undefined,
        dept: undefined,
        session_id: undefined
      }
      this._updateSessionList()
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
        this.getChatsList()
      } else {
        this._updateSessionList()
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
    },
    _updateSessionList() {
      try {
        this.filterQuery = {
          page: 1,
          limit: 20,
          status: undefined,
          dept: undefined,
          session_id: undefined
        }
        var s = Date.parse(this.datePeriod[0])
        var e = Date.parse(this.datePeriod[1])
        this.listData = []
        this.sessionData.forEach((item, index) => {
          var c = Date.parse(item.created + ' UTC')
          if (s <= c && c <= e) {
            this.listData.push(item)
          }
        })
        this.getPage()
      } catch (err) {
        console.log(err)
      }
    },
    getChatsList() {
      this.listLoading = true
      // this.list = []
      fetchChatList(this.token, this.listQuery, this.dealerId).then((resp) => {
        resp.data.forEach((item) => {
          console.log(item)
          this.sessionData.push({
            id: item.id,
            customer: item.customer_name,
            sessionId: item.session_id,
            duration: item.duration,
            created: item.started,
            leadsId: item.lead,
            dealerShip: item.dealer_name,
            dept: item.department,
            handledBy: item.handler,
            status: item.missed
          })
          // console.log(this.list)
        })
        this._updateSessionList()
        // this.total = resp.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getChatsList()
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
    handleMessages(id) {
      this.$router.push({ name: 'ChatMessages', params: { sessionId: id }})
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
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
    handleUpdate(id) {
      fetchLeads(this.token, id, this.dealerId).then((resp) => {
        resp.data.forEach((item) => {
          this.temp = {
            id: item.id,
            importance: item.priority,
            note: item.notes_offer,
            appt: item.appointment,
            customer: item.customer_name,
            email: item.email,
            created: item.created,
            phone: item.phone,
            contact: item.email + ';' + item.phone,
            dept: item.department,
            status: item.status
          }
        })
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', 'CUSTOMER', 'SUBJECT', 'STARTED', 'DURATION', 'LEADS ID', 'HANDLED BY', 'DEALERSHIP', 'DEPARTMENT', 'STATUS']
        const filterVal = ['id', 'customer', 'subject', 'created', 'duration', 'leadsId', 'handledBy', 'dealerShip', 'dept', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'chatsessions-table-list'
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
    }
  }
}
</script>
