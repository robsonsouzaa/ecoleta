import { Request, Response } from 'express';
import knex from '../database/connection';

class ItensController {
  async index (request: Request, response: Response) {
  
    const itens = await knex('itens').select('*');
  
    const itensSerializados = itens.map(item => {
      return {
        id: item.id,
        titulo: item.titulo,
        imagem_url: `http://192.168.100.13:3333/uploads/${item.imagem}`,
      }
    });
  
    return response.json(itensSerializados);
  }
}

export default ItensController;