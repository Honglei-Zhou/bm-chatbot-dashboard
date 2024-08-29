<template>
  <div class="dashboard-editor-container">
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

      <el-button class="filter-item" type="warning" @click="submitQuery">
        Submit
      </el-button>

      <!-- <el-col :xs="4" :sm="4" :lg="4">
        <el-button type="primary" @click="submitDate">Submit</el-button>
      </el-col>

      <el-col :xs="4" :sm="4" :lg="4">
        <el-button type="warning" @click="showChangeScale = !showChangeScale">Change Scale</el-button>
      </el-col> -->
    </el-row>

    <!-- <el-row v-if="showChangeScale" style="background:#fff; padding: 16px; margin-top: 32px; margin-bottom:32px;">
      <el-button v-if="timeScale===0" type="info">Hour</el-button>
      <el-button v-else type="primary" plain @click="setScale(0)">Hour</el-button>

      <el-button v-if="timeScale===1" type="info">Day</el-button>
      <el-button v-else type="primary" plain @click="setScale(1)">Day</el-button>

      <el-button v-if="timeScale===2" type="info">Week</el-button>
      <el-button v-else type="primary" plain @click="setScale(2)">Week</el-button>

      <el-button v-if="timeScale===3" type="info">Month</el-button>
      <el-button v-else type="primary" plain @click="setScale(3)">Month</el-button>
    </el-row> -->

    <panel-group
      :visits="newVisits"
      :messages="messages"
      :chat-sessions="chatSessions"
      @handleSetLineChartData="handleSetLineChartData"
    />

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="currentLineChartData" />
    </el-row> -->

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart-adv :chart-data="currentLineChartData" />
    </el-row>

    <el-row :gutter="32">
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col> -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart :chart-data="barChartData" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 32}" :md="{span: 32}" :lg="{span: 16}" :xl="{span: 16}" style="padding-right:8px;margin-bottom:30px;">
        <!-- <transaction-table /> -->

        <leads-table :list="list" :page.sync="filterQuery.page" :limit.sync="filterQuery.limit" @sortChange="sortChange" />

        <pagination v-show="total>0" :total="total" :page.sync="filterQuery.page" :limit.sync="filterQuery.limit" @pagination="getNextPage" />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 16}" :md="{span: 16}" :lg="{span: 8}" :xl="{span: 8}" style="margin-bottom:30px;">
        <div class="hot-words">
          <div v-if="keywordsObj.keywords.length > 0" class="hot-words-content">
            <p style="text-align: center; font-size: 14px;"><b>Top 10 Keywords</b></p>
            <el-row v-for="(item, index) in keywordsObj.keywords" :key="index" style="margin-top: 5px;">
              <el-col v-if="index % 3 === 0" :span="8" style="color: #F56C6C; text-align: right; font-size: 14px;"><span><b>Top</b></span></el-col>
              <el-col v-else :span="8" style="color: #67C23A; text-align: right; font-size: 14px;"><span><b>Top</b></span></el-col>
              <el-col v-if="index % 3 === 0" :span="4" style="color: #F56C6C; text-align: center; font-size: 14px;"><b>{{ (index + 1) }}</b></el-col>
              <el-col v-else :span="4" style="color: #67C23A; text-align: center; font-size: 14px;"><b>{{ (index + 1) }}</b></el-col>
              <el-col v-if="index % 3 === 0" :span="12" style="font-size: 14px;">{{ item.key }}</el-col>
              <el-col v-else :span="12" style="font-size: 14px;">{{ item.key }}</el-col>
            </el-row>
          </div>
          <img v-if="keywordsObj.url !== ''" style="width: 100%; margin-top: 10px;" :src="keywordsObj.url">
          <el-button style="margin-top: 10px;" type="primary" disabled>Hot Words</el-button>
          <!-- <el-button style="margin-top: 10px;" type="primary" disabled @click="_getKeywords">Click to View Hot Words</el-button> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChartAdv from './components/LineChartAdv'
// import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import LeadsTable from './components/LeadsTable'
import { getPieChartData, getBarChartData, getLineChartDataV2, getKeywords } from '@/api/remote-search'
import { fetchLeadsList } from '@/api/leads'
import { mapGetters } from 'vuex'
import { compareValues } from '@/api/tools'
// import moment from 'moment-timezone'
import Pagination from '@/components/Pagination'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    // LineChart,
    LineChartAdv,
    // RaddarChart,
    PieChart,
    BarChart,
    // TransactionTable,
    // TodoList,
    LeadsTable,
    Pagination
    // BoxCard
  },
  data() {
    return {
      chartData: {},
      pieChartData: {},
      pieTotalData: {},
      newVisits: 0,
      messages: 0,
      chatSessions: 0,
      currentLineChartData: {},
      lineChartAdvData: {},
      barChartData: {},
      list: [],
      total: 0,
      listData: [],
      page: 1,
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
        limit: 10,
        importance: undefined,
        note: undefined,
        department: undefined
      },
      timeScale: 0,
      showChangeScale: false,
      hourDisabled: true,
      earliestDate: '2019-05-01',
      datePeriod: ['', ''],
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
      keywordsObj: {
        keywords: [],
        url: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'token', 'timePeriod', 'dealerId'
    ])
  },
  watch: {
    timePeriod() {
      // this.$store.commit('user/SET_START', this.datePeriod[0])
      // this.$store.commit('user/SET_END', this.datePeriod[1])
      this.datePeriod = this.timePeriod
      // console.log(this.datePeriod)
      this._updateLineDate()
      this._updatePieData()
    }
  },
  created() {
    this.initSessionDates()
    this._getLineChartData()
    this._getPieChartData()
    this._getBarChartData()
    // this._getLineChartAdvData()
    this.fetchData()
    this.$store.dispatch('chat/getAllChats', { token: this.token, val: 1 })
    this.$store.dispatch('bmbot/getAllCars', { pageNum: 1, dealerId: this.dealerId })
  },
  methods: {
    _getKeywords() {
      getKeywords().then(resp => {
        var keywords = resp.keywords

        this.keywordsObj['keywords'] = []
        for (const key in keywords) {
          this.keywordsObj['keywords'].push({ key: key, value: keywords[key] })
        }
        this.keywordsObj['keywords'].sort((a, b) => (a.value > b.value) ? -1 : 1)
        // this.keywordsObj['keywords'] = keywords
        this.keywordsObj['url'] = resp.word_cloud
        console.log(this.keywordsObj)
      })
    },
    submitQuery() {
      this.listLoading = true
      var s = Date.parse(this.datePeriod[0])
      var earliest = Date.parse(this.earliestDate)
      if (s < earliest) {
        this.getLeadsList()
      }
      this.$store.commit('user/SET_START', this.datePeriod[0])
      this.$store.commit('user/SET_END', this.datePeriod[1])
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    submitDate() {
      console.log(this.timePeriod)
    },
    setScale(scale) {
      this.timeScale = scale
    },
    initSessionDates() {
      // const end = new Date()
      // var start = new Date()
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.$store.dispatch('user/initDates')
      this.datePeriod = this.timePeriod
      // this.endDate = moment.tz('America/Chicago').format('MMMM Do')
      // this.startDate = moment.tz('America/Chicago').subtract(5, 'days').format('MMMM Do')
      // this.endDate = curTime.format('MMMM Do YY')
    },
    handleSetLineChartData(type) {
      this.currentLineChartData = this.chartData[type]
    },
    _compareValues(key, order = 'asc') {
      return function(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          return 0
        }
        const varA = (typeof a[key] === 'string')
          ? a[key].toUpperCase() : a[key]
        const varB = (typeof b[key] === 'string')
          ? b[key].toUpperCase() : b[key]

        let comparison = 0
        if (varA > varB) {
          comparison = 1
        } else if (varA < varB) {
          comparison = -1
        }
        return (
          (order === 'desc')
            ? (comparison * -1) : comparison
        )
      }
    },

    _updateLineDate() {
      try {
        var s = Date.parse(this.timePeriod[0])
        var e = Date.parse(this.timePeriod[1])
        this.newVisits = 0
        this.messages = 0
        this.chatSessions = 0
        this.chartData.newVisits.x_axis.forEach((item, index) => {
          var c = Date.parse(item)
          if (s <= c && c <= e) {
            var element = this.chartData.newVisits.data[index]
            this.newVisits += Number(element)
          }
        })
        this.chartData.messages.x_axis.forEach((item, index) => {
          var c = Date.parse(item)
          if (s <= c && c <= e) {
            var element = this.chartData.messages.data[index]
            this.messages += Number(element)
          }
        })
        this.chartData.chatSessions.x_axis.forEach((item, index) => {
          var c = Date.parse(item)
          if (s <= c && c <= e) {
            var element = this.chartData.chatSessions.data[index]
            this.chatSessions += Number(element)
          }
        })
      } catch (err) {
        console.log(err)
      }
    },

    _getLineChartAdvData() {
      getLineChartDataV2(this.token, this.listQuery, this.dealerId).then((resp) => {
        console.log(resp)
        this.lineChartAdvData = resp.newVisits
      })
    },

    _getLineChartData() {
      getLineChartDataV2(this.token, this.listQuery, this.dealerId).then((resp) => {
        this.chartData = resp
        console.log(resp)
        // resp.newVisits.data.forEach(element => {
        //   this.newVisits += Number(element)
        // })
        // resp.messages.data.forEach(element => {
        //   this.messages += Number(element)
        // })
        // resp.chatSessions.data.forEach(element => {
        //   this.chatSessions += Number(element)
        // })
        this._updateLineDate()
        this.currentLineChartData = this.chartData.newVisits
      })
    },

    _updatePieData() {
      try {
        var s = Date.parse(this.timePeriod[0])
        var e = Date.parse(this.timePeriod[1])
        var data = this.pieTotalData.filter(item => {
          var c = Date.parse(item.date)
          // console.log(s)
          // console.log(e)
          // console.log(c)
          // console.log('-----------------------')
          if (s <= c && c <= e) {
            return true
          } else {
            return false
          }
        })

        var tmp = {}
        data.forEach((item) => {
          if (item.name in tmp) {
            tmp[item.name] += item.value
          } else {
            tmp[item.name] = item.value
          }
        })

        data = []
        for (var city in tmp) {
          data.push({ name: city, value: tmp[city] })
        }

        data = data.sort(this._compareValues('value', 'desc'))
        var count = 0
        var total = 0
        var pieData = { data: [], legend: [] }
        data.forEach((element) => {
          if (count < 10) {
            pieData.data.push(element)
            pieData.legend.push(element.name)
            count += 1
          } else {
            total += element.value
          }
        })
        if (total > 0) {
          pieData.data.push({ name: 'other', value: total })
          pieData.legend.push('other')
        }

        this.pieChartData = pieData
      } catch (err) {
        console.log(err)
      }
    },
    _getPieChartData() {
      getPieChartData(this.token, this.listQuery, this.dealerId).then((resp) => {
        // this.pieTotalData = resp.data.sort(this._compareValues('value', 'desc'))
        console.log(resp.data)
        this.pieTotalData = resp.data
        this._updatePieData()
        // this.pieChartData = resp
        // this.pieChartData.legend = []
        // resp.data.forEach((element) => {
        //   this.pieChartData.legend.push(element.name)
        // })
        // console.log(this.pieChartData.data.sort(this._compareValues('value', 'desc')))
        // this.$refs.pieChart.initChart()
      })
    },
    _getBarChartData() {
      getBarChartData(this.token, this.listQuery, this.dealerId).then((resp) => {
        console.log(resp)
        this.barChartData = resp
      })
    },

    getNextPage() {
      // this.filterQuery.page += 1
      this.getPage()
    },
    getPage() {
      var start = (this.filterQuery.page - 1) * this.filterQuery.limit
      this.list = this.listData.slice(start, start + this.filterQuery.limit)
      this.total = this.listData.length
    },
    fetchData() {
      fetchLeadsList(this.token, this.listQuery, this.dealerId).then((resp) => {
        var s = Date.parse(this.timePeriod[0])
        var e = Date.parse(this.timePeriod[1])
        this.listData = []
        resp.data.forEach((item) => {
          var c = Date.parse(item.created + ' UTC')
          if (s <= c && c <= e && item.status.trim() !== 'Invalid' && (item.email !== 'default@telle.ai' || item.phone !== '8008008000')) {
            this.listData.push({
              id: item.id,
              importance: item.priority,
              created: item.created,
              note: item.notes_offer,
              appt: item.appointment,
              customer: item.customer_name,
              email: item.email === 'default@telle.ai' ? '' : item.email,
              phone: item.phone === '8008008000' ? '' : item.phone,
              contact: item.email + ';' + item.phone,
              dept: item.department,
              status: item.status.trim()
            })
          }
        })
        this.getPage()
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
  .bg-white {
    background: #fff;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .hot-words{
    background: #fff;
    display: flex;
    flex-direction: column;
  }

  .hot-words-content{
    // margin-left: 60px;
    display: flex;
    flex-direction: column;
    text-align: left;
  }

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
