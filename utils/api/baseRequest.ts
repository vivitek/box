import fetch from 'node-fetch'
import URL from './url.config.json'

export const get = async <T>(url: string, token?: string): Promise<T | undefined> => {
  const headers: { [key: string]: string } = {
    'Accept': 'application/json'
  }
  if (token) headers.Authorization = token
  const res = await fetch(URL.API + url, {
    headers
  })
  if (res.status !== 200) return
  const data = await res.json()
  return data as T
}

export const post = async <T>(url: string, token?: string, body?: any): Promise<T | undefined> => {
  const headers: { [key: string]: string } = {
    'Accept': 'application/json'
  }
  if (token) headers.Authorization = token
  const res = await fetch(URL.API + url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  if (res.status !== 200) return
  const data = await res.json()
  return data as T
}

export const del = async <T>(url: string, token?: string): Promise<T | undefined> => {
  const headers: { [key: string]: string } = {
    'Accept': 'application/json'
  }
  if (token) headers.Authorization = token
  const res = await fetch(URL.API + url, {
    method: 'DELETE',
    headers
  })
  if (res.status !== 200) return
  const data = await res.json()
  return data as T
}