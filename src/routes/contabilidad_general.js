const express = require('express');
const router = express.Router();

const pool = require('../database');

//--------------------------------------------------------------ELI----------------------------------------------------------------------------
router.get('/', async (req, res) => {
        const periodo_finals = await pool.query("SELECT DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO_FINAL FROM periodocontable ORDER BY ID_PERIODOCONTABLE DESC LIMIT 1");
        console.log(periodo_finals[0].FECHA_PERIODO_FINAL );
        res.render('contabilidad_general/index_contabilidad', {periodo_final: periodo_finals[0]});
});
//-------------------------------------------------------PERIODO CONTABLE---------------------------------------------------------------------
//Listar periodo contable
router.get('/periodo_contable', async (req, res, next) => {
        const periodo_finals = await pool.query("SELECT DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO_FINAL FROM periodocontable "+
        "ORDER BY ID_PERIODOCONTABLE DESC LIMIT 1");
        const periodocontable = await pool.query("SELECT ID_PERIODOCONTABLE, DATE_FORMAT(FECHAINICIO_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO, "+
        "DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO_FINAL FROM periodocontable");
        res.render('contabilidad_general/listar_periodo_contable', { periodocontable , periodo_final: periodo_finals[0]});
});
//-------------------------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------TRANSACCION-----------------------------------------------------------------------
//Listar transacciones
router.get('/transaccion', async (req, res) => {
        const periodo1 = await pool.query("SELECT ID_PERIODOCONTABLE, DATE_FORMAT(FECHAFINAL_PERIODO, '%Y/%m/%d') AS FECHA_PERIODO_FINAL FROM periodocontable ORDER BY "+
        "ID_PERIODOCONTABLE DESC LIMIT 1");
        const periodocontable = await pool.query("SELECT ID_PERIODOCONTABLE, DATE_FORMAT(FECHAINICIO_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO, "+
        "DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO_FINAL FROM periodocontable");
        res.render('contabilidad_general/listar_transacciones', {periodocontable , periodo: periodo1[0]});
});
router.post('/transaccion', async (req, res, next) => {
        const { FECHAFINAL_PERIODO, ID_PERIODOCONTABLE} = req.body;
        console.log(ID_PERIODOCONTABLE);
        console.log(FECHAFINAL_PERIODO);
        await pool.query('UPDATE periodocontable SET FECHAFINAL_PERIODO = ? WHERE ID_PERIODOCONTABLE = ?', [ FECHAFINAL_PERIODO, ID_PERIODOCONTABLE ]);
        console.log('Fila actualizada correctamente de periodocontable');
        res.redirect('/contabilidad_general');
});
//Mostrar transaccion
router.get('/transaccion/ver_transaccion/:ID_TRANSACCION', async (req, res) => {
        const {ID_TRANSACCION} = req.params;
        const ID_TRANSACCION_AJUSTE = 0;
        const transacciones = await pool.query("SELECT ID_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION, "+
        "DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%Y-%m-%d') AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION FROM transaccion INNER JOIN tipotransaccion "+
        "ON transaccion.CODIGO_TIPO_TRANSACCION=tipotransaccion.CODIGO_TIPO_TRANSACCION WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const movimientos = await pool.query("SELECT DATE_FORMAT(movimiento.FECHA_MOVIMIENTO, '%Y-%m-%d') AS FECHA_MOVIMIENTO_FORMATO, movimiento.DETALLE_MOVIMIENTO, "+
        "movimiento.MONTO_CARGO, movimiento.MONTO_ABONO, cuenta.NOMBRE_CUENTA FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ? AND movimiento.ID_TRANSACCION_AJUSTE = ?", [ID_TRANSACCION, ID_TRANSACCION_AJUSTE]);
        res.render('contabilidad_general/mostrar_transaccion', {transaccion: transacciones[0], movimientos});
});
//Mostrar transaccion con impuesto
router.get('/transaccion/ver_transaccion_impuesto/:ID_TRANSACCION/:ES_IMPUESTO', async (req, res) => {
        const {ID_TRANSACCION, ES_IMPUESTO} = req.params;
        const ID_TRANSACCION_AJUSTE = 0;
        const transacciones = await pool.query("SELECT transaccion.MONTO_IMPUESTO, transaccion.ID_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION, "+
        "DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%Y-%m-%d') AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION FROM transaccion "+
        "INNER JOIN tipotransaccion ON transaccion.CODIGO_TIPO_TRANSACCION=tipotransaccion.CODIGO_TIPO_TRANSACCION WHERE transaccion.ID_TRANSACCION = "+[ID_TRANSACCION]+" AND transaccion.ES_IMPUESTO = 'SI'", [ES_IMPUESTO]);
        const movimientos = await pool.query("SELECT DATE_FORMAT(movimiento.FECHA_MOVIMIENTO, '%Y-%m-%d') AS FECHA_MOVIMIENTO_FORMATO, movimiento.DETALLE_MOVIMIENTO, "+
        "movimiento.MONTO_CARGO, movimiento.MONTO_ABONO, cuenta.NOMBRE_CUENTA FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ? AND movimiento.ID_TRANSACCION_AJUSTE = ?", [ID_TRANSACCION, ID_TRANSACCION_AJUSTE]);
        res.render('contabilidad_general/mostrar_transaccion_impuesto', {transaccion: transacciones[0], movimientos});
});
//---------------------------------------------------------------------------------------------------------------------------------------------
//agregar transacciones GET y POST
router.get('/transaccion/agregar_transaccion/', async (req, res, next) => {
        const cuenta_padre = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 3');
        const tipo_transaccion = await pool.query('SELECT * FROM tipotransaccion');
        const periodo_contable = await pool.query("SELECT DATE_FORMAT(FECHAINICIO_PERIODO, '%Y/%m/%d') AS FECHA_PERIODO FROM periodocontable ORDER BY "+
        "ID_PERIODOCONTABLE DESC LIMIT 1");
        const idperiodo_contable = await pool.query("SELECT ID_PERIODOCONTABLE FROM periodocontable ORDER BY ID_PERIODOCONTABLE DESC LIMIT 1");
        res.render('contabilidad_general/agregar_transaccion', {cuenta_padre, tipo_transaccion, idperiodo:idperiodo_contable[0], periodo:periodo_contable[0]});
});
router.post('/transaccion/agregar_transaccion', async (req, res, next) => {
        const { ID_CUENTA, FECHA_MOVIMIENTO, DETALLE_MOVIMIENTO, MONTO_CARGO, MONTO_ABONO, CODIGO_TIPO_TRANSACCION, MONTO_TRANSACCION, DESCRIPCION_TRANSACCION, FECHA_TRANSACCION, FECHAINICIO_PERIODO, ES_AJUSTE, ID_TRANSACCION_AJUSTE, ES_IMPUESTO, MONTO_IMPUESTO, INTERES_MES, PLAZO_MES, PLAZO_ANIO} = req.body;
        var ID_CUENTA_NUM = ID_CUENTA.split(',').map(Number);
        var MONTO_CARGO_NUM = MONTO_CARGO.split(',').map(Number);
        var MONTO_ABONO_NUM = MONTO_ABONO.split(',').map(Number);
        var DETALLE_MOV = DETALLE_MOVIMIENTO.split(',');
        var cantidad = ID_CUENTA_NUM.length;
        const ID_PERIODOCONTABLE_k = await pool.query("SELECT ID_PERIODOCONTABLE FROM periodocontable WHERE FECHAINICIO_PERIODO = '"+FECHAINICIO_PERIODO+"'");
                
        //Insertar transaccion realizada
        const new_transaccion = {
                CODIGO_TIPO_TRANSACCION, 
                MONTO_TRANSACCION, 
                DESCRIPCION_TRANSACCION, 
                FECHA_TRANSACCION,
                ID_PERIODOCONTABLE: ID_PERIODOCONTABLE_k[0].ID_PERIODOCONTABLE,
                ES_AJUSTE,
                ID_TRANSACCION_AJUSTE,
                ES_IMPUESTO, 
                MONTO_IMPUESTO,
                INTERES_MES,
                PLAZO_MES, 
                PLAZO_ANIO
        };
        console.log({new_transaccion});
        await pool.query('INSERT INTO transaccion set ?', [ new_transaccion ]);
        console.log('Fila insertada correctamente de transaccion');

        //Insertar los movimientos realizados en una transaccion
        const id_transaccion = await pool.query('SELECT ID_TRANSACCION FROM transaccion ORDER BY ID_TRANSACCION DESC LIMIT 1');
        for(var k = 0; k<cantidad-1; k++){
                var new_movimiento = {
                        ID_CUENTA:ID_CUENTA_NUM[k],
                        FECHA_MOVIMIENTO,
                        DETALLE_MOVIMIENTO:DETALLE_MOV[k],
                        MONTO_CARGO:MONTO_CARGO_NUM[k], 
                        MONTO_ABONO:MONTO_ABONO_NUM[k],
                        ID_TRANSACCION:id_transaccion[0].ID_TRANSACCION,
                        ID_TRANSACCION_AJUSTE
                };
                await pool.query('INSERT INTO movimiento set ?', [ new_movimiento ]);
                console.log('Fila insertada correctamente de movimiento:'+k);
        }
        //req.flash('success', 'Registro guardado correctamente');
        res.redirect('/contabilidad_general/transaccion');
});
//---------------------------------------------------------------ASIENTO-DE-AJUSTE----------------------------------------------------------------
//listar transacciones para posteriormente realizarle ajuste
router.get('/asiento_ajuste', async (req, res, next) => {
        const periodo = await pool.query("SELECT ID_PERIODOCONTABLE, DATE_FORMAT(FECHAINICIO_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO, "+
        "DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO_FINAL FROM periodocontable");
        res.render('contabilidad_general/listar_asiento_ajuste', {periodo});
});
//Mostrar sin ajuste de transaccion
router.get('/asiento_ajuste/ver_sin_ajuste/:ID_TRANSACCION', async (req, res) => {
        const {ID_TRANSACCION} = req.params;
        const ID_TRANSACCION_AJUSTE = 0;
        const transacciones = await pool.query("SELECT ID_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION, "+
        "DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%Y-%m-%d') AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION FROM transaccion INNER JOIN tipotransaccion "+
        "ON transaccion.CODIGO_TIPO_TRANSACCION=tipotransaccion.CODIGO_TIPO_TRANSACCION WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const movimientos = await pool.query("SELECT DATE_FORMAT(movimiento.FECHA_MOVIMIENTO, '%Y-%m-%d') AS FECHA_MOVIMIENTO_FORMATO, movimiento.DETALLE_MOVIMIENTO, "+
        "movimiento.MONTO_CARGO, movimiento.MONTO_ABONO, cuenta.NOMBRE_CUENTA FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ? AND movimiento.ID_TRANSACCION_AJUSTE = ?", [ID_TRANSACCION, ID_TRANSACCION_AJUSTE]);
        res.render('contabilidad_general/mostrar_sin_ajuste', {transaccion: transacciones[0], movimientos});
});
//Mostrar con ajuste de transaccion
router.get('/asiento_ajuste/ver_ajuste/:ID_TRANSACCION', async (req, res) => {
        const {ID_TRANSACCION} = req.params;
        const transacciones = await pool.query("SELECT ID_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION, "+
        "DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%Y-%m-%d') AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION FROM transaccion INNER JOIN "+
        "tipotransaccion ON transaccion.CODIGO_TIPO_TRANSACCION=tipotransaccion.CODIGO_TIPO_TRANSACCION WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const transacciones_ajustes = await pool.query("SELECT tipoajuste.NOMBRE_TIPO_AJUSTE, transaccionajuste.DESCRIPCION_TRANSACCION_AJUSTE, "+
        "DATE_FORMAT(transaccionajuste.FECHA_TRANSACCION_AJUSTE, '%Y-%m-%d') AS FECHA_TRANSACCION_FORMATO_AJUSTE, transaccionajuste.MONTO_TRANSACCION_AJUSTE "+
        "FROM transaccionajuste INNER JOIN tipoajuste ON transaccionajuste.CODIGO_TIPO_AJUSTE=tipoajuste.CODIGO_TIPO_AJUSTE INNER JOIN transaccion ON "+
        "transaccion.ID_TRANSACCION_AJUSTE=transaccionajuste.ID_TRANSACCION_AJUSTE WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const movimientos = await pool.query("SELECT DATE_FORMAT(movimiento.FECHA_MOVIMIENTO, '%Y-%m-%d') AS FECHA_MOVIMIENTO_FORMATO, movimiento.DETALLE_MOVIMIENTO, "+
        "movimiento.MONTO_CARGO, movimiento.MONTO_ABONO, cuenta.NOMBRE_CUENTA FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        res.render('contabilidad_general/mostrar_ajuste', {transaccion: transacciones[0], movimientos, transacciones_ajuste: transacciones_ajustes[0]});
});
//agregar ajuste a transacciones GET y POST
router.get('/asiento_ajuste/agregar_ajuste/:ID_TRANSACCION/:NOMBRE_TIPO_TRANSACCION/:MONTO_TRANSACCION', async (req, res) => {
        const {ID_TRANSACCION, NOMBRE_TIPO_TRANSACCION, MONTO_TRANSACCION} = req.params;
        var NOMBRE_TIPO_TRANSACCION_SE = NOMBRE_TIPO_TRANSACCION.replace(/_/g," ");
        var tipoajuste = "";
        var monto = 0;
        if(NOMBRE_TIPO_TRANSACCION_SE == "PAGO DE ALQUILER" || NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE SEGURO"){
                tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 1");
        }else{
                if(NOMBRE_TIPO_TRANSACCION_SE == "PRESTAMO BANCARIO" || NOMBRE_TIPO_TRANSACCION_SE == "PAGO DE PLANILLA"){
                        tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 2");
                }else{
                        if(NOMBRE_TIPO_TRANSACCION_SE == "PRESTAMO A UN EMPLEADO"){
                                tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 3");
                        }
                }
        }
        const cuenta_padre = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 3');
        const transaccion = await pool.query("SELECT ID_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION, "+
        "DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%Y-%m-%d') AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION FROM transaccion "+
        "INNER JOIN tipotransaccion ON transaccion.CODIGO_TIPO_TRANSACCION=tipotransaccion.CODIGO_TIPO_TRANSACCION WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const movimientos = await pool.query("SELECT DATE_FORMAT(movimiento.FECHA_MOVIMIENTO, '%Y-%m-%d') AS FECHA_MOVIMIENTO_FORMATO, movimiento.DETALLE_MOVIMIENTO, "+
        "movimiento.MONTO_CARGO, movimiento.MONTO_ABONO, cuenta.NOMBRE_CUENTA FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const count = await pool.query("SELECT count(*) FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        res.render('contabilidad_general/agregar_ajuste', {tipoajuste, cuenta_padre, transaccions:transaccion[0], movimientos, count});
});
router.post('/asiento_ajuste/agregar_ajuste/:ID_TRANSACCION/:NOMBRE_TIPO_TRANSACCION/:MONTO_TRANSACCION', async (req, res, next) => {
        const { ID_TRANSACCION, NOMBRE_TIPO_TRANSACCION, MONTO_TRANSACCION } = req.params;
        const { ES_AJUSTE, ID_CUENTA, FECHA_MOVIMIENTO, DETALLE_MOVIMIENTO, MONTO_CARGO, MONTO_ABONO, CODIGO_TIPO_AJUSTE, MONTO_TRANSACCION_AJUSTE, DESCRIPCION_TRANSACCION_AJUSTE, FECHA_TRANSACCION_AJUSTE} = req.body;
        var ID_CUENTA_NUM = ID_CUENTA.split(',').map(Number);
        var MONTO_CARGO_NUM = MONTO_CARGO.split(',').map(Number);
        var MONTO_ABONO_NUM = MONTO_ABONO.split(',').map(Number);
        var DETALLE_MOV = DETALLE_MOVIMIENTO.split(',');
        var cantidad = ID_CUENTA_NUM.length;
        
        //Insertar transaccion realizada
        const new_transaccion_ajuste = {
                CODIGO_TIPO_AJUSTE, 
                MONTO_TRANSACCION_AJUSTE, 
                DESCRIPCION_TRANSACCION_AJUSTE, 
                FECHA_TRANSACCION_AJUSTE
        };
        console.log({new_transaccion_ajuste});
        await pool.query('INSERT INTO transaccionajuste set ?', [ new_transaccion_ajuste ]);
        console.log('Fila insertada correctamente de transaccion');

//Insertar los movimientos realizados en una transaccion
const id_transaccion_ajuste = await pool.query('SELECT ID_TRANSACCION_AJUSTE FROM transaccionajuste ORDER BY ID_TRANSACCION_AJUSTE DESC LIMIT 1');
await pool.query("UPDATE transaccion SET ID_TRANSACCION_AJUSTE = ?, ES_AJUSTE = ? WHERE ID_TRANSACCION = ? ", [id_transaccion_ajuste[0].ID_TRANSACCION_AJUSTE, ES_AJUSTE, ID_TRANSACCION]);
const ID_TRANSACCION_AJUSTE = id_transaccion_ajuste[0].ID_TRANSACCION_AJUSTE;
for(var k = 0; k<cantidad-1; k++){
        var new_movimiento = {
                ID_CUENTA:ID_CUENTA_NUM[k],
                FECHA_MOVIMIENTO,
                DETALLE_MOVIMIENTO:DETALLE_MOV[k], 
                MONTO_CARGO:MONTO_CARGO_NUM[k], 
                MONTO_ABONO:MONTO_ABONO_NUM[k],
                ID_TRANSACCION,
                ID_TRANSACCION_AJUSTE
        };
        console.log(new_movimiento);
        await pool.query('INSERT INTO movimiento set ?', [ new_movimiento ]);
        console.log('Fila insertada correctamente de movimiento:'+k);
}
//req.flash('success', 'Registro guardado correctamente');
res.redirect('/contabilidad_general/asiento_ajuste');
});
//----------------------------------------------------------CATALOGO-----------------------------------------------------------------------------
//Listar catalogo en un dataTable
router.get('/catalogo', async (req, res, next) => {
        //const cuenta = await pool.query('SELECT * FROM cuenta INNER JOIN naturaleza ON cuenta.ID_NATURALEZA_CUENTA=naturaleza.ID_NATURALEZA_CUENTA');
        const cuenta = await pool.query("SELECT cuenta.ID_CUENTA, cuenta.ID_NATURALEZA_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, "+
        "naturaleza.TIPO_NATURALEZA_CUETA FROM cuenta INNER JOIN naturaleza ON cuenta.ID_NATURALEZA_CUENTA=naturaleza.ID_NATURALEZA_CUENTA "+
        "ORDER BY cuenta.ID_CUENTA");
        res.render('contabilidad_general/listar_catalogo', {cuenta});
});
//------------------------------------------------------------------------------------------------------------------------------------------------------
//mostrar cuenta de catalago en DataTable
router.get('/catalogo/ver_cuenta/:ID_CUENTA', async (req, res) => {
        const { ID_CUENTA } = req.params;
        const cuentas = await pool.query('SELECT * FROM cuenta INNER JOIN naturaleza ON cuenta.ID_NATURALEZA_CUENTA=naturaleza.ID_NATURALEZA_CUENTA '+
        'WHERE ID_CUENTA = ?', [ ID_CUENTA ]);
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
        const naturaleza = await pool.query('SELECT * FROM naturaleza');
        res.render('contabilidad_general/agregar_subcuenta', {rubro, naturaleza});
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
        const naturaleza = await pool.query('SELECT * FROM naturaleza');
        res.render('contabilidad_general/agregar_subsubcuenta', {rubro, naturaleza});
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
        await pool.query('INSERT INTO cuenta set ?', [ new_cuenta ], (err, results, fields) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log('Fila insertada de sub subcuenta:' + results.affectedRows);
               res.redirect('/contabilidad_general/catalogo');
        });
});
//----------------------------------------------------------LLENAR SELECT----------------------------------------------------------------------------------
//Llenar select cuenta
router.get('/select_cuenta/:ID_CUENTA', async (req, res, next) => {
        const {ID_CUENTA} = req.params;
        const cuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 3 AND CODIGO_CUENTA_PADRE = ? ', ID_CUENTA);
        res.render('contabilidad_general/select_cuenta', {cuenta});
});
//Llenar select subcuenta
router.get('/select_subcuenta/:ID_CUENTA', async (req, res, next) => {
        const {ID_CUENTA} = req.params;
        const subcuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 4 AND CODIGO_CUENTA_PADRE = ? ', ID_CUENTA);
        res.render('contabilidad_general/select_subcuenta', {subcuenta});
});
//Llenar select sub_subcuenta
router.get('/select_subsubcuenta/:ID_CUENTA', async (req, res, next) => {
        const {ID_CUENTA} = req.params;
        const sub_subcuenta = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 5 AND CODIGO_CUENTA_PADRE = ? ', [ID_CUENTA]);
        res.render('contabilidad_general/select_subsubcuenta', {sub_subcuenta});
});
//----------------------------------------------------------DATATABLE-------------------------------------------------------------------------
//Llenar tabla de transacciones de acuerdo la seleccion del periodo
router.get('/listar_transaccion_select/:ID_PERIODOCONTABLE', async (req, res, next) => {
        const { ID_PERIODOCONTABLE }=req.params;
        const periodo = await pool.query("SELECT DATE_FORMAT(FECHAINICIO_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO, DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') "+
        "AS FECHA_PERIODO_FINAL FROM periodocontable WHERE ID_PERIODOCONTABLE = ?", [ID_PERIODOCONTABLE]);
        const transaccion = await pool.query("SELECT transaccion.ES_IMPUESTO, transaccion.ES_AJUSTE, transaccion.ID_TRANSACCION, DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%d-%m-%Y') "+
        "AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION "+
        "FROM transaccion INNER JOIN tipotransaccion ON transaccion.CODIGO_TIPO_TRANSACCION = tipotransaccion.CODIGO_TIPO_TRANSACCION INNER JOIN periodocontable ON "+
        "periodocontable.ID_PERIODOCONTABLE=transaccion.ID_PERIODOCONTABLE WHERE periodocontable.ID_PERIODOCONTABLE = ?",[ID_PERIODOCONTABLE]);
        res.render('contabilidad_general/listar_transaccion_select', {transaccion, periodos:periodo[0]});
});
//Llenar tabla de transacciones de ajuste de acuerdo la seleccion del periodo
router.get('/listar_asiento_ajuste_select/:ID_PERIODOCONTABLE', async (req, res, next) => {
        const { ID_PERIODOCONTABLE }=req.params;
        const periodo = await pool.query("SELECT DATE_FORMAT(FECHAINICIO_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO, DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') "+
        "AS FECHA_PERIODO_FINAL FROM periodocontable WHERE ID_PERIODOCONTABLE = ?", [ID_PERIODOCONTABLE]);
        const transaccion = await pool.query("SELECT transaccion.ES_AJUSTE, transaccion.ID_TRANSACCION, DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%d-%m-%Y') AS FECHA_TRANSACCION_FORMATO, "+
        "transaccion.MONTO_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION FROM transaccion INNER JOIN "+
        "tipotransaccion ON transaccion.CODIGO_TIPO_TRANSACCION = tipotransaccion.CODIGO_TIPO_TRANSACCION INNER JOIN periodocontable ON "+
        "periodocontable.ID_PERIODOCONTABLE = ?", [ID_PERIODOCONTABLE]);
        res.render('contabilidad_general/listar_asiento_ajuste_select', {transaccion, periodos:periodo[0]});
});
router.get('/check_impuesto', (req, res) => {
        res.render('contabilidad_general/check_impuesto');
});
router.get('/input_interes_mes', (req, res) => {
        res.render('contabilidad_general/input_interes_mes');
});
router.get('/input_plazo_mes', (req, res) => {
        res.render('contabilidad_general/input_plazo_mes');
});
router.get('/input_plazo_a', (req, res) => {
        res.render('contabilidad_general/input_plazo_año');
});
router.get('/monto_impuesto/:monto_tran', async (req, res) => {
        const { monto_tran } = req.params;
        var monto = 0.13*[monto_tran];
        res.render('contabilidad_general/monto_impuesto', {monto});
});
//-------------------------------------------------------Ejemplo-------------------------------------------------------------------------------
router.get('/ajax', function(req, res){
        res.render('contabilidad_general/ajax', {title: 'An Ajax Example', quote: "AJAX is great!"});
});
router.post('/ajax', function(req, res){
        res.render('contabilidad_general/ajax', {title: 'An Ajax Example', quote: req.body.quote});
});

module.exports = router;