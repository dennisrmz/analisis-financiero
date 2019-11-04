const express = require('express');
const router = express.Router();

const pool = require('../database');


// ********************Rutas Crear Materia Prima *************** */
router.get('/crear_materia_prima', async (req, res) => {
    res.render('materia-prima/crear_materia_prima');
    });

router.post('/crear_materia_prima', async (req, res) => {
    const{ nombre } = req.body;
    const newMateriaPrima = {
        nombre,
        existencias: 0
    };
    await pool.query('INSERT INTO materiasprimas set ?', [newMateriaPrima]);
    req.flash('success', 'Materia Prima Creada');
    res.redirect('/costeo/listar_materia_prima');
    });
        
router.get('/listar_materia_prima', async (req, res) => {
    const materiasprimas = await pool.query('SELECT * FROM materiasprimas');
    res.render('materia-prima/listar_materia_prima', {materiasprimas});
    });


//*******************Rutas Materia Prima******************* */ 
router.get('/entrada_materia_prima_saldo', async (req, res) => {
    const materiasprimas = await pool.query('SELECT * FROM materiasprimas');
    res.render('materia-prima/agregar_materia_prima', {materiasprimas});
    });

router.post('/entrada_materia_prima_saldo', async (req, res) => {
    const { materiaprima_id, cantidad, preciounitario } = req.body;
    const newEntradaMateriaPrima = {
        materiaprima_id,
        cantidad,
        preciounitario,
    }
    await pool.query('INSERT INTO entradamp set ?', [newEntradaMateriaPrima]);
    req.flash('success', 'Link Saved Succesfully');
    res.redirect('/costeo/materia_prima_entrada');
    });

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
    
router.get('/agregar_productos_proceso',async (req, res) => {
    productos =  await pool.query('SELECT * FROM inv_materiaprima');   
    console.log(productos);
    res.render('costeo/agregar_productos_a_proceso', {productos});
    })
router.post('/agregar_productos_proceso', (req, res) => {
        console.log(req);
        res.render('costeo/agregar_productos_a_proceso');
        })

router.get('/detalle_producto_proceso', async (req, res) => {
    res.render('costeo/detalle_producto_proceso');
    });

router.get('/transferir_proceso',(req, res) => {
    res.render('costeo/form_cambiar_proceso_producto');
});


module.exports = router;