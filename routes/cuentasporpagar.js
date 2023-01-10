import routerx from 'express-promise-router';

import Controlador from '../controllers/cuentasporpagar_controlador';


const router=routerx();


router.get('/contar', Controlador.contarCuentas)
router.post('/add',Controlador.add);
router.get('/query',Controlador.query);
router.get('/buscar',Controlador.buscar);
router.get('/list',Controlador.list); 
router.put('/actualizar',Controlador.update);
router.put('/activate',Controlador.activate);
router.put('/deactivate',Controlador.deactivate);
router.delete('/remove',Controlador.remove);

export default router;