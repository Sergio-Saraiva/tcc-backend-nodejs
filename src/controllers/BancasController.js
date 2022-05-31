const BancaAvaliadora = require('../models/BancaAvaliadora');
const HttpError = require('../models/http-error');
const Docentes = require('../models/Docentes');
const Discentes = require('../models/Discentes');
const Orientacoes = require('../models/Orientacoes');
const Sequelize = require('sequelize');

exports.create = async (req, res, next) => {
	const {
		avaliadores,
		discente_id
	} = req.body;
	console.log(req.body)
	if (!discente_id || !avaliadores) {
		const error = new HttpError(
			'Inválido cadastrar banca avaliadora com algum dos campos vazios',
			400,
		);
		return next(error);
	}

	const discenteHasOrientação = await Orientacoes.findOne({ where: { discente_id } })

	if (!discenteHasOrientação) {
		const error = new HttpError(
			'Inválido cadastrar banca avaliadora com discente sem orientação',
			400,
		);
		return next(error);
	}
	// talvez por um transaction?
	try {
		for (let i = 0; i < avaliadores.length; i++) {
			await BancaAvaliadora.create({
				docente_id: avaliadores[i],
				orientacao_id: discenteHasOrientação.id,
			});
		}
		const createBanca = await Orientacoes.findOne({
			where: { id: discenteHasOrientação.id },
			include: [
				{
					model: Docentes,
					through: 'banca_avaliadora',
					as: 'orientacaoHasBancas',
				},
			]
		});
		return res.status(201).send(createBanca);
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao inserir usuário no banco', 500);
		return next(error);

	}
};

exports.listAll = async (req, res, next) => {
	console.log(req.query)
	const { filter, range, sort } = req.query;
	const filterParsed = filter && JSON.parse(filter)
	const rangeParsed = range && JSON.parse(range)
	const sortParsed = sort && JSON.parse(sort)
	let bancas;
	try {
		let searchObj = {
			order: [sortParsed],
			include: [
				{
					model: Docentes,
					through: 'banca_avaliadora',
					as: 'orientacaoHasBancas',
				},
			]
		};
		if (filterParsed.name) {
			searchObj = {
				...searchObj,
				where: {
					name: { [Sequelize.Op.like]: `%${filterParsed.name}%` }
				}
			}
		}
		if (filterParsed.orientadorName) {
			searchObj = {
				...searchObj,
				include: [
					...searchObj.include,
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
					...searchObj.include,
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
					...searchObj.include,
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
		bancas = await Orientacoes.findAll(searchObj);
		const aux = []
		bancas.forEach(banca => {
			if (banca.orientacaoHasBancas.length > 0) {
				aux.push(banca)
			}
		});
		bancas = aux;
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar usuários', 400);
		return next(error);
	}

	return res.status(200).send({ user: bancas.slice(rangeParsed[0], rangeParsed[1]), max: bancas.length });
};
exports.listOne = async (req, res, next) => {
	console.log(req.params)
	const { id } = req.params
	let banca;
	try {
		banca = await Orientacoes.findOne({
			where: { id },
			include: [
				{
					model: Docentes,
					through: 'banca_avaliadora',
					as: 'orientacaoHasBancas',
				},
			]
		});

	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar usuários', 400);
		return next(error);
	}

	return res.status(200).send(banca);
};
exports.update = async (req, res, next) => {
	console.log(req.body)
	const { id } = req.params
	let banca;
	try {
		await BancaAvaliadora.update({ ...req.body }, { where: { id } });
		banca = await BancaAvaliadora.findOne({
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
		const error = new HttpError('Erro ao consultar usuários', 400);
		return next(error);
	}

	return res.status(200).send(banca);
};
exports.delete = async (req, res, next) => {
	const { id } = req.params
	let banca;
	try {
		banca = await BancaAvaliadora.destroy({ where: { id } });
	} catch (err) {
		console.log(err);
		const error = new HttpError('Erro ao consultar usuários', 400);
		return next(error);
	}

	return res.sendStatus(200).send(banca);
};