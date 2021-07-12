import Usuario_esquema from './usuarios';
import Rol_esquema from './rol';
import Genero_esquema from './genero'
import Distribuidor_esquema from './distribuidor'
import Nivel1 from './nivel1_cuentas_base'
import Nivel2 from './nivel2_grupo_financiero'
import Nivel3 from './nivel3_cuentas_control'
import Nivel4 from './nivel4_cuentas_detalle'
import Nivel5 from './nivel5_cuentas_movimiento'
import Libro_esquema from './libroDiario'
import bodega_esquema from './bodega'
import fabricante_esquema from './fabricante'
import proveedor_esquema from './proveedor'
import principioActivo_esquema from './principio_activo'
import tipoProducto_esquema from './tipoproducto'
import presentacion_esquema from './presentacion'
import concentracion_esquema from './concentracion'
import producto_esquema from './producto'
import inventario_esquema from './inventario'
import data_esquema from './data';
import cliente_esquema from './clientes';
import compras from './compras';
import retenciones from './retenciones';
import cuarentenas from './cuarentena';
import perchas from './prechas';
import asignacionPercha from './asignacion_percha'
export default {
    asignacionPercha,
    perchas,
    compras,
    cuarentenas,
    retenciones,
    cliente_esquema,
    data_esquema,
    Usuario_esquema,  
    Rol_esquema,
    Genero_esquema,
    Distribuidor_esquema,
    Nivel1,
    Nivel2,
    Nivel3,
    Nivel4,
    Nivel5,
    Libro_esquema,
    bodega_esquema,
    fabricante_esquema,
    proveedor_esquema,
    principioActivo_esquema,
    tipoProducto_esquema,
    presentacion_esquema,
    concentracion_esquema,
    producto_esquema,
    inventario_esquema
} 