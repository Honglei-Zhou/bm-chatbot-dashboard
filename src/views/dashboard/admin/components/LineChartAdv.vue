<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
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
      // console.log(this.chart)
      // console.log(this.chartData)
      if (this.chartData.data && this.chartData.data.length > 0) {
        var axis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        var startDate = '2019-08-26'
        if (this.chartData.x_axis) {
          axis = []
          this.chartData.x_axis.forEach(item => {
            axis.push(item)
          })
          startDate = moment(this.timePeriod[0]).format('YYYY-MM-DD')
          // console.log(axis)
        }
        this.chart.setOption(
          {
            title: {
              text: this.chartData.name
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              data: axis
            },
            yAxis: {
              splitLine: {
                show: false
              }
            },
            toolbox: {
              show: true,
              showTitle: false,
              left: 'center',
              feature: {
                dataZoom: {
                  yAxisIndex: 'none'
                },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
              }
            },
            dataZoom: [{
              startValue: startDate
            }, {
              type: 'inside'
            }],
            visualMap: {
              top: 10,
              right: 10,
              pieces: [{
                gt: 0,
                lte: 50,
                color: '#096'
              }, {
                gt: 50,
                lte: 100,
                color: '#ffde33'
              }, {
                gt: 100,
                lte: 150,
                color: '#ff9933'
              }, {
                gt: 150,
                lte: 200,
                color: '#cc0033'
              }, {
                gt: 200,
                lte: 300,
                color: '#660099'
              }, {
                gt: 300,
                color: '#7e0023'
              }],
              outOfRange: {
                color: '#999'
              }
            },
            series: {
              name: this.chartData.name,
              type: 'line',
              data: this.chartData.data
            }
          })
      }
    }
  }
}
</script>
