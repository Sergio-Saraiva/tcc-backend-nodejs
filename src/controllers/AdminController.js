const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Admin = require('../models/Admin');
const HttpError = require('../models/http-error');

exports.signUp = async (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  let hashedPassword;

  if (
    !email ||
    !password ||
    !name
  ) {
    const error = new HttpError(
      'Inválido cadastrar admin com algum dos campos vazios',
      400,
    );
    return next(error);
  }

  try {
    let checkAdmin = await Admin.findOne({ where: { email: email } });
    if (checkAdmin) {
      const error = new HttpError(
        'Já existe um admin registrado com esse email',
        400,
      );
      return next(error);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar usuários', 400);
    return next(error);
  }

  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao gerar token', 500);
    return next(error);
  }

  try {
    let createAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });
    const returnData = {
      id: createAdmin.id,
      name: createAdmin.name,
      email: createAdmin.email,
    }
    return res.status(201).send(returnData);
  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao inserir usuário no banco', 500);
    return next(error);
  }
};

exports.listAll = async (req, res, next) => {
  console.log(req.query)
  const { filter, range, sort } = req.query;
  const filterParsed = JSON.parse(filter)
  const rangeParsed = JSON.parse(range)
  const sortParsed = JSON.parse(sort)
  let users;
  try {
    let searchObj = {
      order: [sortParsed],
    };
    if (filterParsed.email) {
      searchObj = {
        ...searchObj,
        where: {
          email: { [Sequelize.Op.like]: `%${filterParsed.email}%` }
        }
      }
    }
    users = await Admin.findAll(searchObj);

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar usuários', 400);
    return next(error);
  }

  return res.status(200).send({ user: users.slice(rangeParsed[0], rangeParsed[1]), max: users.length });
};
exports.listOne = async (req, res, next) => {
  console.log(req.params)
  const { id } = req.params
  let admin;
  try {
    admin = await Admin.findOne({ where: { id } });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar usuários', 400);
    return next(error);
  }

  return res.status(200).send(admin);
};
exports.update = async (req, res, next) => {
  console.log(req.body)
  const { id } = req.params
  let admin;
  let hashedPassword;
  if (req.body.password && req.body.password.length > 0) {
    try {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    } catch (err) {
      console.log(err);
      const error = new HttpError('Erro ao gerar token', 500);
      return next(error);
    }
  }
  try {
    await Admin.update({ ...req.body, password: hashedPassword }, { where: { id } });
    admin = await Admin.findOne({ where: { id } });

  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar usuários', 400);
    return next(error);
  }

  return res.status(200).send(admin);
};
exports.delete = async (req, res, next) => {
  const { id } = req.params
  try {
    await Admin.destroy({ where: { id } });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Erro ao consultar usuários', 400);
    return next(error);
  }
  return res.sendStatus(204)
};
