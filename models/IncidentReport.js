const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema({
  incidentDate: { type: Date, required: true },
  incidentTime: { type: String, required: true },
  location: { type: String, required: true },

  reporterName: { type: String, required: true },
  reporterPhone: { type: String, required: true },

  victimName: { type: String },
  victimUnit: { type: String },

  kecelakaanType: {
    type: String,
    enum: ['staff', 'pengunjung'],
    required: true,
  },

  incidentCategory: {
    type: String,
    enum: ['nearmiss', 'insiden', 'accident'],
    required: true,
  },

  kronologi: { type: String, required: true },
  analisis: { type: String, required: true },
  injuryType: {
    type: String,
    enum: [
      'luka', 'keseleo', 'keracunan', 'lukabakar',
      'patahtulang', 'tidakada'
    ],
  },
  tindakan: { type: String, required: true },
  saran: { type: String, required: true },

  documentation: [String],

  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now }
});

incidentReportSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('IncidentReport', incidentReportSchema);
