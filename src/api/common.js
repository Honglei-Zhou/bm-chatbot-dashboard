let baseUrl = 'https://36e21nqd9i.execute-api.us-east-1.amazonaws.com/telle'
let socketUrl = 'https://admin.telle.ai'

const stage = 'dev'

if (stage === 'prod') {
  baseUrl = 'https://919swyodhj.execute-api.us-east-1.amazonaws.com/redis-master'
  socketUrl = 'https://admin-prod.telle.ai'
} else if (stage === 'test') {
  // baseUrl = 'https://9w7b1r8iy1.execute-api.us-east-1.amazonaws.com/dev'
  // socketUrl = 'http://127.0.0.1:5001'
  // baseUrl = '54.87.133.125:5003'
  socketUrl = 'https://admin.telle.ai'
  // socketUrl = 'http://127.0.0.1:5001'
  baseUrl = 'http://127.0.0.1:5003'
}

export default {
  baseUrl: baseUrl,
  socketUrl: socketUrl
}
