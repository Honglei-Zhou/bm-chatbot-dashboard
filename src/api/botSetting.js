import axios from 'axios'
import commonConfig from './common'

const baseUrl = commonConfig.baseUrl

export function getBotSetting(token, botId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/configuration/detail',
      method: 'GET',
      params: {
        botId: botId
      },
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function updateBotSetting(token, botConfiguration) {
  return new Promise((resolve, reject) => {
    var bodyFormData = new FormData()
    for (var key in botConfiguration) {
      bodyFormData.append(key, botConfiguration[key])
    }
    axios({
      url: '/api/configuration/update',
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      data: bodyFormData,
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function publishBotSetting(token, botId, dealerId) {
  return new Promise((resolve, reject) => {
    var bodyFormData = new FormData()
    bodyFormData.append('botId', botId)
    bodyFormData.append('dealerId', dealerId)
    axios({
      url: '/api/configuration/publish',
      method: 'POST',
      // params: {
      //   botId: botId,
      //   dealerId: dealerId
      // },
      headers: { 'Authorization': 'Bearer ' + token },
      data: bodyFormData,
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}
