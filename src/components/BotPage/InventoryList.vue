<template>
  <div v-show="showFlag" ref="scrollList" class="sc-inventory-list" :style="{backgroundColor: colors.inventoryList.bg}">
    <div class="sc-inventory-list--header">
      <div class="sc-inventory-list--header-div" :class="{clicked: allClicked}" @click="showAllCars(1)"> All </div>
      <div class="sc-inventory-list--header-div" :class="{clicked: newClicked}" @click="showNewCars(1)"> New </div>
      <div class="sc-inventory-list--header-div" :class="{clicked: usedClicked}" @click="showUsedCars(1)"> Used </div>
    </div>

    <el-row :gutter="5" style="padding: 30px 40px 10px 40px;">
      <el-col :span="5">
        <el-select v-model="make" :disabled="clicked" placeholder="Make" clearable @change="updateModelOptions">
          <el-option
            v-for="item in makeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select v-model="models" :disabled="make==='' || clicked" multiple collapse-tags placeholder="Model">
          <el-option
            v-for="item in modelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select></el-col>
      <el-col :span="7">
        <el-button type="default" size="medium" @click="showPriceTags = !showPriceTags">Select Price
          <i v-if="!showPriceTags" class="el-icon-arrow-down el-icon-right" />
          <i v-else class="el-icon-arrow-up el-icon-right" />
        </el-button>
      </el-col>
      <el-col :span="4">
        <el-button v-if="!clicked" type="primary" @click="filterCars">Search</el-button>
        <el-button v-else type="success" @click="resetFilters">Reset</el-button>
      </el-col>
    </el-row>

    <el-row v-if="showPriceTags" style="padding: 5px 40px;">
      <el-checkbox-group v-model="prices" :disabled="clicked">
        <el-checkbox label="Under $10,000" />
        <el-checkbox label="$10,001~$20,000" />
        <el-checkbox label="$20,001~$25,000" />
        <el-checkbox label="$25,001~$30,000" />
        <el-checkbox label="$30,001 & Above" />
      </el-checkbox-group>
    </el-row>

    <el-row v-if="listData.length === 0" style="padding: 5px 40%;">
      <el-button type="primary" @click="loadData">Click to Load Data</el-button>
    </el-row>

    <div class="scroll-content">
      <div class="sc-inventory-list--content">
        <InventoryElement v-for="task in tasksWithRandomKey" :key="task.key" :data="task.car" :message-colors="colors.inventoryElement" />
      </div>
      <paginate
        v-model="page.pageCurrent"
        :page-count="page.pageCount"
        :page-range="6"
        :click-handler="clickHandler"
        :container-class="'pagination'"
        :page-class="'page-item'"
      />

    </div>
  </div>
</template>
<script>
import InventoryElement from '@/components/BotPage/InventoryElement'
import { mapGetters } from 'vuex'
import Paginate from 'vuejs-paginate'
// import { setTimeout } from 'timers'

export default {
  components: {
    InventoryElement,
    Paginate
  },
  props: {
    messages: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showFlag: true,
      colors: {
        inventoryList: {
          bg: '#ffffff'
        },
        inventoryElement: {
          color: 'rgb(34, 34, 34)',
          backgroundColor: '#ffffff'
        }
      },
      allClicked: false,
      newClicked: true,
      usedClicked: false,
      allLoaded: false,
      showPriceTags: false,
      makeOptions: [{
        value: 'Audi',
        label: 'Audi'
      }, {
        value: 'Honda',
        label: 'Honda'
      }],
      modelOptions: {
        Honda: [{
          value: 'Option1',
          label: 'Option1'
        }]
      },
      clicked: false,
      make: '',
      models: [],
      prices: [],
      carList: [],
      listData: [],
      newUsedTags: ['N'],
      page: {
        pageSize: 8,
        pageCount: 1,
        pageCurrent: 1,
        totalCount: 0,
        hasNext: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'cars', 'dealerId'
    ]),
    tasksWithRandomKey() {
      return this.carList.map(car => { return { car, key: this.randomKey() } })
    }
  },
  mounted() {
    this.initCarList()
  },
  methods: {
    loadData() {
      this.$store.dispatch('bmbot/getAllCars', { pageNum: 1, dealerId: this.dealerId })
      this.$nextTick(() => {
        this.initCarList()
      })
    },
    updateMakeOptions() {
      if (this.newClicked) this.makeOptions = this.cars.options.newMakeOptions
      else if (this.allClicked) this.makeOptions = this.cars.options.makeOptions
      else this.makeOptions = this.cars.options.oldMakeOptions
    },
    initCarList() {
      this.clearVariables()
      this.updateMakeOptions()
      this.listData = []
      this.cars.data.forEach(item => {
        if (this.newUsedTags.indexOf(item.new_used) !== -1) this.listData.push(item)
      })
      var total = this.listData.length
      this.page.totalCount = total
      this.page.pageCount = Math.floor(total / (this.page.pageSize + 1)) + 1
      this.page.hasNext = true
      this.page.pageCurrent = 1
      this.getCurrentPage()
    },
    getCurrentPage() {
      this.carList = []
      var start = (this.page.pageCurrent - 1) * this.page.pageSize
      this.carList = this.listData.slice(start, start + this.page.pageSize)
    },
    updateModelOptions() {
      console.log(this.make)
      if (this.allClicked) this.modelOptions = this.cars.options.modelOptions[this.make]
      else if (this.newClicked) this.modelOptions = this.cars.options.newModelOptions[this.make]
      else this.modelOptions = this.cars.options.oldModelOptions[this.make]
    },
    filterCars() {
      this.clicked = true
      this.listData = this.listData.filter(item => {
        if (this.make !== '' && this.make !== item.meta.make) return false
        else if (this.models.length > 0 && this.models.indexOf(item.meta.model) === -1) return false
        else if (this.prices.length > 0) {
          if (this.prices.indexOf('Under $10,000') !== -1 && item.meta.price <= 10000) return true
          if (this.prices.indexOf('$10,001~$20,000') !== -1 && item.meta.price > 10000 && item.meta.price <= 20000) return true
          if (this.prices.indexOf('$20,001~$25,000') !== -1 && item.meta.price > 20000 && item.meta.price <= 25000) return true
          if (this.prices.indexOf('$25,001~$30,000') !== -1 && item.meta.price > 25000 && item.meta.price <= 30000) return true
          if (this.prices.indexOf('$30,001 & Above') !== -1 && item.meta.price > 30000) return true
          return false
        }
        return true
      })
      var total = this.listData.length
      this.page.totalCount = total
      this.page.pageCount = Math.floor(total / (this.page.pageSize + 1)) + 1
      this.page.hasNext = true
      this.page.pageCurrent = 1
      this.getCurrentPage()
    },
    clearVariables() {
      this.clicked = false
      this.make = ''
      this.models = []
      this.prices = []
    },
    resetFilters() {
      // this.clearVariables()
      this.initCarList()
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
    },
    show() {
      this.showFlag = true
      if (this.cars.type === 'all') {
        this.allClicked = true
      } else if (this.cars.type === 'new') {
        this.newClicked = true
      } else {
        this.usedClicked = true
      }
    },
    hide() {
      this.showFlag = false
    },
    clickHandler(pageNum) {
      this.page.pageCurrent = pageNum
      this.getCurrentPage()
      this.$emit('scrollUp')
    },
    showAllCars(pageNum) {
      this.newClicked = false
      this.usedClicked = false
      this.allClicked = true
      this.newUsedTags = ['N', 'U', null]
      this.page.pageCurrent = pageNum
      this.initCarList()
      // this.$store.dispatch('bmbot/getAllCars', pageNum)
      // this.getAllCars(pageNum)
    },
    showNewCars(pageNum) {
      this.newClicked = true
      this.usedClicked = false
      this.allClicked = false
      this.newUsedTags = ['N']
      this.page.pageCurrent = pageNum
      this.initCarList()
      // this.$store.dispatch('bmbot/getNewCars', pageNum)
      // this.getNewCars(pageNum)
    },
    showUsedCars(pageNum) {
      this.newClicked = false
      this.usedClicked = true
      this.allClicked = false
      this.newUsedTags = ['U']
      this.page.pageCurrent = pageNum
      this.initCarList()
      // this.$store.dispatch('bmbot/getUsedCars', pageNum)
      // this.getUsedCars(pageNum)
    },
    scrollUp() {
      this.$refs.scrollList.scrollTop = 0
    }
  }
}
</script>

<style lang="css">
.sc-inventory-list {
  overflow: hidden;
}
.sc-inventory-list--header{
    width: 100%;
    display: flex;
    flex-direction: row;
    /* background-color: #19be6b; */
    color: white;
    position: sticky;
    top: 0px;
    /* border-radius: 9px; */
}
.sc-inventory-list--header-div{
    width: 33.3%;
    height: 40px;
    font-weight: 300;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    background-color: #19be6b;
    border-left: 1px solid #ffffff;
    cursor: pointer;
}

.sr-inventory-list--search{
  width: 100%;
  display: flex;
}

  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

.clicked {
  background-color: red;
}

.sc-inventory-list--header-div:first-of-type{
    border-left: none;
}

.scroll-content {
  width: 100%;
  overflow: hidden;
}

.sc-inventory-list--content {
    padding: 20px 40px;
}

.sc-inventory-list-icon {
    padding-top: 5px;
    height: 30px;
    width: 30px;
    align-self: center;
    outline: none;
}

.sc-inventory-list-icon:hover path {
    filter: contrast(15%);
}

.pagination {
  padding: 20px 40px;
  list-style-type: none;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.page-item {
  width: 10px;
  /* user-select: none;
  border: none; */
}

.active {
  font-weight: bold;
}

</style>
