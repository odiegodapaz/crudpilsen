import { Router, json } from 'express'
import cors from 'cors'

import { cervejaIbu, cervejaDelete, cervejaIndex, cervejaTeor, cervejaPorRegiao, cervejaPremiadas, cervejaStore, cervejaTotalVotos, cervejaUpdate, cervejaLista, cervejaPdf } from './controllers/CervejaController.js'
import { votoIndex, votoStore, votoConfirme, votoPorDia, votoTotais2 } from './controllers/VotoController.js'
import { adminIndex, adminStore } from './controllers/AdminController.js'
import { loginAdmin } from './controllers/LoginController.js'

import upload from './middlewares/FotoStore.js'
import { verificaLogin } from './middlewares/VerificaLogin.js'

const router = Router()

router.use(json())

// libera acesso ao Web Service, a partir de origens diferentes
router.use(cors())

// define as rotas de cadastro das cervejas
router.get('/cervejas', cervejaIndex)
      .post('/cervejas', upload.single('foto'), cervejaStore)
      .put('/cervejas/:id', cervejaUpdate)
      .delete('/cervejas/:id', cervejaDelete)
      .get('/cervejas/teor', cervejaTeor)
      .get('/cervejas/ibu', cervejaIbu)
      .get('/cervejas/regiao', cervejaPorRegiao)
      .get('/cervejas/premiadas', cervejaPremiadas)
      .get('/cervejas/total_votos', cervejaTotalVotos)
      .get('/cervejas/lista', cervejaLista)
      .get('/cervejas/pdf', cervejaPdf)

// define as rotas de cadastro dos votos
router.get('/votos', votoIndex)
      .post('/votos', votoStore)
      .get('/votos/confirma/:hash', votoConfirme)
      .get('/votos/totais', votoTotais2)
      .get('/votos/diarios', votoPorDia)

// define as rotas de cadastro dos admins
router.get('/admins', adminIndex)
      .post('/admins', adminStore)

// define a rota de login
router.get('/login', loginAdmin)



export default router