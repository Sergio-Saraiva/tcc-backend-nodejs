const Respostas = require('../models/Respostas');
const HttpError = require('../models/http-error');
const connection = require('../database');
const Sequelize = require('sequelize');
const Fichas = require('../models/Fichas');
const Discentes = require('../models/Discentes');
const Docentes = require('../models/Docentes');
const Taes = require('../models/Taes');

exports.create = async (req, res, next) => {
  const {
    fichaId,
    docenteId,
    discenteId,
    taeId,
    perguntas,
  } = req.body;

  if (!docenteId && !discenteId && !taeId) {
    const error = new HttpError(
      'É preciso enviar um usuario para cadastrar uma resposta',
      400,
    );
    return next(error);
  }
  if (!fichaId || !perguntas || perguntas.length === 0) {
    const error = new HttpError(
      'Inválido cadastrar Respostas com perguntas vazias',
      400,
    );
    return next(error);
  }
  const bulkCreateRespostas = perguntas.map((pergunta) => {
    return {
      fichas_id: fichaId,
      perguntas_id: pergunta.perguntaId,
      opcao_id: pergunta.optionId,
      docente_id: docenteId,
      discente_id: discenteId,
      is_subjective: pergunta.is_subjective,
      subjective_answer: pergunta.subjective_answer,
      tae_id: taeId,
    }
  })
  const t = await connection.transaction();

  try {
    const createResposta = await Respostas.bulkCreate(bulkCreateRespostas, { individualHooks: true, transaction: t });
    await t.commit();
    return res.status(201).send();
  } catch (err) {
    console.log(err);
    await t.rollback();
    const error = new HttpError('Erro ao inserir no banco', 500);
    return next(error);
  }
};

exports.list = async (req, res, next) => {
  const { filter, range, sort } = req.query;
  const filterParsed = JSON.parse(filter)
  const rangeParsed = JSON.parse(range)
  const sortParsed = JSON.parse(sort)
  let respostas;
  try {
    let searchObj = {
      order: [sortParsed],
    };
    if (filterParsed.fichas) {
      searchObj = {
        ...searchObj,
        include: [{
          model: Fichas,
          as: 'respostasHasFichas',
          where: {
            name: { [Sequelize.Op.like]: `%${filterParsed.fichas}%` }
          }
        }]
      }
    }
    if (filterParsed.discente) {
      searchObj = {
        ...searchObj,
        include: searchObj.include && searchObj.include.length > 0 ?
          [
            ...searchObj.include,
            {
              model: Discentes,
              as: 'respostasHasDiscente',
              where: {
                name: { [Sequelize.Op.like]: `%${filterParsed.discente}%` }
              }
            }
          ]
          :
          [
            {
              model: Discentes,
              as: 'respostasHasDiscente',
              where: {
                name: { [Sequelize.Op.like]: `%${filterParsed.discente}%` }
              }
            }
          ]
      }
    }
    if (filterParsed.docente) {
      searchObj = {
        ...searchObj,
        include: searchObj.include && searchObj.include.length > 0 ?
          [
            ...searchObj.include,
            {
              model: Docentes,
              as: 'respostasHasDocente',
              where: {
                name: { [Sequelize.Op.like]: `%${filterParsed.docente}%` }
              }
            }
          ]
          :
          [
            {
              model: Docentes,
              as: 'respostasHasDocente',
              where: {
                name: { [Sequelize.Op.like]: `%${filterParsed.docente}%` }
              }
            }
          ]
      }
    }
    if (filterParsed.tae) {
      searchObj = {
        ...searchObj,
        include: searchObj.include && searchObj.include.length > 0 ?
          [
            ...searchObj.include,
            {
              model: Taes,
              as: 'respostasHasTaes',
              where: {
                name: { [Sequelize.Op.like]: `%${filterParsed.tae}%` }
              }
            }
          ]
          :
          [
            {
              model: Taes,
              as: 'respostasHasTaes',
              where: {
                name: { [Sequelize.Op.like]: `%${filterParsed.taes}%` }
              }
            }
          ]
      }
    }
    respostas = await Respostas.findAll(searchObj);

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar usuários', 400);
    return next(error);
  }

  return res.status(200).send({ user: respostas.slice(rangeParsed[0], rangeParsed[1]), max: respostas.length });
};
