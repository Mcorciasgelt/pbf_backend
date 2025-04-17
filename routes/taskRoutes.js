const express = require('express');
const router = express.Router();


router.get('/test', (req, res) => {
  res.send(' Ruta /api/tasks/test funcionando');
});


module.exports = router;