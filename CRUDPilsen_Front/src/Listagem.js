import { inAxios, webServiceURL } from "./config_axios";
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './Listagem.css'

function Listagem() {

  // declara uma variável (vetor) e a função que irá manipular
  // essa variável (o conteúdo inicial é o que está dentro () )
  const [premiadas, setPremiadas] = useState([])
  const [show, setShow] = useState(false);
  const [id, setId] = useState(0);
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState("");
  const [ibu, setIbu] = useState(0);
  const [regiao, setRegiao] = useState("");
  const [teor, setTeor] = useState("");
  const [nomeCli, setNomeCli] = useState("");
  const [emailCli, setEmailCli] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (id, nome, foto, ibu, regiao, teor) => {
    setId(id)
    setNome(nome)
    setFoto(webServiceURL + foto)
    setIbu(ibu)
    setRegiao(regiao)
    setTeor(teor)
    setShow(true);
  }

  const getPremiadas = async () => {
    try {
      // indica-se o método (get) para obter os dados do server
      const lista = await inAxios.get("cervejas")
      // modifica o valor da variável de estado (sempre pelo método)
      setPremiadas(lista.data)
    } catch (erro) {
      console.log(`Erro no acesso ao Servidor ${erro}`)
    }
  }

  // executa uma função quando o componente é renderizado
  useEffect(() => {
    getPremiadas()
  }, [])

  // verifica se os dados foram preenchidos e os envia para o Web Service
  const confirmarVoto = async () => {

    if (nomeCli === "" || emailCli === "") {
      alert("Por favor, informe os dados para confirmar seu voto.")
      return
    }

    try {
      // indica-se o método (post) para enviar os dados para o server
      const voto = await inAxios.post("votos", { cervejas_id: id, nome: nomeCli, email: emailCli })
      // exibe a mensagem retornada pelo Web Service
      alert(voto.data.msg)
    } catch (erro) {
      console.log(`Erro no acesso ao Servidor ${erro}`)
    }

    // limpa os campos do formulário
    setNomeCli("")
    setEmailCli("")

    // fecha a janela modal
    setShow(false)
  }

  return (
    <div className="container py-3">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
        {premiadas.map((premiada) => (
          <div className="col">
            <img src={`${webServiceURL}${premiada.foto}`} alt="cervejas" className="w-100 img-fluid" />
            <h4 className="mt-1">{premiada.nome}
              <button className="btn btn-primary fw-bold py-2 px-4 float-end"
                onClick={() => handleShow(premiada.id, premiada.nome, premiada.foto, premiada.ibu, premiada.regiao, premiada.teor)}>
                Votar
              </button>
            </h4>
            <h5 className="mb-5">{premiada.regiao} - {premiada.ibu} anos</h5>
          </div>
        ))}
      </div>

      <Modal show={show} onHide={handleClose} className="modal-lg">
        <Modal.Header closeButton>
          <Modal.Title>Concurso Pilsen Gaúcha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row">
              <div className="col-6">
                <img src={foto} alt={nome} className="img-fluid" />
              </div>
              <div className="col-6">
                <h2>{nome}</h2>
                <h5>Cerveja da região {regiao}</h5>
                <h5>IBU: {ibu}</h5>
                <h5>Teor: {teor}%</h5>
                <h4 className="text-primary mt-5">Insira seus dados:</h4>
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="floatingName" placeholder="Nome"
                    value={nomeCli} onChange={(e) => setNomeCli(e.target.value)} />
                  <label for="floatingName">Nome</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="email" class="form-control" id="floatingEmail" placeholder="E-mail"
                    value={emailCli} onChange={(e) => setEmailCli(e.target.value)} />
                  <label for="floatingEmail">Seu melhor E-mail</label>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmarVoto}>
            Confirmar Voto
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default Listagem