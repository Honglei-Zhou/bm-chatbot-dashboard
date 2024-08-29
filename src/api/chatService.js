import axios from 'axios'
// import request from '@/utils/request'
import commonConfig from './common'

const baseUrl = commonConfig.baseUrl

export const chatService = {
  getSessionMessages,
  getAllSessions,
  getAllMessages,
  updateSessionMessages,
  updateChatSession,
  getChatLocation,
  isAuthorizedBot
}

const timeout = 10000

function getSessionMessages(token, groupId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/livechat/messages',
      method: 'GET',
      params: {
        session_id: groupId
      },
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl,
      timeout: timeout
    }).then((resp) => {
      // console.log(resp)
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

function getAllSessions(token, dealerId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/livechat/sessions',
      method: 'GET',
      params: {
        dealerId: dealerId
      },
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl
    }).then((resp) => {
      console.log(resp)
      resolve(resp.data)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

function getAllMessages(token, groupId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/livechat/all',
      method: 'get',
      headers: { 'Authorization': 'Bearer ' + token },
      timeout: timeout
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

function updateSessionMessages(token, groupId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/livechat/update',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl,
      params: {
        session_id: groupId
      },
      timeout: timeout
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

function updateChatSession(token, groupId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/livechat/close',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl,
      params: {
        session_id: groupId
      },
      timeout: timeout
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

function getChatLocation(token, groupId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/dashboard/chat/location',
      method: 'GET',
      params: {
        sessionId: groupId
      },
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl,
      timeout: timeout
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

function isAuthorizedBot(dealerId, origin) {
  return new Promise((resolve, reject) => {
    var bodyFormData = new FormData()
    bodyFormData.append('cId', dealerId)
    bodyFormData.append('origin', origin)
    axios({
      url: '/bots/authentication',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: bodyFormData,
      baseURL: baseUrl,
      timeout: timeout
    }).then((resp) => {
      // console.log(resp.data)
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}
