import Cookies from 'js-cookie'

const TokenKey = 'telle-dashboard-token'

const EmailKey = 'telle-dashboard-email'

const DealerIDKey = 'telle-dashboard-dealerId'

const MutedChats = 'telle-dashboard-mutedChats'

export function getToken() {
  var token = Cookies.get(TokenKey)
  // console.log(token)
  return token
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getEmail() {
  var email = Cookies.get(EmailKey)
  return email
}

export function setEmail(email) {
  return Cookies.set(EmailKey, email)
}

export function removeEmail() {
  return Cookies.remove(EmailKey)
}

export function getDealerID() {
  var dealerId = Cookies.get(DealerIDKey)
  return dealerId
}

export function setDealerID(dealerId) {
  return Cookies.set(DealerIDKey, dealerId)
}

export function removeDealerID() {
  return Cookies.remove(DealerIDKey)
}

export function getMutedChats() {
  var mutedChats = Cookies.get(MutedChats)
  // Cookies.remove(MutedChats)
  if (mutedChats === undefined) {
    mutedChats = {}
    Cookies.set(MutedChats, JSON.stringify(mutedChats))
  }
  return JSON.parse(mutedChats)
}

export function setMutedChats(mutedChats) {
  return Cookies.set(MutedChats, JSON.stringify(mutedChats))
}

export function removeMutedChats() {
  return Cookies.remove(MutedChats)
}

