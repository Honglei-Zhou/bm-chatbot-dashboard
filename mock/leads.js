import Mock from 'mockjs'

const count = 100
const LeadsList = []

for (let i = 0; i < count; i++) {
  LeadsList.push(Mock.mock({
    id: '@integer(1310,1420)',
    created: '@datetime("MM/dd/yy H:mm A")',
    customer: '@name()',
    contact: '@email()',
    note: '@sentence(0,10)',
    appt: '@datetime("MM/dd/yy H:mm A")',
    dept: '@word()',
    importance: '@integer(1, 3)',
    'status|1': ['New', 'Success', 'Closed']
  }))
}

export default [
  {
    url: '/leads/list',
    type: 'get',
    response: config => {
      const { importance, dept, note, page = 1, limit = 20, sort } = config.query

      let mockList = LeadsList.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (note && item.note.indexOf(note) < 0) return false
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
    url: '/leads/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const leads of LeadsList) {
        if (leads.id === +id) {
          return {
            code: 20000,
            data: leads
          }
        }
      }
    }
  }
]

