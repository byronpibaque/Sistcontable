import routerx from 'express-promise-router';

import Controlador from '../controllers/compras_controlador';


const router=routerx();


 
router.post('/add',Controlador.add);

// router.get('/consulta',Controlador.buscarCliente);
router.get('/query',Controlador.query);
router.get('/queryR',Controlador.queryReten);
router.get('/list',Controlador.list); 
// router.put('/actualizar',Controlador.update);

router.put('/activate',Controlador.activate_Compra);
router.put('/deactivate',Controlador.deactivate_Compra);
router.delete('/remove',Controlador.remove);


export default router;