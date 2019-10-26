const express = require('express');
const router = express.Router();

const pool = require('../database');

//--------------------------------------ELI---------------------------------
//mostrar transacciones
router.get('/transaccion', async (req, res) => {
        const transaccion = await pool.query('SELECT * FROM transaccion');
        res.render('contabilidad_general/listar_transacciones', {transaccion});
});
//-------------------------------------------------------------------------------------------
//agregar transacciones
router.get('/transaccion/agregar_transaccion', async (req, res, next) => {
        const cuenta_padre = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 3');
        const subcuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 4');
        const sub_subcuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 5');
        const tipo_transaccion = await pool.query('SELECT * FROM tipotransaccion');
        res.render('contabilidad_general/agregar_transaccion', {cuenta_padre, subcuenta, sub_subcuenta, tipo_transaccion});
});
router.post('/transaccion/agregar_transaccion', (req, res) => {
        res.render('contabilidad_general/agregar_transaccion');
});
//-------------------------------------------------------------------------------------------
//mostrar periodo contable
router.get('/periodo_contable', async (req, res) => {
        const periodocontable = await pool.query('SELECT * FROM periodocontable');
        res.render('contabilidad_general/listar_periodo_contable', { periodocontable });
});
//-------------------------------------------------------------------------------------------
//agregar periodo contable
router.get('/periodo_contable/agregar_periodo', (req, res) => {
        res.render('contabilidad_general/agregar_periodo_contable');
});
router.post('/periodo_contable/agregar_periodo', async (req, res) => {
        const { fecha } = req.body;
        const new_fecha = {
                fecha
        };
        await pool.query('INSERT INTO periodocontable (FECHAINICIO_PERIODO) VALUES (?)', [fecha]);
        res.redirect('/contabilidad_general/periodo_contable');
});
//-------------------------------------------------------------------------------------------
//listar catalogo
router.get('/catalogo', async (req, res, next) => {
        //const cuenta = await pool.query('SELECT * FROM cuenta INNER JOIN naturaleza ON cuenta.ID_NATURALEZA_CUENTA=naturaleza.ID_NATURALEZA_CUENTA');
        const cuenta = await pool.query('SELECT * FROM cuenta');
        res.render('contabilidad_general/listar_catalogo', {cuenta});
});
//------------------------------------------------------------------------------------------
//mostrar cuenta de catalago
router.get('/catalogo/ver_cuenta/:ID_CUENTA', async (req, res) => {
        const { ID_CUENTA } = req.params;
        const cuentas = await pool.query('SELECT * FROM cuenta INNER JOIN naturaleza ON cuenta.ID_NATURALEZA_CUENTA=naturaleza.ID_NATURALEZA_CUENTA WHERE ID_CUENTA = ?', [ ID_CUENTA ]);
        console.log(cuentas);
        res.render('contabilidad_general/mostrar_cuenta', {cuenta: cuentas[0]});
});
//-------------------------------------------------------------------------------------------
//agregar cuenta padre a catalogo
router.get('/catalogo/agregar_cuenta', async (req, res, next) => {
        const rubro = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 2');
        const naturaleza = await pool.query('SELECT * FROM naturaleza');
        res.render('contabilidad_general/agregar_cuenta', {rubro, naturaleza});
});
router.post('/catalogo/agregar_cuenta', async (req, res, next) => {
        const { CODIGO_CUENTA_PADRE, CODIGO_CUENTA, NOMBRE_CUENTA, ID_NATURALEZA_CUENTA } = req.body;
        const NIVELH = '3';
        const new_cuenta = {
                CODIGO_CUENTA_PADRE,
                CODIGO_CUENTA,
                NOMBRE_CUENTA,
                ID_NATURALEZA_CUENTA, 
                NIVELH,
                CODIGO_CUENTA_PADRE,
        };
        console.log({ CODIGO_CUENTA_PADRE, CODIGO_CUENTA, NOMBRE_CUENTA, NIVELH, ID_NATURALEZA_CUENTA });
        //res.send('recibido');
        await pool.query('INSERT INTO cuenta set ?', [new_cuenta ], (err, results, fields) => {
                if (err) {
                  return console.error(err.message);
                }
                // get inserted rows
                console.log('Fila insertada:' + results.affectedRows);
                res.redirect('/contabilidad_general/catalogo');
        });
});
//-------------------------------------------------------------------------------------------
//agregar sub cuenta de la cuenta padre a catalogo
router.get('/catalogo/agregar_subcuenta', async (req, res, next) => {
        const rubro = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 2');
        const cuenta_padre = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 3');
        const naturaleza = await pool.query('SELECT * FROM naturaleza');
        res.render('contabilidad_general/agregar_subcuenta', {rubro, cuenta_padre, naturaleza});
});
router.post('/catalogo/agregar_subcuenta', async (req, res, next) => {
        const { CODIGO_CUENTA_PADRE, CODIGO_CUENTA_PADRE_SELEC, CODIGO_CUENTA, NOMBRE_CUENTA, ID_NATURALEZA_CUENTA } = req.body;
        const NIVELH = '4';
        const new_cuenta = {
                CODIGO_CUENTA_PADRE,
                CODIGO_CUENTA,
                NOMBRE_CUENTA,
                ID_NATURALEZA_CUENTA, 
                NIVELH
        };
        //console.log(ID_CUENTA);
        console.log({ CODIGO_CUENTA_PADRE, CODIGO_CUENTA_PADRE_SELEC, CODIGO_CUENTA, NOMBRE_CUENTA, ID_NATURALEZA_CUENTA, NIVELH });
        //res.send('recibido');
        await pool.query('INSERT INTO cuenta set ?', [ new_cuenta ], (err, results, fields) => {
                if (err) {
                  return console.error(err.message);
                }
                // get inserted rows
                console.log('Fila insertada:' + results.affectedRows);
               res.redirect('/contabilidad_general/catalogo');
        });
});
//-------------------------------------------------------------------------------------------
//agregar sub cuenta de la sub cuenta de la cuenta padre a catalogo
router.get('/catalogo/agregar_subsubcuenta', async (req, res, next) => {
        const rubro = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 2');
        const cuenta_padre = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 3');
        const subcuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 4');
        const naturaleza = await pool.query('SELECT * FROM naturaleza');
        res.render('contabilidad_general/agregar_subsubcuenta', {rubro, cuenta_padre, subcuenta, naturaleza});
});
router.post('/catalogo/agregar_subsubcuenta', async (req, res, next) => {
        const { CODIGO_CUENTA_RUBRO_SELEC, CODIGO_CUENTA_PADRE, CODIGO_CUENTA_PADRE_SELEC, CODIGO_CUENTA, NOMBRE_CUENTA, ID_NATURALEZA_CUENTA } = req.body;
        const NIVELH = '5';
        const new_cuenta = {
                CODIGO_CUENTA_PADRE,
                CODIGO_CUENTA,
                NOMBRE_CUENTA,
                ID_NATURALEZA_CUENTA, 
                NIVELH
        };
        //console.log(ID_CUENTA);
        console.log({ CODIGO_CUENTA_PADRE, CODIGO_CUENTA_RUBRO_SELEC, CODIGO_CUENTA_PADRE_SELEC, CODIGO_CUENTA, NOMBRE_CUENTA, ID_NATURALEZA_CUENTA, NIVELH });
        //res.send('recibido');
        await pool.query('INSERT INTO cuenta set ?', [ new_cuenta ], (err, results, fields) => {
                if (err) {
                  return console.error(err.message);
                }
                // get inserted rows
                console.log('Fila insertada:' + results.affectedRows);
               res.redirect('/contabilidad_general/catalogo');
        });
});

module.exports = router;