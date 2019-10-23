const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/agregar', (req, res) => {
    res.render('costeo/agregar_entradas_PT');
})
module.exports = router;