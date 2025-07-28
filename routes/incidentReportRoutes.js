const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/incidentReportController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', upload.array('documentation'), controller.createReport);
router.get('/', controller.getAllReports);
router.get('/:id', controller.getReport);
router.delete('/:id', controller.deleteReport);

module.exports = router;
