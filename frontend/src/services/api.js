import { useAuth } from '../state/AuthContext.jsx'
import { apiFetch } from './http.js'

const API_BASE = import.meta.env.VITE_API_BASE || ''; 

export function useApi(){
  const { token } = useAuth()

  async function request(method, url, body){
    if (!token) throw new Error('NO_TOKEN')
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

    const res = await apiFetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const text = await res.text().catch(()=> '')
      throw new Error(text || `HTTP ${res.status}`)
    }
    return res.json()
  }

  return {
    get: (url) => request('GET', url),
    post: (url, body) => request('POST', url, body),
    delete: (url) => request('DELETE', url),
  }
}
