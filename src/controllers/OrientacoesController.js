const Orientacoes = require('../models/Orientacoes');
const HttpError = require('../models/http-error');
const Discentes = require('../models/Discentes');
const Docentes = require('../models/Docentes');
const Sequelize = require('sequelize');

exports.create = async (req, res, next) => {
	const {
		discente_id,
		orientador_id,
		coorientador_id,
	} = req.body;
	console.log(req.body)
	if (!discente_id || !orientador_id) {
		const error = new HttpError(
			'Inválido cadastrar orientacao com algum dos campos vazios',
			400,
		);
		return next(error);
	}

	try {
		let createOrientacao = await Orientacoes.create({
			discente_id,
			orientador_id,
			coorientador_id,
		});
		const returnData = {
			id: createOrientacao.id,
			discente_id: createOrientacao.discente_id,
			orientador_id: createOrientacao.orientador_id,
			coorientador_id: createOrientacao.coorientador_id,
		}
		return res.status(201).send(returnData);
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao inserir orientação no banco', 500);
		return next(error);
	}
};

exports.listAll = async (req, res, next) => {
	console.log(req.query)
	const { filter, range, sort } = req.query;
	const filterParsed = filter && JSON.parse(filter)
	const rangeParsed = range && JSON.parse(range)
	const sortParsed = sort && JSON.parse(sort)
	let orientacoes;
	try {
		let searchObj = {
			order: [sortParsed],
		};
		if (filterParsed.orientadorName) {
			searchObj = {
				...searchObj,
				include: [
					{
						model: Docentes,
						as: 'orientacaoHasOrientador',
						attr: ['name'],
						where: {
							name: { [Sequelize.Op.like]: `%${filterParsed.orientadorName}%` }
						}
					},
				]
			}
		}
		if (filterParsed.coorientadorName) {
			searchObj = {
				...searchObj,
				include: [
					{
						model: Docentes,
						as: 'orientacaoHasCoorientador',
						attr: ['name'],
						where: {
							name: { [Sequelize.Op.like]: `%${filterParsed.coorientadorName}%` }
						}
					},
				]
			}
		}
		if (filterParsed.discenteName) {
			searchObj = {
				...searchObj,
				include: [
					{
						model: Discentes,
						as: 'orientacaoHasDiscente',
						attr: ['name'],
						where: {
							name: { [Sequelize.Op.like]: `%${filterParsed.discenteName}%` }
						}
					},
				]
			}
		}
		orientacoes = await Orientacoes.findAll(searchObj);

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar orientações', 400);
		return next(error);
	}

	return res.status(200).send({ user: orientacoes.slice(rangeParsed[0], rangeParsed[1]), max: orientacoes.length });
};
exports.listOne = async (req, res, next) => {
	console.log(req.params)
	const { id } = req.params
	let orientacao;
	try {
		orientacao = await Orientacoes.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar orientações', 400);
		return next(error);
	}

	return res.status(200).send(orientacao);
};
exports.update = async (req, res, next) => {
	console.log(req.body)
	const { id } = req.params
	let orientacao;
	try {
		await Orientacoes.update({ ...req.body }, { where: { id } });
		orientacao = await Orientacoes.findOne({
			where: { id },
			include: [
				{
					model: Docentes,
					as: 'orientacaoHasOrientador',
					attr: ['name'],
				},
				{
					model: Docentes,
					as: 'orientacaoHasCoorientador',
					attr: ['name'],
				},
				{
					model: Discentes,
					as: 'orientacaoHasDiscente',
					attributes: ['name']
				},

			]
		});

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar orientações', 400);
		return next(error);
	}

	return res.status(200).send(orientacao);
};
exports.delete = async (req, res, next) => {
	const { id } = req.params
	let orientacao;
	try {
		orientacao = await Orientacoes.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar orientações', 400);
		return next(error);
	}

	return res.sendStatus(200).send(orientacao);
};