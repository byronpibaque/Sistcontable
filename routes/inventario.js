import routerx from 'express-promise-router';

import Controlador from '../controllers/inventario';


const router=routerx();


 
router.post('/add',Controlador.add);
router.get('/buscaCodigo',Controlador.buscarCodigo);
router.get('/busca',Controlador.buscar);
router.get('/query',Controlador.query);
router.get('/queryV',Controlador.queryVerificarLote);
router.get('/list',Controlador.list); 
router.put('/actualizar',Controlador.update);
router.put('/activate',Controlador.activate);
router.put('/deactivate',Controlador.deactivate);
router.delete('/remove',Controlador.remove);

export default router;