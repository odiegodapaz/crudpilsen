import dbKnex from '../dados/db_config.js'
import md5 from 'md5'
import nodemailer from "nodemailer"

export const votoIndex = async (req, res) => {
  try {
    // obtém da tabela de votos todos os registros
    const votos = await dbKnex.select("v.*", "c.nome as cerveja")
                              .from("votos as v")
                              .innerJoin("cerveja as c", {"v.cerveja_id": "c.id"})
    res.status(200).json(votos)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

// async..await is not allowed in global scope, must use a wrapper
async function send_email(nome, email, hash) {

  // dados de configuração da conta de onde partirá os e-mails
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7d61bcdb9abc88",
      pass: "8e4ae2881b4695"
    }
  });

  const link = "http://localhost:3001/votos/confirma/"+hash

  let mensa = `<p>Estimado sr(a): ${nome}</p>`
  mensa += `<p>Confirme seu voto clicando no link a seguir:</p>`
  mensa += `<a href=${link}>Confirmação do Voto</a>`

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Concurso Cerveja Gaúcha de 2022" <cerveja2022@email.com>', // sender address
    to: email, // list of receivers
    subject: "Confirmação do Voto", // Subject line
    text: `Para confirmar o voto, copie o endereço ${link} e cole no seu browser`, // plain text body
    html: mensa, // html body
  });

}

export const votoStore = async (req, res) => {

  // atribui via desestruturação
  const { nome, email, cerveja_id } = req.body

  // se não informou estes atributos
  if (!nome || !email || !cerveja_id) {
    res.status(400).json({ id: 0, msg: "Favor informar nome, email e cerveja_id do voto" })
    return
  }

  try {
    // obtém da tabela de cerveja todos os registros da marca indicada
    const verifica = await dbKnex("votos").where({ email })

    // se a consulta retornou algum registro (significa que já votou)
    if (verifica.length > 0) {
      res.status(400).json({ id: 0, msg: "Erro... este e-mail já votou" })
      return  
    }
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
    return
  }

  // gera um "hash" (código) que será utilizado no e-mail para o 
  // cliente confirmar o seu voto
  const hash = md5(email+cerveja_id+Date.now())

  try {
    // insere um registro na tabela de votos
    const novo = await dbKnex('votos').insert({ nome, email, cerveja_id, hash_conf: hash })

    // envia e-mail para que o cliente confirme o seu voto
    send_email(nome, email, hash).catch(console.error);

    // novo[0] => retorna o id do registro inserido                     
    res.status(201).json({ id: novo[0], msg: "Confirme o seu voto a partir da sua conta de e-mail" })
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const votoConfirme = async (req, res) => {

  // recebe o hash do voto
  const { hash } = req.params

  // para poder ser acessado fora do bloco
  let voto

  try {
    // obtém da tabela de votos o registro cujo hash é o que foi passado
    // no e-mail
    voto = await dbKnex("votos").where({ hash_conf: hash })

    // se a consulta não retornou algum registro 
    // (significa que o hash é inválido (o cliente poderia estar
    // tentado "burlar" o sistema))
    if (voto.length == 0) {
      res.status(400).json({ id: 0, msg: "Erro... copie corretamente o link" })
      return  
    }    
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
    return
  }

  // define (inicia) uma nova transação
  const trx = await dbKnex.transaction()

  try {
    // 1ª operação da transação
    const novo = await trx('votos')
                 .where({hash_conf: hash}).update({ confirmado: 1 })

    // 2ª operação da transação
    await trx("cerveja")
          .where({ id: voto[0].cerveja_id }).increment({votos: 1})

    // commit (grava) a transação
    await trx.commit()

    res.status(201).send("Ok! Voto confirmado com sucesso")
  } catch (error) {
    // rollback (volta) desfaz a operação realizada
    await trx.rollback()

    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const votoTotais = async (req, res) => {
  try {
    // obtém dados da tabela cerveja
    const consulta = await dbKnex("votos").select("confirmado")
      .count({ num: "*" }).groupBy("confirmado")
    res.status(200).json(consulta)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const votoTotais2 = async (req, res) => {
  try {
    // obtém dados da tabela cerveja
    const consulta1 = await dbKnex("votos")
      .count({ num: "*" }).where({ confirmado: 1 })
    const consulta2 = await dbKnex("votos")
      .count({ num: "*" }).where({ confirmado: 0 })
    res.status(200).json({confirmados: consulta1[0].num, 
                          nao_confirmados: consulta2[0].num})
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}

export const votoPorDia = async (req, res) => {
  try {
    // // obtém da tabela de votos todos os registros
    // const votos = await dbKnex.select("nome", dbKnex.raw("strftime('%d/%m/%Y',data)"))
    //                           .from("votos")

    // obtém dados da tabela cerveja
    const consulta = await dbKnex("votos").select(dbKnex.raw("strftime('%d/%m/%Y',data) as dia"))
      .count({ num: "*" }).groupBy(dbKnex.raw("strftime('%d/%m/%Y',data)"))

    res.status(200).json(consulta)
  } catch (error) {
    res.status(400).json({ id: 0, msg: "Erro: " + error.message })
  }
}
