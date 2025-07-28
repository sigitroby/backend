const express = require('express');
const router = express.Router();
const kepatuhanController = require('../controllers/kepatuhanController');
const upload = require('../middlewares/uploadMiddleware');

// Routes
router.post('/', upload.array('dokumen'), kepatuhanController.create);
router.get('/', kepatuhanController.getAll);
router.get('/:id', kepatuhanController.getById);
router.put('/:id', upload.array('dokumen'), kepatuhanController.update);
router.delete('/:id', kepatuhanController.delete);
router.get('/filter/data', kepatuhanController.filter);

module.exports = router;