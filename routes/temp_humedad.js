import routerx from 'express-promise-router';

import Controlador from '../controllers/tempHumedController';

const router = routerx();
 
router.post('/', Controlador.add);
router.put('/', Controlador.edit);
router.get('/', Controlador.get);
router.delete('/:id', Controlador.delete);
router.post('/pdf', Controlador.reportePDF);

export default router;