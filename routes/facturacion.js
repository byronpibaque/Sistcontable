import routerx from 'express-promise-router';
import axios from 'axios'
import Controlador from '../controllers/facturacion';


const router=routerx();


 
router.post('/add',Controlador.add);

router.get('/query',Controlador.query);

router.get('/list',Controlador.list); 
router.put('/actualizar',Controlador.update);

router.put('/actualizarC',Controlador.updateNumComprobante);


router.put('/activate',Controlador.activate_facturacion);
router.put('/deactivate',Controlador.deactivate_facturacion);

router.post("/emitirFactura", async (req, res) => {
        try {
          const response = await axios.post(
            "https://azur.com.ec/plataforma/api/v2/factura/emision",
            req.body
          );
      
          res.json(response.data);
        } catch (error) {
          res.status(500).json({ error: "Error al realizar la solicitud a Azur: "+ error.message});
        }
      }
);

router.post("/verificarComprobante", async (req, res) => {
  try {
    const response = await axios.post(
      "https://azur.com.ec/plataforma/api/v2/consulta/comprobante",
      req.body
    );
    const respuestaServer = response.data;
     res.json(respuestaServer);
  } catch (error) {
    res.status(500).json({ error: "Error al realizar la solicitud a Azur: "+ error.message});
  }
}
)


export default router;