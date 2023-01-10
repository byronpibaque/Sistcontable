import routerx from 'express-promise-router';

import Controlador from '../controllers/usuario_Controlador';


const router=routerx();



router.post('/add',Controlador.add);
router.post('/addAccesos',Controlador.addAccesos);
router.get('/query',Controlador.query);
router.get('/list',Controlador.list); 
router.post('/login',Controlador.login);
router.put('/actualizar',Controlador.updateDatosPersonales);
router.put('/activate',Controlador.activate);
router.put('/deactivate',Controlador.deactivate);
router.delete('/remove',Controlador.remove);
router.delete('/removeEstablecimiento',Controlador.removeEstablecimiento);
export default router;