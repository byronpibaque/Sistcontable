import routerx from 'express-promise-router';

import Controlador from '../controllers/fabricante_controlador';


const router=routerx();


 
router.post('/add',Controlador.add);
router.post('/addEstablecimientos',Controlador.addEstablecimientos);
router.get('/query',Controlador.query);
router.get('/list',Controlador.list); 
router.put('/actualizar',Controlador.updatedatos);
router.put('/actualizarEstablecimiento',Controlador.updateEstablecimientos);
router.put('/activate',Controlador.activate);
router.put('/deactivate',Controlador.deactivate);
router.delete('/remove',Controlador.remove);
router.delete('/removeEstablecimiento',Controlador.removeEstablecimiento);

export default router;