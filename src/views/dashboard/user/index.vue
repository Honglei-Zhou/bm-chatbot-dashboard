<template>
  <div class="dashboard-editor-container">

    <panel-group
      :visits="newVisits"
      :messages="messages"
      :chat-sessions="chatSessions"
      @handleSetLineChartData="handleSetLineChartData"
    />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="currentLineChartData" />
    </el-row>

    <el-row :gutter="32">
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
        <leads-table :list="list" />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 16}" :md="{span: 16}" :lg="{span: 8}" :xl="{span: 8}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <!-- <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import LeadsTable from './components/LeadsTable'
import { getLineChartData, getPieChartData, getBarChartData } from '@/api/remote-search'
import { fetchLeadsList } from '@/api/leads'
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardUser',
  components: {
    PanelGroup,
    LineChart,
    // RaddarChart,
    PieChart,
    BarChart,
    // TransactionTable,
    TodoList,
    LeadsTable
    // BoxCard
  },
  data() {
    return {
      chartData: {},
      pieChartData: {},
      newVisits: 0,
      messages: 0,
      chatSessions: 0,
      currentLineChartData: {},
      barChartData: {},
      list: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        note: undefined,
        department: undefined,
        sort: '-id'
      }
    }
  },
  computed: {
    ...mapGetters([
      'token', 'dealerId'
    ])
  },
  created() {
    this._getLineChartData()
    this._getPieChartData()
    this._getBarChartData()
    this.fetchData()
    if (this.token) {
      this.$store.dispatch('chat/getAllChats', { token: this.token, val: 1 })
    }
    // this.$store.dispatch('bmbot/getNewCars', 1)
  },
  methods: {
    handleSetLineChartData(type) {
      this.currentLineChartData = this.chartData[type]
    },
    _getLineChartData() {
      getLineChartData(this.token, this.listQuery, this.dealerId).then((resp) => {
        this.chartData = resp
        // console.log(resp.data.newVisits)
        resp.newVisits.data.forEach(element => {
          this.newVisits += Number(element)
        })
        resp.messages.data.forEach(element => {
          this.messages += Number(element)
        })
        resp.chatSessions.data.forEach(element => {
          this.chatSessions += Number(element)
        })
        this.currentLineChartData = this.chartData.newVisits
      })
    },
    _getPieChartData() {
      getPieChartData(this.token, this.listQuery, this.dealerId).then((resp) => {
        this.pieChartData = resp
        this.pieChartData.legend = []
        resp.data.forEach((element) => {
          this.pieChartData.legend.push(element.name)
        })
        // this.$refs.pieChart.initChart()
      })
    },
    _getBarChartData() {
      getBarChartData(this.token, this.listQuery, this.dealerId).then((resp) => {
        this.barChartData = resp
      })
    },
    fetchData() {
      fetchLeadsList(this.token, this.listQuery, this.dealerId).then((resp) => {
        console.log(resp)
        this.list = []
        resp.data.forEach((item) => {
          this.list.push({
            id: item.id,
            importance: item.priority,
            created: item.created,
            note: item.notes_offer,
            appt: item.appointment,
            customer: item.customer_name,
            email: item.email,
            phone: item.phone,
            contact: item.email + ';' + item.phone,
            dept: item.department,
            status: item.status
          })
        })
      })
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
