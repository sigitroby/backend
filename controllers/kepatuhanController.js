const Kepatuhan = require('../models/Kepatuhan');
const fs = require('fs');

// Helper konversi alat_keamanan (array dari frontend) ke object boolean sesuai schema
const convertAlatKeamanan = (arr = []) => ({
  helm: arr.includes('helm'),
  kacamata: arr.includes('kacamata'),
  earplug: arr.includes('earplug'),
  masker: arr.includes('masker'),
  sarung_tangan: arr.includes('sarungtangan'),
  sepatu_safety: arr.includes('sepatu'),
  harness: arr.includes('harness'),
  rompi: arr.includes('rompi')
});

// Helper untuk file upload
const handleFileUpload = (files) => {
  return files.map(file => ({
    nama_file: file.originalname,
    path: file.path,
    tipe: file.mimetype,
    ukuran: file.size
  }));
};

const kepatuhanController = {
  create: async (req, res) => {
    try {
      const {
        nama_pekerja,
        lokasi_pekerjaan,
        unit,
        resiko_pekerjaan,
        kondisi_peralatan,
        tanggal,
        pemeriksa,
        kegiatan,
        temuan,
        status
      } = req.body;

      let alat_keamanan = [];
      try {
        alat_keamanan = JSON.parse(req.body.alat_keamanan || '[]');
      } catch (e) {
        console.error('Gagal parse alat_keamanan:', e);
      }

      const peralatan = convertAlatKeamanan(alat_keamanan);
      const dokumen = req.files ? handleFileUpload(req.files) : [];

      const newKepatuhan = new Kepatuhan({
        nama_pekerja,
        lokasi_pekerjaan,
        unit,
        resiko_pekerjaan: Array.isArray(resiko_pekerjaan) ? resiko_pekerjaan : [resiko_pekerjaan],
        peralatan,
        kondisi_peralatan,
        tanggal,
        pemeriksa,
        kegiatan,
        temuan,
        dokumen,
        status
      });

      await newKepatuhan.save();

      res.status(201).json({
        success: true,
        message: 'Data kepatuhan berhasil disimpan',
        data: newKepatuhan
      });
    } catch (error) {
      console.error('CREATE ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal menyimpan data kepatuhan',
        error: error.message
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const data = await Kepatuhan.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kepatuhan',
        error: error.message
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Kepatuhan.findById(id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Data kepatuhan tidak ditemukan'
        });
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data kepatuhan',
        error: error.message
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;

      let alat_keamanan = [];
      try {
        alat_keamanan = JSON.parse(req.body.alat_keamanan || '[]');
      } catch (e) {
        console.error('Gagal parse alat_keamanan (update):', e);
      }

      const updateData = {
        nama_pekerja: req.body.nama_pekerja,
        lokasi_pekerjaan: req.body.lokasi_pekerjaan,
        unit: req.body.unit,
        resiko_pekerjaan: Array.isArray(req.body.resiko_pekerjaan)
          ? req.body.resiko_pekerjaan
          : [req.body.resiko_pekerjaan],
        kondisi_peralatan: req.body.kondisi_peralatan,
        tanggal: req.body.tanggal,
        pemeriksa: req.body.pemeriksa,
        kegiatan: req.body.kegiatan,
        temuan: req.body.temuan,
        status: req.body.status,
        peralatan: convertAlatKeamanan(alat_keamanan)
      };

      if (req.files && req.files.length > 0) {
        updateData.dokumen = handleFileUpload(req.files);
      }

      const updatedData = await Kepatuhan.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedData) {
        return res.status(404).json({
          success: false,
          message: 'Data kepatuhan tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Data kepatuhan berhasil diupdate',
        data: updatedData
      });
    } catch (error) {
      console.error('UPDATE ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengupdate data kepatuhan',
        error: error.message
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Kepatuhan.findByIdAndDelete(id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Data kepatuhan tidak ditemukan'
        });
      }

      if (data.dokumen && data.dokumen.length > 0) {
        data.dokumen.forEach(doc => {
          if (fs.existsSync(doc.path)) {
            fs.unlinkSync(doc.path);
          }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Data kepatuhan berhasil dihapus'
      });
    } catch (error) {
      console.error('DELETE ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus data kepatuhan',
        error: error.message
      });
    }
  },

  filter: async (req, res) => {
    try {
      const { unit, status, startDate, endDate } = req.query;
      const filter = {};

      if (unit) filter.unit = unit;
      if (status) filter.status = status;

      if (startDate && endDate) {
        filter.tanggal = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const data = await Kepatuhan.find(filter).sort({ tanggal: -1 });

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal melakukan filter data',
        error: error.message
      });
    }
  }
};

module.exports = kepatuhanController;
