const Perguntas = require('../models/Perguntas');
const HttpError = require('../models/http-error');
const Sequelize = require('sequelize');

exports.create = async (req, res, next) => {
  const {
    pergunta,
    ficha_id,
    isSubjective
  } = req.body;
  console.log(req.body)
  if (!ficha_id || !pergunta) {
    const error = new HttpError(
      'Inválido cadastrar Perguntas com algum dos campos vazios',
      400,
    );
    return next(error);
  }

  try {
    let createFicha = await Perguntas.create({
      pergunta,
      ficha_id,
      is_subjective: isSubjective
    });
    const returnData = {
      id: createFicha.id,
      pergunta: createFicha.pergunta,
      ficha_id: createFicha.ficha_id,
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
  let perguntas;
  try {
    let searchObj = {
      order: [sortParsed],
    };
    if (filterParsed.pergunta) {
      searchObj = {
        ...searchObj,
        where: {
          pergunta: { [Sequelize.Op.like]: `%${filterParsed.pergunta}%` }
        }
      }
    }

    perguntas = await Perguntas.findAll(searchObj);

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar pergunta', 400);
    return next(error);
  }

  return res.status(200).send({ user: perguntas.slice(rangeParsed[0], rangeParsed[1]), max: perguntas.length });
};
exports.listOne = async (req, res, next) => {
  console.log(req.params)
  const { id } = req.params
  let pergunta;
  try {
    pergunta = await Perguntas.findOne({ where: { id } });

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar pergunta', 400);
    return next(error);
  }

  return res.status(200).send(pergunta);
};
exports.update = async (req, res, next) => {
  console.log(req.body)
  const { id } = req.params
  let pergunta;

  try {
    await Perguntas.update({ ...req.body }, { where: { id } });
    pergunta = await Perguntas.findOne({ where: { id } });

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar pergunta', 400);
    return next(error);
  }

  return res.status(200).send(pergunta);
};
exports.delete = async (req, res, next) => {
  const { id } = req.params
  let pergunta;
  try {
    pergunta = await Perguntas.destroy({ where: { id } });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar pergunta', 400);
    return next(error);
  }

  return res.sendStatus(200).send(pergunta);
};
