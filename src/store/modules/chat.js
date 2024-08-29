import { chatService } from '@/api/chatService'
import { getToken, getDealerID, getMutedChats, setMutedChats } from '@/utils/auth'
import { messageService } from '@/api/messageService'
import ChatAvatar from '@/assets/icons/bmbot.png'
import UserAvatar from '@/assets/icons/user.png'
import AdminAvatar from '@/assets/icons/admin.png'
import { showNotification } from '@/utils/tools'
import moment from 'moment-timezone'

const state = {
  token: getToken(),
  dealerId: getDealerID(),
  adminId: '15632',
  sessionMeta: {},
  sessionMessages: {},
  messageContainer: [],
  currentGroupId: '',
  mutedChats: getMutedChats(),
  onlineChats: {},
  chatLocations: {},
  notifications: { leads: 0, message: 0 }
}
// actions
const actions = {
  getAllMessages({ commit }, results) {
    commit('resetMessageContainer')
    commit('pushAllMessages', results)
  },
  getAllChats({ commit, state, dispatch }, flag) {
    console.log(state)
    console.log(state.mutedChats)
    var val = flag.val
    chatService.getAllSessions(flag.token, state.dealerId).then((resp) => {
      // console.log(resp.data)
      const messages = resp.data
      var results = []
      var parsedMessages = []
      messages.forEach((message) => {
        if (message.direction === 'incoming') {
          var customerMessage = JSON.parse(message.message)
          customerMessage.author = 'user'
          results.push({
            groupId: message.session_id,
            imgUrl: UserAvatar,
            time: message.created,
            unread: message.un_read,
            from_user: message.from_user,
            message: customerMessage
          })
        } else if (message.from_bot === 0) {
          var adminMessage = JSON.parse(message.message)
          adminMessage.author = 'me'
          results.push({
            groupId: message.session_id,
            imgUrl: AdminAvatar,
            time: message.created,
            unread: message.un_read,
            from_user: message.from_user,
            message: adminMessage
          })
        } else {
          parsedMessages = messageService.parseMessage(message, 'support')

          if (parsedMessages.length > 0) {
            results.push({
              groupId: message.session_id,
              imgUrl: ChatAvatar,
              time: message.created,
              unread: message.un_read,
              from_user: message.from_user,
              message: parsedMessages[parsedMessages.length - 1].message
            })
          }
        }
      })
      commit('resetMessageContainer')
      commit('resetAllMessageList')
      commit('pushAllMessages', { results, val })
    }).catch((error) => {
      console.log(error)
    })
  },
  getSessionMessages({ commit, state }, data) {
    commit('resetMessageList', data.groupId)
    commit('updateCurrentGroupId', data.groupId)
    commit('pushSessionMessages', data)
    if (state.sessionMeta[data.groupId] === undefined) {
      commit('updateSessionMeta', { groupId: data.groupId, sessionEnded: false, botMuted: false })
    }
  },
  getUserLocation({ commit, state, dispatch }, data) {
    chatService.getChatLocation(data.token, data.groupId).then((resp) => {
      commit('updateUserLocation', resp)
    })
  },
  setSessionMeta({ commit, state }, data) {
    var new_message = {
      dealerId: state.dealerId,
      adminId: state.adminId,
      groupId: data.groupId
    }
    if (data.action === 'mute') {
      new_message['type'] = 'MUTE_BOT'
      new_message['muted'] = true
      this._vm.$socket.emit('mute_bot', JSON.stringify(new_message))
    } else if (data.action === 'unmute') {
      new_message['type'] = 'MUTE_BOT'
      new_message['muted'] = false
      this._vm.$socket.emit('unmute_bot', JSON.stringify(new_message))
    } else if (data.action === 'end') {
      new_message['type'] = 'CLOSE_CHAT'
      new_message['close'] = true
      this._vm.$socket.emit('end_session', JSON.stringify(new_message))
    }
    commit('updateSessionMeta', data)
  },

  sendMessage({ commit, state, dispatch }, data) {
    var new_message = {
      type: 'UPDATE_MSG',
      dealerId: state.dealerId,
      groupId: data.groupId,
      adminId: state.adminId,
      user: 'admin',
      muted: state.sessionMeta[data.groupId] === undefined ? false : state.sessionMeta[data.groupId].botMuted,
      unread: 0,
      message: data.message
    }
    this._vm.$socket.emit('admin_message', JSON.stringify(new_message))
  },

  joinChatRoom({ commit, state }) {
    var new_message = {
      type: 'ADMIN_JOIN',
      dealerId: state.dealerId,
      adminId: state.adminId,
      user: 'admin',
      online: true
    }
    console.log(new_message)
    this._vm.$socket.emit('admin_join', JSON.stringify(new_message))
  },

  SOCKET_ON_CONNECTION({ commit, state }, message) {
    console.log('Connected............')
    // send mute status to server
  },

  // To be implemented
  SOCKET_MUTE_STATE({ state, commit }, message) {
    console.log(message)
    var parsedMessage = JSON.parse(message)
    if (parsedMessage.dealerId === state.dealerId) {
      var data = { sessionId: parsedMessage.groupId, muted: parsedMessage.muted }
      // console.log(parsedMessage)
      commit('toggleChatState', data)
    }
  },

  SOCKET_CHAT_STATUS({ commit }, message) {
    console.log(message)
    var parsedMessage = JSON.parse(message)
    if (parsedMessage.dealerId === state.dealerId) {
      if (parsedMessage.user === 'customer') {
        var data = { sessionId: parsedMessage.groupId, online: parsedMessage.online }
        // console.log(parsedMessage)
        commit('toggleChatState', data)
      }
    }
  },

  SOCKET_LEADS_NOTIFICATION({ commit }, message) {
    commit('updateLeadsNotification', 1)
  },
  /** ******************************************************
   *
   *Socket Actions
   *
   *******************************************************/
  SOCKET_CHAT_MESSAGE({ commit }, message) {
    console.log(message)
    var parsedMessage = JSON.parse(message)
    if (parsedMessage.dealerId === state.dealerId) {
      var received_messages = parsedMessage.message
      var richMessage = false
      var texts = []
      var results = []
      var metaInfo = { from_bot: 1, imgUrl: ChatAvatar, from_user: 'BM Bot', groupId: parsedMessage.groupId }

      var curTime = moment.tz(Date.now(), 'Europe/London')
      var localTime = curTime.clone().tz('America/Chicago')
      var sysMessage = {
        groupId: parsedMessage.groupId,
        message: { type: 'system', author: 'support', data: { text: 'Received: ', meta: localTime.format('MMMM Do, h:mm a') }},
        unread: 0
      }

      if (parsedMessage.user !== 'bot') {
        metaInfo['from_bot'] = 0
        metaInfo['imgUrl'] = UserAvatar
        metaInfo['from_user'] = 'Customer'
        metaInfo['direction'] = 'incoming'
        if (parsedMessage.user === 'admin') {
          received_messages.author = 'me'
          metaInfo['direction'] = 'outgoing'
          metaInfo['from_user'] = 'Admin'
          metaInfo['imgUrl'] = AdminAvatar
          sysMessage.message.data.text = 'Sent'
        } else {
        // playSound()
          received_messages.author = 'user'
          showNotification('Telle AI New Message', 'Customer: ' + parsedMessage.message.data.text, ChatAvatar)
          commit('toggleChatState', { sessionId: parsedMessage.groupId, online: true })
        }
        results.push({
          groupId: parsedMessage.groupId,
          message: received_messages,
          unread: 0
        })
      // commit('pushMessage', received_messages)
      } else {
      // playSound()
        var author = 'support'
        received_messages.forEach((item, index) => {
          // console.log(item)
          if ('platform' in item && item['platform'].toLowerCase() === 'facebook') {
            if ('quickReplies' in item) {
              var textMsg = item.quickReplies.title
              textMsg += ' ['
              item.quickReplies.quickReplies.forEach(item => {
                textMsg += item
                textMsg += ','
              })
              textMsg += ']'
              var qr_msg = {
                type: 'text',
                author: author,
                data: { text: textMsg }
              // suggestions: item.quickReplies.quickReplies
              }
              results.push({
                groupId: parsedMessage.groupId,
                message: qr_msg,
                unread: 0
              })
              richMessage = true
              // If quick reply, only one message allowed.
            } else if ('text' in item) {
              if (index === 0) {
                var textMsgs = messageService.getTextMessage(item, author)
                textMsgs.forEach((textMsg, index) => {
                  results.push({
                    groupId: parsedMessage.groupId,
                    message: textMsg,
                    unread: 0
                  })
                })
                richMessage = true
              } else {
                texts.push({ text: item, index: index })
              }
            } else if ('payload' in item) {
              var msgType = item.payload.facebook.attachment.payload.template_type
              switch (msgType) {
                case 'list':
                  var listMsg = messageService.getPayloadListMessage(item, author)
                  results.push({
                    groupId: parsedMessage.groupId,
                    message: listMsg,
                    unread: 0
                  })
                  richMessage = true
                  break
                case 'generic':
                  var cardMsg = messageService.getPayloadCardMessage(item, author)
                  results.push({
                    groupId: parsedMessage.groupId,
                    message: cardMsg,
                    unread: 0
                  })
                  richMessage = true
                  break
                case 'button':
                  var buttonMsg = messageService.getPayloadButtonMessage(item, author)
                  results.push({
                    groupId: parsedMessage.groupId,
                    message: buttonMsg,
                    unread: 0
                  })
                  richMessage = true
                  break
                case 'media':
                  var videoMsgs = messageService.getPayloadVideoMessage(item, author)
                  videoMsgs.forEach((videoMsg, index) => {
                    results.push({
                      groupId: parsedMessage.groupId,
                      message: videoMsg,
                      unread: 0
                    })
                  })
                  richMessage = true
                  break
                default:
                  break
              }
            } else if ('image' in item) {
              var imageMsg = messageService.getImageMessage(item, author)
              results.push({
                groupId: parsedMessage.groupId,
                message: imageMsg,
                unread: 0
              })
              richMessage = true
            }
          } else {
            if ('text' in item) {
              texts.push({ text: item, index: index })
            }
          }
        })
        if (!richMessage) {
          texts.forEach((item, index) => {
            var textMsgs = messageService.getTextMessage(item.text, author)
            textMsgs.forEach((textMsg, index) => {
              results.push({
                groupId: parsedMessage.groupId,
                message: textMsg,
                unread: 0
              })
            })
          })
        }
      }
      // console.log(results)
      commit('pushMessage', sysMessage)
      commit('pushMessages', results)
      results.forEach(item => {
        var containerMessage = {
          from_bot: metaInfo.from_bot,
          message: item.message,
          direction: metaInfo.direction,
          groupId: metaInfo.groupId,
          time: Date.now(),
          unread: 0,
          imgUrl: metaInfo.imgUrl,
          from_user: metaInfo.from_user
        }
        // console.log(containerMessage)

        commit('updateMessage', containerMessage)
      })
      commit('updateMessageNotification', results.length)
    }
  },
  setMutedChat({ commit }, data) {
    // console.log(data)
    commit('updateMuteState', data)
  }
}

// mutations
const mutations = {
  /**
   * Push new message into messages array
   */
  pushMessage(state, message) {
    if (state.sessionMessages[message.groupId] === undefined) {
      state.sessionMessages[message.groupId] = []
    }
    state.sessionMessages[message.groupId].push(message)
  },
  pushMessages(state, messages) {
    messages.forEach(item => {
      if (state.sessionMessages[item.groupId] === undefined) {
        state.sessionMessages[item.groupId] = []
      }
      state.sessionMessages[item.groupId].push(item)
    })
  },
  pushAllMessages(state, messages) {
    messages.results.forEach(message => {
      state.messageContainer.push(message)
      if (messages.flag === 1) state.notifications.message += message.unread
      // console.log(state.notifications.message)
    })
  },
  pushSessionMessages(state, data) {
    data.results.forEach(item => {
      if (state.sessionMessages[item.groupId] === undefined) {
        state.sessionMessages[item.groupId] = []
      }
      state.sessionMessages[item.groupId].push(item)
    })
    // state.sessionMessages[data.groupId] = data.results
  },
  resetMessageContainer(state) {
    state.messageContainer = []
  },
  resetAllMessageList(state) {
    state.sessionMessages = {}
    state.sessionMeta = {}
  },
  resetMessageList(state, groupId) {
    state.sessionMessages[groupId] = []
    state.sessionMeta[groupId] = {}
  },
  updateUnreadMessage(state, data) {
    const index = state.messageContainer.findIndex((item) => {
      return item.groupId === data.groupId
    })
    if (index !== -1) {
      (state.messageContainer)[index].unread = 0
    }
  },
  updateMessage(state, data) {
    const index = state.messageContainer.findIndex((item) => {
      return item.groupId === data.groupId
    })

    let unread = 0
    let isOnline = true
    // console.log(index)
    if (index !== -1) {
      unread = (state.messageContainer)[index].unread
      unread++
      isOnline = state.messageContainer[index].online === undefined ? false : state.messageContainer[index].online
      state.messageContainer.splice(index, 1)
      // console.log(state.messageContainer.length)
      if (data.groupId === state.currentGroupId) {
        // console.log(state.currentGroupId)
        unread = 0
      }
    } else {
      unread = 1
    }

    state.messageContainer.unshift(
      {
        groupId: data.groupId,
        imgUrl: data.imgUrl,
        time: data.time,
        message: data.message,
        unread: unread,
        online: isOnline,
        from_user: data.from_user
      })
  },
  updateCurrentGroupId(state, groupId) {
    state.currentGroupId = groupId
  },
  resetCurrentGroupId(state) {
    state.currentGroupId = ''
  },
  updateSessionMeta(state, data) {
    if (state.sessionMeta[data.groupId] === undefined) {
      state.sessionMeta[data.groupId] = {
        sessionEnded: false,
        botMuted: false
      }
    } else {
      state.sessionMeta[data.groupId] = {
        sessionEnded: data.sessionEnded,
        botMuted: data.botMuted
      }
    }
  },
  resetLeadsNotification(state) {
    state.notifications.leads = 0
  },
  updateLeadsNotification(state, notification) {
    state.notifications.leads += notification
  },
  resetMessageNotification(state) {
    state.notifications.message = 0
  },
  updateMessageNotification(state, unread) {
    state.notifications.message += unread
    // console.log(state.notifications.message)
  },
  updateMuteState(state, data) {
    state.mutedChats[data.sessionId] = data.muted
    setMutedChats(state.mutedChats)
  },
  toggleChatState(state, data) {
    if (data.muted !== undefined) {
      state.mutedChats[data.sessionId] = data.muted
      setMutedChats(state.mutedChats)
    }

    if (data.online !== undefined) {
      state.onlineChats[data.sessionId] = data.online
    }
    console.log(state.onlineChats)
  },
  removeChatSession(state, data) {
    state.messageContainer.splice(data, 1)
  },
  updateUserLocation(state, data) {
    state.chatLocations[data.session_id] = {
      groupId: data.session_id,
      city: data.city,
      state: data.state,
      deviceType: data.device_type,
      deviceDetail: data.device_detail
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
