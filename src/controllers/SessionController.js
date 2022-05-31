const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Docentes = require("../models/Docentes");
const Discentes = require("../models/Discentes");
const Taes = require("../models/Taes");
const Admin = require("../models/Admin");
const HttpError = require("../models/http-error");

exports.login = async (req, res, next) => {
  const { email, password, type } = req.body;
  if (!email || !password || !type) {
    const error = new HttpError(
      "Inválido logar usuário com algum dos campos vazios",
      400
    );
    return next(error);
  }

  let user;
  try {
    switch (type) {
      case "docente":
        user = await Docentes.scope("withPassword").findOne({
          where: { email: email },
        });
        break;
      case "discente":
        user = await Discentes.scope("withPassword").findOne({
          where: { email: email },
        });
        break;
      case "tae":
        user = await Taes.scope("withPassword").findOne({
          where: { email: email },
        });
        break;
      case "admin":
        user = await Admin.scope("withPassword").findOne({
          where: { email: email },
        });
        break;

      default:
        user = await Docentes.scope("withPassword").findOne({
          where: { email: email },
        });
        break;
    }
    if (!user) {
      const error = new HttpError("Usuário não encontrado com esse email", 400);
      return next(error);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Falha no login", 500);
    return next(error);
  }
  try {
    let isValid = await bcrypt.compare(password, user.password);
    if (isValid === false) {
      const error = new HttpError("Email e(ou) senha incorreto(s)", 400);
      return next(error);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Erro no bcrypt", 500);
    return next(error);
  }
  try {
    const token = jwt.sign(
      {
        userID: user.id,
        email: user.email,
        type: type,
      },
      type === "admin" ? process.env.JWT_ADMIN_KEY : process.env.JWT_USER_KEY,
      {
        expiresIn: "7d",
      }
    );
    const aux = user.dataValues;
    return res.status(200).send({
      id: aux.id,
      name: aux.name,
      email: aux.email,
      token: token,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Falha ao gerar token", 500);
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await Docentes.findOne({ where: { email: email } });
    console.log(user);
    if (!user) {
      return next(new HttpError("Não existe usuário com este email", 404));
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Erro ao buscar usuário", 500);
    return next(error);
  }

  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Erro ao gerar token", 500);
    return next(error);
  }

  user.password = hashedPassword;
  user.save();
  return res.status(200).json("Senha atualizada");
};
