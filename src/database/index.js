const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Docentes = require('../models/Docentes');
const Discentes = require('../models/Discentes');
const Taes = require('../models/Taes');
const Secretarias = require('../models/Secretarias');
const Disciplinas = require('../models/Disciplinas');
const docentesHasDiciplinas = require('../models/docentesHasDiciplinas');
const discentesHasDiciplinas = require('../models/discentesHasDiciplinas');
const ComissaoAutoavaliadora = require('../models/ComissaoAutoavaliadora');
const discentesHasComissaoAutoavaliadoras = require('../models/discentesHasComissaoAutoavaliadoras');
const docentesHasComissaoAutoavaliadoras = require('../models/docentesHasComissaoAutoavaliadoras');
const Orientacoes = require('../models/Orientacoes');
const BancaAvaliadora = require('../models/BancaAvaliadora');
const Temas = require('../models/Temas');
const Fichas = require('../models/Fichas');
const Perguntas = require('../models/Perguntas');
const Opcoes = require('../models/Opcoes');
const Respostas = require('../models/Respostas');
const Admin = require('../models/Admin');

const connection = new Sequelize(dbConfig);

const models = [
  Docentes,
  Discentes,
  Taes,
  Secretarias,
  Disciplinas,
  docentesHasDiciplinas,
  discentesHasDiciplinas,
  ComissaoAutoavaliadora,
  discentesHasComissaoAutoavaliadoras,
  docentesHasComissaoAutoavaliadoras,
  Orientacoes,
  BancaAvaliadora,
  Temas,
  Fichas,
  Perguntas,
  Opcoes,
  Respostas,
  Admin
]

models.map(model => model.init(connection))
models.map(model => model.associate && model.associate(connection.models))


module.exports = connection;
