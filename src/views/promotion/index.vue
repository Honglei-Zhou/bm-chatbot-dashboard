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

      <el-select v-model="filterQuery.status" placeholder="Status" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <!-- <el-select v-model="filterQuery.importance" placeholder="Priority" clearable style="width: 100px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <el-select v-model="filterQuery.department" placeholder="Department" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in departmentOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="filterHandler">
        Filter
      </el-button>
      <el-button v-waves class="filter-item" type="success" icon="el-icon-refresh" @click="resetFilter">
        Reset
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button> -->

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

      <!-- Name -->
      <el-table-column v-if="checkColumns.indexOf('NAME') >= 0" label="NAME" width="195" align="center">
        <template slot-scope="scope">
          {{ scope.row.promotionName }}
        </template>
      </el-table-column>

      <!-- COUPON -->
      <el-table-column v-if="checkColumns.indexOf('COUPON') >= 0" label="COUPON" align="center">
        <template slot-scope="scope">
          <img width="70px" :src="scope.row.coupon" alt="" @click="scope.row.dialogVisible=true">
          <el-dialog :visible.sync="scope.row.dialogVisible">
            <img width="100%" :src="scope.row.coupon" alt="">
          </el-dialog>
        </template>
      </el-table-column>

      <!-- CODE -->
      <el-table-column v-if="checkColumns.indexOf('CODE') >= 0" label="CODE" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <!-- Keywords -->
      <el-table-column v-if="checkColumns.indexOf('KEYWORDS') >= 0" label="KEYWORDS" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.keywords }}</span>
        </template>
      </el-table-column>

      <!-- NOTES -->
      <el-table-column v-if="checkColumns.indexOf('Note') >= 0" label="Note" align="center">
        <template slot-scope="{row}">
          {{ row.note }}
        </template>
      </el-table-column>

      <!-- DEPARTMENT -->
      <el-table-column v-if="checkColumns.indexOf('DEPT') >= 0" label="DEPT" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>

      <!-- Start Date -->
      <el-table-column v-if="checkColumns.indexOf('START') >= 0" label="START" prop="start" sortable align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.valid ===0" style="color:#67C23A;">{{ scope.row.startDate | timeFilter }}</span>
          <span v-else style="color:#F56C6C;">{{ scope.row.startDate | timeFilter }}</span>
        </template>
      </el-table-column>

      <!-- End Date -->
      <el-table-column v-if="checkColumns.indexOf('END') >= 0" label="END" prop="end" sortable align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.valid ===0" style="color:#67C23A;">{{ scope.row.endDate | timeFilter }}</span>
          <span v-else style="color:#F56C6C;">{{ scope.row.endDate | timeFilter }}</span>
        </template>
      </el-table-column>

      <!-- Created -->
      <el-table-column v-if="checkColumns.indexOf('CREATED') >= 0" label="CREATED" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created | timeFilter }}</span>
        </template>
      </el-table-column>

      <!-- STATUS -->
      <el-table-column v-if="checkColumns.indexOf('STATUS') >= 0" label="STATUS" class-name="status-col" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.valid | statusFilter">
            {{ row.valid === 0 ? 'Valid' : 'Expired' }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- ACTIONS -->
      <el-table-column v-if="checkColumns.indexOf('ACTIONS') >= 0" label="ACTIONS" align="center" width="190" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <!-- <el-button v-else size="mini" type="warning" @click="handleModifyStatus(row,'Closed')">
            Close
          </el-button> -->
          <el-button size="mini" type="danger" @click="row.deleteDialogVisible=true">
            Delete
          </el-button>
          <el-dialog
            title="Warning"
            :visible.sync="row.deleteDialogVisible"
            width="30%"
            center
          >
            <span>You are going to delete the coupon. Press Confirm button to proceed.</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="row.deleteDialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="handleDelete(row)">Confirm</el-button>
            </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="filterQuery.page" :limit.sync="filterQuery.limit" @pagination="getNextPage" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 70%; margin-left:50px;">
        <el-form-item label="Name" prop="promotionName">
          <el-input v-model="temp.promotionName" type="text" placeholder="Name: October Sales Promotion" style="min-width: 400px;" />
        </el-form-item>

        <el-form-item label="Date" prop="promotionDates">
          <el-date-picker
            v-model="temp.promotionDates"
            style="min-width: 400px;"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="timestamp"
          />
          <!-- <el-date-picker v-model="temp.appt" type="datetime" placeholder="Please pick a date" /> -->
        </el-form-item>

        <el-form-item v-if="dialogStatus==='create'" label="Coupon" prop="coupon">
          <el-upload
            ref="upload"
            action=""
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeCouponUpload"
            :http-request="handleUpload"
            :multiple="false"
            :limit="1"
            :disabled="temp.uploaded"
          >
            <!-- <img v-if="temp.coupon" :src="temp.coupon" class="coupon"> -->
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="temp.dialogVisible">
            <img width="100%" :src="temp.dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

        <el-form-item v-else label="Coupon" prop="coupon">
          <el-upload
            v-if="temp.couponUpload"
            ref="upload"
            action=""
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeCouponUpload"
            :http-request="handleUpload"
            :multiple="false"
            :limit="1"
            :disabled="temp.uploaded"
          >
            <!-- <img v-if="temp.coupon" :src="temp.coupon" class="coupon"> -->
            <i class="el-icon-plus" />
          </el-upload>
          <img v-else :src="temp.coupon" class="coupon">
          <el-button type="primary" style="margin-top: 20px;" @click="temp.couponUpload=true">
            Change Coupon
          </el-button>
          <el-dialog :visible.sync="temp.dialogVisible">
            <img width="100%" :src="temp.dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

        <el-form-item label="Department" prop="department">
          <el-select v-model="temp.department" placeholder="Please select department" clearable>
            <el-option v-for="item in departmentOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Keywords">
          <el-select
            v-if="temp.keywordsSelect"
            v-model="temp.keywordsList"
            multiple
            collapse-tags
            placeholder="Select"
          >
            <el-option
              v-for="item in keywordsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-else v-model="temp.keywordsOther" type="text" placeholder="Please enter keywords. Ex. oil change,battery replacement." />

          <el-switch
            v-model="temp.keywordsSelect"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="Note">
          <el-input v-model="temp.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please enter note." />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">
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
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'
import { compareValues, randomCode } from '@/api/tools'
import { promotionService } from '@/api/promotionService'

const departmentOptions = [
  { key: 'service', display_name: 'Service' },
  { key: 'sales', display_name: 'Sales' }
]

const statusOptions = [
  { key: 0, display_name: 'Valid' },
  { key: 1, display_name: 'Expired' }
]

const columnOptions = ['ID', 'NAME', 'COUPON', 'CODE', 'KEYWORDS', 'DEPT', 'NOTE', 'CREATED', 'START', 'END', 'STATUS', 'ACTIONS']

export default {
  name: 'Promotion',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    },
    timeFilter(timestamp) {
      if (timestamp) {
        var curTime = moment.tz(timestamp, 'Europe/London')
        var localTime = curTime.clone().tz('Europe/London')
        return localTime.format('MMM Do, YYYY')
      } else {
        return 'NA'
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      showTable: true,
      list: null,
      listData: [],
      itemsData: [],
      total: 0,
      checkColumns: ['ID', 'NAME', 'COUPON', 'CODE', 'KEYWORDS', 'NOTE', 'START', 'END', 'STATUS', 'ACTIONS'],
      columns: columnOptions,
      showColumn: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        dealerId: '201978945124789',
        sort: '-id'
      },
      filterQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        department: undefined
      },
      departmentOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions,
      showReviewer: false,
      keywordsOptions: [{
        value: 'Oil Change, Filter Change',
        label: 'Oil & Filter Change'
      }, {
        value: 'Tire Rotation',
        label: 'Tire Rotation'
      }, {
        value: 'New Customers Only',
        label: 'New Customers Only'
      }, {
        value: 'Accessories',
        label: 'Accessories'
      }, {
        value: '4-Wheel Alignment',
        label: '4-Wheel Alignment'
      }, {
        value: 'Wildcard Savings',
        label: 'Wildcard Savings'
      }],
      temp: {
        id: undefined,
        promotionDates: '',
        promotionName: '',
        dealerId: '201978945124789',
        dealerName: 'Telle',
        keywords: '',
        keywordsList: [],
        keywordsOther: '',
        note: '',
        startDate: '',
        endDate: '',
        coupon: '',
        code: '',
        department: '',
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        valid: 0,
        uploaded: false,
        keywordsSelect: true,
        couponUpload: false
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        promotionName: [{ required: true, message: 'promotion name is required', trigger: 'blur' }],
        promotionDates: [{ required: true, message: 'Start and end dates are required', trigger: 'blur' }],
        coupon: [{ required: true, message: 'Coupon image is required', trigger: 'blur' }]
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
      'token', 'colors', 'participants', 'dealerId'
    ])
  },
  created() {
    this.initSessionDates()
    this.listQuery.dealerId = this.dealerId
    this.temp.dealerId = this.dealerId
    this.temp.dealerName = this.dealerId
    this.getPromotions()
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file)
      promotionService.deleteFile(file.raw).then(resp => {
        console.log(resp)
        this.temp.coupon = ''
        this.temp.uploaded = false
      })
    },
    handlePictureCardPreview(file) {
      this.temp.dialogImageUrl = file.url
      this.temp.dialogVisible = true
    },
    beforeCouponUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt4M = file.size / 1024 / 1024 < 4

      if (!isJPG) {
        this.$message.error('Coupon picture must be JPG format!')
      }
      if (!isLt4M) {
        this.$message.error('Coupon picture size can not exceed 4MB!')
      }
      return isJPG && isLt4M
    },
    handleUpload(file) {
      this.temp.uploaded = true
      promotionService.uploadFileToS3(file.file).then(resp => {
        // console.log(resp.request)
        this.temp.coupon = 'https://blissmotors-web-upload.s3.amazonaws.com/telle/' + file.file.name
        this.temp.uploaded = false
      }).catch(err => {
        console.log(err)
        this.temp.uploaded = false
      })
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
        this.getPromotions()
      } else {
        this._updatePromotionList()
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
      this.list = null
      var start = (this.filterQuery.page - 1) * this.filterQuery.limit
      this.list = this.listData.slice(start, start + this.filterQuery.limit)
      this.total = this.listData.length
      console.log(this.total)
      // this.forceRerender()
    },
    _updatePromotionList() {
      try {
        this.filterQuery = {
          page: 1,
          limit: 20,
          status: undefined,
          department: undefined
        }
        var s = Date.parse(this.datePeriod[0])
        var e = Date.parse(this.datePeriod[1])
        this.listData = []

        this.itemsData.forEach((item, index) => {
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
    getPromotions() {
      this.listLoading = true
      promotionService.getPromotionList(this.token, this.listQuery).then((resp) => {
        this.list = []
        this.itemsData = []
        console.log(resp)
        resp.promotions.forEach((item) => {
          var current_timestamp = new Date().getTime()
          var end_timestamp = new Date(item.end_date).getTime()
          this.itemsData.push({
            id: item.id,
            promotionName: item.promotion_name,
            dealerId: item.dealer_id,
            dealerName: item.dealer_name,
            keywords: item.keywords,
            note: item.note,
            startDate: new Date(item.start_date).getTime(),
            endDate: end_timestamp,
            coupon: item.coupon,
            code: item.code,
            department: item.department,
            created: item.created,
            valid: current_timestamp > end_timestamp ? 1 : 0,
            dialogVisible: false,
            deleteDialogVisible: false
          })
        })

        this._updatePromotionList()

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getPromotions()
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
      if (prop === 'start') {
        if (order === 'descending') {
          this.listData = this.listData.sort(compareValues('email', 'desc'))
        } else {
          this.listData = this.listData.sort(compareValues('email', 'asc'))
        }
      } else if (prop === 'end') {
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
        status: undefined,
        department: undefined
      }
      this._updatePromotionList()
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.showTable = false

      this.$nextTick(() => {
        // Add the component back in
        this.showTable = true
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        promotionDates: '',
        promotionName: '',
        dealerId: this.dealerId,
        dealerName: this.dealerId,
        keywords: '',
        keywordsList: [],
        keywordsOther: '',
        note: '',
        startDate: '',
        endDate: '',
        coupon: '',
        code: '',
        department: '',
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        uploaded: false,
        keywordsSelect: true,
        couponUpload: false
      }
    },
    handleCancel() {
      this.resetTemp()
      this.dialogFormVisible = false
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
      this.temp.startDate = this.temp.promotionDates[0]
      this.temp.endDate = this.temp.promotionDates[1]
      this.temp.code = randomCode()
      this.temp.keywords = ''
      if (this.temp.keywordsSelect) {
        this.temp.keywordsList.forEach((item, index) => {
          if (index === 0) {
            this.temp.keywords = item
          } else {
            this.temp.keywords = this.temp.keywords + ',' + item
          }
        })
      } else {
        this.temp.keywords = this.temp.keywordsOther
      }

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.keywords === '' || this.temp.coupon === '') {
            this.$notify({
              title: 'Error',
              message: 'Keywords or Coupon is empty',
              type: 'error',
              duration: 2000
            })
          } else {
            var curTime = new Date().getTime()
            this.temp.valid = this.temp.endDate >= curTime ? 0 : 1
            promotionService.addPromotion(this.token, this.temp).then((resp) => {
              this.itemsData.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })

              this.$nextTick(() => {
                this._updatePromotionList()
              })
            })
          }
        }
      })
    },
    handleUpdate(row) {
      for (const key in row) {
        this.temp[key] = row[key]
      }
      // this.temp = Object.assign({}, row) // copy obj
      this.temp.promotionDates = [this.temp.startDate, this.temp.endDate]
      this.temp.keywordsOther = this.temp.keywords
      this.temp.keywordsSelect = false
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.temp.startDate = this.temp.promotionDates[0]
      this.temp.endDate = this.temp.promotionDates[1]
      this.temp.code = randomCode()
      this.temp.keywords = ''
      if (this.temp.keywordsSelect) {
        this.temp.keywordsList.forEach((item, index) => {
          if (index === 0) {
            this.temp.keywords = item
          } else {
            this.temp.keywords = this.temp.keywords + ',' + item
          }
        })
      } else {
        this.temp.keywords = this.temp.keywordsOther
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.keywords === '' || this.temp.coupon === '') {
            this.$notify({
              title: 'Error',
              message: 'Keywords or Coupon is empty',
              type: 'error',
              duration: 2000
            })
          } else {
            // const tempData = Object.assign({}, this.temp)
            // tempData.timestamp = +new Date(tempData.timestamp)
            var curTime = new Date().getTime()
            this.temp.valid = this.temp.endDate >= curTime ? 0 : 1

            promotionService.updatePromotion(this.token, this.temp).then(() => {
              for (const v of this.itemsData) {
                if (v.id === this.temp.id) {
                  const index = this.itemsData.indexOf(v)
                  this.itemsData.splice(index, 1, this.temp)
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
              this.$nextTick(() => {
                // this.getPromotions()
                this._updatePromotionList()
              })
            })
          }
        }
      })
      console.log(this.temp)
    },
    handleDelete(row) {
      this.listLoading = true
      promotionService.deletePromotion(this.token, { id: row.id, dealerId: this.dealerId }).then(resp => {
        console.log(resp)
        row.deleteDialogVisible = false
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })

        console.log(row)
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        this.listLoading = false
      }).catch(() => {
        row.deleteDialogVisible = false
        this.listLoading = false
      })
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

<style scoped>
.coupon-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
.coupon-uploader .el-upload:hover {
    border-color: #409EFF;
  }
.coupon-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
.coupon {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
