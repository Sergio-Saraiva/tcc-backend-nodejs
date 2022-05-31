const Fichas = require('../models/Fichas');
const HttpError = require('../models/http-error');
const Sequelize = require('sequelize');
const Perguntas = require('../models/Perguntas');
const Opcoes = require('../models/Opcoes');
const connection = require('../database');
exports.create = async (req, res, next) => {
  const {
    fichas,
    tema_id,
  } = req.body;
  if (!tema_id || !fichas || fichas.length <= 0) {
    const error = new HttpError(
      'Inválido cadastrar Fichas com algum dos campos vazios',
      400,
    );
    return next(error);
  }
  let createFichas
  let createPerguntas
  let createOpcoes
  let fichasArray
  let perguntasArray = []
  let opcoesArray = []
  console.log(fichas[0].perguntas)
  try {
    fichasArray = fichas.map((obj1, i) => {
      const perguntas = obj1.perguntas.map((obj2, j) => {
        const opcao = obj2.opcoes.map(obj3 => {
          return { name: obj3.name, pergunta_id: j }
        })
        opcoesArray.push(...opcao)
        return { pergunta: obj2.pergunta, ficha_id: i, is_subjective: obj2.isSubject }
      })
      perguntasArray.push(...perguntas)
      return { name: obj1.name, tema_id }
    })
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Inválido cadastrar Fichas com perguntas/opcoes vazias',
      400,
    );
    return next(error);
  }
  console.log(fichasArray)
  console.log(perguntasArray)
  console.log(opcoesArray)
  const t = await connection.transaction();
  try {
    createFichas = await Fichas.bulkCreate(fichasArray, { individualHooks: true, transaction: t });
    perguntasArray = perguntasArray.map((obj) => {
      return { ...obj, ficha_id: createFichas[obj.ficha_id].id }
    })
    createPerguntas = await Perguntas.bulkCreate(perguntasArray, { individualHooks: true, transaction: t });
    opcoesArray = opcoesArray.map((obj) => { return { ...obj, pergunta_id: createPerguntas[obj.pergunta_id].id } })
    createOpcoes = await Opcoes.bulkCreate(opcoesArray, { individualHooks: true, transaction: t });
    await t.commit();
    return res.status(201).send({ fichas: createFichas, perguntas: createPerguntas, opcoes: opcoesArray });
  } catch (err) {
    console.log(err);
    await t.rollback();
    const error = new HttpError('Erro ao inserir no banco', 500);
    return next(error);
  }

};
exports.listAll = async (req, res, next) => {
  console.log(req.query)
  const { filter, range, sort } = req.query;
  const filterParsed = JSON.parse(filter)
  const rangeParsed = JSON.parse(range)
  const sortParsed = JSON.parse(sort)
  let fichas;
  try {
    let searchObj = {
      order: [sortParsed],
    };
    if (filterParsed.name) {
      searchObj = {
        ...searchObj,
        where: {
          name: { [Sequelize.Op.like]: `%${filterParsed.name}%` }
        }
      }
    }
    if (filterParsed.id) {
      searchObj = {
        ...searchObj,
        where: {
          id: filterParsed.id,
        }
      }
    }
    fichas = await Fichas.findAll(searchObj);

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar fichas', 400);
    return next(error);
  }

  return res.status(200).send({ user: fichas.slice(rangeParsed[0], rangeParsed[1]), max: fichas.length });
};
exports.listOne = async (req, res, next) => {
  const { id } = req.params
  let ficha;
  try {
    ficha = await Fichas.findOne({ where: { id } });
    perguntas = await Perguntas.findAll({ where: { ficha_id: ficha.id } })
    const options = []
    for await (let pergunta of perguntas) {
      const op = await Opcoes.findAll({ where: { pergunta_id: pergunta.id } })
      options.push(op)
    }
    const formattedPerguntas = perguntas.map((pergunta, index) => {
      return {
        ...pergunta.dataValues,
        options: options[index]
      }
    })
    const data = {
      fichaId: ficha.id,
      fichaName: ficha.name,
      perguntas: formattedPerguntas
    }
    return res.status(200).send(data);

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar fichas', 400);
    return next(error);
  }

};
exports.update = async (req, res, next) => {
  console.log(req.body)
  const { id } = req.params
  let ficha;

  try {
    await Fichas.update({ ...req.body }, { where: { id } });
    ficha = await Fichas.findOne({ where: { id } });

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar fichas', 400);
    return next(error);
  }

  return res.status(200).send(ficha);
};
exports.delete = async (req, res, next) => {
  const { id } = req.params
  let ficha;
  try {
    ficha = await Fichas.destroy({ where: { id } });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar fichas', 400);
    return next(error);
  }

  return res.sendStatus(200).send(ficha);
};
