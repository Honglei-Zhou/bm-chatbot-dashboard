import Mock from 'mockjs'

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@first'
  }))
}
NameList.push({ name: 'mock-Pan' })

export default [
  // username search
  {
    url: '/search/user',
    type: 'get',
    response: config => {
      const { name } = config.query
      const mockNameList = NameList.filter(item => {
        const lowerCaseName = item.name.toLowerCase()
        return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
      })
      return {
        code: 20000,
        data: { items: mockNameList }
      }
    }
  },

  // transaction list
  {
    url: '/transaction/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: 20,
          'items|20': [{
            order_no: '@guid()',
            timestamp: +Mock.Random.date('T'),
            username: '@name()',
            price: '@float(1000, 15000, 0, 2)',
            'status|1': ['success', 'pending']
          }]
        }
      }
    }
  },

  // leads list
  // {
  //   url: '/leads/list',
  //   type: 'get',
  //   response: _ => {
  //     return {
  //       code: 20000,
  //       data: {
  //         total: 20,
  //         'items|20': [{
  //           'id|+1': 1,
  //           created: '@datetime("yyyy-MM-dd A HH:mm:ss")',
  //           customer: '@name()',
  //           contact: '@email()',
  //           note: '@sentence(0,10)',
  //           appt: '@datetime("yyyy-MM-dd A HH:mm")',
  //           dept: '@word()',
  //           'status|1': ['pending', 'success']
  //         }]
  //       }
  //     }
  //   }
  // },

  // todo list
  {
    url: '/todo/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: 10,
          'items|10': [{
            text: 'offer help and guidance',
            done: '@boolean()'
          },
          {
            text: 'Write blog post',
            done: '@boolean()'
          },
          {
            text: 'Call Brian',
            done: '@boolean()'
          },
          {
            text: 'Edit new articles',
            done: '@boolean()'
          },
          {
            text: 'Checking things ',
            done: '@boolean()'
          },
          {
            text: 'adding all pertinent details to your to-do list',
            done: '@boolean()'
          },
          {
            text: 'find this information 10 minutes before the call',
            done: '@boolean()'
          },
          {
            text: 'keep a separate list of delegated tasks',
            done: '@boolean()'
          },
          {
            text: 'check-in with employees',
            done: '@boolean()'
          },
          {
            text: 'Write Email',
            done: '@boolean()'
          }
          ]
        }
      }
    }
  },

  // dashboard pie chart
  {
    url: '/dashboard/piechart',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          name: 'User Location',
          // data: [
          //   { value: 320, name: 'Industries' },
          //   { value: 240, name: 'Technology' },
          //   { value: 149, name: 'Forex' },
          //   { value: 100, name: 'Gold' },
          //   { value: 59, name: 'Forecasts' }
          // ],
          // legend: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts'],
          'data|4-7': [
            {
              'value|1': ['@integer(7, 500)'],
              'name|1': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
                'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Columbus', 'San Francisco', 'Seattle', 'Boston', 'Atlanta', 'Miami']
            }
          ]
        }
      }
    }
  },

  // dashboard line chart
  {
    url: '/dashboard/linechart',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          newVisits: {
            'name|1': ['New Visits'],
            'data|7': ['@integer(60, 220)'],
            'legend|1-1': ['Total New Visits']
          },
          messages: {
            'name|1': ['New Messages'],
            'data|7': ['@integer(50, 280)'],
            'legend|1-1': ['Total Messages']
          },
          chatSessions: {
            'name|1': ['New Chat Sessions'],
            'data|7': ['@integer(60, 100)'],
            'legend|1-1': ['Total Chat Sessions']
          }
        }
      }
    }
  },

  // dashboard bar chart
  {
    url: '/dashboard/barchart',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data:
        { name: 'Time',
          data: [{
            'name|1': ['Morning'],
            'data|7': ['@integer(60, 220)'],
            'legend|1-1': ['Morning']
          },
          {
            'name|1': ['Afternoon'],
            'data|7': ['@integer(50, 280)'],
            'legend|1-1': ['Afternoon']
          },
          {
            'name|1': ['Evening'],
            'data|7': ['@integer(60, 100)'],
            'legend|1-1': ['Evening']
          }
          ]
        }

      }
    }
  }
]
