const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  inspector_name: { type: String, required: true },
  inspection_date: { type: Date, required: true },
  location: { type: String, required: true },
  equipment: [String],

  fire_extinguisher_code: String,
  fire_extinguisher_jenis: String,
  fire_extinguisher_expired: Date,
  fire_extinguisher_condition: [String],

  gensethydrant_condition: [String],
  apab_condition: [String],
  hydrant_condition: [String],

  notes: String,
  recommendation: String,
  photo: String,
}, { timestamps: true });

module.exports = mongoose.model('Inspection', inspectionSchema);
