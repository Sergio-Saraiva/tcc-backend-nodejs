const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Docentes = require('../models/Docentes');
const HttpError = require('../models/http-error');

exports.signUp = async (req, res, next) => {
	const {
		email,
		password,
		name,
		areaConcetracao,
		linhaPesquisa,
		ppg,
		coordenador
	} = req.body;
	let hashedPassword;

	if (
		!email ||
		!password ||
		!name ||
		!areaConcetracao ||
		!linhaPesquisa ||
		!ppg
	) {
		const error = new HttpError(
			'Inválido cadastrar usuário com algum dos campos vazios',
			400,
		);
		return next(error);
	}

	try {
		let checkDocentes = await Docentes.findOne({ where: { email: email } });
		if (checkDocentes) {
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
		let createDocentes = await Docentes.create({
			name,
			email,
			password: hashedPassword,
			areaConcetracao,
			linhaPesquisa,
			ppg,
			coordenador
		});
		const returnData = {
			id: createDocentes.id,
			name: createDocentes.name,
			email: createDocentes.email,
			areaConcetracao: createDocentes.areaConcetracao,
			linhaPesquisa: createDocentes.linhaPesquisa,
			ppg: createDocentes.ppg,
			coordenador: createDocentes.coordenador,
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
	let docentes;
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
		if (filterParsed.id) {
			searchObj = {
				...searchObj,
				where: {
					id: filterParsed.id,
				}
			}
		}
		docentes = await Docentes.findAll(searchObj);

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar usuários', 400);
		return next(error);
	}

	return res.status(200).send({ user: docentes.slice(rangeParsed[0], rangeParsed[1]), max: docentes.length });
};
exports.listOne = async (req, res, next) => {
	console.log(req.params)
	const { id } = req.params
	let docente;
	try {
		docente = await Docentes.findOne({ where: { id } });

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
		await Docentes.update({ ...req.body, password: hashedPassword }, { where: { id } });
		docente = await Docentes.findOne({ where: { id } });

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
		docente = await Docentes.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar usuários', 400);
		return next(error);
	}

	return res.sendStatus(200).send(docente);
};