const express = require('express');
const router = express.Router();

const pool = require('../database');

//--------------------------------------------------------------ELI----------------------------------------------------------------------------
router.get('/', (req, res) => {
        res.render('contabilidad_general/index_contabilidad');
});
//-------------------------------------------------------PERIODO CONTABLE---------------------------------------------------------------------
//Listar periodo contable
router.get('/periodo_contable', async (req, res) => {
        const periodocontable = await pool.query("SELECT ID_PERIODOCONTABLE, DATE_FORMAT(FECHAINICIO_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO, DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO_FINAL FROM periodocontable");
        res.render('contabilidad_general/listar_periodo_contable', { periodocontable });
});
//-------------------------------------------------------------------------------------------------------------------------------------------------
//agregar periodo contable GET y POST
router.get('/periodo_contable/agregar_periodo', (req, res) => {
        res.render('contabilidad_general/agregar_periodo_contable');
});
router.post('/periodo_contable/agregar_periodo', async (req, res) => {
        const { fecha } = req.body;
        await pool.query('INSERT INTO periodocontable (FECHAINICIO_PERIODO) VALUES (?)', [fecha]);
        res.redirect('/contabilidad_general/periodo_contable');
});
//-----------------------------------------------------------TRANSACCION-----------------------------------------------------------------------
//Listar transacciones
router.get('/transaccion', async (req, res) => {
        const transaccion = await pool.query("SELECT transaccion.ES_AJUSTE, transaccion.ID_TRANSACCION, DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%d-%m-%Y') "+
        "AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION FROM "+
        "transaccion INNER JOIN tipotransaccion ON transaccion.CODIGO_TIPO_TRANSACCION = tipotransaccion.CODIGO_TIPO_TRANSACCION");
        res.render('contabilidad_general/listar_transacciones', {transaccion});
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
        //const movimientos = await pool.query("SELECT DATE_FORMAT(movimiento.FECHA_MOVIMIENTO, '%Y-%m-%d') AS FECHA_MOVIMIENTO_FORMATO, movimiento.DETALLE_MOVIMIENTO, movimiento.MONTO_CARGO, movimiento.MONTO_ABONO, cuenta.NOMBRE_CUENTA FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        res.render('contabilidad_general/mostrar_transaccion', {transaccion: transacciones[0], movimientos});
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
                const { ID_CUENTA, FECHA_MOVIMIENTO, DETALLE_MOVIMIENTO, MONTO_CARGO, MONTO_ABONO, CODIGO_TIPO_TRANSACCION, MONTO_TRANSACCION, DESCRIPCION_TRANSACCION, FECHA_TRANSACCION, FECHAINICIO_PERIODO, ES_AJUSTE, ID_TRANSACCION_AJUSTE} = req.body;
                var ID_CUENTA_NUM = ID_CUENTA.split(',').map(Number);
                var MONTO_CARGO_NUM = MONTO_CARGO.split(',').map(Number);
                var MONTO_ABONO_NUM = MONTO_ABONO.split(',').map(Number);
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
                        ID_TRANSACCION_AJUSTE
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
                        DETALLE_MOVIMIENTO,  
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
        //const periodo_final = await pool.query("SELECT DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO_FINAL FROM periodocontable ORDER BY ID_PERIODOCONTABLE DESC LIMIT 1");
        //console.log(periodo_final[0] );
        //console.log("hola");
        //if(periodo_final[0] != null){
                const periodo = await pool.query("SELECT DATE_FORMAT(FECHAINICIO_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO, DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') "+
                "AS FECHA_PERIODO_FINAL FROM periodocontable ORDER BY ID_PERIODOCONTABLE DESC LIMIT 1");
                const transaccion = await pool.query("SELECT transaccion.ES_AJUSTE, transaccion.ID_TRANSACCION, DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%d-%m-%Y') "+
                "AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION FROM "+
                "transaccion INNER JOIN tipotransaccion ON transaccion.CODIGO_TIPO_TRANSACCION = tipotransaccion.CODIGO_TIPO_TRANSACCION");
                //const transaccion_con_ajuste = await pool.query("SELECT transaccion.ES_AJUSTE, transaccion.ID_TRANSACCION, DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%d-%m-%Y') AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION, tipoajuste.NOMBRE_TIPO_AJUSTE, transaccion.DESCRIPCION_TRANSACCION FROM transaccion INNER JOIN tipoajuste ON transaccion.CODIGO_TIPO_AJUSTE = tipoajuste.CODIGO_TIPO_AJUSTE");
                res.render('contabilidad_general/listar_asiento_ajuste', {transaccion, periodos:periodo[0]});
        //}
        
});
//Mostrar ajuste de transaccion
router.get('/asiento_ajuste/ver_ajuste/:ID_TRANSACCION', async (req, res) => {
        const {ID_TRANSACCION} = req.params;
        const transacciones = await pool.query("SELECT ID_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION, "+
        "DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%Y-%m-%d') AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION FROM transaccion INNER JOIN "+
        "tipotransaccion ON transaccion.CODIGO_TIPO_TRANSACCION=tipotransaccion.CODIGO_TIPO_TRANSACCION WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const transacciones_ajustes = await pool.query("SELECT tipoajuste.NOMBRE_TIPO_AJUSTE, transaccionajuste.DESCRIPCION_TRANSACCION_AJUSTE, "+
        "DATE_FORMAT(transaccionajuste.FECHA_TRANSACCION_AJUSTE, '%Y-%m-%d') AS FECHA_TRANSACCION_FORMATO_AJUSTE, transaccionajuste.MONTO_TRANSACCION_AJUSTE "+
        "FROM transaccionajuste INNER JOIN tipoajuste ON transaccionajuste.CODIGO_TIPO_AJUSTE=tipoajuste.CODIGO_TIPO_AJUSTE INNER JOIN transaccion ON transaccion.ID_TRANSACCION_AJUSTE = transaccionajuste.ID_TRANSACCION_AJUSTE WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const movimientos = await pool.query("SELECT DATE_FORMAT(movimiento.FECHA_MOVIMIENTO, '%Y-%m-%d') AS FECHA_MOVIMIENTO_FORMATO, movimiento.DETALLE_MOVIMIENTO, "+
        "movimiento.MONTO_CARGO, movimiento.MONTO_ABONO, cuenta.NOMBRE_CUENTA FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        res.render('contabilidad_general/mostrar_ajuste', {transaccion: transacciones[0], movimientos, transacciones_ajuste: transacciones_ajustes[0]});
});
//agregar ajuste a transacciones GET y POST
router.get('/asiento_ajuste/agregar_ajuste/:ID_TRANSACCION', async (req, res) => {
        const {ID_TRANSACCION} = req.params;
        const tipoajuste = await pool.query("SELECT * FROM tipoajuste");
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
router.post('/asiento_ajuste/agregar_ajuste/:ID_TRANSACCION', async (req, res, next) => {
        const { ID_TRANSACCION } = req.params;
        const { ES_AJUSTE, ID_CUENTA, FECHA_MOVIMIENTO, DETALLE_MOVIMIENTO, MONTO_CARGO, MONTO_ABONO, CODIGO_TIPO_AJUSTE, MONTO_TRANSACCION_AJUSTE, DESCRIPCION_TRANSACCION_AJUSTE, FECHA_TRANSACCION_AJUSTE} = req.body;
        var ID_CUENTA_NUM = ID_CUENTA.split(',').map(Number);
        var MONTO_CARGO_NUM = MONTO_CARGO.split(',').map(Number);
        var MONTO_ABONO_NUM = MONTO_ABONO.split(',').map(Number);
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
for(var k = 0; k<cantidad-1; k++){
        var new_movimiento = {
                ID_CUENTA:ID_CUENTA_NUM[k],
                FECHA_MOVIMIENTO,
                DETALLE_MOVIMIENTO,  
                MONTO_CARGO:MONTO_CARGO_NUM[k], 
                MONTO_ABONO:MONTO_ABONO_NUM[k],
                ID_TRANSACCION,
                ID_TRANSACCION_AJUSTE: id_transaccion_ajuste[0].ID_TRANSACCION_AJUSTE
        };
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
        const cuenta = await pool.query('SELECT * FROM cuenta');
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

//-------------------------------------------------------Ejemplo-------------------------------------------------------------------------------
router.get('/ajax', function(req, res){
        res.render('contabilidad_general/ajax', {title: 'An Ajax Example', quote: "AJAX is great!"});
});
router.post('/ajax', function(req, res){
        res.render('contabilidad_general/ajax', {title: 'An Ajax Example', quote: req.body.quote});
});

router.get('/ejemplo', function(req, res){
        res.render('contabilidad_general/ejemplo', {title: 'An Ajax Example', quote: req.body.quote});
});

module.exports = router;