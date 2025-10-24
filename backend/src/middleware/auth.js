import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(req, res, next){
  try{
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if(!token) return res.status(401).json({ error: 'Unauthorized' })

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const userId = payload.sub || payload.id
    if(!userId) return res.status(401).json({ error: 'Unauthorized' })

    const user = await User.findById(userId).lean()
    if(!user) return res.status(401).json({ error: 'Unauthorized' })

    req.user = { id: user._id.toString(), name: user.name, email: user.email }
    next()
  }catch(e){
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
