import routerx from 'express-promise-router';

import Controlador from '../controllers/cuarentena_controlador';


const router=routerx();


 
router.post('/add',Controlador.add);
router.get('/query',Controlador.query);
router.get('/list',Controlador.list); 
router.put('/actualizar',Controlador.update);
router.put('/activate',Controlador.activate);
router.put('/deactivate',Controlador.deactivate);
router.put('/activateD',Controlador.activar_detalle);
router.put('/deactivateD',Controlador.desactivar_detalle);
router.delete('/remove',Controlador.remove);

export default router;