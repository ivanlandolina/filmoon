import mongoose from 'mongoose';

const WatchedSchema = new mongoose.Schema({
  filmId: { type: Number, required: true, index: true },
  rating: { type: Number, min: 0, max: 5 }, 
  review: { type: String },                  
  watchedAt: { type: Date, default: Date.now }
}, { _id: false })

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  watchlist: { type: [Number], default: [] },
  watched: { type: [WatchedSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);