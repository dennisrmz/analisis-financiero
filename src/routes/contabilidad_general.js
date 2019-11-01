const express = require('express');
const router = express.Router();

const pool = require('../database');

//--------------------------------------------------------------ELI----------------------------------------------------------------------------
router.get('/', (req, res) => {
        res.render('contabilidad_general/index_contabilidad');
});
//-----------------------------------------------------------TRANSACCION-----------------------------------------------------------------------
//mostrar transacciones
router.get('/transaccion', async (req, res) => {
        const transaccion = await pool.query('SELECT * FROM transaccion INNER JOIN tipotransaccion ON transaccion.CODIGO_TIPO_TRANSACCION = tipotransaccion.CODIGO_TIPO_TRANSACCION');
        res.render('contabilidad_general/listar_transacciones', {transaccion});
});
//---------------------------------------------------------------------------------------------------------------------------------------------
//agregar transacciones GET y POST
router.get('/transaccion/agregar_transaccion/', async (req, res, next) => {
        const cuenta_padre = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 3');
        var subcuenta = subcuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 4');
        //subcuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 4 AND CODIGO_CUENTA_PADRE = ? ', ID_CUENTA);
        const sub_subcuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 5');
        const tipo_transaccion = await pool.query('SELECT * FROM tipotransaccion');
        const periodo_contables = await pool.query('SELECT FECHAINICIO_PERIODO FROM periodocontable LIMIT 1');
        console.log({periodo_contable: periodo_contables[0]});
        res.render('contabilidad_general/agregar_transaccion', {cuenta_padre, subcuenta, sub_subcuenta, tipo_transaccion, periodo_contable: periodo_contables[0]});
});
router.post('/transaccion/agregar_transaccion', async (req, res, next) => {
        const { ID_CUENTA, MONTO_CARGO, MONTO_ABONO, CODIGO_TIPO_TRANSACCION, MONTO_TRANSACCION, DESCRIPCION_TRANSACCION, FECHA_TRANSACCION} = req.body;
        var ID_CUENTA_NUM = ID_CUENTA.split(',').map(Number);
        var MONTO_CARGO_NUM = MONTO_CARGO.split(',').map(Number);
        var MONTO_ABONO_NUM = MONTO_ABONO.split(',').map(Number);
        var cantidad = ID_CUENTA_NUM.length;
        
        //Insertar transaccion realizada
        const new_transaccion = {
                CODIGO_TIPO_TRANSACCION, 
                MONTO_TRANSACCION, 
                DESCRIPCION_TRANSACCION, 
                FECHA_TRANSACCION
        };
        console.log(new_transaccion);
        await pool.query('INSERT INTO transaccion set ?', [ new_transaccion ]);
        console.log('Fila insertada correctamente de transaccion');

        //Insertar los movimientos realizados en una transaccion
        const id_transaccion = await pool.query('SELECT ID_TRANSACCION FROM transaccion ORDER BY ID_TRANSACCION DESC LIMIT 1');
        for(var k = 0; k<cantidad-1; k++){
                var new_movimiento = {
                        ID_CUENTA:ID_CUENTA_NUM[k],  
                        MONTO_CARGO:MONTO_CARGO_NUM[k], 
                        MONTO_ABONO:MONTO_ABONO_NUM[k],
                        ID_TRANSACCION:id_transaccion[0].ID_TRANSACCION
                };
                console.log(new_movimiento);
                await pool.query('INSERT INTO movimiento set ?', [ new_movimiento ]);
                console.log('Fila insertada correctamente de movimiento:'+k);
        }
        //req.flash('success', 'Registro guardado correctamente');
        res.redirect('/contabilidad_general/transaccion');
});
//----------------------------------------------------------LLENAR SELECT----------------------------------------------------------------------------------
//Llenar select subcuenta
router.get('/transaccion/agregar_transaccion/select_subcuenta/:ID_CUENTA', async (req, res, next) => {
        const {ID_CUENTA} = req.params;
        const subcuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 4 AND CODIGO_CUENTA_PADRE = ? ', ID_CUENTA);
        console.log({subcuenta});
        res.render('contabilidad_general/select_subcuenta', {subcuenta});
});
//Llenar select sub_subcuenta
router.get('/transaccion/agregar_transaccion/select_subsubcuenta/:CODIGO_CUENTA', async (req, res, next) => {
        const {CODIGO_CUENTA} = req.params;
        const ID_CUENTA_S = await pool.query('SELECT ID_CUENTA FROM cuenta WHERE CODIGO_CUENTA = ? ', CODIGO_CUENTA);
        const sub_subcuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 5 AND CODIGO_CUENTA_PADRE = ? ', ID_CUENTA_S[0].ID_CUENTA);
        console.log({sub_subcuenta});
        res.render('contabilidad_general/select_subsubcuenta', {sub_subcuenta});
});
//-------------------------------------------------------PERIODO CONTABLE---------------------------------------------------------------------
//mostrar periodo contable
router.get('/periodo_contable', async (req, res) => {
        const periodocontable = await pool.query('SELECT ID_PERIODOCONTABLE, FECHAINICIO_PERIODO, FECHAFINAL_PERIODO FROM periodocontable');
        res.render('contabilidad_general/listar_periodo_contable', { periodocontable });
});
//-------------------------------------------------------------------------------------------------------------------------------------------------
//agregar periodo contable GET y POST
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
//----------------------------------------------------------CATALOGO-----------------------------------------------------------------------------
//Listar catalogo en un dataTable
router.get('/catalogo', async (req, res, next) => {
        const cuenta = await pool.query('SELECT * FROM cuenta INNER JOIN naturaleza ON cuenta.ID_NATURALEZA_CUENTA=naturaleza.ID_NATURALEZA_CUENTA');
        //const cuenta = await pool.query('SELECT * FROM cuenta');
        res.render('contabilidad_general/listar_catalogo', {cuenta});
});
//------------------------------------------------------------------------------------------------------------------------------------------------------
//mostrar cuenta de catalago en Input
router.get('/catalogo/ver_cuenta/:ID_CUENTA', async (req, res) => {
        const { ID_CUENTA } = req.params;
        const cuentas = await pool.query('SELECT * FROM cuenta INNER JOIN naturaleza ON cuenta.ID_NATURALEZA_CUENTA=naturaleza.ID_NATURALEZA_CUENTA WHERE ID_CUENTA = ?', [ ID_CUENTA ]);
        console.log(cuentas);
        res.render('contabilidad_general/mostrar_cuenta', {cuenta: cuentas[0]});
});
//-------------------------------------------------------------------------------------------------------------------------------------------------------
//agregar cuenta padre a catalogo GET y POST
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
                console.log('Fila insertada de cuenta padre:' + results.affectedRows);
                res.redirect('/contabilidad_general/catalogo');
        });
});
//------------------------------------------------------------------------------------------------------------------------------------------------
//agregar sub cuenta de la cuenta padre a catalogo GET y POST
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
        console.log({ CODIGO_CUENTA_PADRE, CODIGO_CUENTA_PADRE_SELEC, CODIGO_CUENTA, NOMBRE_CUENTA, ID_NATURALEZA_CUENTA, NIVELH });
        //res.send('recibido');
        await pool.query('INSERT INTO cuenta set ?', [ new_cuenta ], (err, results, fields) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log('Fila insertada de subcuenta:' + results.affectedRows);
               res.redirect('/contabilidad_general/catalogo');
        });
});
//------------------------------------------------------------------------------------------------------------------------------------------
//agregar sub cuenta de la sub cuenta de la cuenta padre a catalogo GET y POST
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
        console.log({ CODIGO_CUENTA_PADRE, CODIGO_CUENTA_RUBRO_SELEC, CODIGO_CUENTA_PADRE_SELEC, CODIGO_CUENTA, NOMBRE_CUENTA, ID_NATURALEZA_CUENTA, NIVELH });
        await pool.query('INSERT INTO cuenta set ?', [ new_cuenta ], (err, results, fields) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log('Fila insertada de sub subcuenta:' + results.affectedRows);
               res.redirect('/contabilidad_general/catalogo');
        });
});
//-------------------------------------------------------Ejemplo-------------------------------------------------------------------------------
router.get('/ajax', function(req, res){
        res.render('contabilidad_general/ajax', {title: 'An Ajax Example', quote: "AJAX is great!"});
});
router.post('/ajax', function(req, res){
        res.render('contabilidad_general/ajax', {title: 'An Ajax Example', quote: req.body.quote});
});

module.exports = router;