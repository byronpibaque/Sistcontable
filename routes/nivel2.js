import routerx from 'express-promise-router';

import Controlador from '../controllers/nivel2.js';


const router=routerx();


 
router.post('/add',Controlador.add);
router.get('/query',Controlador.query);
router.get('/list',Controlador.list); 
router.put('/actualizar',Controlador.update);
router.put('/activate',Controlador.activate);
router.put('/deactivate',Controlador.deactivate);
router.delete('/remove',Controlador.remove);

export default router;