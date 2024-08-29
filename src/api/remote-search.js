import request from '@/utils/request'
import axios from 'axios'
import commonConfig from './common'

const baseUrl = commonConfig.baseUrl

export function searchUser(token, name) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/search/user',
      method: 'GET',
      params: name,
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function transactionList(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}

export function todoList(token, query) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/todo/list',
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

export function addTodoList(token, query) {
  var bodyFormData = new FormData()
  bodyFormData.append('item', query.item)
  bodyFormData.append('status', query.status)
  return new Promise((resolve, reject) => {
    axios({
      url: '/todo/new',
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

export function updateTodoList(token, query) {
  var bodyFormData = new FormData()
  bodyFormData.append('id', query.id)
  bodyFormData.append('item', query.item)
  bodyFormData.append('status', query.status)
  return new Promise((resolve, reject) => {
    axios({
      url: '/todo/update',
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

export function saveTodoList(token, query) {
  var bodyFormData = new FormData()
  bodyFormData.append('items', JSON.stringify(query))
  return new Promise((resolve, reject) => {
    axios({
      url: '/todo/save',
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

export function getLineChartData(token, query, dealerId) {
  return new Promise((resolve, reject) => {
    query['dealerId'] = dealerId
    axios({
      url: '/dashboard/linechart',
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

export function getLineChartDataV2(token, query, dealerId) {
  return new Promise((resolve, reject) => {
    query['dealerId'] = dealerId
    axios({
      url: '/dashboard/v2/linechart',
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

export function getPieChartData(token, query, dealerId) {
  return new Promise((resolve, reject) => {
    query['dealerId'] = dealerId
    axios({
      url: '/dashboard/piechart',
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

export function getBarChartData(token, query, dealerId) {
  return new Promise((resolve, reject) => {
    query['dealerId'] = dealerId
    axios({
      url: '/dashboard/barchart',
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

export function getKeywords() {
  return new Promise((resolve, reject) => {
    axios({
      url: 'https://telle.bmhax.com/keywords',
      method: 'GET'
    }).then((resp) => {
      console.log(resp)
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}
