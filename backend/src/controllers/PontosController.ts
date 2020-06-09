import { Request, Response } from 'express';
import knex from '../database/connection';

class PontosController {

  async index(request: Request, response: Response) { 
    
    const { cidade, uf, itens } = request.query;

    const itensPesquisa = String(itens).split(',').map(item => Number(item.trim()));

    const pontos = await knex('pontos')
      .join('ponto_itens', 'pontos.id', '=', 'ponto_itens.ponto_id')
      .whereIn('ponto_itens.item_id', itensPesquisa)
      .where('cidade', String(cidade))
      .where('uf', String(uf))
      .distinct()
      .select('pontos.*');

    const pontosSerializados = pontos.map(ponto => {
        return {
          ...ponto,
          imagem_url: `http://192.168.100.13:3333/uploads/${ponto.imagem}`,
        };
      });

    return response.json(pontos);
  }

  async show(request: Request, response: Response) {

    const { id } = request.params;

    const ponto = await knex('pontos').where('id', id).first();

    if(!ponto) {
      return response.status(400).json({ mensagem: 'Ponto não encontrado '});
    }

    const pontoSerializado = {
        ...ponto,
        imagem_url: `http://192.168.100.13:3333/uploads/${ponto.imagem}`,
    };

    const itens = await knex('itens')
      .join('ponto_itens', 'itens.id', '=', 'ponto_itens.item_id')
      .where('ponto_itens.ponto_id', id)
      .select('itens.titulo');

    return response.json({ ponto: pontoSerializado, itens});
  }

  async create(request: Request, response: Response) {
  
    const {
      nome,
      email,
      whatsapp,
      latitude,
      longitude,
      cidade,
      uf,
      itens
    } = request.body;
  
    const trx = await knex.transaction();

    const ponto = {
      imagem: request.file.filename,
      nome,
      email,
      whatsapp,
      latitude,
      longitude,
      cidade,
      uf
    }
  
    const idsInseridos = await trx('pontos').insert(ponto);
  
    const ponto_id = idsInseridos[0];
  
    const pontoItens = itens
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
      return {
        item_id,
        ponto_id: ponto_id,
      };
    })
  
    await trx('ponto_itens').insert(pontoItens);

    await trx.commit();
  
    return response.json({ 
      id: ponto_id,
      ...ponto,
    });
  }
}

export default PontosController;