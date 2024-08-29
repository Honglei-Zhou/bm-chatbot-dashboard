import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getEmail, setEmail, removeEmail, getDealerID, setDealerID } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { chatService } from '@/api/chatService'

// User login requires email and password
const state = {
  token: getToken(),
  dealerId: getDealerID(),
  department: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  email: getEmail(),
  start: '',
  end: '',
  timePeriod: [],
  bot: {
    cId: '',
    origin: 'dashboard.telle.ai',
    authorized: false,
    imagePrefix: '',
    chatWindowTitle: 'Telle Chat',
    titleImageUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/bmbot.png'
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_START: (state, start) => {
    if (start) {
      state.start = start
      state.timePeriod = [state.start, state.end]
    }
  },
  SET_END: (state, end) => {
    if (end) {
      state.end = end
      state.timePeriod = [state.start, state.end]
    }
  },
  SET_PROFILE: (state, data) => {
    state.dealerId = data.dealerId
    state.dept = data.department
  },
  SET_DEALERID: (state, data) => {
    state.dealerId = data
  },
  SET_BOT: (state, data) => {
    state.bot.authorized = data.isAuthorized
    state.bot.cId = data.dealer_id
    state.bot.imagePrefix = data.dealer_image_prefix
    state.bot.chatWindowTitle = data.dealer_chat_window_title
    state.bot.titleImageUrl = data.dealer_title_image
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    var { username, password } = userInfo
    console.log('login......')
    // console.log(username)
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log('In Store......')
        // console.log(response)
        const data = response.data
        console.log(data)
        commit('SET_TOKEN', data.token)
        setToken(data.token)

        commit('SET_PROFILE', data)

        commit('SET_EMAIL', username)
        setEmail(username)
        setDealerID(data.dealerId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  initDates({ commit, dispatch }) {
    const end = new Date()
    var start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    commit('SET_START', start)
    commit('SET_END', end)
  },

  // get user info
  getInfo({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token, { email: state.email, dealerId: state.dealerId }).then(response => {
        const { data } = response
        // console.log(data)
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, first_name, last_name, avatar, introduction, dealer_id } = data[0]
        var name = first_name + ' ' + last_name

        // roles must be a non-empty array
        var rolesArray = roles.split(',')

        if (!rolesArray || rolesArray.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_DEALERID', dealer_id)

        commit('SET_ROLES', rolesArray)
        commit('SET_NAME', name.trim())
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        console.log(this._vm.$socket)
        if (!state.bot.authorized) {
          chatService.isAuthorizedBot(state.dealerId, state.bot.origin).then((resp) => {
            // console.log(resp)
            if (resp.data.isAuthorized) {
              commit('SET_BOT', resp.data)
              console.log('***************Socket1*****************')
              // console.log(this._vm.$socket)
              if (!this._vm.$socket.connected) {
                this._vm.$socket.connect()
              }
              dispatch('chat/joinChatRoom', null, { root: true })
            }
          })
        } else {
          console.log('***************Socket2*****************')
          // console.log(this._vm.$socket)
          if (!this._vm.$socket.connected) {
            this._vm.$socket.connect()
          }
          dispatch('chat/joinChatRoom', null, { root: true })
        }
        console.log('GetINFO*****************')
        resolve(data[0])
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token, state.email).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeEmail()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)
      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
