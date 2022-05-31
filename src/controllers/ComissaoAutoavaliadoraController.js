const ComissaoAutoavaliadora = require('../models/ComissaoAutoavaliadora');
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
			'Inválido cadastrar ComissaoAutoavaliadora com algum dos campos vazios',
			400,
		);
		return next(error);
	}

	try {
		let createComissaoAutoavaliadora = await ComissaoAutoavaliadora.create({
			tae_id,
			name,
		});
		const returnData = {
			id: createComissaoAutoavaliadora.id,
			name: createComissaoAutoavaliadora.name,
			tae_id: createComissaoAutoavaliadora.tae_id,
		}
		return res.status(201).send(returnData);
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao inserir comissao no banco', 500);
		return next(error);
	}
};

exports.listAll = async (req, res, next) => {
	console.log(req.query)
	const { filter, range, sort } = req.query;
	const filterParsed = filter && JSON.parse(filter)
	const rangeParsed = range && JSON.parse(range)
	const sortParsed = sort && JSON.parse(sort)
	let comissoes;
	try {
		let searchObj = {
			order: [sortParsed],
			include: { model: Taes, as: 'comissaoHasTaes' }
		};
		if (filterParsed.name) {
			searchObj = {
				...searchObj,
				where: {
					name: { [Sequelize.Op.like]: `%${filterParsed.name}%` }
				}
			}
		}
		comissoes = await ComissaoAutoavaliadora.findAll(searchObj);

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar comissao', 400);
		return next(error);
	}

	return res.status(200).send({ user: comissoes.slice(rangeParsed[0], rangeParsed[1]), max: comissoes.length });
};
exports.listOne = async (req, res, next) => {
	console.log(req.params)
	const { id } = req.params
	let comissao;
	try {
		comissao = await ComissaoAutoavaliadora.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar comissao', 400);
		return next(error);
	}

	return res.status(200).send(comissao);
};
exports.update = async (req, res, next) => {
	console.log(req.body)
	const { id } = req.params
	let comissao;

	try {
		await ComissaoAutoavaliadora.update({ ...req.body }, { where: { id } });
		comissao = await ComissaoAutoavaliadora.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar comissao', 400);
		return next(error);
	}

	return res.status(200).send(comissao);
};
exports.delete = async (req, res, next) => {
	const { id } = req.params
	let comissao;
	try {
		comissao = await ComissaoAutoavaliadora.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar comissao', 400);
		return next(error);
	}

	return res.sendStatus(200).send(comissao);
};