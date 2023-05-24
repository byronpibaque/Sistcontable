import routerx from 'express-promise-router';

import Controlador from '../controllers/actaEntregaController';

const router = routerx();
 
router.post('/', Controlador.add);
// router.put('/', Controlador.edit);
router.get('/', Controlador.get);
router.get('/acta_by_id/:acta_id', Controlador.getActaByID);
router.get('/detalleProducto/details/:producto_id', Controlador.detalleProducto);
router.post('/delete/:acta_id', Controlador.delete);
// router.post('/pdf', Controlador.reportePDF);

export default router;