import { useAuth } from '../state/AuthContext.jsx'

export function useApi(){
  const { token } = useAuth()

  async function request(method, url, body){
    if (!token) throw new Error('NO_TOKEN')

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      // prova a leggere il testo di errore, altrimenti status
      const text = await res.text().catch(()=> '')
      throw new Error(text || `HTTP ${res.status}`)
    }

    // se errore 204, non c'è body
    if (res.status === 204) return null

    // se c'è body, prova a fare il parse json
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return res.json()
    }
    // fallback in caso non sia json
    return res.text()
  }

  return {
    get: (url) => request('GET', url),
    post: (url, body) => request('POST', url, body),
    delete: (url) => request('DELETE', url),
  }
}
