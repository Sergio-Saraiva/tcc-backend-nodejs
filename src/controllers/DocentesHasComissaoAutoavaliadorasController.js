const Sequelize = require('sequelize');
const Docentes = require('../models/Docentes');
const HttpError = require('../models/http-error');
const ComissaoAutoavaliadora = require('../models/ComissaoAutoavaliadora');
const docentesHasComissaoAutoavaliadoras = require('../models/docentesHasComissaoAutoavaliadoras');

exports.signup = async (req, res, next) => {
	const {
		comissaoAutoavaliadora_id,
		docente_id,

	} = req.body;

	if (!comissaoAutoavaliadora_id || !docente_id) {
		const error = new HttpError(
			'Inválido cadastrar usuário com algum dos campos vazios',
			400,
		);
		return next(error);
	}

	let docente;
	try {
		docente = await Docentes.findOne({ where: { id: docente_id } });
		if (!docente) {
			throw new Error('docente nao existe')
		}
	} catch (error) {
		return new HttpError(
			error,
			400,
		);
	}
	let comissao;
	try {
		comissao = await ComissaoAutoavaliadora.findOne({ where: { id: comissaoAutoavaliadora_id } });
		if (!comissao) {
			throw new Error('comissao nao existe')
		}
	} catch (error) {
		return new HttpError(
			error,
			400,
		);
	}

	try {

		const docHasComissao = await docentesHasComissaoAutoavaliadoras.create({
			docente_id,
			comissaoAutoavaliadora_id,
		})
		return res.status(201).send(docHasComissao);
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
		if (filterParsed.comissaoName) {
			searchObj = {
				...searchObj,
				include: [
					{
						model: ComissaoAutoavaliadora,
						as: 'comissao',
						attr: ['name'],
						where: {
							name: { [Sequelize.Op.like]: `%${filterParsed.comissaoName}%` }
						}
					},
				]
			}
		}
		if (filterParsed.docenteName) {
			searchObj = {
				...searchObj,
				include: [
					{
						model: Docentes,
						as: 'docente',
						attr: ['name'],
						where: {
							name: { [Sequelize.Op.like]: `%${filterParsed.docenteName}%` }
						}
					},
				]
			}
		}
		docentes = await docentesHasComissaoAutoavaliadoras.findAll(searchObj);

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
		docente = await docentesHasComissaoAutoavaliadoras.findOne({ where: { id } });

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
	try {
		await docentesHasComissaoAutoavaliadoras.update({ ...req.body }, { where: { id } });
		docente = await docentesHasComissaoAutoavaliadoras.findOne({ where: { id } });

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
		docente = await docentesHasComissaoAutoavaliadoras.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar usuários', 400);
		return next(error);
	}

	return res.sendStatus(200).send(docente);
};