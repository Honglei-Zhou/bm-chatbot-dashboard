<template>
  <!-- <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="ID" width="70" align="center">
      <template slot-scope="scope">
        {{ scope.row.id }}
      </template>
    </el-table-column>
    <el-table-column label="CUSTOMER" align="center">
      <template slot-scope="scope">
        {{ scope.row.customer }}
      </template>
    </el-table-column>
    <el-table-column label="CREATED" align="center">
      <template slot-scope="scope">
        {{ scope.row.created }}
      </template>
    </el-table-column>
    <el-table-column label="CONTACTS" align="center">
      <template slot-scope="scope">
        {{ scope.row.contact }}
      </template>
    </el-table-column>
    <el-table-column label="NOTES/OFFER" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.note }}
      </template>
    </el-table-column>
    <el-table-column label="APPT" align="center">
      <template slot-scope="scope">
        {{ scope.row.appt }}
      </template>
    </el-table-column>
    <el-table-column label="DEPT" align="center">
      <template slot-scope="scope">
        {{ scope.row.dept }}
      </template>
    </el-table-column>
    <el-table-column label="STATUS" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table> -->
  <el-table
    :data="list"
    style="width: 100%;padding-top: 15px;"
  >
    <!-- ID -->
    <el-table-column label="ID" prop="id" sortable="custom" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <!-- CUSTOMER -->
    <el-table-column label="CUSTOMER" align="center">
      <template slot-scope="scope">
        {{ scope.row.customer }}
      </template>
    </el-table-column>

    <!-- CREATED -->
    <el-table-column label="CREATED" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.created | timeFilter }}</span>
      </template>
    </el-table-column>

    <!-- CONTACT -->
    <el-table-column label="CONTACT" align="center">
      <template slot-scope="scope">
        <span style="color:red;">{{ scope.row.contact }}</span>
      </template>
    </el-table-column>

    <!-- NOTES -->
    <el-table-column label="NOTES" align="center">
      <template slot-scope="{row}">
        <span class="link-type" @click="handleUpdate(row)">{{ row.note }}</span>
      </template>
    </el-table-column>

    <!-- APPOINTMENT -->
    <el-table-column label="APPOINTMENT" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.appt | timeFilter }}</span>
      </template>
    </el-table-column>

    <!-- DEPARTMENT -->
    <el-table-column label="DEPT" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.dept }}</span>
      </template>
    </el-table-column>

    <!-- PRIORITY -->
    <el-table-column label="PRIORITY" align="center">
      <template slot-scope="scope">
        <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
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

    <!-- ACTIONS -->
    <el-table-column label="ACTIONS" align="center" min-width="120" class-name="small-padding fixed-width">
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
</template>

<script>
// import { fetchLeadsList } from '@/api/leads'
// import { mapGetters } from 'vuex'
// import Avatar from 'vue-avatar'
import moment from 'moment-timezone'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        Success: 'success',
        New: 'danger',
        Closed: 'info'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
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
  props: {
    list: {
      type: Array,
      required: true
    }
  }
  // data() {
  //   return {
  //     list: null
  //   }
  // },
  // computed: {
  //   ...mapGetters([
  //     'token'
  //   ])
  // },
  // created() {
  //   this.fetchData()
  // },
  // methods: {
  //   fetchData() {
  //     fetchLeadsList(this.token, this.listQuery).then((resp) => {
  //       console.log(resp.data.length)
  //       this.list = []
  //       resp.data.forEach((item) => {
  //         this.list.push({
  //           id: item.id,
  //           importance: item.priority,
  //           note: item.notes_offer,
  //           appt: item.appointment,
  //           customer: item.customer_name,
  //           email: item.email,
  //           phone: item.phone,
  //           contact: item.email + ';' + item.phone,
  //           dept: item.department,
  //           status: item.status
  //         })
  //       })
  //     })
  //   }
  // }
}
</script>
