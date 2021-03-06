const express = require('express');

const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
router.get('/', isLoggedIn, async (req, res) => {
    const periodo1 = await pool.query("SELECT DATE_FORMAT(FECHAFINAL_PERIODO, '%Y/%m/%d') AS FECHA_PERIODO_FINAL FROM periodocontable ORDER BY "+
        "ID_PERIODOCONTABLE DESC LIMIT 1");
    const periodo_counts = await pool.query("SELECT COUNT(*) AS COUNT FROM periodocontable");
    res.render('index', {periodo: periodo1[0], periodo_count: periodo_counts[0]});
});
//agregar periodo contable GET y POST
router.get('/agregar_periodo',isLoggedIn, (req, res) => {
    res.render('contabilidad_general/agregar_periodo_contable');
});
router.post('/agregar_periodo', isLoggedIn, async (req, res) => {
    const { fecha } = req.body;
    await pool.query('INSERT INTO periodocontable (FECHAINICIO_PERIODO) VALUES (?)', [fecha]);
    res.redirect('/');
});

module.exports = router;