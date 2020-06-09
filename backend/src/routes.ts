import express from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import PontosController from './controllers/PontosController';
import ItensController from './controllers/ItensController';
import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);

const pontosController = new PontosController();
const itensController = new ItensController();

routes.get('/itens', itensController.index);
routes.get('/pontos', pontosController.index);
routes.get('/pontos/:id', pontosController.show);

routes.post(
  '/pontos',
  upload.single('imagem'),
  celebrate({ 
    body: Joi.object().keys({
      nome: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      cidade: Joi.string().required(),
      uf: Joi.string().required().max(2),
      itens: Joi.string().required(),
    })
  }, {
    abortEarly: false
  }),
  pontosController.create
);

export default routes;