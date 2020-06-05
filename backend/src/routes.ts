import express from 'express';

import PontosController from './controllers/PontosController';
import ItensController from './controllers/ItensController';

const routes = express.Router();
const pontosController = new PontosController();
const itensController = new ItensController();

routes.get('/itens', itensController.index);
routes.post('/pontos', pontosController.create);
routes.get('/pontos', pontosController.index);
routes.get('/pontos/:id', pontosController.show);

export default routes;