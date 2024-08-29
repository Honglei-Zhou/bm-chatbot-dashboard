import axios from 'axios'
import commonConfig from './common'

const baseUrl = commonConfig.baseUrl

export const carSearchService = {
  getNewCars,
  getAllCars,
  getUsedCars
}

const timeout = 4000

function getAllCars(page, page_size, dealerId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/cars/',
      method: 'GET',
      params: {
        page: page,
        page_size: page_size,
        dealerId: dealerId
      },
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

function getNewCars(page, page_size, dealerId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/cars/new',
      method: 'GET',
      params: {
        page: page,
        page_size: page_size,
        dealerId: dealerId
      },
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

function getUsedCars(page, page_size, dealerId) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/cars/used',
      method: 'GET',
      params: {
        page: page,
        page_size: page_size,
        dealerId: dealerId
      },
      baseURL: baseUrl,
      timeout: timeout
    }).then((resp) => {
      console.log(resp.data)
      resolve(resp.data)
    }).catch(err => {
      reject(err)
    })
  })
}
