
import axios from 'axios'
import commonConfig from './common'

const baseUrl = commonConfig.baseUrl

export const promotionService = {
  getSignedURL,
  deleteFile,
  uploadFileToS3,
  getPromotionList,
  addPromotion,
  updatePromotion,
  deletePromotion
}

const s3baseUrl = 'https://3dxcuahqad.execute-api.us-east-1.amazonaws.com/v1'

function getSignedURL(file) {
  console.log(file)
  return new Promise((resolve, reject) => {
    // axios.post(endpoint, payload)
    var bodyFormData = new FormData()
    console.log(file.name)
    bodyFormData.append('filePath', 'telle/' + file.name)
    bodyFormData.append('contentType', file.type)
    bodyFormData.forEach(item => {
      console.log(item)
    })
    axios(
      {
        url: '/uploadimage',
        method: 'POST',
        data: bodyFormData,
        baseURL: s3baseUrl
      }
    )
      .then((res) => {
        console.log(res)
        resolve(res.data)
      })
      .catch((err) => {
        console.error(err)
        reject(err)
      })
  })
}

function uploadFileToS3(file) {
  return new Promise((resolve, reject) => {
    getSignedURL(file).then(result => {
      console.log(file)
      var options = {
        headers: {
          'Content-Type': file.type
        }
      }
      return axios.put(result, file, options)
    }).then((res) => {
      console.log(res)
      resolve(res)
    })
      .catch((err) => {
        console.error(err)
        reject(err)
      })
  })
}

function deleteFile(file) {
  return new Promise((resolve, reject) => {
    // axios.post(endpoint, payload)
    var bodyFormData = new FormData()
    bodyFormData.append('filePath', 'telle/' + file.name)
    bodyFormData.append('contentType', file.type)
    axios({
      url: '/delete',
      method: 'POST',
      data: bodyFormData,
      baseURL: s3baseUrl
    })
      .then((res) => {
        console.log(res)
        resolve(res)
      })
      .catch((err) => {
        console.error(err)
        reject(err)
      })
  })
}

function getPromotionList(token, query) {
  return new Promise((resolve, reject) => {
    axios({
      url: '/promotion/list',
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

function addPromotion(token, query) {
  var bodyFormData = new FormData()
  bodyFormData.append('promotionName', query.promotionName)
  bodyFormData.append('dealerId', query.dealerId)
  bodyFormData.append('dealerName', query.dealerName)
  bodyFormData.append('code', query.code)
  bodyFormData.append('coupon', query.coupon)
  bodyFormData.append('keywords', query.keywords)
  bodyFormData.append('note', query.note)
  bodyFormData.append('department', query.department)
  bodyFormData.append('startDate', query.startDate)
  bodyFormData.append('endDate', query.endDate)
  return new Promise((resolve, reject) => {
    axios({
      url: '/promotion/new',
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

function updatePromotion(token, query) {
  var bodyFormData = new FormData()
  bodyFormData.append('id', query.id)
  bodyFormData.append('promotionName', query.promotionName)
  bodyFormData.append('dealerId', query.dealerId)
  bodyFormData.append('dealerName', query.dealerName)
  bodyFormData.append('code', query.code)
  bodyFormData.append('coupon', query.coupon)
  bodyFormData.append('keywords', query.keywords)
  bodyFormData.append('note', query.note)
  bodyFormData.append('department', query.department)
  bodyFormData.append('startDate', query.startDate)
  bodyFormData.append('endDate', query.endDate)
  return new Promise((resolve, reject) => {
    axios({
      url: '/promotion/update',
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

function deletePromotion(token, query) {
  var bodyFormData = new FormData()
  bodyFormData.append('id', query.id)
  bodyFormData.append('dealerId', query.dealerId)
  return new Promise((resolve, reject) => {
    axios({
      url: '/promotion/delete',
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
