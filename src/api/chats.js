// import request from '@/utils/request'
import axios from 'axios'
import commonConfig from './common'

const baseUrl = commonConfig.baseUrl

export function fetchChatList(token, query, dealerId) {
  query.dealerId = dealerId
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/chats',
      method: 'GET',
      params: query,
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl
    }).then((resp) => {
      console.log(resp)
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function fetchMessageList(token, query, dealerId) {
  // console.log(query)
  query.dealerId = dealerId
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/messages',
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
