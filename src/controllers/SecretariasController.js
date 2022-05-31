const Secretarias = require('../models/Secretarias');
const HttpError = require('../models/http-error');
const Taes = require('../models/Taes');
const Sequelize = require('sequelize');

exports.create = async (req, res, next) => {
	const {
		name,
		tae_id,
	} = req.body;

	if (!tae_id || !name) {
		const error = new HttpError(
			'Inválido cadastrar secretaria com algum dos campos vazios',
			400,
		);
		return next(error);
	}

	try {
		let createSecretaria = await Secretarias.create({
			name,
			tae_id,
		});
		const returnData = {
			id: createSecretaria.id,
			name: createSecretaria.name,
			tae_id: createSecretaria.tae_id,
		}
		return res.status(201).send(returnData);
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao inserir secretaria no banco', 500);
		return next(error);
	}
};
exports.listAll = async (req, res, next) => {
	console.log(req.query)
	const { filter, range, sort } = req.query;
	const filterParsed = filter && JSON.parse(filter)
	const rangeParsed = range && JSON.parse(range)
	const sortParsed = sort && JSON.parse(sort)
	let secretarias;
	try {
		let searchObj = {
			order: [sortParsed],
			include: { model: Taes, as: 'secretariaHasTaes' }
		};
		if (filterParsed.name) {
			searchObj = {
				...searchObj,
				where: {
					name: { [Sequelize.Op.like]: `%${filterParsed.name}%` }
				}
			}
		}
		secretarias = await Secretarias.findAll(searchObj);

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar secretarias', 400);
		return next(error);
	}

	return res.status(200).send({ user: secretarias.slice(rangeParsed[0], rangeParsed[1]), max: secretarias.length });
};
exports.listOne = async (req, res, next) => {
	console.log(req.params)
	const { id } = req.params
	let secretaria;
	try {
		secretaria = await Secretarias.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar secretarias', 400);
		return next(error);
	}

	return res.status(200).send(secretaria);
};
exports.update = async (req, res, next) => {
	console.log(req.body)
	const { id } = req.params
	let secretaria;

	try {
		await Secretarias.update({ ...req.body }, { where: { id } });
		secretaria = await Secretarias.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar secretarias', 400);
		return next(error);
	}

	return res.status(200).send(secretaria);
};
exports.delete = async (req, res, next) => {
	const { id } = req.params
	let secretaria;
	try {
		secretaria = await Secretarias.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar secretarias', 400);
		return next(error);
	}

	return res.sendStatus(200).send(secretaria);
};