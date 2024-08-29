import Mock from 'mockjs'

const count = 100
const ChatList = []

const MessageList = []

for (let i = 0; i < count; i++) {
  ChatList.push(Mock.mock({
    id: '@increment',
    sessionId: '@guid',
    created: '@datetime("MM/dd/yy H:mm A")',
    customer: '@name()',
    duration: '@time("H:m:s")',
    device_type: '@word()',
    leadsId: '@integer(1310,1410)',
    dept: '@word()',
    handledBy: '@name()',
    dealerShip: '@name()',
    'status|1': ['Missed', 'Answered']
  }))
}

for (let i = 0; i < count; i++) {
  MessageList.push(Mock.mock({
    id: '@increment',
    created: '@datetime("MM/dd/yy H:mm A")',
    sessionId: '@guid',
    message: '@sentence(0,10)',
    'direction|1': ['Incoming', 'Outgoing'],
    handledBy: '@name()',
    'status|1': ['Delivered', 'Failed']
  }))
}

export default [
  {
    url: '/chats/list',
    type: 'get',
    response: config => {
      const { subject, dept, status, page = 1, limit = 20, sort } = config.query

      let mockList = ChatList.filter(item => {
        if (status && item.status.indexOf(status) < 0) return false
        if (subject && item.subject.indexOf(subject) < 0) return false
        if (dept && item.dept !== dept) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      console.log('In request')
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/messages/',
    type: 'get',
    response: config => {
      const { sessionId, direction, status, page = 1, limit = 50, sort } = config.query
      console.log(sessionId)
      let mockList = MessageList.filter(item => {
        if (sessionId && item.sessionId !== Number(sessionId)) return false
        if (direction && item.direction.indexOf(direction) < 0) return false
        if (status && item.status.indexOf(status) < 0) return false
        return true
      })
      console.log(mockList)
      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      console.log('In request')
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]

