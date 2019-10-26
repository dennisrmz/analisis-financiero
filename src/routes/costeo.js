const express = require('express');
const router = express.Router();

const pool = require('../database');

//*******************Rutas Materia Prima******************* */ 
router.get('/materia_prima_saldo', async (req, res) => {
    res.render('materia-prima/listar_saldos_materia_prima');
    });

router.get('/materia_prima_entrada', async (req, res) => {
    res.render('materia-prima/listar_entradas_materia_prima');
    });

router.get('/materia_prima_salida', async (req, res) => {
    res.render('materia-prima/listar_salidas_materia_prima');
    });


//*******************Rutas Producto Terminado***************** */
router.get('/producto_terminado_saldo', async (req, res) => {
    res.render('costeo/listar_saldos_producto_terminado');
    });

router.get('/producto_terminado_entrada', async (req, res) => {
    res.render('costeo/listar_entradas_producto_terminado');
    });

router.get('/producto_terminado_salida', async (req, res) => {
    res.render('costeo/listar_salidas_producto_terminado');
    });

//*******************Rutas Producto en Proceso***************** */  

router.get('/producto_proceso', async (req, res) => {
    res.render('costeo/productos_procesos');
    });
    
router.get('/agregar_productos_proceso', (req, res) => {
    res.render('costeo/agregar_productos_a_proceso');
    })

router.get('/detalle_producto_proceso', async (req, res) => {
    res.render('costeo/detalle_producto_proceso');
    });

router.get('/transferir_proceso',(req, res) => {
    res.render('costeo/form_cambiar_proceso_producto');
});


module.exports = router;