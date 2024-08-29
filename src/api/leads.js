// import request from '@/utils/request'
import axios from 'axios'
import commonConfig from './common'

const baseUrl = commonConfig.baseUrl

export function fetchLeadsList(token, query, dealerId) {
  return new Promise((resolve, reject) => {
    query['dealerId'] = dealerId
    axios({
      url: '/api/leads',
      method: 'GET',
      params: query,
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function fetchLeads(token, id, dealerId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/leads/detail',
      method: 'GET',
      params: {
        id: id,
        dealerId: dealerId
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

export function createLeads(token, data) {
  var bodyFormData = new FormData()
  bodyFormData.append('email', data.email)
  bodyFormData.append('customer', data.customer)
  bodyFormData.append('email', data.email)
  bodyFormData.append('phone', data.phone)
  bodyFormData.append('note', data.note)
  bodyFormData.append('department', data.dept)
  bodyFormData.append('handleBy', data.handleBy)
  bodyFormData.append('importance', data.importance)
  bodyFormData.append('status', data.status)
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/leads/new',
      method: 'POST',
      data: bodyFormData,
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}
