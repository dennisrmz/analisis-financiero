const express = require('express');
const router = express.Router();

const pool = require('../database');

//--------------------------------------ELI---------------------------------
//mostrar transacciones
router.get('/transaccion', (req, res) => {
        res.render('contabilidad_general/listar_transacciones');
});
//agregar transacciones
router.get('/agregar', (req, res) => {
        res.render('contabilidad_general/agregar_transaccion');
});
//mostrar periodo contable
router.get('/periodo_contable', (req, res) => {
        res.render('contabilidad_general/listar_periodo_contable');
});
//agregar periodo contable
router.get('/agregar_periodo', (req, res) => {
        res.render('contabilidad_general/agregar_periodo_contable');
});
//listar catalogo
router.get('/catalogo', (req, res) => {
        res.render('contabilidad_general/listar_catalogo');
});
//agregar cuenta a catalogo
router.get('/agregar_cuenta', (req, res) => {
        res.render('contabilidad_general/agregar_cuenta');
});

module.exports = router;