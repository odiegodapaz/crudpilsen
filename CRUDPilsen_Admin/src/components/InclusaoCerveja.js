import { useState } from "react";
import { inAxios } from "../config_axios";

const InclusaoCerveja = () => {
  // declara as variáveis de estado (e os métodos para manipulá-las)
  const [foto, setFoto] = useState(null);
  const [nome, setNome] = useState("");
  const [teor, setTeor] = useState("");
  const [ibu, setIbu] = useState("");
  const [regiao, setRegiao] = useState("");

  const enviarDados = async (e) => {
    e.preventDefault();

    // como deve ser enviado um arquivo também, deve ser desta forma
    const formData = new FormData();
    formData.append("admin_id", 1);
    formData.append("foto", foto);
    formData.append("nome", nome);
    formData.append("teor", teor);
    formData.append("regiao", regiao);
    formData.append("ibu", ibu);

    try {
      const inc = await inAxios.post("cervejas", formData);
      alert(`Cerveja inserida com sucesso. Código: ${inc.data.id}`);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <form className="container" onSubmit={enviarDados}>
      <h2>Inclusão de cerveja no Concurso</h2>
      <div className="mb-3">
        <label htmlFor="nome" className="form-label">
          Nome da Pilsen:
        </label>
        <input
          type="text"
          className="form-control"
          id="nome"
          placeholder="Nome da Cerveja"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="regiao" className="form-label">
          Região de Origem:
        </label>
        <input
          type="text"
          className="form-control"
          id="clube"
          placeholder="Metropolitana, Serra, Sul, Centro, etc."
          value={regiao}
          onChange={(e) => setRegiao(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="teor" className="form-label">
          Teor alcoólico:
        </label>
        <input
          type="number"
          className="form-control"
          id="teor"
          placeholder="Teor Alcoólico(%)"
          value={teor}
          onChange={(e) => setTeor(e.target.value)}
          required
        />
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="ibu" className="form-label">
            Ibu:
          </label>
          <input
            type="number"
            className="form-control"
            id="ibu"
            placeholder="Índice de Amargor"
            value={ibu}
            onChange={(e) => setIbu(e.target.value)}
            required
          />
        </div>
        <div className="col-md-8">
          <label htmlFor="foto" className="form-label">
            Imagem:
          </label>
          <input
            type="file"
            className="form-control"
            id="foto"
            placeholder="Foto da bebida"
            onChange={(e) => setFoto(e.target.files[0])}
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-lg px-5">
        Incluir Cerveja 
      </button>
      <button type="reset" className="btn btn-danger btn-lg px-5 ms-3">
        Limpar Formulário
      </button>
    </form>
  );
};



export default InclusaoCerveja