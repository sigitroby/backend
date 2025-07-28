const mongoose = require('mongoose');
const { Schema } = mongoose;

const kepatuhanSchema = new Schema({
  // Identitas Pekerja
  nama_pekerja: { type: String, required: true, trim: true },
  lokasi_pekerjaan: { type: String, required: true, trim: true },
  unit: {
    type: String,
    required: true,
    enum: ['ITISI', 'IPAME', 'IPL', 'PERLENGKAPAN', 'K3RS']
  },
  resiko_pekerjaan: [{ type: String }],

  // Peralatan Keselamatan
  peralatan: {
    helm: Boolean,
    kacamata: Boolean,
    earplug: Boolean,
    masker: Boolean,
    sarung_tangan: Boolean,
    sepatu_safety: Boolean,
    harness: Boolean,
    rompi: Boolean
  },
  kondisi_peralatan: {
    type: String,
    enum: ['baik', 'cukup', 'buruk'],
    required: true
  },

  // Pemeriksaan
  tanggal: { type: Date, required: true },
  pemeriksa: { type: String, required: true, trim: true },
  kegiatan: String,
  temuan: String,

  // Dokumen
  dokumen: [{
    nama_file: String,
    path: String,
    tipe: String,
    ukuran: Number
  }],

  // Status
  status: {
    type: String,
    enum: ['patuh', 'tidak patuh', 'sebagian patuh'],
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Kepatuhan', kepatuhanSchema);
