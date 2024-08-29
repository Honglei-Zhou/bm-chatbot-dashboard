<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    ...mapGetters([
      'timePeriod'
    ])
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        // console.log(val)
        this.setOptions()
      }
    },
    timePeriod: {
      deep: true,
      handler(val) {
        this.setOptions()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      // console.log(this.chart)
      this.chart.on('datazoom', () => {
        var axis = this.chart.getModel().option.xAxis[0]
        var starttime = axis.data[axis.rangeStart]
        var endtime = axis.data[axis.rangeEnd]
        if (starttime === undefined) {
          starttime = '2019-05-02'
        }
        if (endtime === undefined) {
          endtime = new Date()
        }
        this.$store.commit('user/SET_START', starttime)
        this.$store.commit('user/SET_END', endtime)
        // console.log(starttime, endtime)
      })
      this.setOptions()
    },
    setOptions() {
      var series = []
      var axis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      var startDate = '2019-08-26'
      if (this.chartData.x_axis) {
        axis = []
        this.chartData.x_axis.forEach(item => {
          axis.push(item)
        })
        startDate = moment(this.timePeriod[0]).format('YYYY-MM-DD')
      }
      // console.log(axis)
      // console.log(this.chartData.data)

      // console.log(this.chartData)
      if (this.chartData.data !== undefined) {
        this.chartData.data.forEach((element) => {
          series.push({
            name: element.name,
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: element.data,
            animationDuration
          })
        })
      }
      this.chart.setOption({
        title: {
          // text: this.chartData.name
          text: 'Visiting Time'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 40,
          left: '10%',
          right: '10%',
          bottom: '14%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: axis,
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        dataZoom: [{
          startValue: startDate
        }, {
          type: 'slider'
        }],
        series: series
      })
    }
  }
}
</script>
