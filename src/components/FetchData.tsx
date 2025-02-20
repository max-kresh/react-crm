import { SERVER } from '../services/ApiUrls'

export function compileHeader () { 
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('Token'),
    org: localStorage.getItem('org')
  }
}

export function fetchData (url: any, method: any, data = '', header: any) {
  return fetch(`${SERVER}${url}`, {
    method,
    headers: header,
    body: data
  }).then((response) => {
    if (response.status === 401) {
      logout_and_navigate_to_login()
      return null
    } 
    return response.json()
  })
}

export function fetchRawData (url: any, method: any, data = '', header: any) {
  return fetch(`${SERVER}${url}`, {
    method,
    headers: header,
    body: data
  }).then((response) => {
    if (response.status === 401) {
      logout_and_navigate_to_login()
      return null
    } 
    return response
  })
}

function logout_and_navigate_to_login () {
  localStorage.clear()
  
  // Normally setting window.location.href in a SPA is not a good practice.
  // However, since we use this function only when a user token cannot be
  // authenticated (e.i. fetch function returns a 403 status code) 
  // (either because it has expired or corrupted) to navigate the user to 
  // the login page, it seems acceptable to set window.location.href for this 
  // scenario
  window.location.href = '/login'
}
