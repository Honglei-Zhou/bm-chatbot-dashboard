import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
// import locale from 'element-ui/lib/locale/lang/en'
// import lang from 'element-ui/lib/locale/lang/en'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }
import commonConfig from '@/api/common'

Vue.use(Element, {
  size: Cookies.get('size') || 'medium',
  locale: 'en'
})

import VTooltip from 'v-tooltip'

Vue.use(VTooltip)
// locale.use(lang)

import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

Vue.use(VueMoment, {
  moment
})

import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: false,
  connection: commonConfig.socketUrl,
  // connection: 'https://middleware.bmhax.com',
  vuex: {
    store,
    actionPrefix: 'SOCKET_'
  }
}))

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
