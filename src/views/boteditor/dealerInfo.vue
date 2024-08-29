<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top: 40px;">
      <el-col :span="11">
        <el-form ref="infoForm" :model="infoForm" :rules="rules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="Dealer Name" prop="title">
            <el-input v-model="infoForm.title" type="text" />
          </el-form-item>
          <el-form-item label="Dealer Address" prop="address">
            <el-input v-model="infoForm.address" type="text" />
          </el-form-item>

          <!-- <el-form-item label="Map Name">
            <el-input v-model="infoForm.workingHours.contact.title" readonly />
          </el-form-item> -->
          <el-form-item label="Latitude" prop="latitude">
            <el-input v-model="infoForm.latitude" />
          </el-form-item>

          <el-form-item label="Longitude" prop="longitude">
            <el-input v-model="infoForm.longitude" />
          </el-form-item>

          <el-form-item v-for="(item, index) in infoForm.workingHours.items" :key="index" :label="item.name">
            <div v-for="(rowItem, idx) in item.content" :key="idx" style="margin-top: 5px;">
              <el-input slot="prepend" v-model="rowItem.key" :placeholder="item.key" style="width: 25%;" />
              <el-input v-model="rowItem.value" :placeholder="item.value" style="width: 58%;" />

              <el-button slot="append" type="danger" icon="el-icon-delete" style="width: 15%;" @click="deleteRow(index, idx)" />
            </div>
            <el-button type="primary" style="margin-top: 5px;" plain @click="addRow(index)">Add</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('infoForm')">Save</el-button>
            <el-button @click="resetForm('infoForm')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2"><div class="col-divider-white" /></el-col>
      <el-col :span="11">
        <el-card shadow="always" :body-style="{height: '650px', width: '334px'}">
          <div style="width: 334px; height: 580px; border-radius: 9px; background: white;">
            <WorkingHours ref="workingHours" :working-hours="infoForm.workingHours" :dealer-name="infoForm.workingHours.contact.title" />
          </div>
        </el-card></el-col>
    </el-row>

    <el-dialog
      title="Warning"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>Press Confirm button to delete row.</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDelete">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import WorkingHours from '@/components/BotPage/WorkingHours'
import TelephoneIcon from '@/assets/icons/telephone.png'
import SalesIcon from '@/assets/icons/sales.png'
import ServiceIcon from '@/assets/icons/tools.png'
import PartsIcon from '@/assets/icons/parts.png'
import { updateBotSetting } from '@/api/botSetting'
import { mapGetters } from 'vuex'

export default {
  name: 'ChatPageEditor',
  components: {
    WorkingHours
  },
  data() {
    return {
      centerDialogVisible: false,
      rowIndex: {
        index: -1,
        idx: -1
      },
      infoForm: {
        title: 'Telle AI',
        address: '160 E Grand Ave, Chicago, IL-60611',
        workingHours: {
          contact: {
            title: 'Telle AI',
            address: '160 E Grand Ave, Chicago, IL-60611'
          },
          items: [
            { name: 'Phone Numbers',
              key: 'Department',
              value: 'Phone Number',
              icon: TelephoneIcon,
              content: [
                { key: 'Main:', value: '(312) 500-8535' },
                { key: 'Sales:', value: '(312) 500-8535' },
                { key: 'Service:', value: '(312) 265-8535' },
                { key: 'Parts:', value: '(312) 267-8525' }
              ]
            },
            { name: 'Sales Hours',
              key: 'Date',
              value: 'Hours',
              icon: SalesIcon,
              content: [
                { key: 'Mon - Thu:', value: '9:00 AM - 8:00 PM' },
                { key: 'Fri - Sat:', value: '9:00 AM - 6:00 PM' },
                { key: 'Sun:', value: 'Closed' }
              ]
            },
            { name: 'Service Hours',
              key: 'Date',
              value: 'Hours',
              icon: ServiceIcon,
              content: [
                { key: 'Mon - Thu:', value: '7:00 AM - 7:00 PM' },
                { key: 'Fri - Sat:', value: '7:00 AM - 6:00 PM' },
                { key: 'Sun:', value: 'Closed' }
              ]
            },
            { name: 'Parts Hours',
              key: 'Date',
              value: 'Hours',
              icon: PartsIcon,
              content: [
                { key: 'Mon - Thu:', value: '8:00 AM - 6:00 PM' },
                { key: 'Fri - Sat:', value: '8:00 AM - 5:00 PM' },
                { key: 'Sun:', value: 'Closed' }
              ]
            }
          ]
        },
        latitude: 41.9022635,
        longitude: -87.6330796
      },
      rules: {
        title: [
          { required: true, message: 'Please input dealer name', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'Please input dealer address', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: 'Please input latitude', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: 'Please input longitude', trigger: 'blur' }
        ]
      },
      colors: {
        header: {
          bg: '#1f95e7',
          text: '#ffffff'
        },
        launcher: {
          bg: '#1f95e7'
        },
        messageList: {
          bg: '#f5f5f5'
        },
        sentMessage: {
          bg: '#1f95e7',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#ffffff',
          text: '#222222'
        },
        userInput: {
          bg: '#ffffff',
          text: '#565867'
        },
        toolBar: {
          active: '#1296db',
          inactive: '#565867'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['token', 'dealerId', 'dealerInfoForm'])
  },
  created() {
    console.log('dealer info page created')
  },
  methods: {
    update() {
      for (var key in this.dealerInfoForm) {
        this.infoForm[key] = this.dealerInfoForm[key]
      }
      console.log(this.infoForm)
    },
    submitForm(formName) {
      console.log(this.infoForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var dealerProfile = []
          this.infoForm.workingHours.contact = {
            title: this.infoForm.title,
            address: this.infoForm.address
          }
          this.infoForm.workingHours.items.forEach(profile => {
            var val = ''
            profile.content.forEach(item => {
              if (val === '') {
                val = `${item.key}|${item.value}`
              } else {
                val = `${val},${item.key}|${item.value}`
              }

              // for (var key in item) {
              //   val = `${val},${key}|${item[key]}`
              // }
            })
            dealerProfile.push(val)
          })
          var botConfiguration = {
            botId: this.dealerId,
            dealerName: this.infoForm.workingHours.contact.title,
            dealerAddress: this.infoForm.workingHours.contact.address,
            phoneNumbers: dealerProfile[0],
            salesHours: dealerProfile[1],
            serviceHours: dealerProfile[2],
            partsHours: dealerProfile[3],
            mapName: this.infoForm.workingHours.contact.title,
            dealerLatitude: this.infoForm.latitude,
            dealerLongitude: this.infoForm.longitude
          }
          console.log(botConfiguration)
          updateBotSetting(this.token, botConfiguration).then((resp) => {
            this.$store.commit('bmbot/updateDealerInfoSet', this.infoForm)
            this.$message({
              showClose: true,
              message: 'Chat Page Setting has been saved.',
              type: 'success'
            })
          }).catch(() => {
            this.$message({
              showClose: true,
              message: 'Failed to save. Please retry.',
              type: 'error'
            })

            return false
          })
        } else {
          this.$message({
            showClose: true,
            message: 'Failed to save. Please retry.',
            type: 'error'
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    deleteRow(index, idx) {
      this.rowIndex.index = index
      this.rowIndex.idx = idx
      this.centerDialogVisible = true
    },
    handleDelete() {
      if (this.rowIndex.index === -1 || this.rowIndex.idx === -1) {
        this.centerDialogVisible = false
      } else {
        this.infoForm.workingHours.items[this.rowIndex.index].content.splice(this.rowIndex.idx, 1)
        this.centerDialogVisible = false
        this.rowIndex.index = -1
        this.rowIndex.idx = -1
      }
    },
    addRow(index) {
      this.infoForm.workingHours.items[index].content.push({ key: '', value: '' })
    }
  }
}
</script>

<style scoped>
.el-input-group__prepend {
    background-color: #fff;
  }
.col-divider-white {
    background-color: white;
    border-radius: 4px;
    min-height: 36px;
}
</style>
