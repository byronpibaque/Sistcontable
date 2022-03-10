import routerx from 'express-promise-router';

import Controlador from '../controllers/egresos_controlador';


const router=routerx();


 
router.post('/add',Controlador.add);

// router.get('/consulta',Controlador.buscarCliente);
router.get('/query',Controlador.query);
//router.get('/queryR',Controlador.queryReten);
router.get('/list',Controlador.list); 
// router.put('/actualizar',Controlador.update);

router.get('/obtenerconteo',Controlador.AumentarNumComp); 

router.put('/activate',Controlador.activate_Egreso);
router.put('/deactivate',Controlador.deactivate_Egreso);
//router.delete('/remove',Controlador.remove);


export default router;