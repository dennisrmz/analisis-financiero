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
        'FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
        const cuentas = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero.ID_ESTADOFINANCIERO=? ORDER BY cuenta.ID_CUENTA', [ID_ESTADOFINANCIERO]));
        const sumas_debe = await(pool.query('SELECT ROUND(SUM(mayorizacion.MONTO_SALDO), 2) AS DEBE FROM mayorizacion INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND mayorizacion.ES_SALDO_ACREEDOR="NO"', [ID_ESTADOFINANCIERO]));
        const sumas_haber = await(pool.query('SELECT ROUND(SUM(mayorizacion.MONTO_SALDO), 2) AS HABER FROM mayorizacion INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND mayorizacion.ES_SALDO_ACREEDOR="SI"', [ID_ESTADOFINANCIERO]));
        res.render('contabilidad_general/balance_de_comprobacion_inicial', {estadofinanciero, periodocontable:periodoscontables[0], idioma, cuentas, suma_debe:sumas_debe[0], suma_haber:sumas_haber[0]});
    });
    
    //-----------------------------------BALANCE DE COMPROBACION---------------------------------------------------------
    router.get('/estados_financieros/BALANCE_DE_COMPROBACION/:ID_ESTADOFINANCIERO', async (req, res) => {
        const { ID_ESTADOFINANCIERO } = req.params;
        const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
        const idioma = await pool.query('SET lc_time_names = "es_VE"');
        const periodoscontables = await pool.query('SELECT DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d") AS FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d") AS FECHAFINAL, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%M") AS MES, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%Y") AS ANIO ' +
        'FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
        const cuentas = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero.ID_ESTADOFINANCIERO=? ORDER BY cuenta.ID_CUENTA', [ID_ESTADOFINANCIERO]));
        const sumas_debe = await(pool.query('SELECT ROUND(SUM(mayorizacion.MONTO_SALDO), 2) AS DEBE FROM mayorizacion INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND mayorizacion.ES_SALDO_ACREEDOR="NO"', [ID_ESTADOFINANCIERO]));
        const sumas_haber = await(pool.query('SELECT ROUND(SUM(mayorizacion.MONTO_SALDO), 2) AS HABER FROM mayorizacion INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND mayorizacion.ES_SALDO_ACREEDOR="SI"', [ID_ESTADOFINANCIERO]));
        res.render('contabilidad_general/balance_de_comprobacion', {estadofinanciero, periodocontable:periodoscontables[0], idioma, cuentas, suma_debe:sumas_debe[0], suma_haber:sumas_haber[0]});
    });

    //--------------------------------------ESTADO DE RESULTADOS---------------------------------------------------------
    router.get('/estados_financieros/ESTADO_DE_RESULTADOS/:ID_ESTADOFINANCIERO', async (req, res) => {
        const { ID_ESTADOFINANCIERO} = req.params;
        const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
        const idioma = await pool.query('SET lc_time_names = "es_VE"');
        const periodoscontables = await pool.query('SELECT DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d") AS FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d") AS FECHAFINAL, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%M") AS MES, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%Y") AS ANIO ' +
        'FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
        const cuentas_ingresos = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero.ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "51%"', [ID_ESTADOFINANCIERO]));
        const sumas_ingresos = await(pool.query('SELECT ROUND(SUM(mayorizacion.MONTO_SALDO), 3) AS INGRESO FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero.ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "51%"', [ID_ESTADOFINANCIERO]));
        const cuentas_gastos = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero.ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "4%"', [ID_ESTADOFINANCIERO]));
        const sumas_gastos = await(pool.query('SELECT ROUND(SUM(mayorizacion.MONTO_SALDO), 3) AS GASTO FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero.ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "4%"', [ID_ESTADOFINANCIERO]));
        const utilidades = await(pool.query('SELECT CODIGO_CUENTA, NOMBRE_CUENTA, SALDO_CUENTA FROM cuenta WHERE CODIGO_CUENTA=331'));
        var saldo_utilidad = 0;
        saldo_utilidad = Number((sumas_ingresos[0].INGRESO - sumas_gastos[0].GASTO).toFixed(2));
        var nuevo_saldo_utilidad = utilidades[0].SALDO_CUENTA + (saldo_utilidad);
        console.log('nuevo_saldo_utilidad '+nuevo_saldo_utilidad);
        await pool.query('UPDATE cuenta SET SALDO_CUENTA =? WHERE CODIGO_CUENTA = 331', [nuevo_saldo_utilidad]);
        console.log('Fila actualizada correctamente de cuenta 331');
        res.render('contabilidad_general/estado_de_resultados', {estadofinanciero, periodocontable:periodoscontables[0], idioma, cuentas_ingresos, cuentas_gastos, suma_ingreso:sumas_ingresos[0], suma_gasto:sumas_gastos[0], utilidad:utilidades[0], saldo_utilidad});
    });

    //----------------------------------------ESTADO DE CAPITAL---------------------------------------------------------
    router.get('/estados_financieros/ESTADO_DE_CAPITAL/:ID_ESTADOFINANCIERO', async (req, res) => {
        const { ID_ESTADOFINANCIERO } = req.params;
        const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
        const idioma = await pool.query('SET lc_time_names = "es_VE"');
        const periodoscontables = await pool.query('SELECT DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d") AS FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d") AS FECHAFINAL, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%M") AS MES, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%Y") AS ANIO ' +
        'FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
        const cuentas_patrimonio = await pool.query('SELECT * FROM cuenta WHERE cuenta.CODIGO_CUENTA LIKE "3%"');
        //const cuentas_activo = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "1%"', [ID_ESTADOFINANCIERO]));
        //const cuentas_pasivo = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "2%"', [ID_ESTADOFINANCIERO]));
        //const cuentas_patrimonio = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "3%"', [ID_ESTADOFINANCIERO]));
        res.render('contabilidad_general/estado_de_capital', {estadofinanciero, periodocontable:periodoscontables[0], idioma, cuentas_patrimonio});
    });
    
    //---------------------------------------BALANCE GENERAL---------------------------------------------------------
    router.get('/estados_financieros/BALANCE_GENERAL/:ID_ESTADOFINANCIERO', async (req, res) => {
        const { ID_ESTADOFINANCIERO } = req.params;
        const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
        const idioma = await pool.query('SET lc_time_names = "es_VE"');
        const periodoscontables = await pool.query('SELECT DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%d") AS FECHAINICIO, DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, "%d") AS FECHAFINAL, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%M") AS MES, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, "%Y") AS ANIO ' +
        'FROM periodocontable INNER JOIN estadofinanciero ON estadofinanciero.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE ID_ESTADOFINANCIERO = ?', [ ID_ESTADOFINANCIERO ]);
        const cuentas_activo = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "1%" ORDER BY cuenta.CODIGO_CUENTA', [ID_ESTADOFINANCIERO]));
        const cuentas_pasivo = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "2%" ORDER BY cuenta.CODIGO_CUENTA', [ID_ESTADOFINANCIERO]));
        const cuentas_patrimonio = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, mayorizacion.MONTO_SALDO, mayorizacion.ES_SALDO_ACREEDOR FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero .ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "3%" ORDER BY cuenta.CODIGO_CUENTA', [ID_ESTADOFINANCIERO]));
        const utilidades = await(pool.query('SELECT cuenta.CODIGO_CUENTA, cuenta.NOMBRE_CUENTA, cuenta.SALDO_CUENTA FROM cuenta WHERE cuenta.CODIGO_CUENTA=331'));
        
        const sumas_activo = await(pool.query('SELECT ROUND(SUM(mayorizacion.MONTO_SALDO), 2) AS TOTAL_ACTIVO FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero.ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "1%"', [ID_ESTADOFINANCIERO]));
        const sumas_pasivo = await(pool.query('SELECT ROUND(SUM(mayorizacion.MONTO_SALDO), 2) AS TOTAL_PASIVO FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero.ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "2%"', [ID_ESTADOFINANCIERO]));
        const sumas_patrimonio = await(pool.query('SELECT ROUND(SUM(mayorizacion.MONTO_SALDO), 2) AS TOTAL_PATRIMONIO FROM cuenta INNER JOIN mayorizacion ON cuenta.ID_CUENTA= mayorizacion. ID_CUENTA INNER JOIN estadofinanciero_mayorizacion ON mayorizacion.ID_MAYORIZACION= estadofinanciero_mayorizacion. ID_MAYORIZACION INNER JOIN estadofinanciero ON estadofinanciero.ID_ESTADOFINANCIERO= estadofinanciero_mayorizacion. ID_ESTADOFINANCIERO INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE= estadofinanciero.ID_PERIODOCONTABLE WHERE estadofinanciero.ID_ESTADOFINANCIERO=? AND cuenta.CODIGO_CUENTA LIKE "3%"', [ID_ESTADOFINANCIERO]));
        
        var total_patrimonio = 0;
        total_patrimonio = utilidades[0].SALDO_CUENTA + sumas_patrimonio[0].TOTAL_PATRIMONIO;
        var total_PP = 0;
        total_PP = sumas_pasivo[0].TOTAL_PASIVO + total_patrimonio;

        res.render('contabilidad_general/balance_general', {estadofinanciero, periodocontable:periodoscontables[0], idioma, cuentas_activo, cuentas_pasivo, cuentas_patrimonio, utilidad:utilidades[0], suma_activo:sumas_activo[0],suma_pasivo:sumas_pasivo[0], suma_patrimonio:sumas_patrimonio[0], total_patrimonio, total_PP});
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
        console.log('Fila insertada correctamente de estadofinanciero - BCI');
        //Insertar mayorizaciones por cada cuenta utilizada en el periodo que NO SON AJUSTE
        const mayorizacion_cuentas = await pool.query('SELECT DISTINCT(cuenta.ID_CUENTA), cuenta.SALDO_CUENTA, cuenta.ID_NATURALEZA_CUENTA FROM cuenta INNER JOIN movimiento ON cuenta.ID_CUENTA=movimiento.ID_CUENTA INNER JOIN transaccion ON movimiento.ID_TRANSACCION=transaccion.ID_TRANSACCION INNER JOIN periodocontable ON transaccion.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE periodocontable.ID_PERIODOCONTABLE=?', [ID_PERIODOCONTABLE]);
        const cantidad_cuentas = await pool.query('SELECT COUNT(DISTINCT(cuenta.ID_CUENTA)) AS CANTIDAD_CUENTAS FROM cuenta INNER JOIN movimiento ON cuenta.ID_CUENTA=movimiento.ID_CUENTA INNER JOIN transaccion ON movimiento.ID_TRANSACCION=transaccion.ID_TRANSACCION INNER JOIN periodocontable ON transaccion.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE periodocontable.ID_PERIODOCONTABLE=?', [ID_PERIODOCONTABLE]);
        console.log('cuenta a mayorizar '+mayorizacion_cuentas[0].ID_CUENTA);
        var cantidad=0;
        cantidad = cantidad_cuentas[0].CANTIDAD_CUENTAS
        console.log('cuentas a recorrer '+ cantidad);
        for(i=0; i<cantidad; i++){ 
                var saldo_acreedor='';
                if(mayorizacion_cuentas[i].ID_NATURALEZA_CUENTA==1 && mayorizacion_cuentas[i].SALDO_CUENTA<0){
                        saldo_acreedor= 'SI';
                }else if(mayorizacion_cuentas[i].ID_NATURALEZA_CUENTA==1 && mayorizacion_cuentas[i].SALDO_CUENTA>=0){
                        saldo_acreedor = 'NO';
                }else if(mayorizacion_cuentas[i].ID_NATURALEZA_CUENTA==2 && mayorizacion_cuentas[i].SALDO_CUENTA<0){
                        saldo_acreedor = 'NO';
                }else if(mayorizacion_cuentas[i].ID_NATURALEZA_CUENTA==2 && mayorizacion_cuentas[i].SALDO_CUENTA>=0){
                        saldo_acreedor = 'SI';
                }
                const newMayorizacion = {
                        ID_CUENTA: mayorizacion_cuentas[i].ID_CUENTA,
                        MONTO_SALDO: mayorizacion_cuentas[i].SALDO_CUENTA,
                        ES_SALDO_ACREEDOR: saldo_acreedor
                };
                await pool.query('INSERT INTO mayorizacion SET ?', [newMayorizacion]);
                console.log('Fila insertada correctamente de mayorizacion');
                //Insertar datos en tabla estadofinanciero_mayorizacion
                const ultima_m = await pool.query('SELECT mayorizacion.ID_MAYORIZACION FROM mayorizacion ORDER BY mayorizacion.ID_MAYORIZACION DESC LIMIT 1');
                const ultimo_eci =await pool.query('SELECT estadofinanciero.ID_ESTADOFINANCIERO FROM estadofinanciero ORDER BY estadofinanciero.ID_ESTADOFINANCIERO DESC LIMIT 1');
                const newEF_M = {
                        ID_MAYORIZACION:ultima_m[0].ID_MAYORIZACION,
                        ID_ESTADOFINANCIERO:ultimo_eci[0].ID_ESTADOFINANCIERO
                }
                await pool.query('INSERT INTO estadofinanciero_mayorizacion SET ?', [newEF_M]);
                console.log('Fila insertada correctamente en estadofinanciero_mayorizacion');
        }
        res.redirect('/contabilidad_general/estados_financieros/listado');
});

//GENERAR TODOS LOS ESTADOS FINANCIEROS
router.post('/transaccion/estadosfinancieros', async (req, res, next) => {
        const { FECHAFINAL_PERIODO, ID_PERIODOCONTABLE, ID_CUENTA, CANTIDAD_CUENTAS} = req.body;
        console.log(ID_PERIODOCONTABLE);
        console.log(FECHAFINAL_PERIODO);
        console.log('Fila actualizada correctamente de periodocontable');

        //Insertar balance de comprobación 
        var nombre='BALANCE_DE_COMPROBACION';
        const newEstadoCInicial = {
                ID_PERIODOCONTABLE,
                NOMBRE_ESTADOFINANCIERO:nombre
        }
        await pool.query('INSERT INTO estadofinanciero SET ?', [newEstadoCInicial]);
        console.log('Fila insertada correctamente de estadofinanciero - BC');
        //Insertar estado de resultados
        var nombre='ESTADO_DE_RESULTADOS';
        const newEstadoResult = {
                ID_PERIODOCONTABLE,
                NOMBRE_ESTADOFINANCIERO:nombre
        }
        await pool.query('INSERT INTO estadofinanciero SET ?', [newEstadoResult]);
        console.log('Fila insertada correctamente de estadofinanciero - ER');
        //Insertar estado de capital
        var nombre='ESTADO_DE_CAPITAL';
        const newEstadoCapital = {
                ID_PERIODOCONTABLE,
                NOMBRE_ESTADOFINANCIERO:nombre
        }
        await pool.query('INSERT INTO estadofinanciero SET ?', [newEstadoCapital]);
        console.log('Fila insertada correctamente de estadofinanciero - EC');
        //Insertar balance general
        var nombre='BALANCE_GENERAL';
        const newBalanceGeneral = {
                ID_PERIODOCONTABLE,
                NOMBRE_ESTADOFINANCIERO:nombre
        }
        await pool.query('INSERT INTO estadofinanciero SET ?', [newBalanceGeneral]);
        console.log('Fila insertada correctamente de estadofinanciero - BG');

        //Insertar mayorizaciones por cada cuenta utilizada en el periodo que ANTES Y DESPUES DE AJUSTE
        const mayorizacion_cuentas = await pool.query('SELECT DISTINCT(cuenta.ID_CUENTA), cuenta.SALDO_CUENTA, cuenta.ID_NATURALEZA_CUENTA FROM cuenta INNER JOIN movimiento ON cuenta.ID_CUENTA=movimiento.ID_CUENTA INNER JOIN transaccion ON movimiento.ID_TRANSACCION=transaccion.ID_TRANSACCION INNER JOIN periodocontable ON transaccion.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE periodocontable.ID_PERIODOCONTABLE=?', [ID_PERIODOCONTABLE]);
        const cantidad_cuentas = await pool.query('SELECT COUNT(DISTINCT(cuenta.ID_CUENTA)) AS CANTIDAD_CUENTAS FROM cuenta INNER JOIN movimiento ON cuenta.ID_CUENTA=movimiento.ID_CUENTA INNER JOIN transaccion ON movimiento.ID_TRANSACCION=transaccion.ID_TRANSACCION INNER JOIN periodocontable ON transaccion.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE periodocontable.ID_PERIODOCONTABLE=?', [ID_PERIODOCONTABLE]);
        console.log('cuenta a mayorizar '+mayorizacion_cuentas[0].ID_CUENTA);
        var cantidad=0;
        cantidad = cantidad_cuentas[0].CANTIDAD_CUENTAS
        console.log('cuentas a recorrer '+ cantidad);
        for(i=0; i<cantidad; i++){ 
                var saldo_acreedor='';
                if(mayorizacion_cuentas[i].ID_NATURALEZA_CUENTA==1 && mayorizacion_cuentas[i].SALDO_CUENTA<0){
                        saldo_acreedor= 'SI';
                }else if(mayorizacion_cuentas[i].ID_NATURALEZA_CUENTA==1 && mayorizacion_cuentas[i].SALDO_CUENTA>=0){
                        saldo_acreedor = 'NO';
                }else if(mayorizacion_cuentas[i].ID_NATURALEZA_CUENTA==2 && mayorizacion_cuentas[i].SALDO_CUENTA<0){
                        saldo_acreedor = 'NO';
                }else if(mayorizacion_cuentas[i].ID_NATURALEZA_CUENTA==2 && mayorizacion_cuentas[i].SALDO_CUENTA>=0){
                        saldo_acreedor = 'SI';
                }
                const newMayorizacion = {
                        ID_CUENTA: mayorizacion_cuentas[i].ID_CUENTA,
                        MONTO_SALDO: mayorizacion_cuentas[i].SALDO_CUENTA,
                        ES_SALDO_ACREEDOR: saldo_acreedor
                };
                await pool.query('INSERT INTO mayorizacion SET ?', [newMayorizacion]);
                console.log('Fila insertada correctamente de mayorizacion');

                //Insertar datos en tabla estadofinanciero_mayorizacion
                const ultima_m = await pool.query('SELECT mayorizacion.ID_MAYORIZACION FROM mayorizacion ORDER BY mayorizacion.ID_MAYORIZACION DESC LIMIT 1');
                const ultimoBC =await pool.query('SELECT MAX(estadofinanciero.ID_ESTADOFINANCIERO) AS ID_EF FROM estadofinanciero WHERE estadofinanciero.ID_ESTADOFINANCIERO=((SELECT MAX(estadofinanciero.ID_ESTADOFINANCIERO) FROM estadofinanciero)-3)');
                const ultimoER =await pool.query('SELECT MAX(estadofinanciero.ID_ESTADOFINANCIERO) AS ID_EF FROM estadofinanciero WHERE estadofinanciero.ID_ESTADOFINANCIERO=((SELECT MAX(estadofinanciero.ID_ESTADOFINANCIERO) FROM estadofinanciero)-2)');
                const ultimoEC =await pool.query('SELECT MAX(estadofinanciero.ID_ESTADOFINANCIERO) AS ID_EF FROM estadofinanciero WHERE estadofinanciero.ID_ESTADOFINANCIERO=((SELECT MAX(estadofinanciero.ID_ESTADOFINANCIERO) FROM estadofinanciero)-1)');
                const ultimoBG =await pool.query('SELECT MAX(estadofinanciero.ID_ESTADOFINANCIERO) AS ID_EF FROM estadofinanciero WHERE estadofinanciero.ID_ESTADOFINANCIERO=((SELECT MAX(estadofinanciero.ID_ESTADOFINANCIERO) FROM estadofinanciero))');
                
                const newBC_M = {
                        ID_MAYORIZACION:ultima_m[0].ID_MAYORIZACION,
                        ID_ESTADOFINANCIERO:ultimoBC[0].ID_EF
                }
                await pool.query('INSERT INTO estadofinanciero_mayorizacion SET ?', [newBC_M]);
                console.log('Fila insertada correctamente en estadofinanciero_mayorizacion - BC');

                const newER_M = {
                        ID_MAYORIZACION:ultima_m[0].ID_MAYORIZACION,
                        ID_ESTADOFINANCIERO:ultimoER[0].ID_EF
                }
                await pool.query('INSERT INTO estadofinanciero_mayorizacion SET ?', [newER_M]);
                console.log('Fila insertada correctamente en estadofinanciero_mayorizacion - ER');

                const newEC_M = {
                        ID_MAYORIZACION:ultima_m[0].ID_MAYORIZACION,
                        ID_ESTADOFINANCIERO:ultimoEC[0].ID_EF
                }
                await pool.query('INSERT INTO estadofinanciero_mayorizacion SET ?', [newEC_M]);
                console.log('Fila insertada correctamente en estadofinanciero_mayorizacion - EC');
                
                
                const newBG_M = {
                        ID_MAYORIZACION:ultima_m[0].ID_MAYORIZACION,
                        ID_ESTADOFINANCIERO:ultimoBG[0].ID_EF
                }
                await pool.query('INSERT INTO estadofinanciero_mayorizacion SET ?', [newBG_M]);
                console.log('Fila insertada correctamente en estadofinanciero_mayorizacion - BG');

        }
        res.redirect('/contabilidad_general/estados_financieros/listado');
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
        const { ID_CUENTA, FECHA_MOVIMIENTO, DETALLE_MOVIMIENTO, MONTO_CARGO, MONTO_ABONO, CODIGO_TIPO_TRANSACCION, MONTO_TRANSACCION, DESCRIPCION_TRANSACCION, FECHA_TRANSACCION, FECHAINICIO_PERIODO, ES_AJUSTE, ID_TRANSACCION_AJUSTE, ES_IMPUESTO, MONTO_IMPUESTO, CANTIDAD_MATERIA} = req.body;
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
                CANTIDAD_MATERIA
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
router.get('/asiento_ajuste/agregar_ajuste/:ID_TRANSACCION/:NOMBRE_TIPO_TRANSACCION', async (req, res, next) => {
        const {ID_TRANSACCION, NOMBRE_TIPO_TRANSACCION} = req.params;
        const cuenta_padre = await pool.query('SELECT * FROM cuenta WHERE NIVELH = 3');
        const transaccion = await pool.query("SELECT ID_TRANSACCION, tipotransaccion.NOMBRE_TIPO_TRANSACCION, transaccion.DESCRIPCION_TRANSACCION, DATE_FORMAT(transaccion.FECHA_TRANSACCION, '%d-%m-%Y') "+
        "AS FECHA_TRANSACCION_FORMATO, transaccion.MONTO_TRANSACCION, DATE_FORMAT(periodocontable.FECHAINICIO_PERIODO, '%d-%m-%Y') AS FECHA_INICIO, "+
        "DATE_FORMAT(periodocontable.FECHAFINAL_PERIODO, '%d-%m-%Y') AS FECHA_FIN FROM transaccion INNER JOIN tipotransaccion ON "+
        "transaccion.CODIGO_TIPO_TRANSACCION=tipotransaccion.CODIGO_TIPO_TRANSACCION INNER JOIN periodocontable ON periodocontable.ID_PERIODOCONTABLE=transaccion.ID_PERIODOCONTABLE "+
        "WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const movimientos = await pool.query("SELECT DATE_FORMAT(movimiento.FECHA_MOVIMIENTO, '%Y-%m-%d') AS FECHA_MOVIMIENTO_FORMATO, movimiento.DETALLE_MOVIMIENTO, "+
        "movimiento.MONTO_CARGO, movimiento.MONTO_ABONO, cuenta.NOMBRE_CUENTA FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        const count = await pool.query("SELECT count(*) FROM transaccion INNER JOIN movimiento On transaccion.ID_TRANSACCION=movimiento.ID_TRANSACCION "+
        "INNER JOIN cuenta ON cuenta.ID_CUENTA=movimiento.ID_CUENTA WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        var NOMBRE_TIPO_TRANSACCION_SE = NOMBRE_TIPO_TRANSACCION.replace(/_/g," ");
        var tipoajuste = "";
        var periodo_contable = await pool.query("SELECT periodocontable.FECHAINICIO_PERIODO FROM periodocontable INNER JOIN transaccion ON "+
        "transaccion.ID_PERIODOCONTABLE=periodocontable.ID_PERIODOCONTABLE WHERE transaccion.ID_TRANSACCION = ?", [ID_TRANSACCION]);
        var periodo_inicio = new Date(periodo_contable[0].FECHAINICIO_PERIODO);//Fecha inicial del periodo
        var d = periodo_inicio.getDate();//Toma los dias de la Fecha inicial del periodo
        var dias = parseInt(transaccion[0].FECHA_TRANSACCION_FORMATO);//Fecha transaccion
        console.log(periodo_inicio);
        console.log(d);
        console.log(transaccion[0].FECHA_TRANSACCION_FORMATO);
        console.log(dias);
        function sumarDias(d, dias){
                fecha_new = d + dias;
                return fecha_new;
        }
        console.log("Suma del mes: "+sumarDias(d, dias));
        
        //Evaluando la fecha en que se realizo la transaccion
        if(sumarDias(d, dias) >= '1' && sumarDias(d, dias) <= '12'){
                console.log("mes: 1");
        }else{
                if(sumarDias(d, dias) >= '13' && sumarDias(d, dias) <= '27'){
                        console.log("mes: 0.5");
                }else{
                        var mes = 0;
                }
        }

        //Calculo del pago de alquiler
        if(NOMBRE_TIPO_TRANSACCION_SE == "PAGO DE ALQUILER"){
                tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 1");
        }else{
                //Calculo de la compra de seguro
                if(NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE SEGURO"){
                        tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 1");
                }else{
                        //Calculo del prestamo bancario
                        if(NOMBRE_TIPO_TRANSACCION_SE == "PRESTAMO BANCARIO"){
                                tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 2");
                        }else{
                                //Calculo del pago de planilla
                                if(NOMBRE_TIPO_TRANSACCION_SE == "PAGO DE PLANILLA"){
                                        tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 2");
                                }else{
                                        //Calculo del prestamo a un empleado
                                        if(NOMBRE_TIPO_TRANSACCION_SE == "PRESTAMO A UN EMPLEADO"){
                                                tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 3");
                                        }else{
                                                //Calculo de compra de insumo al contado y al credito
                                                if(NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE INSUMO AL CONTADO" || NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE INSUMO AL CREDITO"){
                                                        tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 5"); 
                                                }else{
                                                        //Calculo de compra de equipo al contado y al credito
                                                        if(NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE EQUIPO AL CONTADO" || NOMBRE_TIPO_TRANSACCION_SE == "COMPRA DE EQUIPO AL CREDITO"){
                                                                tipoajuste = await pool.query("SELECT * FROM tipoajuste WHERE CODIGO_TIPO_AJUSTE = 6"); 
                                                        }
                                                } 
                                        }
                                }
                        }
                } 
        }
        res.render('contabilidad_general/agregar_ajuste', {tipoajuste, cuenta_padre, transaccions:transaccion[0], movimientos, count, mes});
});
router.post('/asiento_ajuste/agregar_ajuste/:ID_TRANSACCION', async (req, res, next) => {
        const { ID_TRANSACCION } = req.params;
        const { ES_AJUSTE, ID_CUENTA, FECHA_MOVIMIENTO, DETALLE_MOVIMIENTO, MONTO_CARGO, MONTO_ABONO, CODIGO_TIPO_AJUSTE, MONTO_TRANSACCION_AJUSTE, DESCRIPCION_TRANSACCION_AJUSTE, FECHA_TRANSACCION_AJUSTE, INTERES_MES, PLAZO_MES, PLAZO_ANIO, VIDA_UTIL, VALOR_RECUPERACION} = req.body;
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
                FECHA_TRANSACCION_AJUSTE,
                INTERES_MES,
                PLAZO_MES, 
                PLAZO_ANIO,
                VIDA_UTIL,
                VALOR_RECUPERACION
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
router.get('/check_calcular_monto', (req, res) => {
        res.render('contabilidad_general/check_calcular_monto');
});
router.get('/input_cantidad', (req, res) => {
        res.render('contabilidad_general/input_cantidad');
});
router.get('/monto_impuesto/:monto_tran', async (req, res) => {
        const { monto_tran } = req.params;
        var monto = 0.13*[monto_tran];
        res.render('contabilidad_general/monto_impuesto', {monto});
});

//Listado Estados Financieros
router.get('/estados_financieros/listado', async (req, res) => {
    const estadofinanciero = await pool.query('SELECT * FROM estadofinanciero');
    res.render('contabilidad_general/listado_estados_financieros', {estadofinanciero});
});

//Balance de Comprobacion
router.get('/estados_financieros/balance_comprobacion', async (req, res) => {
    res.render('contabilidad_general/balance_de_comprobacion');
});

//Balance General
router.get('/estados_financieros/balance_general', async (req, res) => {
    res.render('contabilidad_general/balance_general');
});

//Estado de Resultados
router.get('/estados_financieros/estado_resultados', async (req, res) => {
    res.render('contabilidad_general/estado_de_resultados');
});

//Estado de Capital
router.get('/estados_financieros/estado_capital', async (req, res) => {
    res.render('contabilidad_general/estado_de_capital');
});

//Estado de Flujo de Efectivo
router.get('/estados_financieros/estado_flujo_efectivo', async (req, res) => {
    res.render('contabilidad_general/estado_flujo_de_efectivo');
});

//Notas Explicativas (agregar)
router.get('/estados_financieros/agregar_nota_explicativa', async (req, res) => {
    res.render('contabilidad_general/agregar_nota_explicativa');
});

//Listado de Notas Explicativas 
router.get('/estados_financieros/notas_explicativas/listado', async (req, res) => {
    res.render('contabilidad_general/listado_notas_explicativas');
});

router.get('/planilla', async (req, res) => {
        const planilla_salarios=  await pool.query("SELECT * FROM planilla")
          res.render('contabilidad_general/planilla', {planilla_salarios});
  });
  
// Mostrar detalles de empleado
router.get('/planilla/mostrar_empleado/:CODIGO_EMPLEADO', async (req, res) => {
        const {CODIGO_EMPLEADO} = req.params;
        const empleado = await pool.query("SELECT * FROM planilla WHERE CODIGO_EMPLEADO = ? ", [CODIGO_EMPLEADO]);
        console.log(empleado[0]);
        res.render('contabilidad_general/mostrar_empleado', {emp : empleado[0]});
});

//Actualizar datos de planilla si han sido modifocados

router.post('/planilla/guardar/:CODIGO_EMPLEADO', async(req, res) => {
        const {CODIGO_EMPLEADO} = req.params;
        const { SALARIO_BASE, VACACIONES, AGUINALDO, TOTAL_DEVENGADO, ISSS, AFP, INSAFORP, TOTAL_DEDUCCIONES, TOTAL_LIQUIDO } = req.body;
        const n_empleado = {
                SALARIO_BASE, VACACIONES, AGUINALDO, TOTAL_DEVENGADO, ISSS, AFP, INSAFORP, TOTAL_DEDUCCIONES, TOTAL_LIQUIDO     
        };
        console.log(n_empleado)
        await pool.query('UPDATE planilla set ? WHERE CODIGO_EMPLEADO= ?', [n_empleado, CODIGO_EMPLEADO]);
        console.log(n_empleado);
        res.redirect('/contabilidad_general/planilla');
});

module.exports = router;



