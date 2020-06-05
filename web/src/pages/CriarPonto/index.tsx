import React, { useEffect, useState, ChangeEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker} from 'react-leaflet';
import axios from 'axios';
import api from '../../services/api';

import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  titulo: string;
  imagem_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECidadeResponse {
  nome: string;
}


const CriarPonto = () => {

  const [itens, setItens] = useState<Item[]>([]);
  const [estados, setEstados] = useState<string[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);

  const [estadoSelecionado, setEstadoSelecionado] = useState('0');
  const [cidadeSelecionada, setCidadeSelecionada] = useState('0');

  useEffect(() => {
    api.get('itens').then(response => {
      setItens(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => {
      const siglaEstados = response.data.map(estado => estado.sigla);
      setEstados(siglaEstados);
    });
  }, []);

  useEffect(() => {
    if (estadoSelecionado === '0') {
      return;
    }
    axios.get<IBGECidadeResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
    .then(response => {
      const nomeCidades = response.data.map(cidade => cidade.nome);
      setCidades(nomeCidades);
    })
  },[estadoSelecionado]);

  function ArmazenaEstadoSelecionado(evento: ChangeEvent<HTMLSelectElement>) {
    const estado = evento.target.value;
    
    setEstadoSelecionado(estado);
  }

  function ArmazenaCidadeSelecionada(evento: ChangeEvent<HTMLSelectElement>) {
    const cidade = evento.target.value;
    
    setCidadeSelecionada(cidade);
  }


  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form>
        <h1>Cadastro do <br/> ponto de coleta </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
              <label htmlFor="nome">Nome da entidade</label>
              <input 
                type="text"
                name="nome"
                id="nome"/>
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input 
                  type="email"
                  name="email"
                  id="email"/>
              </div>

              <div className="field">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input 
                  type="text"
                  name="whatsapp"
                  id="whatsapp"/>
              </div>
            </div>

        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[-15.6143962, -56.1120188]} zoom={15}>
            <TileLayer 
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[-15.6143962, -56.1120188]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select 
                name="uf" 
                id="uf" 
                value={estadoSelecionado} 
                onChange={ArmazenaEstadoSelecionado}>

                <option value="0">Selecione um Estado</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="cidade">Cidade</label>
              <select 
                name="cidade" 
                id="cidade"
                value={cidadeSelecionada} 
                onChange={ArmazenaCidadeSelecionada}>

                <option value="0">Selecione uma Cidade</option>
                {cidades.map(cidade => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {
              itens.map(item => (
                <li key={item.id}>
                <img src={item.imagem_url} alt={item.titulo}/>
                <span>{item.titulo}</span>
              </li>
              ))
            }
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CriarPonto;