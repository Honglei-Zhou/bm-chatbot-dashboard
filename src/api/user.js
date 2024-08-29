// import request from '@/utils/request'
import axios from 'axios'
import commonConfig from './common'

const baseUrl = commonConfig.baseUrl

export function login(data) {
  var bodyFormData = new FormData()
  bodyFormData.append('email', data.username.toLowerCase())
  bodyFormData.append('password', data.password)
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/user/login',
      method: 'post',
      data: bodyFormData,
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function getInfo(token, query) {
  var bodyFormData = new FormData()
  bodyFormData.append('email', query.email.toLowerCase())
  bodyFormData.append('dealerId', query.dealerId)
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/user/info',
      method: 'post',
      data: bodyFormData,
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

export function logout(token, email) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/user/logout',
      method: 'post',
      headers: { 'Authorization': 'Bearer ' + token },
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function register(data) {
  var bodyFormData = new FormData()
  bodyFormData.append('email', data.email.toLowerCase())
  bodyFormData.append('password', data.password)
  bodyFormData.append('roles', data.role.toLowerCase())
  bodyFormData.append('departments', data.dept.toLowerCase())
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/user/registration',
      method: 'post',
      data: bodyFormData,
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function getAllUsers(token, query) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/user/all/',
      method: 'get',
      headers: { 'Authorization': 'Bearer ' + token },
      params: query,
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function addUser(token, data) {
  var bodyFormData = new FormData()
  bodyFormData.append('email', data.email.toLowerCase())
  bodyFormData.append('role', data.role.toLowerCase())
  bodyFormData.append('dept', data.dept.toLowerCase())
  bodyFormData.append('dealerId', data.dealerId.toLowerCase())
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/user/add/',
      method: 'post',
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

export function deleteUser(token, email) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/user/delete/',
      method: 'get',
      headers: { 'Authorization': 'Bearer ' + token },
      params: { email: email },
      baseURL: baseUrl
    }).then((resp) => {
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function updateUser(token, data) {
  var bodyFormData = new FormData()
  bodyFormData.append('email', data.email.toLowerCase())
  bodyFormData.append('role', data.role.toLowerCase())
  bodyFormData.append('dept', data.dept.toLowerCase())
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/user/update/',
      method: 'post',
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

export function changeUserPassword(token, data) {
  var bodyFormData = new FormData()
  bodyFormData.append('email', data.email.toLowerCase())
  bodyFormData.append('password', data.currentPassword)
  bodyFormData.append('new_password', data.newPassword)
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/user/password',
      method: 'post',
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
