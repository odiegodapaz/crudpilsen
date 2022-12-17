import { inAxios, webServiceURL } from '../config_axios'
import { useState, useEffect } from 'react'

import './ListaCerveja.css'

const ListaCerveja = () => {

  // declara a variável de estado e o método que irá atualizá-la
  const [cerveja, setCerveja] = useState([])

  const obterCerveja = async () => {
    // obtém do Web Service a lista das Cerveja cadastradas
    const lista = await inAxios.get("cervejas")

    // atualiza a variável de estado
    setCerveja(lista.data)
  }

  // chama o método ao carregar o componente
  useEffect(() => {
    obterCerveja()
  }, [])


  const update = async (id, nome, teor, ibu, index) => {
    const novoNome = prompt(`Qual o nome correto da cerveja "${nome}"?`);
    if (novoNome === null || novoNome === "") {
      return;
    }
    try {
      await inAxios.put(`cervejas/${id}`, { nome: novoNome, teor, ibu});
      const cervejaUpdate = [...cerveja];
      cervejaUpdate[index].nome = novoNome;
      setCerveja(cervejaUpdate);
    } catch (error) {
      alert(`Erro... Não foi possível alterar: ${error}`);
    }
  };

  const excluir = async (id, nome) => {
    if (!window.confirm(`Confirma a exclusão da cerveja"${nome}"?`)) {
      return;
    }
    try {
      await inAxios.delete(`cervejas/${id}`);
      setCerveja(cerveja.filter((cerveja) => cerveja.id !== id));
    } catch (error) {
      alert(`Erro... Não foi possível excluir este competidor: ${error}`);
    }
  };

  

  return (
    <div className="container">
      <h2>Cervejas Cadastradas</h2>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Região</th>
            <th>Teor</th>
            <th>IBU</th>
            <th>Votos</th>
          </tr>
        </thead>
        <tbody>
          {cerveja.map((cerv, index) => (
            <tr>
              <td><img src={webServiceURL + cerv.foto} alt={cerv.nome} className="img-cerv" /></td>
              <td>{cerv.nome}</td>
              <td>{cerv.regiao}</td>
              <td>{cerv.teor}%</td>
              <td>{cerv.ibu}</td>
              <td>{cerv.votos} votos</td>
              <td className='text-center'>
                <h4>
                  <i class="bi bi-pencil-square text-success"onClick={() =>
                      update(cerv.id, cerv.nome, cerv.teor, cerv.ibu, index)
                    }></i>
                  &ensp;
                  <i
                    className="bi bi-person-dash-fill text-danger"
                    onClick={() => excluir(cerv.id, cerv.nome, cerv.teor, cerv.ibu)}
                  ></i>
                </h4>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListaCerveja