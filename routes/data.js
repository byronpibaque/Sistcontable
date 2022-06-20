import routerx from 'express-promise-router';

import Controlador from '../controllers/data';


const router=routerx();


 
router.post('/add',Controlador.add);
router.get('/queryId',Controlador.queryxid);
router.get('/query',Controlador.query);
router.get('/contar',Controlador.contarFacturas);
router.get('/list',Controlador.list); 
router.put('/actualizar',Controlador.update);
router.put('/actualizarSecuencial',Controlador.updateSecuencial);
router.put('/activate',Controlador.activate);
router.put('/deactivate',Controlador.deactivate);
router.delete('/remove',Controlador.remove);

export default router;