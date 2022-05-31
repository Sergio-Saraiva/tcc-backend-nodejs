const Disciplinas = require('../models/Disciplinas');
const HttpError = require('../models/http-error');
const Docentes = require('../models/Docentes');
const Discentes = require('../models/Discentes');
const Sequelize = require('sequelize');

exports.create = async (req, res, next) => {
	const {
		name,
		ano,
		semestre
	} = req.body;

	if (!ano || !name || !semestre) {
		const error = new HttpError(
			'Inválido cadastrar disciplina com algum dos campos vazios',
			400,
		);
		return next(error);
	}

	try {
		let createDisciplina = await Disciplinas.create({
			name,
			ano,
			semestre
		});
		const returnData = {
			id: createDisciplina.id,
			name: createDisciplina.name,
			ano: createDisciplina.ano,
			semestre: createDisciplina.semestre,
		}
		return res.status(201).send(returnData);
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao inserir diciplina no banco', 500);
		return next(error);
	}
};

exports.listAll = async (req, res, next) => {
	console.log(req.query)
	const { filter, range, sort } = req.query;
	const filterParsed = filter && JSON.parse(filter)
	const rangeParsed = range && JSON.parse(range)
	const sortParsed = sort && JSON.parse(sort)
	let disciplinas;
	try {
		let searchObj = {
			order: [sortParsed],
		};
		if (filterParsed.name) {
			searchObj = {
				...searchObj,
				where: {
					name: { [Sequelize.Op.like]: `%${filterParsed.name}%` }
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
		disciplinas = await Disciplinas.findAll(searchObj);

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar disciplinas', 400);
		return next(error);
	}

	return res.status(200).send({ user: disciplinas.slice(rangeParsed[0], rangeParsed[1]), max: disciplinas.length });
};
exports.listOne = async (req, res, next) => {
	console.log(req.params)
	const { id } = req.params
	let disciplina;
	try {
		disciplina = await Disciplinas.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar disciplinas', 400);
		return next(error);
	}

	return res.status(200).send(disciplina);
};
exports.update = async (req, res, next) => {
	console.log(req.body)
	const { id } = req.params
	let disciplina;
	try {
		await Disciplinas.update({ ...req.body }, { where: { id } });
		disciplina = await Disciplinas.findOne({
			where: { id },
			include: [
				{
					model: Docentes,
					through: 'docentes_has_diciplinas',
					as: 'disciplinaHasDocentes',
					attributes: ['name']
				},
				{
					model: Discentes,
					through: 'discentes_has_diciplinas',
					as: 'disciplinaHasDiscentes',
					attributes: ['name']
				},

			]
		});

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar disciplinas', 400);
		return next(error);
	}

	return res.status(200).send(disciplina);
};
exports.delete = async (req, res, next) => {
	const { id } = req.params
	let disciplina;
	try {
		disciplina = await Disciplinas.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar disciplinas', 400);
		return next(error);
	}

	return res.sendStatus(200).send(disciplina);
};