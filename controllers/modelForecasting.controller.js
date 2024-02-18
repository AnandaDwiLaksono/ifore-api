const RandomForestRegression = require('ml-random-forest').RandomForestRegression;
const moment = require('moment');
const formidable = require('formidable');

const rawData = require('../data/dataTraining.json');

const form = formidable({ multiples: true });

const formattedDate = (date) => {
  const newDate = new Date(date);

  const day = String(newDate.getDate()).padStart(2, '0');
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const year = newDate.getFullYear();

  return `${year}-${month}-${day}`;
};

const dataTimeSeries = (args) => {
  const days = moment('2024-02-01').diff(moment('2023-11-05'), 'days') + 1;
  const transactions = rawData;

  const data = Array.from({ length: days }, (_, i) => {
    const transactionDataFiltered = transactions.filter((item) =>
      item.status === 'completed' && moment(formattedDate(item.createdAt)).isSame(formattedDate(moment('2024-02-01').subtract(i, 'days')))
    );

    const total = transactionDataFiltered.reduce((acc, curr) => acc + curr[args], 0);

    return { x: new Date(moment('2024-02-01').subtract(i - 1, 'days')), y: total };
  });

  return data;
};

const dataCategoryTimeSeries = (args) => {
  const days = moment('2024-02-01').diff(moment('2023-11-05'), 'days') + 1;
  const transactions = rawData;

  const data = Array.from({ length: days }, (_, i) => {
    const transactionDataFiltered = transactions.filter((item) =>
      item.status === 'completed' && moment(formattedDate(item.createdAt)).isSame(formattedDate(moment('2024-02-01').subtract(i, 'days')))
    );

    const total = transactionDataFiltered.reduce((acc, item) => {
      return acc + item.order_items.reduce((orderAcc, orderItem) => {
        return orderAcc + (orderItem.inventory.category.name === args ? orderItem.qty : 0);
      }, 0);
    }, 0);

    return { x: new Date(moment('2024-02-01').subtract(i - 1, 'days')), y: total };
  });

  return data;
};

const randomForestModel = (data, parameter) => {
	const trainingSet = new Array(data.length - 7);
	const predictions = new Array(data.length - 7);

	for (let i = 0; i < data.length - 7; i++) {
		trainingSet[i] = data.slice(i, i + 7);
		predictions[i] = data[i + 7];
	};

	const options = {
		seed: parameter.seed,
		maxFeatures: parameter.maxFeatures,
		replacement: parameter.replacement,
		nEstimators: parameter.nEstimators,
		selectionMethod: parameter.selectionMethod,
	};

	const randomForest = new RandomForestRegression(options);

	randomForest.train(trainingSet, predictions);

	return randomForest
};

const getModelForecasting = async (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form' });
    }

    try {
      const { category, parameter } = fields;

      if (category === 'total') {
        const data = dataTimeSeries(category).reverse().map((item) => item.y);

        const model = randomForestModel(data, parameter);

        return res.status(200).json(model);
      } else {
        const data = dataCategoryTimeSeries(category).reverse().map((item) => item.y);

        const model = randomForestModel(data, parameter);

        return res.status(200).json(model);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

module.exports = { getModelForecasting };
