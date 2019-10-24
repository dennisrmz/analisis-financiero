const express = require('express');
const router = express.Router();

const pool = require('../database');

//--------------------------------------ELI---------------------------------
//mostrar transacciones
router.get('/transaccion', async (req, res) => {
        const transaccion = await pool.query('SELECT * FROM transaccion');
        res.render('contabilidad_general/listar_transacciones', {transaccion});
});
//agregar transacciones
router.get('/transaccion/agregar_transaccion', (req, res) => {
        res.render('contabilidad_general/agregar_transaccion');
});
//mostrar periodo contable
router.get('/periodo_contable', async (req, res) => {
        const periodocontable = await pool.query('SELECT * FROM periodocontable');
        res.render('contabilidad_general/listar_periodo_contable', { periodocontable });
});
//agregar periodo contable
router.get('/periodo_contable/agregar_periodo', (req, res) => {
        res.render('contabilidad_general/agregar_periodo_contable');
});
router.post('/periodo_contable/agregar_periodo', async (req, res) => {
        const { fecha } = req.body;
        const new_fecha = {
                fecha
        };
        let sentenciaSQL= 'INSERT INTO periodocontable (FECHAINICIO_PERIODO) VALUES (?)';
        await pool.query(sentenciaSQL, [fecha], (err,results,fields) =>{
                if (err) {
                        return console.error(err.message);
                }
                res.send('recibido');
        });
});
//listar catalogo
router.get('/catalogo', async (req, res) => {
        const cuenta = await pool.query('SELECT * FROM cuenta');
        res.render('contabilidad_general/listar_catalogo', {cuenta});
});
//agregar cuenta a catalogo
router.get('/catalogo/agregar_cuenta', (req, res) => {
        res.render('contabilidad_general/agregar_cuenta');
});

module.exports = router;