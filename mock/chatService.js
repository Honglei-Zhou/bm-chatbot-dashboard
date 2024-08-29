import Mock from 'mockjs'

const count = 100

const MessageList = []

const MessageContainer = []

for (let i = 0; i < count; i++) {
  MessageList.push(Mock.mock({
    id: '@increment',
    'from_bot|1': [0, 1],
    'message|1': [
      JSON.stringify([{ quickReplies: { title: "What's the upper bound of your budget?", quickReplies: ['$300/mo', '$400/mo', '$500/mo', '$600/mo', 'more'] }, platform: 'FACEBOOK' }]),
      JSON.stringify([{ text: { text: ["Sorry. I don't understand, can you rephrase?"] }}]),
      JSON.stringify([{ text: { text: ['What is the year, make, and model of your vehicle?'] }, platform: 'FACEBOOK' }, { text: { text: ['What is the year, make, and model of your vehicle?'] }}])
    ],
    'direction|1': ['incoming', 'outgoing'],
    'session_id|1': [1, 2, 3],
    'is_read|1': [0, 1],
    created: '@datetime("MM/dd/yy H:mm A")'
  }))
}
for (let i = 0; i < 3; i++) {
  MessageContainer.push(Mock.mock({
    id: '@increment',
    'from_bot|1': [0, 1],
    'message|1': [
      JSON.stringify([{ quickReplies: { title: "What's the upper bound of your budget?", quickReplies: ['$300/mo', '$400/mo', '$500/mo', '$600/mo', 'more'] }, platform: 'FACEBOOK' }]),
      JSON.stringify([{ text: { text: ["Sorry. I don't understand, can you rephrase?"] }}]),
      JSON.stringify([{ text: { text: ['What is the year, make, and model of your vehicle?'] }, platform: 'FACEBOOK' }, { text: { text: ['What is the year, make, and model of your vehicle?'] }}])
    ],
    'direction|1': ['incoming', 'outgoing'],
    session_id: i + 1,
    created: '@datetime("MM/dd/yy H:mm A")',
    'unread}1': [1, 2, 3, 4],
    'imgUrl|1': ['support', 'me', 'user'],
    'from_user|1': ['BM Bot', 'User']
  }))
}

export default [
  {
    url: '/api/livechat/messages',
    type: 'get',
    response: config => {
      const { session_id } = config.query
      console.log(session_id)
      let mockList = MessageList.filter(item => {
        if (session_id && item.session_id === Number(session_id)) return true
        else return false
      })
      console.log(mockList)
      mockList = mockList.sort((a, b) => {
        return b.created - a.created
      })

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList
        }
      }
    }
  },
  {
    url: '/api/livechat/all',
    type: 'get',
    response: config => {
      var mockList = MessageContainer.sort((a, b) => {
        return b.created - a.created
      })

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList
        }
      }
    }
  }
]

