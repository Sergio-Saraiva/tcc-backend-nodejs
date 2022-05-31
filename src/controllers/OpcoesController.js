const Opcoes = require('../models/Opcoes');
const HttpError = require('../models/http-error');
const Sequelize = require('sequelize');

exports.create = async (req, res, next) => {
  const {
    name,
    pergunta_id,
  } = req.body;
  let nameDefault = name
  console.log(req.body)
  if (!pergunta_id) {
    const error = new HttpError(
      'Inválido cadastrar Opcoes com algum dos campos vazios',
      400,
    );
    return next(error);
  }
  if (!name) {
    nameDefault = 'R.:'
  }
  try {
    let createOpção = await Opcoes.create({
      name: nameDefault,
      pergunta_id,
    });
    const returnData = {
      id: createOpção.id,
      name: createOpção.name,
      pergunta_id: createOpção.pergunta_id,
    }
    return res.status(201).send(returnData);
  } catch (err) {
    console.log(err);
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
  let opcoes;
  try {
    let searchObj = {
      order: [sortParsed],
    };
    if (filterParsed.opcao) {
      searchObj = {
        ...searchObj,
        where: {
          name: { [Sequelize.Op.like]: `%${filterParsed.opcao}%` }
        }
      }
    }

    opcoes = await Opcoes.findAll(searchObj);

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar opçoes', 400);
    return next(error);
  }

  return res.status(200).send({ user: opcoes.slice(rangeParsed[0], rangeParsed[1]), max: opcoes.length });
};
exports.listOne = async (req, res, next) => {
  console.log(req.params)
  const { id } = req.params
  let opcao;
  try {
    opcao = await Opcoes.findOne({ where: { id } });

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar opçoes', 400);
    return next(error);
  }

  return res.status(200).send(opcao);
};
exports.update = async (req, res, next) => {
  console.log(req.body)
  const { id } = req.params
  let opcao;

  try {
    await Opcoes.update({ ...req.body }, { where: { id } });
    opcao = await Opcoes.findOne({ where: { id } });

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar opçoes', 400);
    return next(error);
  }

  return res.status(200).send(opcao);
};
exports.delete = async (req, res, next) => {
  const { id } = req.params
  let opcao;
  try {
    opcao = await Opcoes.destroy({ where: { id } });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar opçoes', 400);
    return next(error);
  }

  return res.sendStatus(200).send(opcao);
};
