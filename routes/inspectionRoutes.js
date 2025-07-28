const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const {
  createInspection,
  getAllInspections,
  deleteInspectionById
} = require('../controllers/inspectionController');

router.post('/', upload.single('photo'), createInspection);
router.get('/', getAllInspections);
router.delete('/:id', deleteInspectionById);

module.exports = router;
