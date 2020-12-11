import * as api from './baseRequest'

interface TExampleResponse {
  error?: string,
  data: string
}

const exampleGet = async (): Promise<TExampleResponse> => {
  const res = await api.get<TExampleResponse>('/example')
  if (!res || res.error) throw new Error('Error')
  return res
}

const examplePost = async (token: string): Promise<TExampleResponse> => {
  const body = {
    dataToSend: 'ahahsomedata'
  }
  const res = await api.post<TExampleResponse>('/example', token, body)
  if (!res || res.error) throw new Error('Error POST')
  return res
}