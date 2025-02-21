// app/models/Objekt.js
import mongoose from 'mongoose';

const objektSchema = new mongoose.Schema({
  platformId: { type: mongoose.Schema.Types.ObjectId, ref: 'Platform', required: true },
  tokenId: { type: String, required: true },
  name: { type: String, required: true },
  season: { type: String, required: true },
  member: { type: String, required: true },
  collection: { type: String, required: true },
  frontImage: String,
  backImage: String,
  currentOwner: String,
  transferHistory: [{
    from: String,
    to: String,
    timestamp: Date,
    transactionHash: String
  }],
  metadata: { type: Map, of: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const Objekt = mongoose.models.Objekt || mongoose.model('Objekt', objektSchema);

export default Objekt;
