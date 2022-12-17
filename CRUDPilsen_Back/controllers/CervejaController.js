import dbKnex from '../dados/db_config.js'
import ejs from 'ejs'
import puppeteer from 'puppeteer'

export const cervejaIndex = async (req, res) => {
  try {
    // obtém da tabela de cerveja todos os registros
    const cerveja = await dbKnex.select("*").from("cerveja")
    res.status(200).json(cerveja)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const cervejaStore = async (req, res) => {

  // informações que podem ser obtidas do arquivo enviado
  console.log(req.file.originalname);
  console.log(req.file.filename);
  console.log(req.file.mimetype);
  console.log(req.file.size);

  const foto = req.file.path; // obtém o caminho do arquivo no server

  if ((req.file.mimetype != "image/jpeg" && req.file.mimetype != "image/png") || req.file.size > 1024 * 1024) {
    fs.unlinkSync(foto); // exclui o arquivo do servidor
    res
      .status(400)
      .json({ msg: "Formato inválido da imagem ou imagem muito grande" });
    return;
  }

  // atribui via desestruturação
  const { nome, teor, ibu, regiao, admin_id } = req.body

  // se não informou estes atributos
  if (!nome || !teor || !ibu || !regiao || !admin_id || !foto) {
    res.status(400).json({ id: 0, msg: "Erro... informe nome, teor, admin_id e foto da cerveja" })
    return
  }

  try {
    const novo = await dbKnex('cerveja').insert({ nome, teor, ibu, regiao, foto, admin_id })

    // novo[0] => retorna o id do registro inserido                     
    res.status(201).json({ id: novo[0], msg: "Ok! Inserido com sucesso" })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const cervejaUpdate = async (req, res) => {
  const { id } = req.params;

  // atribui via desestruturação
  const { nome, teor, ibu } = req.body
  if (!nome || !teor || !ibu) {
    res.status(400).json(
      {
        id: 0,
        msg: "Erro... informe nome, teor e ibu da cerveja"
      })
    return
  }

  try {
    await dbKnex("cerveja").where({ id })
      .update({ nome, teor, ibu })

    res.status(200).json({ id, msg: "Ok! Alterado com sucesso" })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }

}

export const cervejaDelete = async (req, res) => {
  const { id } = req.params;

  console.log(req.admin_id)
  console.log(req.admin_nome)

  try {
    await dbKnex("cerveja").where({ id }).del()
    res.status(200).json({ id, msg: "Ok! Excluído com sucesso" })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const cervejaTeor = async (req, res) => {

  const { teor } = req.params

  try {
    // consulta com count, min, max e avg
    const consulta = await dbKnex("cerveja")
      .count({ num: "*" })
      .min({ menor: "teor" })
      .max({ maior: "teor" })
      .avg({ media: "teor" })

    // a consulta retorna um array de objetos
    // consulta[0] = {num: 9, menor: 19, maior: 28, media: 24.5}
    const { num, menor, maior, media } = consulta[0]

    res.status(200)
      .json({ num, menor, maior, media: Number(media).toFixed(1) })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

// retorna dados estatísticos do cadastro de cerveja
export const cervejaIbu = async (req, res) => {
  try {
    // consulta com count, min, max e avg
    const consulta = await dbKnex("cerveja")
      .count({ num: "*" })
      .min({ menor: "ibu" })
      .max({ maior: "ibu" })
      .avg({ media: "ibu" })

    // a consulta retorna um array de objetos
    // consulta[0] = {num: 9, menor: 19, maior: 28, media: 24.5}
    const { num, menor, maior, media } = consulta[0]

    res.status(200)
      .json({ num, menor, maior, media: Number(media).toFixed(1) })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

// retorna dados estatísticos do cadastro de cerveja
export const cervejaPorRegiao = async (req, res) => {
  try {
    // consulta com agrupamento
    const consulta = await dbKnex("cerveja").select("regiao")
      .count({ votos: "*" }).groupBy("regiao")
    res.status(200).json(consulta)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

// retorna dados estatísticos do cadastro de cerveja
export const cervejaPremiadas = async (req, res) => {
  try {
    // consulta com ordenação e limite de registros retornados
    const consulta = await dbKnex("cerveja")
      .select("nome", "votos")
      .orderBy("votos", "desc")
      .limit(3)
    res.status(200).json(consulta)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

// retorna dados estatísticos do cadastro de cerveja
export const cervejaTotalVotos = async (req, res) => {
  try {
    // consulta com sum e max
    const consulta = await dbKnex("cerveja")
      .sum({ total: "votos" })
      .max({ maior: "votos" })

    // a consulta retorna um array de objetos
    const { total, maior } = consulta[0]

    res.status(200).json({ total, maior })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const cervejaLista = async (req, res) => {
  try {
    // obtém os dados de votação
    const cervejas = await dbKnex
      .select("c.*"/*, "v.nome as voto"*/)
      .from("cerveja as c")
      .orderBy("votos", "desc")
    // .innerJoin("votos as v", { "c.votos": "v.cerveja_id" })
    ejs.renderFile('views/listaCervejas.ejs', { cervejas }, (err, html) => {
      if (err) {
        return res.status(400).send("Erro na geração da página")
      }
      res.status(200).send(html)
    });
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const cervejaPdf = async (req, res) => {
  //  const browser = await puppeteer.launch({headless: false});
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // carrega a página da rota anterior (com a listagem dos produtos)
  await page.goto('http://localhost:3001/cervejas/lista');

  // aguarda a conclusão da exibição da página com os dados do banco
  await page.waitForNetworkIdle(0)

  // gera o pdf da página exibida
  const pdf = await page.pdf({
    printBackground: true,
    format: 'A4',
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  })

  await browser.close();

  // define o tipo de retorno deste método
  res.contentType('application/pdf')

  res.status(200).send(pdf)
}