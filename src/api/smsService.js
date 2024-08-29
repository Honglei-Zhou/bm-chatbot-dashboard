import axios from 'axios'
import commonConfig from './common'

const baseUrl = commonConfig.baseUrl

export const smsService = {
  sendProfile,
  sendTextMessage
}

const timeout = 4000

function sendProfile(cId, origin, email, phone) {
  return new Promise((resolve, reject) => {
    var bodyFormData = new FormData()
    bodyFormData.append('cId', cId)
    bodyFormData.append('origin', origin)
    bodyFormData.append('email', email)
    bodyFormData.append('phone', phone)
    axios({
      url: '/api/leads/new',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: bodyFormData,
      baseURL: baseUrl,
      timeout: timeout
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

function sendTextMessage(cId, origin, name, phone, message) {
  return new Promise((resolve, reject) => {
    var bodyFormData = new FormData()
    bodyFormData.append('cId', cId)
    bodyFormData.append('origin', origin)
    bodyFormData.append('customer', name)
    bodyFormData.append('phone', phone)
    bodyFormData.append('note', message)
    axios({
      url: '/api/leads/new',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: bodyFormData,
      baseURL: baseUrl,
      timeout: timeout
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}
