const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//-----------------------------------RAZONES FINANCIERAS-----------------------------------------------------
router.get('/razones', async (req, res) => {
    console.log("hola")
            const activos_c = await(pool.query('SELECT CODIGO_CUENTA, NOMBRE_CUENTA, SALDO_CUENTA FROM cuenta WHERE CODIGO_CUENTA="11"'));
            const pasivos_c = await(pool.query('SELECT CODIGO_CUENTA, NOMBRE_CUENTA, SALDO_CUENTA FROM cuenta WHERE CODIGO_CUENTA="21"'));
            const activos_corriente = await(pool.query('SELECT ROUND(SUM(SALDO_CUENTA), 2) AS AC FROM cuenta WHERE CODIGO_CUENTA IN (1111, 1112, 1121, 1122, 1131, 1132, 1133, 11411, 11412, 11413, 11414, 11415, 1142, 11431, 11432, 11433, 11441, 11442, 11443, 11444, 11511, 11512, 11513, 11514, 11515, 1152, 116, 1171, 1172, 1173)'));
            const pasivos_corriente = await(pool.query('SELECT ROUND(SUM(SALDO_CUENTA), 2) AS PC FROM cuenta WHERE CODIGO_CUENTA IN (211, 2121, 213)'));
            var rc =0;
            rc = Number((activos_corriente[0].AC/ pasivos_corriente[0].PC).toFixed(2));
            
            const inventarios = await(pool.query('SELECT CODIGO_CUENTA, NOMBRE_CUENTA, SALDO_CUENTA FROM cuenta WHERE CODIGO_CUENTA="114"'));
            const sumas_inventarios = await(pool.query('SELECT ROUND(SUM(SALDO_CUENTA), 2) AS INVENTARIO  FROM cuenta WHERE CODIGO_CUENTA IN (11411, 11412, 11413, 11414, 11415, 1142, 11431, 11432, 11433, 11441, 11442, 11443, 11444)'));
            var razon_liq_cor = 0;
            razon_liq_cor = Number(((activos_corriente[0].AC - sumas_inventarios[0].INVENTARIO) / pasivos_corriente[0].PC).toFixed(2));
            
            const costos_ventas = await(pool.query('SELECT CODIGO_CUENTA, NOMBRE_CUENTA, SALDO_CUENTA FROM cuenta WHERE CODIGO_CUENTA="521"'));
            var razon_inv = 0;
            razon_inv = Number((costos_ventas[0].SALDO_CUENTA / sumas_inventarios[0].INVENTARIO).toFixed(2));
            res.render('contabilidad_general/razones_financieras', { activo_c:activos_c[0], pasivo_c:pasivos_c[0], activo_corriente:activos_corriente[0], pasivo_corriente:pasivos_corriente[0], rc, suma_inventario:sumas_inventarios[0], inventario:inventarios[0], razon_liq_cor, costo_venta:costos_ventas[0],razon_inv});
});


// ********************Rutas Crear Materia Prima *************** */
router.get('/crear_materia_prima', isLoggedIn, async (req, res) => {
    res.render('materia-prima/crear_materia_prima');
});

router.post('/crear_materia_prima', isLoggedIn, async (req, res) => {
    const { nombre } = req.body;
    const newMateriaPrima = {
        nombre,
        existencias: 0
    };
    await pool.query('INSERT INTO materiasprimas set ?', [newMateriaPrima]);
    req.flash('success', 'Materia Prima Creada');
    res.redirect('/costeo/listar_materia_prima');
});

router.get('/listar_materia_prima', isLoggedIn, async (req, res) => {
    const materiasprimas = await pool.query('SELECT * FROM materiasprimas');
    res.render('materia-prima/listar_materia_prima', { materiasprimas });
});


//*******************Rutas Materia Prima******************* */ 
router.get('/entrada_materia_prima_saldo', isLoggedIn, async (req, res) => {
    const materiasprimas = await pool.query('SELECT * FROM materiasprimas');
    res.render('materia-prima/agregar_materia_prima', { materiasprimas });
});

router.post('/entrada_materia_prima_saldo', isLoggedIn, async (req, res) => {
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

router.get('/materia_prima_saldo', isLoggedIn, async (req, res) => {
    res.render('materia-prima/listar_saldos_materia_prima');
});

router.get('/materia_prima_entrada', isLoggedIn, async (req, res) => {
    const entradaMateriasPrimas = await pool.query("SELECT materiasprimas.nombre, entradamp.cantidad, entradamp.preciounitario, DATE_FORMAT(entradamp.fecha, '%Y/%m/%d') as fecha FROM materiasprimas INNER JOIN entradamp ON materiasprimas.id = entradamp.materiaprima_id");
    
    console.log(entradaMateriasPrimas);
    res.render('materia-prima/listar_entradas_materia_prima', { entradaMateriasPrimas});
});

router.get('/materia_prima_salida', isLoggedIn, async (req, res) => {
    res.render('materia-prima/listar_salidas_materia_prima');
});


//*******************Rutas Producto Terminado***************** */
router.get('/producto_terminado_saldo', isLoggedIn, async (req, res) => {
    res.render('costeo/listar_saldos_producto_terminado');
});

router.get('/producto_terminado_entrada', isLoggedIn, async (req, res) => {
  const productoTerminado = await pool.query("SELECT orden.detalle,productosterminados.cantidadproducto, DATE_FORMAT(productosterminados.fechaterminado, '%Y/%m/%d') AS fechaterminado, (productosterminados.costototal / productosterminados.cantidadproducto) AS preciounitario FROM `orden` INNER JOIN productosterminados ON productosterminados.orden_id = orden.id");   
    res.render('costeo/listar_entradas_producto_terminado',{productoTerminado});
});

router.get('/producto_terminado_salida', isLoggedIn, async (req, res) => {
    res.render('costeo/listar_salidas_producto_terminado');
});

//*******************Rutas Producto en Proceso***************** */  

router.get('/producto_proceso', isLoggedIn, async (req, res) => {
    var productoproc = await pool.query('SELECT * FROM `invproductosproceso` WHERE invproductosproceso.estado != 1  ORDER BY id DESC');
    console.log(productoproc);
    res.render('costeo/productos_procesos', { productoproc });
});

router.post('/agregar_productos_proceso', isLoggedIn, async (req, res) => {
    const { tipoproducto, cantidadrestante, detalle, materiaprimaid, cantidadmatariaprima,
        numeroprocesos } = req.body;
    var costomp = 0;
    const newProducProc = {
        tipoproducto,
        cantidadrestante,
        numeroprocesos,
    }


    await pool.query('INSERT INTO invproductosproceso set ?', [newProducProc]);
    var ProductoProc = await pool.query('SELECT * FROM `invproductosproceso`  ORDER BY id DESC');

    productoproceso_id = ProductoProc[0].id;
    cantidaddeproducto = ProductoProc[0].cantidadrestante;
    const orden = {
        productoproceso_id,
        detalle
    }

    await pool.query('INSERT INTO orden set ?', [orden]);
    var Arrayorden = await pool.query('SELECT * FROM `orden`  ORDER BY id DESC');
    const ordenproceso_id = Arrayorden[0].id;
    const materiaPrima = await pool.query('SELECT t1.id,t1.preciounitario,t1.cantidad,t1.materiaprima_id FROM `entradamp` t1 INNER JOIN materiasprimas t2 ON t1.materiaprima_id = t2.id where t2.id=?', materiaprimaid);
    
    costomp = await procesokardexmp(materiaPrima,cantidadmatariaprima,materiaprimaid);
        
       
  
    const materiaprima_id = materiaPrima[0].materiaprima_id;
    const numero = 1;
    
    const nuevoProceso = {
        ordenproceso_id,
        materiaprima_id,
        numero,
        cantidadmatariaprima,
        cantidaddeproducto,
        costomp
    }
    console.log(nuevoProceso);
    await pool.query('INSERT INTO procesos set ?', [nuevoProceso]);

    var productoproc = await pool.query('SELECT * FROM `invproductosproceso`  ORDER BY id DESC');
    req.flash('success', 'Link Saved Succesfully');
    res.render('costeo/productos_procesos', { productoproc });
});

router.get('/agregar_productos_proceso', isLoggedIn, async (req, res) => {
    const materiasPrimas = await pool.query('SELECT * FROM materiasprimas');
    res.render('costeo/agregar_productos_a_proceso', { materiasPrimas });
})



router.get('/detalle_producto_proceso/:id', isLoggedIn, async (req, res) => {
    console.log(req.params.id);
    var producto = await pool.query('SELECT * FROM `invproductosproceso`  WHERE id=?', req.params.id);
    var procesos = await pool.query('SELECT procesos.id, procesos.cantidaddeproducto, procesos.numero FROM `procesos` INNER JOIN `orden`  ON (procesos.ordenproceso_id = orden.id) INNER JOIN `invproductosproceso` ON orden.productoproceso_id = invproductosproceso.id WHERE (invproductosproceso.id = ? AND procesos.cantidaddeproducto != 0)', req.params.id)
    res.render('costeo/detalle_producto_proceso', { producto, procesos });
});

router.get('/transferir_proceso/:id', isLoggedIn, async (req, res) => {
    const materiasPrimas = await pool.query('SELECT * FROM materiasprimas');
    var procesos = await pool.query('SELECT procesos.id, procesos.cantidaddeproducto,procesos.ordenproceso_id, procesos.numero FROM `procesos` INNER JOIN `orden`  ON (procesos.ordenproceso_id = orden.id) INNER JOIN `invproductosproceso` ON orden.productoproceso_id = invproductosproceso.id WHERE procesos.id = ? ', req.params.id)
    console.log(procesos);
    res.render('costeo/form_cambiar_proceso_producto', { materiasPrimas, procesos });
});
router.post('/transferir_proceso', isLoggedIn, async (req, res) => {
    var { ordenproceso_id, numero, materiaprima_id, cantidadproducto, cantidadmatariaprima, mod,
        cif } = req.body;
        const materiaPrima = await pool.query('SELECT t1.id,t1.preciounitario,t1.cantidad,t1.materiaprima_id FROM `entradamp` t1 INNER JOIN materiasprimas t2 ON t1.materiaprima_id = t2.id where t2.id=?', materiaprima_id);
        costomp = await procesokardexmp(materiaPrima,cantidadmatariaprima,materiaprima_id);
    
    var cantidadProceso = await pool.query('SELECT  invproductosproceso.id,invproductosproceso.numeroprocesos,invproductosproceso.tipoproducto FROM `orden`  INNER JOIN invproductosproceso on orden.productoproceso_id = invproductosproceso.id where orden.id = ?', ordenproceso_id);
    if (numero < parseInt(cantidadProceso[0].numeroprocesos)) {
        const procActual = numero;
        numero = parseInt(numero) + 1;
        const nuevoProceso = {
            ordenproceso_id,
            materiaprima_id,
            numero,
            cantidadmatariaprima,
            cantidaddeproducto:cantidadproducto,
            costomp
        }
        console.log("aca llega "+ [nuevoProceso]);
        console.log(nuevoProceso);
        await pool.query('INSERT INTO procesos set ?', [nuevoProceso]);
        
        await pool.query('UPDATE `procesos` SET `cantidaddeproducto`=?, `costomod`=?,`costocif`=? WHERE (procesos.ordenproceso_id = ? AND procesos.numero = ?)', [0,mod, cif, ordenproceso_id, procActual]);
        var productoproc = await pool.query('SELECT * FROM `invproductosproceso` WHERE invproductosproceso.estado != 1 ORDER BY id DESC');

        res.render('costeo/productos_procesos', { productoproc });
    } else {
        orden = await pool.query('SELECT  procesos.ordenproceso_id, SUM(procesos.costomp + procesos.costomod + procesos.costocif) AS costototal FROM   procesos WHERE procesos.ordenproceso_id = ? GROUP   BY procesos.ordenproceso_id',ordenproceso_id);
        const procActual = numero;
        const nombreproducto = cantidadProceso[0].tipoproducto;
        const orden_id = ordenproceso_id
        const costototal = orden[0].costototal
        const productoTerminado = {
            orden_id,
            cantidadproducto,
            nombreproducto,
            costototal,
        }
        console.log(productoTerminado);
        
        await pool.query('UPDATE `invproductosproceso` SET estado=1 WHERE id = ?',cantidadProceso[0].id)
        await pool.query('UPDATE `procesos` SET `cantidaddeproducto`=?, `costomod`=?,`costocif`=? WHERE (procesos.ordenproceso_id = ? AND procesos.numero = ?)', [0,mod, cif, ordenproceso_id, procActual]);
        await pool.query('INSERT INTO productosterminados set ?', [productoTerminado]);
        var productoproc = await pool.query('SELECT * FROM `invproductosproceso` WHERE invproductosproceso.estado != 1 ORDER BY id DESC');

        res.render('costeo/productos_procesos', { productoproc });
    }


});

async  function procesokardexmp(materiaPrima,cantidadmatariaprima,materiaprimaid,costomp){
   var totalcosto =0;
    for (let index = 0; index < materiaPrima.length; index++) {
        const element = materiaPrima[index];
        console.log( index);
        console.log(cantidadmatariaprima);
        console.log(element.cantidad);
        if (element.cantidad > cantidadmatariaprima) {
            const newEntradaMateriaPrima = {
                materiaprima_id:materiaprimaid,
                cantidad:cantidadmatariaprima,
                preciounitario:element.preciounitario,
                tipo:1,
            }
          
            element.cantidad = parseInt(element.cantidad) - parseInt(cantidadmatariaprima);
            await pool.query('UPDATE `entradamp` SET `cantidad`=? WHERE entradamp.id = ?', [element.cantidad,element.id]);
            await pool.query('UPDATE `materiasprimas` SET `existencias`=(materiasprimas.existencias-?) WHERE materiasprimas.id = ?',[cantidadmatariaprima,element.materiaprima_id]);
            await pool.query('INSERT INTO entradamp set ?', [newEntradaMateriaPrima]);
            console.log(cantidadmatariaprima);
            totalcosto = parseFloat(totalcosto) + parseFloat(element.preciounitario) * parseFloat(cantidadmatariaprima);
            
            break;
        } if(element.cantidad < cantidadmatariaprima) {
            const newEntradaMateriaPrima = {
                materiaprima_id:materiaprimaid,
                cantidad:parseInt(element.cantidad),
                preciounitario:element.preciounitario,
                tipo:1,
            }
          cantidadmatariaprima=parseInt(cantidadmatariaprima)-parseInt(element.cantidad);           
            await pool.query('UPDATE `entradamp` SET `cantidad`=? WHERE entradamp.id = ?', [0,element.id]);
            await pool.query('INSERT INTO entradamp set ?', [newEntradaMateriaPrima]);
            await pool.query('UPDATE `materiasprimas` SET `existencias`=(materiasprimas.existencias-?) WHERE materiasprimas.id = ?',[element.cantidad,element.materiaprima_id]);
            totalcosto = parseFloat(totalcosto) + parseFloat(element.preciounitario) * parseFloat(element.cantidad);
            console.log(totalcosto);
        }
        
    }
    console.log(totalcosto);
    return totalcosto;
}

router.get('/producto_salida', isLoggedIn, async (req, res) => {
    res.render('costeo/salida_producto');
});
module.exports = router;