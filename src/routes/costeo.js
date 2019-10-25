const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/', async (req, res) => {
    res.render('costeo/listar_saldos_PT');
    });

router.get('/producto_proceso', async (req, res) => {
    res.render('costeo/productos_procesos');
    });

router.get('/detalle_producto_proceso', async (req, res) => {
    res.render('costeo/detalle_producto_proceso');
    });

router.get('/transferir_proceso',(req, res) => {
    res.render('costeo/form_cambiar_proceso_producto');
});

router.get('/agregar', (req, res) => {
    res.render('costeo/agregar_entradas_PT');
})
module.exports = router;