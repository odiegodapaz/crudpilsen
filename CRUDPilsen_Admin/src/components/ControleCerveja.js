import { inAxios } from "../config_axios";
import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "Numero de Cervejas por região do estado"
};

const ControleCerveja = () => {
  // declara a variável de estado e o método que irá atualizá-la
  const [ibu, setIbu] = useState(0);
  const [total, setTotal] = useState(0);
  const [votos, setVotos] = useState([]);
  const [teor, setTeor] = useState(0);
  const [regiao, setRegiao] = useState([])

  const obterDados = async () => {
    // obtém do Web Service dados gerais das candidatas
    const dadosIbu = await inAxios.get("cervejas/ibu");
    const dadosTeor = await inAxios.get("cervejas/teor");
    const dadosTotais = await inAxios.get("cervejas/total_votos");
    const dadosVotos = await inAxios.get("cervejas/premiadas");
    const dadosRegiao = await inAxios.get("cervejas/regiao");

    // atualiza a variável de estado
    setTotal(dadosTotais.data);
    setIbu(dadosIbu.data);
    setTeor(dadosTeor.data);
    // setRegiao(dadosRegiao.data);

    // conforme a documentação do exemplo de gráfico
    // define as colunas de título
    const data = [["Cerveja", "Votos", { role: "style" }]];

    const data2 = [["Região", "Votos"]];

    const cores = ["#D02090", "#32CD32", "#4169E1", "#D2691E", "#00CED1"];

    // acrescenta os dados "propriamente ditos" do gráfico
    dadosVotos.data.map((voto, i) =>
      data.push([voto.nome, voto.votos, cores[i]])
    );

    // // acrescenta os dados "propriamente ditos" do gráfico
  dadosRegiao.data.map((regiao) => data2.push([regiao.regiao, regiao.votos]));


    // atualiza a variável de estado
    setVotos(data);
    setRegiao(data2);
  };

  // chama o método ao carregar o componente
  useEffect(() => {
    obterDados();
  }, []);

  return (
    <div className="container">
      <h2 className="my-3">Dados de Controle do Sistema</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="card text-center border-primary">
            <div className="card-header border-primary">
              <span className="badge text-bg-primary fs-2 fw-bold p-3 my-2">
                {total.total}
              </span>
            </div>
            <h5 className="my-4">Total de Votos</h5>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-primary">
            <div className="card-header border-primary">
              <span className="badge text-bg-primary fs-2 fw-bold p-3 my-2">
                {ibu.media}
              </span>
            </div>
            <h5 className="my-4">IBU médio</h5>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-primary">
            <div className="card-header border-primary">
              <span className="badge text-bg-primary fs-2 fw-bold p-3 my-2">
                {teor.media}
              </span>
            </div>
            <h5 className="my-4">Teor alcoólico médio</h5>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-primary">
            <div className="card-header border-primary">
              <span className="badge text-bg-primary fs-2 fw-bold p-3 my-2">
                {total.maior}
              </span>
            </div>
            <h5 className="my-4">Votos da vencedora</h5>
          </div>
        </div>
      </div>

      <h4 className="mt-5 ms-5">Cervejas mais votadas</h4>
      <Chart chartType="ColumnChart" width="100%" height="400px" data={votos} />

      <Chart
        chartType="PieChart"
        data={regiao}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
};
export default ControleCerveja