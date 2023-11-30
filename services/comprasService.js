import models from '../models';

export default {
  verificaNumComprobante: async (numComprobante) => {
    try {
      const doc = await models.compras.findOne({
        numComprobante: numComprobante,
      });
      return !!doc;
    } catch (error) {
      throw error;
    }
  },
};
