const express = require('express');
const router = express.Router();

const pool = require('../database');

//-------------------------------------------ROSA-----------------------------------------------------------------------

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



//--------------------------------------------------------------ELI----------------------------------------------------------------------------
router.get('/', async (req, res) => {
        const periodo_finals = await pool.query("SELECT DATE_FORMAT(FECHAFINAL_PERIODO, '%d-%m-%Y') AS FECHA_PERIODO_FINAL FROM periodocontable ORDER BY ID_PERIODOCONTABLE DESC LIMIT 1");
        console.log(periodo_finals[0].FECHA_PERIODO_FINAL );
        res.render('contabilidad_general/index_contabilidad', {periodo_final: periodo_finals[0]});
});
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
        const { FECHAFINAL_PERIODO, ID_PERIODOCONTABLE, ID_CUENTA, CANTIDAD_CUENTAS} = req.body;
        console.log(ID_PERIODOCONTABLE);
        console.log(FECHAFINAL_PERIODO);
        await pool.query('UPDATE periodocontable SET FECHAFINAL_PERIODO = ? WHERE ID_PERIODOCONTABLE = ?', [ FECHAFINAL_PERIODO, ID_PERIODOCONTABLE ]);
        console.log('Fila actualizada correctamente de periodocontable');
        //Insertar balance de comprobación inicial
        var nombre='BALANCE_DE_COMPROBACION_INICIAL';
        const newEstadoCInicial = {
                ID_PERIODOCONTABLE,
                NOMBRE_ESTADOFINANCIERO:nombre
        }
        await pool.query('INSERT INTO estadofinanciero SET ?', [newEstadoCInicial]);
        console.log('Fila actualizada correctamente de estadofinanciero');
        
        //Insertar mayorizaciones por cada cuenta utilizada en el periodo
        const mayorizacion_cuentas = await pool.query('SELECT DISTINCT(cuenta.ID_CUENTA), cuenta.SALDO_CUENTA FROM cuenta INNER JOIN movimiento ON cuenta.ID_CUENTA=movimiento.ID_CUENTA INNER JOIN transaccion ON movimiento.ID_TRANSACCION=transaccion.ID_TRANSACCION INNER JOIN periodocontable ON transaccion.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE periodocontable.ID_PERIODOCONTABLE=?', [ID_PERIODOCONTABLE]);
        const cantidad_cuentas = await pool.query('SELECT COUNT(DISTINCT(cuenta.ID_CUENTA)) AS CANTIDAD_CUENTAS FROM cuenta INNER JOIN movimiento ON cuenta.ID_CUENTA=movimiento.ID_CUENTA INNER JOIN transaccion ON movimiento.ID_TRANSACCION=transaccion.ID_TRANSACCION INNER JOIN periodocontable ON transaccion.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE periodocontable.ID_PERIODOCONTABLE=?', [ID_PERIODOCONTABLE]);
        console.log('cuenta a mayorizar '+mayorizacion_cuentas[0].ID_CUENTA);
        var cantidad=0;
        cantidad = cantidad_cuentas[0].CANTIDAD_CUENTAS
        console.log('cuentas a recorrer '+ cantidad);
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
        const { ID_CUENTA, FECHA_MOVIMIENTO, DETALLE_MOVIMIENTO, MONTO_CARGO, MONTO_ABONO, CODIGO_TIPO_TRANSACCION, MONTO_TRANSACCION, DESCRIPCION_TRANSACCION, FECHA_TRANSACCION, FECHAINICIO_PERIODO, ES_AJUSTE, ID_TRANSACCION_AJUSTE, ES_IMPUESTO, MONTO_IMPUESTO, INTERES_MES, PLAZO_MES, PLAZO_ANIO, FECHA_PRESTAMO, VIDA_UTIL, VALOR_RECUPERACION} = req.body;
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
                PLAZO_ANIO,
                FECHA_PRESTAMO,
                VIDA_UTIL,
                VALOR_RECUPERACION
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
                //Actualizar el saldo de cada cuenta cuando se hace un movimiento
                const naturaleza_cuenta = await pool.query('SELECT ID_NATURALEZA_CUENTA FROM cuenta WHERE ID_CUENTA=?', [new_movimiento.ID_CUENTA]);
                const saldo_cuenta = await pool.query('SELECT SALDO_CUENTA FROM cuenta WHERE ID_CUENTA=? AND ID_NATURALEZA_CUENTA=1', [new_movimiento.ID_CUENTA]);
                var montoCargo = new_movimiento.MONTO_CARGO;
                var montoAbono = new_movimiento.MONTO_ABONO;
                var saldo_new = 0;
                if(naturaleza_cuenta[0].ID_NATURALEZA_CUENTA == 1){
                        saldo_new = saldo_cuenta[0].SALDO_CUENTA + montoCargo - montoAbono;
                        console.log("Nuevo saldo de una cuenta deudora: "+saldo_new);
                        await pool.query('UPDATE cuenta SET SALDO_CUENTA=? WHERE ID_CUENTA=?', [saldo_new, new_movimiento.ID_CUENTA] );
                
                }else{
                        saldo_new = saldo_cuenta[0].SALDO_CUENTA - montoCargo + montoAbono;
                        console.log("Nuevo saldo de una cuenta acreedora: "+saldo_new);
                        await pool.query('UPDATE cuenta SET SALDO_CUENTA=? WHERE ID_CUENTA=?', [saldo_new, new_movimiento.ID_CUENTA] );
                }
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
router.get('/asiento_ajuste/agregar_ajuste/:ID_TRANSACCION/:NOMBRE_TIPO_TRANSACCION/:MONTO_TRANSACCION/:FECHA_TRANSACCION_FORMATO', async (req, res, next) => {
        const {ID_TRANSACCION, NOMBRE_TIPO_TRANSACCION, MONTO_TRANSACCION, FECHA_TRANSACCION_FORMATO} = req.params;
        const cuenta_padre = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 3');
        const transaccion = await pool.query("SELECT ID_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION, "+
        "DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%Y-%m-%d') AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION FROM transaccion "+
        "INNER JOIN tipotransaccion ON transaccion.CODIGO_TIPO_TRANSACCION=tipotransaccion.CODIGO_TIPO_TRANSACCION WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const movimientos = await pool.query("SELECT DATE_FORMAT(movimiento.FECHA_MOVIMIENTO, '%Y-%m-%d') AS FECHA_MOVIMIENTO_FORMATO, movimiento.DETALLE_MOVIMIENTO, "+
        "movimiento.MONTO_CARGO, movimiento.MONTO_ABONO, cuenta.NOMBRE_CUENTA FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const count = await pool.query("SELECT count(*) FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        var NOMBRE_TIPO_TRANSACCION_SE = NOMBRE_TIPO_TRANSACCION.replace(/_/g," ");
        var tipoajuste = "";
        var Calculo = "";
        //SUMA DE FECHAS
        //https://es.stackoverflow.com/questions/136409/c%C3%B3mo-sumar-d%C3%ADas-a-una-fecha
        var interes_m = await pool.query('SELECT INTERES_MES FROM transaccion WHERE ID_TRANSACCION = ?',[ID_TRANSACCION]);
        var plazo_m = await pool.query('SELECT PLAZO_MES FROM transaccion WHERE ID_TRANSACCION = ?',[ID_TRANSACCION]);
        var plazo_a = await pool.query('SELECT PLAZO_ANIO FROM transaccion WHERE ID_TRANSACCION = ?',[ID_TRANSACCION]);
        var vida_u = await pool.query('SELECT VIDA_UTIL FROM transaccion WHERE ID_TRANSACCION = ?',[ID_TRANSACCION]);
        var valor_r = await pool.query('SELECT VALOR_RECUPERACION FROM transaccion WHERE ID_TRANSACCION = ?',[ID_TRANSACCION]);
        var fecha_p = await pool.query('SELECT FECHA_PRESTAMO FROM transaccion WHERE ID_TRANSACCION = ?',[ID_TRANSACCION]);
        var periodo_contable = await pool.query("SELECT periodocontable.FECHAINICIO_PERIODO FROM periodocontable INNER JOIN transaccion ON "+
        "transaccion.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        var periodo_inicio = new Date(periodo_contable[0].FECHAINICIO_PERIODO);//Fecha inicial del periodo
        var fecha_n = periodo_inicio.getDate();//Toma los dias de la Fecha inicial del periodo
        var dias = parseInt(FECHA_TRANSACCION_FORMATO);//Fecha transaccion
        var mes = 0;
        function sumarDias(fecha_n, dias){
                fecha_new = fecha_n + dias;
                return fecha_new;
        }
        console.log("Suma del mes: "+sumarDias(fecha_n, dias));
        
        //Evaluando la fecha en que se realizo la transaccion
        if(sumarDias(fecha_n, dias) >= '1' && sumarDias(fecha_n, dias) <= '12'){
                mes = 1;
        }else{
                if(sumarDias(fecha_n, dias) >= '13' && sumarDias(fecha_n, dias) <= '27'){
                        mes = 0.5;
                }
        }

        //Calculo del pago de alquiler
        if(NOMBRE_TIPO_TRANSACCION_SE == "PAGO DE ALQUILER"){
                tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 1");
                Calculo_sin = MONTO_TRANSACCION / plazo_m[0].PLAZO_MES;
                Calculo = Number(Calculo_sin.toFixed(2));
                console.log(mes);
        }else{
                //Calculo de la compra de seguro
                if(NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE SEGURO"){
                        tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 1");
                        var cal_plazo_anio = MONTO_TRANSACCION / plazo_a[0].PLAZO_ANIO;
                        Calculo_sin = (cal_plazo_anio / 12)*mes;
                        Calculo = Number(Calculo_sin.toFixed(2));
                        console.log(mes);
                }else{
                        //Calculo del prestamo bancario
                        if(NOMBRE_TIPO_TRANSACCION_SE == "PRESTAMO BANCARIO"){
                                tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 2");
                                Calculo_sin = MONTO_TRANSACCION * (interes_m[0].INTERES_MES/100) * mes;
                                Calculo = Number(Calculo_sin.toFixed(2));
                                console.log(mes);
                        }else{
                                //Calculo del pago de planilla
                                if(NOMBRE_TIPO_TRANSACCION_SE == "PAGO DE PLANILLA"){
                                        tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 2");
                                        console.log(mes);
                                }else{
                                        //Calculo del prestamo a un empleado
                                        if(NOMBRE_TIPO_TRANSACCION_SE == "PRESTAMO A UN EMPLEADO"){
                                                tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 3");
                                                Calculo_sin = MONTO_TRANSACCION * (interes_m[0].INTERES_MES/100) * mes;
                                                Calculo = Number(Calculo_sin.toFixed(2));
                                                console.log(mes);
                                        }else{
                                                //Calculo de compra de insumo al contado y al credito
                                                if(NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE INSUMO AL CONTADO" || NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE INSUMO AL CREDITO"){
                                                        tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 5"); 
                                                        console.log(mes);
                                                }else{
                                                        //Calculo de compra de equipo al contado y al credito
                                                        if(NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE EQUIPO AL CONTADO" || NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE EQUIPO AL CREDITO"){
                                                                tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 6"); 
                                                                var Cargo_dep_anual = (MONTO_TRANSACCION - valor_r[0].VALOR_RECUPERACION)/vida_u[0].VIDA_UTIL;
                                                                var Cargo_dep_mensual = Cargo_dep_anual/12;
                                                                Calculo_sin = Cargo_dep_mensual * mes;
                                                                Calculo = Number(Calculo_sin.toFixed(2));
                                                                console.log(mes);
                                                        }
                                                } 
                                        }
                                }
                        }
                } 
        }
        res.render('contabilidad_general/agregar_ajuste', {tipoajuste, cuenta_padre, transaccions:transaccion[0], movimientos, count, Calculo});
});
router.post('/asiento_ajuste/agregar_ajuste/:ID_TRANSACCION/', async (req, res, next) => {
        const { ID_TRANSACCION } = req.params;
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
router.get('/input_fecha_prestamo', (req, res) => {
        res.render('contabilidad_general/input_fecha_prestamo');
});
router.get('/input_vida_util', (req, res) => {
        res.render('contabilidad_general/input_vida_util');
});
router.get('/input_valor_recuperacion', (req, res) => {
        res.render('contabilidad_general/input_valor_recuperacion');
});
router.get('/monto_impuesto/:monto_tran', async (req, res) => {
        const { monto_tran } = req.params;
        var monto = 0.13*[monto_tran];
        res.render('contabilidad_general/monto_impuesto', {monto});
});

module.exports = router;