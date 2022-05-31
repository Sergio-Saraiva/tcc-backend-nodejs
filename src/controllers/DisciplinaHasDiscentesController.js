const Sequelize = require('sequelize');
const Discentes = require('../models/Discentes');
const HttpError = require('../models/http-error');
const Disciplinas = require('../models/Disciplinas');
const discentesHasDiciplinas = require('../models/discentesHasDiciplinas');

exports.signup = async (req, res, next) => {
	const {
		disciplina_id,
		discente_id,
		horario
	} = req.body;

	if (!disciplina_id || !discente_id) {
		const error = new HttpError(
			'Inválido associar disciplina ao discente com algum dos campos vazios',
			400,
		);
		return next(error);
	}

	let discente;
	try {
		discente = await Discentes.findOne({ where: { id: discente_id } });
		if (!discente) {
			throw new Error('discente nao existe')
		}
	} catch (error) {
		return new HttpError(
			error,
			400,
		);
	}
	let disciplina;
	try {
		disciplina = await Disciplinas.findOne({ where: { id: disciplina_id } });
		if (!disciplina) {
			throw new Error('disciplina nao existe')
		}
	} catch (error) {
		return new HttpError(
			error,
			400,
		);
	}

	try {

		const docHasDiciplinas = await discentesHasDiciplinas.create({
			discente_id,
			disciplina_id,
			horario,
		})
		return res.status(201).send(docHasDiciplinas);
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao inserir associaçao no banco', 500);
		return next(error);
	}
};

exports.listAll = async (req, res, next) => {
	console.log(req.query)
	const { filter, range, sort } = req.query;
	const filterParsed = JSON.parse(filter)
	const rangeParsed = JSON.parse(range)
	const sortParsed = JSON.parse(sort)
	let discentes;
	try {
		let searchObj = {
			order: [sortParsed],
		};
		if (filterParsed.disciplinaName) {
			searchObj = {
				...searchObj,
				include: [
					{
						model: Disciplinas,
						as: 'disciplina',
						attr: ['name'],
						where: {
							name: { [Sequelize.Op.like]: `%${filterParsed.disciplinaName}%` }
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
						as: 'discente',
						attr: ['name'],
						where: {
							name: { [Sequelize.Op.like]: `%${filterParsed.discenteName}%` }
						}
					},
				]
			}
		}
		discentes = await discentesHasDiciplinas.findAll(searchObj);

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar associação', 400);
		return next(error);
	}

	return res.status(200).send({ user: discentes.slice(rangeParsed[0], rangeParsed[1]), max: discentes.length });
};
exports.listOne = async (req, res, next) => {
	console.log(req.params)
	const { id } = req.params
	let discente;
	try {
		discente = await discentesHasDiciplinas.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar associação', 400);
		return next(error);
	}

	return res.status(200).send(discente);
};
exports.update = async (req, res, next) => {
	console.log(req.body)
	const { id } = req.params
	let discente;
	try {
		await discentesHasDiciplinas.update({ ...req.body }, { where: { id } });
		discente = await discentesHasDiciplinas.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar associação', 400);
		return next(error);
	}

	return res.status(200).send(discente);
};
exports.delete = async (req, res, next) => {
	const { id } = req.params
	let discente;
	try {
		discente = await discentesHasDiciplinas.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar associação', 400);
		return next(error);
	}

	return res.sendStatus(200).send(discente);
};