import routerx from 'express-promise-router';

import Controlador from '../controllers/facturacion';


const router=routerx();


 
router.post('/add',Controlador.add);

router.get('/query',Controlador.query);

router.get('/list',Controlador.list); 
router.put('/actualizar',Controlador.update);

router.put('/actualizarC',Controlador.updateNumComprobante);


router.put('/activate',Controlador.activate_facturacion);
router.put('/deactivate',Controlador.deactivate_facturacion);
//router.delete('/remove',Controlador.remove);


export default router;