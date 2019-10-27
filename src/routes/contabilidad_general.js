const express = require('express');
const router = express.Router();

const pool = require('../database')

//Listado Estados Financieros
router.get('/estados_financieros/listado', async (req, res) => {
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero');
    res.render('contabilidad_general/listado_estados_financieros', {estadofinanciero});
});

//Balance de Comprobacion
router.get('/estados_financieros/balance_comprobacion', async (req, res) => {
    res.render('contabilidad_general/balance_de_comprobacion');
});

//Consultar cuentas del Balance de Comprobacion
/*router.get('/estados_financieros/balance_comprobacion', async (req, res) => {
    const balanceCoomprobacion = await pool.query('SELECT cuenta.nombre_cuenta FROM cuenta ' + 
    'INNER JOIN movimiento ON cuenta.id_cuenta = movimiento.id_cuenta ' + 
    'INNER JOIN mayorizacion ON movimiento.id_mayorizacion = mayorizacion.id_mayorizacion ' +
    'INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.id_mayorizacion = estadofinanciero_mayorizacion.id_mayorizacion ' +
    'INNER JOIN estadofinanciero ON estadofinanciero_mayorizacion.id_estadofinanciero = estadofinanciero.id_estadofinanciero ' +
    'WHERE estadofinanciero.id_estadofinanciero = ?');
    res.render('contabilidad_general/listado_estados_financieros', {balanceComprobacion});
});*/

//Balance General
router.get('/estados_financieros/balance_general', async (req, res) => {
    res.render('contabilidad_general/balance_general');
});

//Estado de Resultados
router.get('/estados_financieros/estado_resultados', async (req, res) => {
    res.render('contabilidad_general/estado_de_resultados');
});

//Estado de Capital
router.get('/estados_financieros/estado_capital', async (req, res) => {
    res.render('contabilidad_general/estado_de_capital');
});

//Estado de Flujo de Efectivo
router.get('/estados_financieros/estado_flujo_efectivo', async (req, res) => {
    res.render('contabilidad_general/estado_flujo_de_efectivo');
});

//Notas Explicativas (agregar)
router.get('/estados_financieros/agregar_nota_explicativa', async (req, res) => {
    res.render('contabilidad_general/agregar_nota_explicativa');
});

//Listado de Notas Explicativas 
router.get('/estados_financieros/notas_explicativas/listado', async (req, res) => {
    res.render('contabilidad_general/listado_notas_explicativas');
});

module.exports = router;

