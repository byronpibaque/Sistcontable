import routerx from 'express-promise-router';

import Usuario_router from './usuario';
import Rol_router from './rol'
import Genero_router from './genero'
import Distribuidor_router from './distribuidor'
import Nivel1_router from './nivel1'
import Nivel2_router from './nivel2'
import Nivel3_router from './nivel3'
import Nivel4_router from './nivel4'
import Nivel5_router from './nivel5'
import libro_router from './libroDiario'
import bodega_router from './bodega'
import fabricante_router from './fabricante'
import proveedor_router from './proveedor'
import principioActivo_router from './principioActivo'
import tipoProducto_router from './tipoproducto'
import presentacion_router from './presentacion'
import concentracion_router from './concentracion'
import producto_router from'./producto'
import inventario_router from './inventario'
import data from './data';
import cliente from './cliente'
import perchas from './perchas'
import compras from './compras'
import retenciones from './retencion'
import curentena from './cuarentena'
import asignacionPercha from './asignacionPercha'

const router=routerx();
router.use('/data',data)
router.use('/usuario',Usuario_router)
router.use('/rol',Rol_router)
router.use('/genero',Genero_router)
router.use('/distribuidor',Distribuidor_router)
//------------CATALGO DE CUENTAS-------------//
router.use('/nivel1',Nivel1_router)
router.use('/nivel2',Nivel2_router)
router.use('/nivel3',Nivel3_router)
router.use('/nivel4',Nivel4_router)
router.use('/nivel5',Nivel5_router)
router.use('/librodiario',libro_router)
//-------------INVENTARIO------------------//
router.use('/bodega',bodega_router)
router.use('/fabricante',fabricante_router)
router.use('/proveedor',proveedor_router)
router.use('/perchas',perchas)

//--------------PRODUCTOS------------------//
router.use('/principioactivo',principioActivo_router)
router.use('/tipoproducto',tipoProducto_router)
router.use('/presentacion',presentacion_router)
router.use('/concentracion',concentracion_router) 
router.use('/producto',producto_router)
router.use('/inventario',inventario_router)
//--------------CLIENTES------------------//
router.use('/cliente',cliente)
//--------------COMPRAS-------------------//
router.use('/compras',compras)
router.use('/retenciones',retenciones)
router.use('/cuarentena',curentena)
router.use('/asignacionpercha',asignacionPercha)

export default router;