const Inspection = require('../models/Inspection');

exports.createInspection = async (req, res) => {
  try {
    const { body, file } = req;
    const inspection = new Inspection({
      inspector_name: body.inspector_name,
      inspection_date: new Date(body.inspection_date),
      location: body.location,
      equipment: JSON.parse(body.equipment || '[]'),

      fire_extinguisher_code: body.fire_extinguisher_code || '',
      fire_extinguisher_jenis: body.fire_extinguisher_jenis || '',
      fire_extinguisher_expired: body.fire_extinguisher_expired ? new Date(body.fire_extinguisher_expired) : null,
      fire_extinguisher_condition: JSON.parse(body.fire_extinguisher_condition || '[]'),

      gensethydrant_condition: JSON.parse(body.gensethydrant_condition || '[]'),
      apab_condition: JSON.parse(body.apab_condition || '[]'),
      hydrant_condition: JSON.parse(body.hydrant_condition || '[]'),

      notes: body.notes,
      recommendation: body.recommendation,
      photo: file?.filename || null,
    });

    await inspection.save();

    res.status(201).json({ success: true, data: inspection });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ inspection_date: -1 });
    res.json({ success: true, data: inspections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInspectionById = async (req, res) => {
  try {
    const deleted = await Inspection.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

