const express = require('express');
const router = express.Router();

const pool = require('../database')

//Listado Estados Financieros
router.get('/estados_financieros/listado', async (req, res) => {
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero');
    res.render('contabilidad_general/listado_estados_financieros', {estadofinanciero});
});

module.exports = router;

