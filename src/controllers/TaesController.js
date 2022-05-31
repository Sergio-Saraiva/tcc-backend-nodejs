const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Taes = require('../models/Taes');
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
			'Inválido cadastrar tae com algum dos campos vazios',
			400,
		);
		return next(error);
	}

	try {
		let checkTaes = await Taes.findOne({ where: { email: email } });
		if (checkTaes) {
			const error = new HttpError(
				'Já existe tae registrado com esse email',
				400,
			);
			return next(error);
		}
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar taes', 400);
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
		let createTaes = await Taes.create({
			name,
			email,
			password: hashedPassword,
		});
		const returnData = {
			id: createTaes.id,
			name: createTaes.name,
			email: createTaes.email,
		}
		return res.status(201).send(returnData);
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao inserir tae no banco', 500);
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
					email: { [Sequelize.Op.like]: `%${filterParsed.email}%` },

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
		users = await Taes.findAll(searchObj);

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar taes', 400);
		return next(error);
	}
	// console.log(users)
	return res.status(200).send({ user: users.slice(rangeParsed[0], rangeParsed[1]), max: users.length });
};
exports.listOne = async (req, res, next) => {
	console.log(req.params)
	const { id } = req.params
	let docente;
	try {
		docente = await Taes.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar taes', 400);
		return next(error);
	}

	return res.status(200).send(docente);
};
exports.update = async (req, res, next) => {
	console.log(req.body)
	const { id } = req.params
	let docente;
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
		await Taes.update({ ...req.body, password: hashedPassword }, { where: { id } });
		docente = await Taes.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar taes', 400);
		return next(error);
	}

	return res.status(200).send(docente);
};
exports.delete = async (req, res, next) => {
	const { id } = req.params
	let docente;
	try {
		docente = await Taes.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar taes', 400);
		return next(error);
	}

	return res.sendStatus(200).send(docente);
};