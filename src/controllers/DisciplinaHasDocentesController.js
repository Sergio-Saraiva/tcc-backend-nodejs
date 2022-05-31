const Sequelize = require('sequelize');
const Docentes = require('../models/Docentes');
const HttpError = require('../models/http-error');
const Disciplinas = require('../models/Disciplinas');
const docentesHasDiciplinas = require('../models/docentesHasDiciplinas');

exports.signup = async (req, res, next) => {
	const {
		disciplina_id,
		docente_id,
		horario
	} = req.body;

	if (!disciplina_id || !docente_id) {
		const error = new HttpError(
			'Inválido cadastrar associação com algum dos campos vazios',
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

		const docHasDiciplinas = await docentesHasDiciplinas.create({
			docente_id,
			disciplina_id,
			horario,
		})
		return res.status(201).send(docHasDiciplinas);
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao inserir associação no banco', 500);
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
		docentes = await docentesHasDiciplinas.findAll(searchObj);

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar associação', 400);
		return next(error);
	}

	return res.status(200).send({ user: docentes.slice(rangeParsed[0], rangeParsed[1]), max: docentes.length });
};
exports.listOne = async (req, res, next) => {
	console.log(req.params)
	const { id } = req.params
	let docente;
	try {
		docente = await docentesHasDiciplinas.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar associação', 400);
		return next(error);
	}

	return res.status(200).send(docente);
};
exports.update = async (req, res, next) => {
	console.log(req.body)
	const { id } = req.params
	let docente;
	try {
		await docentesHasDiciplinas.update({ ...req.body }, { where: { id } });
		docente = await docentesHasDiciplinas.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar associação', 400);
		return next(error);
	}

	return res.status(200).send(docente);
};
exports.delete = async (req, res, next) => {
	const { id } = req.params
	let docente;
	try {
		docente = await docentesHasDiciplinas.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar associação', 400);
		return next(error);
	}

	return res.sendStatus(200).send(docente);
};