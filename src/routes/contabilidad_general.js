const express = require('express');
const router = express.Router();

const pool = require('../database')

//-----------------------------------BALANCE DE COMPROBACION---------------------------------------------------------
router.get('/estados_financieros/balance_comprobacion/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    res.render('contabilidad_general/balance_de_comprobacion', {estadofinanciero});
});

//---------------------------------------BALANCE GENERAL---------------------------------------------------------
router.get('/estados_financieros/balance_general/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    res.render('contabilidad_general/balance_general', {estadofinanciero});
});

//--------------------------------------ESTADO DE RESULTADOS---------------------------------------------------------
router.get('/estados_financieros/estado_resultados/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    res.render('contabilidad_general/estado_de_resultados', {estadofinanciero});
});

//----------------------------------------ESTADO DE CAPITAL---------------------------------------------------------
router.get('/estados_financieros/estado_capital/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    res.render('contabilidad_general/estado_de_capital', {estadofinanciero});
});

//-------------------------------------ESTADO DE FLUJO DE EFECTIVO--------------------------------------------------
router.get('/estados_financieros/estado_flujo_efectivo/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    res.render('contabilidad_general/estado_flujo_de_efectivo', {estadofinanciero});
});

//------------------------------------------NOTAS EXPLICATIVAS------------------------------------------------------

//Mostrar listado de notas explicativas del estado financiero elegido
router.get('/estados_financieros/:NOMBRE_ESTADOFINANCIERO/:ID_ESTADOFINANCIERO/notas_explicativas/listado',async (req, res,next) => {
    const { NOMBRE_ESTADOFINANCIERO } = req.params;
    const { ID_ESTADOFINANCIERO } = req.params;
    const notasexplicativas = pool.query('SELECT * FROM notaexplicativa INNER JOIN estadofinanciero ON ' +
    'notaexplicativa.ID_ESTADOFINANCIERO = estadofinanciero.ID_ESTADOFINANCIERO WHERE estadofinanciero.ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    console.log("ID_ESTADOFINANCIERO");
    console.log({ID_ESTADOFINANCIERO});
    res.render('contabilidad_general/listado_notas_explicativas', {notasexplicativas, ID_ESTADOFINANCIERO, NOMBRE_ESTADOFINANCIERO});
});

//Agregar Notas Explicativas
router.get('/estados_financieros/:NOMBRE_ESTADOFINANCIERO/:ID_ESTADOFINANCIERO/notas_explicativas/listado/agregar', (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    console.log({ID_ESTADOFINANCIERO});
    res.render('contabilidad_general/agregar');
});
router.post('/estados_financieros/agregar_nota_explicativa', (req, res) => {
    console.log(req.body);
    res.send('recibido');
});

//---------------------------------------ESTADOS FINANCIEROS---------------------------------------------------------

//Mostrar listado de estados financieros
router.get('/estados_financieros/listado', async (req, res) => {
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero');
    res.render('contabilidad_general/listado_estados_financieros', {estadofinanciero});
});

//Mostrar el estado financiero elegido
router.get('/estados_financieros/:NOMBRE_ESTADOFINANCIERO/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { NOMBRE_ESTADOFINANCIERO } = req.params;
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ? AND ' +
    'NOMBRE_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO, NOMBRE_ESTADOFINANCIERO ]);
    res.render('contabilidad_general/listado_estados_financieros', {estadofinanciero});
});

module.exports = router;



