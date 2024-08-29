import { carSearchService } from '@/api/carSearchService'
import ChatAvatar from '@/assets/icons/bmbot.png'
import UserAvatar from '@/assets/icons/user.png'
import AdminAvatar from '@/assets/icons/admin.png'
import CloseURL from '@/assets/icons/close-icon.png'
import IconURL from '@/assets/icons/bmbot.png'
import TelephoneIcon from '@/assets/icons/telephone.png'
import SalesIcon from '@/assets/icons/sales.png'
import ServiceIcon from '@/assets/icons/tools.png'
import PartsIcon from '@/assets/icons/parts.png'
// import { updateBotSetting } from '../../api/botSetting'

const state = {
  participants: [
    {
      id: 'support',
      name: 'Telle Bot',
      imageUrl: ChatAvatar
    },
    {
      id: 'user',
      name: 'Customer',
      imageUrl: UserAvatar
    },
    {
      id: 'me',
      name: 'Admin',
      imageUrl: AdminAvatar
    }
  ],
  colors: {
    header: {
      bg: '#1f95e7',
      text: '#ffffff'
    },
    launcher: {
      bg: '#1f95e7'
    },
    messageList: {
      bg: '#F5F5F5'
    },
    sentMessage: {
      bg: '#67C23A',
      text: '#ffffff'
    },
    receivedMessage: {
      bg: '#ffffff',
      text: '#222222'
    },
    userInput: {
      bg: '#ffffff',
      text: '#565867'
    },
    toolBar: {
      active: '#1296db',
      inactive: '#565867'
    }
  },
  newCars: [],
  usedCars: [],
  cars: {
    type: 'new',
    data: [],
    options: {}
  },
  page: {
    pageSize: 8,
    pageCount: 1,
    pageCurrent: 1,
    totalCount: 0,
    hasNext: false
  },
  smallPageForm: {
    closeUrl: CloseURL,
    placeholder: 'Enter your message',
    botName: 'Telle',
    adminName: 'Emily',
    dealerName: 'Telle AI',
    dialogImageUrl: '',
    iconUrl: IconURL,
    dialogVisible: false,
    imageUrl: '',
    valid: 0,
    uploaded: false,
    keywordsSelect: true,
    couponUpload: false,
    welcomeSentence: 'Hi, this is Henri, how can I help you?',
    quickReplies: ['trade in', 'service', 'new car sales', 'used car sales', 'dealer information']
  },
  chatPageForm: {
    closeIcon: CloseURL,
    dialogImageUrl: '',
    iconUrl: IconURL,
    dialogVisible: false,
    imageUrl: '',
    valid: 0,
    uploaded: false,
    keywordsSelect: true,
    couponUpload: false,
    viewAllChats: true,
    chatLoading: false,
    chatWindowTitle: 'Telle Chat',
    titleImageUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/bmbot.png',
    isPageOpen: true,
    chatIdx: -1,
    isChatOpen: true,
    showTypingIndicator: '',
    placeholder: 'Enter your message',
    currentSession: '',
    disableUserListToggle: true,
    chatMessages: [{ message: {
      type: 'text',
      author: 'support',
      data: { text: "I'm Emily" },
      suggestions: []
    }
    }],
    alwaysScrollToBottom: true,
    messageStyling: true,
    participants: [
      {
        id: 'support',
        name: 'Telle Bot',
        imageUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/bmbot.png'
      },
      {
        id: 'user',
        name: 'Customer',
        imageUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/telle_ai.png'
      },
      {
        id: 'me',
        name: 'Admin',
        imageUrl: 'https://telle-ai-resources.s3.us-east-2.amazonaws.com/admin.png'
      }
    ]
  },
  dealerInfoForm: {
    dealerName: 'Telle',
    title: 'Telle AI',
    address: '160 E Grand Ave, Chicago, IL-60611',
    workingHours: {
      contact: {
        title: 'Telle AI',
        address: '160 E Grand Ave, Chicago, IL-60611'
      },
      items: [
        { name: 'Phone Numbers',
          key: 'Department',
          value: 'Phone Number',
          icon: TelephoneIcon,
          content: [
            { key: 'Main:', value: '(312) 500-8535' },
            { key: 'Sales:', value: '(312) 500-8535' },
            { key: 'Service:', value: '(312) 265-8535' },
            { key: 'Parts:', value: '(312) 267-8525' }
          ]
        },
        { name: 'Sales Hours',
          key: 'Date',
          value: 'Hours',
          icon: SalesIcon,
          content: [
            { key: 'Mon - Thu:', value: '9:00 AM - 8:00 PM' },
            { key: 'Fri - Sat:', value: '9:00 AM - 6:00 PM' },
            { key: 'Sun:', value: 'Closed' }
          ]
        },
        { name: 'Service Hours',
          key: 'Date',
          value: 'Hours',
          icon: ServiceIcon,
          content: [
            { key: 'Mon - Thu:', value: '7:00 AM - 7:00 PM' },
            { key: 'Fri - Sat:', value: '7:00 AM - 6:00 PM' },
            { key: 'Sun:', value: 'Closed' }
          ]
        },
        { name: 'Parts Hours',
          key: 'Date',
          value: 'Hours',
          icon: PartsIcon,
          content: [
            { key: 'Mon - Thu:', value: '8:00 AM - 6:00 PM' },
            { key: 'Fri - Sat:', value: '8:00 AM - 5:00 PM' },
            { key: 'Sun:', value: 'Closed' }
          ]
        }
      ]
    },
    map: null,
    mapName: 'Telle AI',
    latitude: 41.9022635,
    longitude: -87.6330796
  }

}

// actions
const actions = {
  getAllCars({ commit, state }, data) {
    console.log(this.state.user.bot.imagePrefix)
    carSearchService.getAllCars(data.pageNum, state.page.pageSize, data.dealerId).then((resp) => {
      var results = resp.data
      var inventory = []
      var options = { makes: [], makeOptions: [], models: [], modelOptions: {},
        newMakes: [], newMakeOptions: [], newModels: [], newModelOptions: {},
        oldMakes: [], oldMakeOptions: [], oldModels: [], oldModelOptions: {}
      }
      for (var i = 0; i < results.length; i++) {
        var car = results[i]
        // var base_url = 'https://www.dthondachicago.com/inventory/'
        var base_url = this.state.user.bot.imagePrefix
        // console.log(base_url)
        var payload = ''
        // console.log(car)
        // if (car.series === undefined || car.series === null) {
        //   payload = car.new_used.toLowerCase() + '-' + car.year + '-' + car.make.toLowerCase() + '-' + car.model.toLowerCase() + '-' + car.drivetrain_desc.toLowerCase() + '-' + car.body.toLowerCase() + '-' + car.vin.toLowerCase()
        // } else {
        //   payload = car.new_used.toLowerCase() + '-' + car.year + '-' + car.make.toLowerCase() + '-' + car.model.toLowerCase() + '-' + car.series.toLowerCase() + '-' + car.drivetrain_desc.toLowerCase() + '-' + car.body.toLowerCase() + '-' + car.vin.toLowerCase()
        // }
        if (car.link !== '') {
          payload = car.link
        } else {
          // console.log(car)
          if (car.series === undefined || car.series === null) {
            payload = car.new_used.toLowerCase() + '-' + car.year + '-' + car.make.toLowerCase() + '-' + car.model.toLowerCase() + '-' + car.drivetrain_desc.toLowerCase() + '-' + car.body.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + car.vin.toLowerCase()
          } else {
            payload = car.new_used.toLowerCase() + '-' + car.year + '-' + car.make.toLowerCase() + '-' + car.model.toLowerCase() + '-' + car.series.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + car.drivetrain_desc.toLowerCase() + '-' + car.body.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + car.vin.toLowerCase()
          }
          payload = base_url + payload
        }

        if (options.makes.indexOf(car.make) === -1) {
          options.makes.push(car.make)
          options.makeOptions.push({
            value: car.make,
            label: car.make
          })
          options.models.push(car.model)
          options.modelOptions[car.make] = [{
            value: car.model,
            label: car.model
          }]
        } else {
          if (options.models.indexOf(car.model) === -1) {
            options.models.push(car.model)
            options.modelOptions[car.make].push({
              value: car.model,
              label: car.model
            })
          }
        }

        var inventoryElement = {
          name: car.year + ' ' + car.make + ' ' + car.model + ' ' + car.series + ' ' + car.drivetrain_desc,
          title: 'VIN# ' + car.vin,
          subtitle: 'Stock# ' + car.stock,
          new_used: car.new_used,
          meta: {
            title: 'Price',
            value: '$' + car.price,
            price: car.price,
            make: car.make,
            model: car.model,
            msrp: '$' + car.msrp,
            exterior: car.colour,
            interior: car.interior_color
          },
          image_urls: car.photo_url_list,
          url: null,
          buttons: [
            {
              title: 'Select and Send',
              payload: payload
            }
          ]
        }

        inventory.push(inventoryElement)
        if (car.new_used === 'N' || car.new_used === 'New') {
          inventoryElement.name = 'NEW ' + inventoryElement.name

          if (options.newMakes.indexOf(car.make) === -1) {
            options.newMakes.push(car.make)
            options.newMakeOptions.push({
              value: car.make,
              label: car.make
            })
            options.newModels.push(car.model)
            options.newModelOptions[car.make] = [{
              value: car.model,
              label: car.model
            }]
          } else {
            if (options.newModels.indexOf(car.model) === -1) {
              options.newModels.push(car.model)
              options.newModelOptions[car.make].push({
                value: car.model,
                label: car.model
              })
            }
          }
          // newCarInventory.push(inventoryElement)
        } else {
          if (options.oldMakes.indexOf(car.make) === -1) {
            options.oldMakes.push(car.make)
            options.oldMakeOptions.push({
              value: car.make,
              label: car.make
            })
            options.oldModels.push(car.model)
            options.oldModelOptions[car.make] = [{
              value: car.model,
              label: car.model
            }]
          } else {
            if (options.oldModels.indexOf(car.model) === -1) {
              options.oldModels.push(car.model)
              options.oldModelOptions[car.make].push({
                value: car.model,
                label: car.model
              })
            }
          }
        }
      }
      commit('updatePagination', { total: resp.total, pageCurrent: data.pageNum, hasNext: resp.has_next })
      commit('addCars', { type: 'all', data: inventory, options: options })
    })
  },

  getNewCars({ commit, state }, data) {
    carSearchService.getNewCars(data.pageNum, state.page.pageSize, data.dealerId).then((resp) => {
      var results = resp.data
      var inventory = []
      var options = { makes: [], makeOptions: [], models: [], modelOptions: {}}
      for (var i = 0; i < results.length; i++) {
        var car = results[i]
        // var base_url = 'https://www.dthondachicago.com/inventory/'
        var base_url = this.state.user.bot.imagePrefix
        var payload = ''
        if (car.link !== '') {
          payload = car.link
        } else {
          // console.log(car)
          if (car.series === undefined || car.series === null) {
            payload = car.new_used.toLowerCase() + '-' + car.year + '-' + car.make.toLowerCase() + '-' + car.model.toLowerCase() + '-' + car.drivetrain_desc.toLowerCase() + '-' + car.body.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + car.vin.toLowerCase()
          } else {
            payload = car.new_used.toLowerCase() + '-' + car.year + '-' + car.make.toLowerCase() + '-' + car.model.toLowerCase() + '-' + car.series.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + car.drivetrain_desc.toLowerCase() + '-' + car.body.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + car.vin.toLowerCase()
          }
          payload = base_url + payload
        }

        if (options.makes.indexOf(car.make) === -1) {
          options.makes.push(car.make)
          options.makeOptions.push({
            value: car.make,
            label: car.make
          })
          options.models.push(car.model)
          options.modelOptions[car.make] = [{
            value: car.model,
            label: car.model
          }]
        } else {
          if (options.models.indexOf(car.model) === -1) {
            options.models.push(car.model)
            options.modelOptions[car.make].push({
              value: car.model,
              label: car.model
            })
          }
        }

        var inventoryElement = {
          name: 'NEW ' + car.year + ' ' + car.make + ' ' + car.model + ' ' + car.series + ' ' + car.drivetrain_desc,
          title: 'VIN# ' + car.vin,
          subtitle: 'Stock# ' + car.stock,
          new_used: car.new_used,
          meta: {
            title: 'Price',
            value: '$' + car.price,
            msrp: '$' + car.msrp,
            price: car.price,
            make: car.make,
            model: car.model,
            exterior: car.colour,
            interior: car.interior_color
          },
          image_urls: car.photo_url_list,
          url: null,
          buttons: [
            {
              title: 'Select and Send',
              payload: payload
            }
          ]
        }

        inventory.push(inventoryElement)
      }
      commit('updatePagination', { total: resp.total, pageCurrent: data.pageNum, hasNext: resp.has_next })
      commit('addCars', { type: 'new', data: inventory, options: options })
    })
  },

  getUsedCars({ commit, state }, data) {
    carSearchService.getUsedCars(data.pageNum, state.page.pageSize, data.dealerId).then((resp) => {
      var results = resp.data
      var inventory = []
      var options = { makes: [], makeOptions: [], models: [], modelOptions: {}}
      for (var i = 0; i < results.length; i++) {
        var car = results[i]
        // var base_url = 'https://www.dthondachicago.com/inventory/'
        var base_url = this.state.user.bot.imagePrefix
        var payload = ''
        if (car.link !== '') {
          payload = car.link
        } else {
          // console.log(car)
          if (car.series === undefined || car.series === null) {
            payload = car.new_used.toLowerCase() + '-' + car.year + '-' + car.make.toLowerCase() + '-' + car.model.toLowerCase() + '-' + car.drivetrain_desc.toLowerCase() + '-' + car.body.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + car.vin.toLowerCase()
          } else {
            payload = car.new_used.toLowerCase() + '-' + car.year + '-' + car.make.toLowerCase() + '-' + car.model.toLowerCase() + '-' + car.series.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + car.drivetrain_desc.toLowerCase() + '-' + car.body.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + car.vin.toLowerCase()
          }
          payload = base_url + payload
        }

        if (options.makes.indexOf(car.make) === -1) {
          options.makes.push(car.make)
          options.makeOptions.push({
            value: car.make,
            label: car.make
          })
          options.models.push(car.model)
          options.modelOptions[car.make] = [{
            value: car.model,
            label: car.model
          }]
        } else {
          if (options.models.indexOf(car.model) === -1) {
            options.models.push(car.model)
            options.modelOptions[car.make].push({
              value: car.model,
              label: car.model
            })
          }
        }

        var inventoryElement = {
          name: car.year + ' ' + car.make + ' ' + car.model + ' ' + car.series + ' ' + car.drivetrain_desc,
          title: 'VIN# ' + car.vin,
          subtitle: 'Stock# ' + car.stock,
          new_used: car.new_used,
          meta: {
            title: 'Price',
            value: '$' + car.price,
            msrp: '$' + car.msrp,
            price: car.price,
            make: car.make,
            model: car.model,
            exterior: car.colour,
            interior: car.interior_color
          },
          image_urls: car.photo_url_list,
          url: null,
          buttons: [
            {
              title: 'Select and Send',
              payload: payload
            }
          ]
        }
        inventory.push(inventoryElement)
      }
      commit('updatePagination', { total: resp.total, pageCurrent: data.pageNum, hasNext: resp.has_next })
      commit('addCars', { type: 'used', data: inventory, options: options })
    })
  }
}

// mutations
const mutations = {

  addNewCars(state, cars) {
    cars.forEach((car) => {
      state.newCars.push(car)
    })
  },

  addUsedCars(state, cars) {
    cars.forEach((car) => {
      state.usedCars.push(car)
    })
  },
  addCars(state, cars) {
    // state.cars = { type: cars.type, data: cars.data, options: { makes: cars.options.makes, makeOptions: cars.options.makeOptions, models: cars.options.models, modelOptions: cars.options.modelOptions }}
    state.cars = cars
    console.log(state.cars)
  },
  updatePagination(state, data) {
    state.page.totalCount = data.total
    state.page.pageCount = Math.floor(data.total / state.page.pageSize) + 1
    state.page.hasNext = data.hasNext
    state.page.pageCurrent = data.pageCurrent
  },
  updateSmallPageSet(state, data) {
    state.smallPageForm = data
  },
  updateChatPageSet(state, data) {
    state.chatPageForm = data
  },
  updateDealerInfoSet(state, data) {
    state.dealerInfoForm = data
  },
  updateBot(state, data) {
    console.log(data)
    for (var key1 in data.smallPageForm) {
      state.smallPageForm[key1] = data.smallPageForm[key1]
    }
    for (var key2 in data.chatPageForm) {
      state.chatPageForm[key2] = data.chatPageForm[key2]
    }
    for (var key3 in data.dealerInfoForm) {
      if (key3 in state.dealerInfoForm) {
        state.dealerInfoForm[key3] = data.dealerInfoForm[key3]
      }
    }
    if (data.dealerInfoForm.workingHours.contact.title && data.dealerInfoForm.workingHours.contact.address) {
      state.dealerInfoForm.workingHours.contact = {
        title: data.dealerInfoForm.workingHours.contact.title,
        address: data.dealerInfoForm.workingHours.contact.address
      }
    }
    if (data.dealerInfoForm.phoneNumbers) {
      state.dealerInfoForm.workingHours.items[0] = { name: 'Phone Numbers',
        key: 'Department',
        value: 'Phone Number',
        icon: TelephoneIcon,
        content: data.dealerInfoForm.phoneNumbers
      }
    }
    if (data.dealerInfoForm.salesHours) {
      state.dealerInfoForm.workingHours.items[1] = {
        name: 'Sales Hours',
        key: 'Date',
        value: 'Hours',
        icon: SalesIcon,
        content: data.dealerInfoForm.salesHours
      }
    }
    if (data.dealerInfoForm.serviceHours) {
      state.dealerInfoForm.workingHours.items[2] = {
        name: 'Service Hours',
        key: 'Date',
        value: 'Hours',
        icon: ServiceIcon,
        content: data.dealerInfoForm.serviceHours
      }
    }
    if (data.dealerInfoForm.partsHours) {
      state.dealerInfoForm.workingHours.items[3] = {
        name: 'Parts Hours',
        key: 'Date',
        value: 'Hours',
        icon: PartsIcon,
        content: data.dealerInfoForm.partsHours
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
