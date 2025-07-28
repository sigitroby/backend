const fs = require('fs');
const path = require('path');
const IncidentReport = require('../models/IncidentReport');

exports.createReport = async (req, res, next) => {
  try {
    const documentation = req.files?.map(file => file.filename) || [];

    const newReport = new IncidentReport({
      ...req.body,
      incidentDate: new Date(req.body.incidentDate),
      incidentTime: String(req.body.incidentTime),
      documentation
    });

    const saved = await newReport.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('❌ Error saving:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(err.errors).map(e => e.message)
      });
    }
    next(err);
  }
};

exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await IncidentReport.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const report = await IncidentReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Not found' });
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

exports.deleteReport = async (req, res, next) => {
  try {
    const report = await IncidentReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Not found' });

    report.documentation.forEach(filename => {
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      fs.unlink(filePath, () => {});
    });

    await report.deleteOne();
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
