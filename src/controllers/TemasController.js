const Temas = require('../models/Temas');
const HttpError = require('../models/http-error');
const Sequelize = require('sequelize');

exports.create = async (req, res, next) => {
	const {
		name,
		type_access,
	} = req.body;
	if (!type_access || !name) {
		const error = new HttpError(
			'Inválido cadastrar Temas com algum dos campos vazios',
			400,
		);
		return next(error);
	}
	if (!type_access.includes('do')
		&& !type_access.includes('di')
		&& !type_access.includes('t')
		&& !type_access.includes('all')
		&& !type_access.includes('dodi')
		&& !type_access.includes('dot')
		&& !type_access.includes('dit')) {
		const error = new HttpError(
			'Tipo de acesso inválido, utilize um desses do = docente, di = discente, t = tae, all = todos, dodi = tema e discente, dot = tema e tae, dit = discente e tae',
			400,
		);
		return next(error);
	}


	try {
		let createTema = await Temas.create({
			name,
			type_access,
		});

		const returnData = {
			id: createTema.id,
			name: createTema.name,
			type_access: createTema.type_access,
		}
		return res.status(201).send(returnData);
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao inserir no banco', 500);
		return next(error);
	}
};

exports.listAll = async (req, res, next) => {
	console.log(req.query)
	const { filter, range, sort } = req.query;
	const filterParsed = JSON.parse(filter)
	const rangeParsed = JSON.parse(range)
	const sortParsed = JSON.parse(sort)
	let temas;
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
		temas = await Temas.findAll(searchObj);

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar temas', 400);
		return next(error);
	}

	return res.status(200).send({ user: temas.slice(rangeParsed[0], rangeParsed[1]), max: temas.length });
};
exports.listOne = async (req, res, next) => {
	console.log(req.params)
	const { id } = req.params
	let tema;
	try {
		tema = await Temas.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar temas', 400);
		return next(error);
	}

	return res.status(200).send(tema);
};
exports.update = async (req, res, next) => {
	console.log(req.body)
	const { id } = req.params
	let tema;

	try {
		await Temas.update({ ...req.body }, { where: { id } });
		tema = await Temas.findOne({ where: { id } });

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar temas', 400);
		return next(error);
	}

	return res.status(200).send(tema);
};
exports.delete = async (req, res, next) => {
	const { id } = req.params
	let tema;
	try {
		tema = await Temas.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar temas', 400);
		return next(error);
	}

	return res.sendStatus(200).send(tema);
};