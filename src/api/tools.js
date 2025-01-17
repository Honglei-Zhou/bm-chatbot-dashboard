const stringConstructor = 'test'.constructor
const arrayConstructor = [].constructor
const objectConstructor = {}.constructor

export function create_UUID() {
  var dt = new Date().getTime()
  var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

export function whatIsIt(object) {
  if (object === null) {
    return 'null'
  } else if (object === undefined) {
    return 'undefined'
  } else if (object.constructor === stringConstructor) {
    return 'String'
  } else if (object.constructor === arrayConstructor) {
    return 'Array'
  } else if (object.constructor === objectConstructor) {
    return 'Object'
  } else {
    return 'unknown'
  }
}

export function compareValues(key, order = 'asc') {
  return function(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0
    }
    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key]
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return (
      (order === 'desc')
        ? (comparison * -1) : comparison
    )
  }
}

export function randomCode() {
  var length = 6
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
