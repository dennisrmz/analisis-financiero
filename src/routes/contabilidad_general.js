const express = require('express');
const router = express.Router();

const pool = require('../database')

//-----------------------------------BALANCE DE COMPROBACION INICIAL-----------------------------------------------------
router.get('/estados_financieros/BALANCE_DE_COMPROBACION_INICIAL/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    const idioma = await pool.query('SET lc_time_names = "es_VE"');
    const periodoscontables = await pool.query('SELECT DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d") AS FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d") AS FECHAFINAL, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%M") AS MES, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%Y") AS ANIO ' +
    'FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ])
    const cuentas = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=?', [ID_ESTADOFINANCIERO]));
    const sumas_debe = await(pool.query('SELECT SUM(mayorizacion.MONTO_SALDO) AS DEBE FROM mayorizacion INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND mayorizacion.ES_SALDO_ACREEDOR="NO"', [ID_ESTADOFINANCIERO]));
    const sumas_haber = await(pool.query('SELECT SUM(mayorizacion.MONTO_SALDO) AS HABER FROM mayorizacion INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND mayorizacion.ES_SALDO_ACREEDOR="SI"', [ID_ESTADOFINANCIERO]));
    console.log({cuentas});
    console.log({sumas_debe});
    console.log({sumas_haber});
    res.render('contabilidad_general/balance_de_comprobacion_inicial', {estadofinanciero, periodocontable:periodoscontables[0], idioma, cuentas, suma_debe:sumas_debe[0], suma_haber:sumas_haber[0]});
});

//-----------------------------------BALANCE DE COMPROBACION---------------------------------------------------------
router.get('/estados_financieros/BALANCE_DE_COMPROBACION/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    const idioma = await pool.query('SET lc_time_names = "es_VE"');
    const periodoscontables = await pool.query('SELECT DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d") AS FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d") AS FECHAFINAL, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%M") AS MES, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%Y") AS ANIO ' +
    'FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ])
    const cuentas = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=?', [ID_ESTADOFINANCIERO]));
    const sumas_debe = await(pool.query('SELECT SUM(mayorizacion.MONTO_SALDO) AS DEBE FROM mayorizacion INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND mayorizacion.ES_SALDO_ACREEDOR="NO"', [ID_ESTADOFINANCIERO]));
    const sumas_haber = await(pool.query('SELECT SUM(mayorizacion.MONTO_SALDO) AS HABER FROM mayorizacion INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND mayorizacion.ES_SALDO_ACREEDOR="SI"', [ID_ESTADOFINANCIERO]));
    console.log({cuentas});
    console.log({sumas_debe});
    console.log({sumas_haber});
    res.render('contabilidad_general/balance_de_comprobacion', {estadofinanciero, periodocontable:periodoscontables[0], idioma, cuentas, suma_debe:sumas_debe[0], suma_haber:sumas_haber[0]});
});

//---------------------------------------BALANCE GENERAL---------------------------------------------------------
router.get('/estados_financieros/BALANCE_GENERAL/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    const idioma = await pool.query('SET lc_time_names = "es_VE"');
    const periodoscontables = await pool.query('SELECT DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d") AS FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d") AS FECHAFINAL, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%M") AS MES, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%Y") AS ANIO ' +
    'FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    const cuentas = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=?', [ID_ESTADOFINANCIERO]));
    const cuentas_activo = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "1%"', [ID_ESTADOFINANCIERO]));
    const cuentas_pasivo = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "2%"', [ID_ESTADOFINANCIERO]));
    const cuentas_patrimonio = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "3%"', [ID_ESTADOFINANCIERO]));
    console.log({cuentas});
    res.render('contabilidad_general/balance_general', {estadofinanciero, periodocontable:periodoscontables[0], idioma, cuentas, cuentas_activo, cuentas_pasivo, cuentas_patrimonio});
});


//--------------------------------------ESTADO DE RESULTADOS---------------------------------------------------------
router.get('/estados_financieros/ESTADO_DE_RESULTADOS/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    const idioma = await pool.query('SET lc_time_names = "es_VE"');
    const periodoscontables = await pool.query('SELECT DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d") AS FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d") AS FECHAFINAL, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%M") AS MES, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%Y") AS ANIO FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ])
    const cuentas_ingresos = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "51%"', [ID_ESTADOFINANCIERO]));
    const cuentas_gastos = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "4%"', [ID_ESTADOFINANCIERO]));
    res.render('contabilidad_general/estado_de_resultados', {estadofinanciero, periodocontable:periodoscontables[0], idioma, cuentas_ingresos, cuentas_gastos});
});

//----------------------------------------ESTADO DE CAPITAL---------------------------------------------------------
router.get('/estados_financieros/ESTADO_DE_CAPITAL/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    const idioma = await pool.query('SET lc_time_names = "es_VE"');
    const periodoscontables = await pool.query('SELECT DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d") AS FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d") AS FECHAFINAL, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%M") AS MES, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%Y") AS ANIO FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ])
    const cuentas_activo = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "1%"', [ID_ESTADOFINANCIERO]));
    const cuentas_pasivo = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "2%"', [ID_ESTADOFINANCIERO]));
    const cuentas_patrimonio = await(pool.query('SELECT cuenta.ID_CUENTA, cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.ID_MAYORIZACION, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "3%"', [ID_ESTADOFINANCIERO]));
    res.render('contabilidad_general/estado_de_capital', {estadofinanciero, periodocontable:periodoscontables[0], idioma});
});

//-------------------------------------ESTADO DE FLUJO DE EFECTIVO--------------------------------------------------
router.get('/estados_financieros/ESTADO_DE_FLUJO_DE_EFECTIVO/:ID_ESTADOFINANCIERO', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    const idioma = await pool.query('SET lc_time_names = "es_VE"');
    const periodoscontables = await pool.query('SELECT DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d") AS FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d") AS FECHAFINAL, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%M") AS MES, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%Y") AS ANIO FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ])
    res.render('contabilidad_general/estado_flujo_de_efectivo', {estadofinanciero, periodocontable:periodoscontables[0], idioma});
});

//------------------------------------------NOTAS EXPLICATIVAS------------------------------------------------------

//Mostrar listado de notas explicativas del estado financiero elegido
router.get('/estados_financieros/:NOMBRE_ESTADOFINANCIERO/:ID_ESTADOFINANCIERO/notas_explicativas/listado',async (req, res) => {
    const { NOMBRE_ESTADOFINANCIERO } = req.params;
    const { ID_ESTADOFINANCIERO } = req.params;
    const notasexplicativas = await pool.query('SELECT * FROM notaexplicativa INNER JOIN estadofinanciero ON ' +
    'notaexplicativa.ID_ESTADOFINANCIERO = estadofinanciero.ID_ESTADOFINANCIERO WHERE estadofinanciero.ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    console.log("ID_ESTADOFINANCIERO");
    console.log({ID_ESTADOFINANCIERO});
    res.render('contabilidad_general/listado_notas_explicativas', {notasexplicativas, ID_ESTADOFINANCIERO, NOMBRE_ESTADOFINANCIERO});
});
/*router.post('/estados_financieros/:NOMBRE_ESTADOFINANCIERO/:ID_ESTADOFINANCIERO/notas_explicativas/listado',async (req, res) => {
    //const { NOMBRE_ESTADOFINANCIERO } = req.params;
    const { ID_ESTADOFINANCIERO } = req.params;
    /*const notasexplicativas = await pool.query('SELECT * FROM notaexplicativa INNER JOIN estadofinanciero ON ' +
    'notaexplicativa.ID_ESTADOFINANCIERO = estadofinanciero.ID_ESTADOFINANCIERO WHERE estadofinanciero.ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);*/
    //console.log("ID_ESTADOFINANCIERO");
    //console.log({ID_ESTADOFINANCIERO});
    //res.render('contabilidad_general/listado_notas_explicativas', {notasexplicativas, ID_ESTADOFINANCIERO, NOMBRE_ESTADOFINANCIERO});
    //res.send('recibido');
//});

//Agregar Notas Explicativas
router.get('/estados_financieros/:NOMBRE_ESTADOFINANCIERO/:ID_ESTADOFINANCIERO/notas_explicativas/listado/agregar', (req, res) => {
    //const { ID_ESTADOFINANCIERO } = req.params;
    //console.log({ID_ESTADOFINANCIERO});
    res.render('contabilidad_general/agregar');
});

//prueba post notas explicativas
router.post('/estados_financieros/:NOMBRE_ESTADOFINANCIERO/:ID_ESTADOFINANCIERO/notas_explicativas/listado/agregar', async (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    const notasexplicativas = await pool.query('SELECT * FROM notaexplicativa INNER JOIN estadofinanciero ON ' +
    'notaexplicativa.ID_ESTADOFINANCIERO = estadofinanciero.ID_ESTADOFINANCIERO WHERE estadofinanciero.ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    console.log("ID_ESTADOFINANCIERO");
    console.log({ID_ESTADOFINANCIERO});
    //res.render('contabilidad_general/listado_estados_financieros', {notasexplicativas, ID_ESTADOFINANCIERO, NOMBRE_ESTADOFINANCIERO});
    console.log(req.body);
    res.send('recibido');
});

/*router.post('/estados_financieros/:NOMBRE_ESTADOFINANCIERO/:ID_ESTADOFINANCIERO/notas_explicativas/listado/agregar', (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    console.log({ID_ESTADOFINANCIERO});
    //console.log(req.body);
    res.send('recibido');
});*/

/*router.post('/estados_financieros/:NOMBRE_ESTADOFINANCIERO/:ID_ESTADOFINANCIERO/notas_explicativas/listado/agregar', async (req, res, next) => {
    const { NOMBRE_ESTADOFINANCIERO } = req.params;
    const { ID_ESTADOFINANCIERO } = req.params;
    const notasexplicativas = await pool.query('SELECT * FROM notaexplicativa INNER JOIN estadofinanciero ON ' +
    'notaexplicativa.ID_ESTADOFINANCIERO = estadofinanciero.ID_ESTADOFINANCIERO WHERE estadofinanciero.ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
    console.log("ID_ESTADOFINANCIERO");
    console.log({ID_ESTADOFINANCIERO});
    res.render('contabilidad_general/agregar', {notasexplicativas, ID_ESTADOFINANCIERO, NOMBRE_ESTADOFINANCIERO});
});*/
/*router.post('/estados_financieros/:NOMBRE_ESTADOFINANCIERO/:ID_ESTADOFINANCIERO/notas_explicativas/listado/agregar', (req, res) => {
    const { ID_ESTADOFINANCIERO } = req.params;
    console.log({ID_ESTADOFINANCIERO});
    res.render('contabilidad_general/agregar');
});*/

//---------------------------------------ESTADOS FINANCIEROS---------------------------------------------------------

//Mostrar listado de estados financieros
router.get('/estados_financieros/listado', async (req, res) => {
    const estadofinanciero = await pool.query('SELECT estadofinanciero.ID_ESTADOFINANCIERO, estadofinanciero.NOMBRE_ESTADOFINANCIERO, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d-%m-%Y") AS  FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d-%m-%Y") AS  FECHAFINAL FROM estadofinanciero INNER JOIN periodocontable WHERE estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE');
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



