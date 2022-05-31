const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Discentes = require('../models/Discentes');
const HttpError = require('../models/http-error');

exports.signUp = async (req, res, next) => {
	const {
		email,
		password,
		name,
		areaConcetracao,
		linhaPesquisa,
		edital,
		defesa,
	} = req.body;
	let hashedPassword;

	if (
		!email ||
		!password ||
		!name ||
		!areaConcetracao ||
		!linhaPesquisa ||
		!edital ||
		!defesa
	) {
		const error = new HttpError(
			'Inválido cadastrar usuário com algum dos campos vazios',
			400,
		);
		return next(error);
	}

	try {
		let checkDiscentes = await Discentes.findOne({ where: { email: email } });
		if (checkDiscentes) {
			const error = new HttpError(
				'Já existe usuário registrado com esse email',
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
		let createDiscentes = await Discentes.create({
			name,
			email,
			password: hashedPassword,
			areaConcetracao,
			linhaPesquisa,
			edital,
			defesa
		});
		const returnData = {
			id: createDiscentes.id,
			name: createDiscentes.name,
			email: createDiscentes.email,
			areaConcetracao: createDiscentes.areaConcetracao,
			linhaPesquisa: createDiscentes.linhaPesquisa,
			edital: createDiscentes.edital,
			defesa: createDiscentes.defesa,
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
		users = await Discentes.findAll(searchObj);

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
	let docente;
	try {
		docente = await Discentes.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar usuários', 400);
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
		await Discentes.update({ ...req.body, password: hashedPassword }, { where: { id } });
		docente = await Discentes.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar usuários', 400);
		return next(error);
	}

	return res.status(200).send(docente);
};
exports.delete = async (req, res, next) => {
	const { id } = req.params
	let docente;
	try {
		docente = await Discentes.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar usuários', 400);
		return next(error);
	}

	return res.sendStatus(200).send(docente);
};