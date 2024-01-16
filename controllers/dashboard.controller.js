const formidable = require('formidable');
const moment = require('moment');
const RandomForestRegression = require('ml-random-forest').RandomForestRegression;

const { transaction_history, payment_type, order_item, inventory, category } = require('../models');
const { Op } = require('sequelize');

const form = formidable({ multiples: true });

const transactionData = async () => {
  try {
    const data = await transaction_history.findAll({
      include: [
        {
          model: payment_type,
          attributes: ['id', 'name'],
        },
        {
          model: order_item,
          attributes: ['id', 'item_id', 'qty', 'discount', 'total', 'profit'],
          include: {
            model: inventory,
            attributes: ['id', 'name', 'category_id', 'purchase_price', 'selling_price', 'qty_stock', 'note'],
            include: {
              model: category,
              attributes: ['id', 'name'],
            },
          },
          through: {
            attributes: []
          },
          as: 'order_items',
        }
      ],
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const categoryData = async () => {
  try {
    const data = await category.findAll();

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const formattedDate = (date) => {
  const newDate = new Date(date);

  const day = String(newDate.getDate()).padStart(2, '0');
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const year = newDate.getFullYear();

  return `${year}-${month}-${day}`;
};

const percentage = (currentValue, previousValue) => {
  const result = (((currentValue - previousValue) / previousValue) * 100).toFixed(0);

  if (result === 'Infinity' || result === 'NaN') {
    return '';
  } else if (result > 0) {
    return `+${result}%`;
  } else {
    return `${result}%`;
  };
};

// const percentage = (currentValue, previousValue) => {
//   if (previousValue === 0) {
//     return currentValue > 0 ? '+100%' : '0%';
//   }

//   const result = (((currentValue - previousValue) / Math.abs(previousValue)) * 100).toFixed(0);

//   if (result === 'Infinity' || result === 'NaN') {
//     return '';
//   } else if (result > 0) {
//     return `+${result}%`;
//   } else {
//     return `${result}%`;
//   }
// };

const dataTimeSeries = async (args) => {
  // let data = [];
  const days = moment().diff(moment('2023-07-09'), 'days') + 1;
  const transactions = await transactionData();

  // for (let i = -1; i < days; i++) {
  //   const transactionDataFiltered = await transactions.filter((item) => item.status === 'completed' && moment(formattedDate(item.createdAt)).isSame(formattedDate(moment().subtract(i, 'days'))));

  //   const total = await transactionDataFiltered.reduce((acc, curr) => acc + curr[args], 0);

  //   data.push({ x: new Date(moment().subtract(i, 'days')), y: total });
  // };

  const data = Array.from({ length: days }, (_, i) => {
    const transactionDataFiltered = transactions.filter((item) =>
      item.status === 'completed' && moment(formattedDate(item.createdAt)).isSame(formattedDate(moment().subtract(i, 'days')))
    );

    const total = transactionDataFiltered.reduce((acc, curr) => acc + curr[args], 0);

    return { x: new Date(moment().subtract(i, 'days')), y: total };
  });

  return data;
};

const dataTimeSeriesFilter = async (field, categories) => {
  // let data = [];
  const days = moment().diff(moment('2023-07-09'), 'days') + 1;
  const transactions = await transactionData();

  // for (let i = -1; i < days; i++) {
  //   const transactionDataFiltered = await transactions.filter((item) => item.status === 'completed' && moment(formattedDate(item.createdAt)).isSame(formattedDate(moment().subtract(i, 'days'))));

  //   let total = 0;

  //   for (let j = 0; j < categories.length; j++) {
  //     transactionDataFiltered.forEach((item) => {
  //       item.order_items.forEach((orderItem) => {
  //         if (orderItem.inventory.category.name === categories[j]) {
  //           total += orderItem[field];
  //         };
  //       });
  //     });
  //   };

  //   data.push({ x: new Date(moment().subtract(i, 'days')), y: total });
  // };

  const data = Array.from({ length: days }, (_, i) => {
    const transactionDataFiltered = transactions.filter((item) =>
      item.status === 'completed' && moment(formattedDate(item.createdAt)).isSame(formattedDate(moment().subtract(i, 'days')))
    );

    const total = transactionDataFiltered.reduce((acc, item) => {
      return acc + item.order_items.reduce((orderAcc, orderItem) => {
        return orderAcc + (categories.includes(orderItem.inventory.category.name) ? orderItem[field] : 0);
      }, 0);
    }, 0);

    return { x: new Date(moment().subtract(i, 'days')), y: total };
  });

  return data;
};

const dataCategoryTimeSeries = async (args) => {
  // let data = [];
  const days = moment().diff(moment('2023-07-09'), 'days') + 1;
  const transactions = await transactionData();
  
  // for (let i = -1; i < days; i++) {
  //   const transactionDataFiltered = await transactions.filter((item) => item.status === 'completed' && moment(formattedDate(item.createdAt)).isSame(formattedDate(moment().subtract(i, 'days'))));
    
  //   let total = 0;
  
  //   transactionDataFiltered.forEach((item) => {
  //     item.order_items.forEach((orderItem) => {
  //       if (orderItem.inventory.category.name === args) {
  //         total += orderItem.qty;
  //       };
  //     });
  //   });

  //   data.push({ x: new Date(moment().subtract(i, 'days')), y: total });
  // };

  const data = Array.from({ length: days }, (_, i) => {
    const transactionDataFiltered = transactions.filter((item) =>
      item.status === 'completed' && moment(formattedDate(item.createdAt)).isSame(formattedDate(moment().subtract(i, 'days')))
    );

    const total = transactionDataFiltered.reduce((acc, item) => {
      return acc + item.order_items.reduce((orderAcc, orderItem) => {
        return orderAcc + (orderItem.inventory.category.name === category ? orderItem.qty : 0);
      }, 0);
    }, 0);

    return { x: new Date(moment().subtract(i, 'days')), y: total };
  });

  return data;
};

const randomForestModel = async (data) => {
  let salesData = data;
  let predictionResults = [];

  for (let i = 0; i < 3; i++) {
    let trainingSet = new Array(salesData.length - 3);
    let predictions = new Array(salesData.length - 3);

    for (let i = 0; i < salesData.length - 3; i++) {
      trainingSet[i] = salesData.slice(i, i + 3);
      predictions[i] = salesData[i + 3];
    };

    const options = {
      seed: 3,
      maxFeatures: 2,
      replacement: false,
      nEstimators: 200
    };

    const randomForest = new RandomForestRegression(options);

    randomForest.train(trainingSet, predictions);

    const result = await randomForest.predict([salesData.slice(-3)]);

    predictionResults.push({ x: new Date(moment().add(i, 'days')), y: result[0] });
    salesData.push(result[0]);
  }

  return predictionResults;
};

const getDataActual = async (category) => {
  const data = await dataCategoryTimeSeries(category);
  return data.slice(1, 9).reverse();
};

const getDataTrain = async (category) => {
  const data = await dataCategoryTimeSeries(category);
  return data.slice(2).reverse().map((item) => item.y);
};

const getIncomePrediction = async (incomeDataTrain) => {
  return await randomForestModel(incomeDataTrain);
};

const getPredictionCategory = async (category) => {
  const dataActual = await getDataActual(category);
  const dataTrain = await getDataTrain(category);
  const dataForecasting = await randomForestModel(dataTrain);

  return [`${category}DataActual`, dataActual, `${category}DataForecasting`, dataForecasting];
};

const getCategoryDataBetweenDates = async (startDate, endDate) => {
  try {

    const startMoment = moment(formattedDate(startDate)) + " 00:00:00";
    const endMoment = moment(formattedDate(endDate)) + " 23:59:59";

    console.log('startDate:', startMoment);
    console.log('endDate:', endMoment);

    const data = await transaction_history.findAll({
      include: [
        {
          model: order_item,
          attributes: ['qty'],
          include: {
            model: inventory,
            attributes: [],
            include: {
              model: category,
              attributes: ['name'],
            },
          },
          through: {
            attributes: []
          },
          as: 'order_items',
        },
      ],
      where: {
        status: 'completed',
        createdAt: {
          [Op.between]: [startMoment, endMoment],
        },
      },
    });

    const categoryData = data.reduce((acc, transaction) => {
      transaction.order_items.forEach((orderItem) => {
        const categoryName = orderItem.inventory.category.name;
        acc[categoryName] = acc[categoryName] || 0;
        acc[categoryName] += orderItem.qty;
      });

      return acc;
    }, {});

    return Object.entries(categoryData).map(([name, qty]) => ({ name, qty }));
  } catch (error) {
    throw new Error(error);
  }
};

const getCardData = async (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    try {
      // const transactions = await transactionData();
      // const categories = await categoryData();
  
      // const { startDate, endDate } = fields;
  
      // const diffDays = moment(formattedDate(endDate)).diff(moment(formattedDate(startDate)), 'days') + 1;
  
      // const transactionsFiltered = await transactions.filter((item) => item.status === 'completed' && moment(formattedDate(item.createdAt)).isSameOrAfter(formattedDate(startDate)) && moment(formattedDate(item.createdAt)).isSameOrBefore(formattedDate(endDate)));
  
      // const transactionsFilteredBefore = await transactions.filter((item) => item.status === 'completed' && moment(formattedDate(item.createdAt)).isSameOrAfter(formattedDate(moment(startDate).subtract(diffDays, 'days'))) && moment(formattedDate(item.createdAt)).isSameOrBefore(formattedDate(moment(endDate).subtract(diffDays, 'days'))));
  
      // for (let i = 0; i < categories.length; i++) {
      //   let qtyTotal = 0;
        
      //   transactionsFiltered.forEach((item) => {
      //     item.order_items.forEach((orderItem) => {
      //       if (orderItem.inventory.category.id === categories[i].id) {
      //         qtyTotal += orderItem.qty;
      //       };
      //     });
      //   });
  
      //   categories[i] = {...categories[i], qty: qtyTotal};
      // };

      const [transactions, categories] = await Promise.all([transactionData(), categoryData()]);

      const { startDate, endDate } = fields;
      const startMoment = moment(formattedDate(startDate));
      const endMoment = moment(formattedDate(endDate));
      const diffDays = endMoment.diff(startMoment, 'days') + 1;

      const transactionsFiltered = transactions.filter((item) => 
        item.status === 'completed' &&
        moment(formattedDate(item.createdAt)).isBetween(startMoment, endMoment, null, '[]')
      );

      const transactionsFilteredBefore = transactions.filter((item) => 
        item.status === 'completed' &&
        moment(formattedDate(item.createdAt)).isBetween(startMoment.subtract(diffDays, 'days'), endMoment.subtract(diffDays, 'days'), null, '[]')
      );

      const qtyTotals = categories.map((category) => {
        const qtyTotal = transactionsFiltered.reduce((acc, item) => {
          return acc + item.order_items.reduce((orderAcc, orderItem) => {
            return orderAcc + (orderItem.inventory.category.id === category.id ? orderItem.qty : 0);
          }, 0);
        }, 0);
        return { ...category.dataValues, qty: qtyTotal };
      });
  
      const transactionTotal = transactionsFiltered.length;
      const transactionTotalBefore = transactionsFilteredBefore.length;
      const transactionTotalPercentage = percentage(transactionTotal, transactionTotalBefore);
  
      const incomeTotal = transactionsFiltered.reduce((acc, curr) => acc + curr.total, 0);
      const incomeTotalBefore = transactionsFilteredBefore.reduce((acc, curr) => acc + curr.total, 0);
      const incomeTotalPercentage = percentage(incomeTotal, incomeTotalBefore);
  
      const profitTotal = transactionsFiltered.reduce((acc, curr) => acc + curr.total_profit, 0);
      const profitTotalBefore = transactionsFilteredBefore.reduce((acc, curr) => acc + curr.total_profit, 0);
      const profitTotalPercentage = percentage(profitTotal, profitTotalBefore);
  
      // const bestSellerCategory = categories.sort((a, b) => b.qty - a.qty)[0].dataValues.name;

      const bestSellerCategory = qtyTotals.sort((a, b) => b.qty - a.qty)[0]?.name || '';

      const data = {
        transactionTotal,
        transactionTotalPercentage,
        incomeTotal,
        incomeTotalPercentage,
        profitTotal,
        profitTotalPercentage,
        bestSellerCategory,
      };
  
      return res.status(200).json({
        message: 'Get card data',
        data,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

const getIncomeProfitData = async (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }
    
    try {
      // const { categories } = fields;

      // if (categories.length === 0) {
      //   const dataIncome = await dataTimeSeries('total');
      //   const dataProfit = await dataTimeSeries('total_profit');

      //   const data = {
      //     dataIncome,
      //     dataProfit,
      //   }; 
  
      //   return res.status(200).json({
      //     message: 'Get income and profit data',
      //     data,
      //   });
      // } else {
      //   const dataIncome = await dataTimeSeriesFilter('total', categories);
      //   const dataProfit = await dataTimeSeriesFilter('profit', categories);
  
      //   const data = {
      //     dataIncome,
      //     dataProfit,
      //   }; 
  
      //   return res.status(200).json({
      //     message: 'Get income and profit data',
      //     data,
      //   });
      // };

      const { categories } = fields;
      const dataIncomePromise = categories.length === 0 ? dataTimeSeries('total') : dataTimeSeriesFilter('total', categories);
      const dataProfitPromise = categories.length === 0 ? dataTimeSeries('total_profit') : dataTimeSeriesFilter('profit', categories);

      const [dataIncome, dataProfit] = await Promise.all([dataIncomePromise, dataProfitPromise]);

      const data = {
        dataIncome,
        dataProfit,
      }; 
  
      return res.status(200).json({
        message: 'Get income and profit data',
        data,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
}

const getCategoryData = async (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    try {
      // const transactions = await transactionData();
      // const categories = await categoryData();
  
      const { startDate, endDate } = fields;

      const data = await getCategoryDataBetweenDates(startDate, endDate);
  
      // const transactionsFiltered = await transactions.filter((item) => item.status === 'completed' && moment(formattedDate(item.createdAt)).isSameOrAfter(formattedDate(startDate)) && moment(formattedDate(item.createdAt)).isSameOrBefore(formattedDate(endDate)));

      // for (let i = 0; i < categories.length; i++) {
      //   let qtyTotal = 0;
        
      //   transactionsFiltered.forEach((item) => {
      //     item.order_items.forEach((orderItem) => {
      //       if (orderItem.inventory.category.id === categories[i].id) {
      //         qtyTotal += orderItem.qty;
      //       };
      //     });
      //   });
  
      //   categories[i] = {...categories[i], qty: qtyTotal};
      // };

      // const data = categories.map((item) => {
      //   return {
      //     name: item.dataValues.name,
      //     qty: item.qty,
      //   };
      // });

      return res.status(200).json({
        message: 'Get category data',
        data,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

const getPredictionData = async (req, res) => {
  try {
    // const dataIncome = await dataTimeSeries('total');
    // const incomeDataActual = await dataIncome.slice(1,9).reverse();
    // const dataIncomeTrain = await dataIncome.slice(2).reverse().map((item) => item.y);
    // const incomeDataForecasting = await randomForestModel(dataIncomeTrain);
    
    // const freebaseData = await dataCategoryTimeSeries('Freebase');
    // const freebaseDataActual = await freebaseData.slice(1,9).reverse();
    // const dataFreebaseTrain = await freebaseData.slice(2).reverse().map((item) => item.y);
    // const freebaseDataForecasting = await randomForestModel(dataFreebaseTrain);

    // const saltnicData = await dataCategoryTimeSeries('Saltnic');
    // const saltnicDataActual = await saltnicData.slice(1,9).reverse();
    // const dataSaltnicTrain = await saltnicData.slice(2).reverse().map((item) => item.y);
    // const saltnicDataForecasting = await randomForestModel(dataSaltnicTrain);

    // const podData = await dataCategoryTimeSeries('Pod');
    // const podDataActual = await podData.slice(1,9).reverse();
    // const dataPodTrain = await podData.slice(2).reverse().map((item) => item.y);
    // const podDataForecasting = await randomForestModel(dataPodTrain);

    // const modData = await dataCategoryTimeSeries('Mod');
    // const modDataActual = await modData.slice(1,9).reverse();
    // const dataModTrain = await modData.slice(2).reverse().map((item) => item.y);
    // const modDataForecasting = await randomForestModel(dataModTrain);

    // const coilData = await dataCategoryTimeSeries('Coil');
    // const coilDataActual = await coilData.slice(1,9).reverse();
    // const dataCoilTrain = await coilData.slice(2).reverse().map((item) => item.y);
    // const coilDataForecasting = await randomForestModel(dataCoilTrain);

    // const accessoriesData = await dataCategoryTimeSeries('Accessories');
    // const accessoriesDataActual = await accessoriesData.slice(1,9).reverse();
    // const dataAccessoriesTrain = await accessoriesData.slice(2).reverse().map((item) => item.y);
    // const accessoriesDataForecasting = await randomForestModel(dataAccessoriesTrain);

    // const data = {
    //   incomeDataActual,
    //   incomeDataForecasting,
    //   freebaseDataActual,
    //   freebaseDataForecasting,
    //   saltnicDataActual,
    //   saltnicDataForecasting,
    //   podDataActual,
    //   podDataForecasting,
    //   modDataActual,
    //   modDataForecasting,
    //   coilDataActual,
    //   coilDataForecasting,
    //   accessoriesDataActual,
    //   accessoriesDataForecasting,
    // };

    const categories = ['Freebase', 'Saltnic', 'Pod', 'Mod', 'Coil', 'Accessories'];
    const incomeDataActual = await getDataActual('total');
    const incomeDataTrain = await getDataTrain('total');
    const incomeDataForecasting = await getIncomePrediction(incomeDataTrain);

    const predictions = await Promise.all(categories.map(category => getPredictionCategory(category)));

    const data = {
      incomeDataActual,
      incomeDataForecasting,
      ...Object.fromEntries(predictions),
    };

    return res.status(200).json({
      message: 'Get prediction data',
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const getTransactionHistoryData = async (req, res) => {
  try {
    const transactions = await transactionData();

    return res.status(200).json({
      message: 'Get transaction history data',
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { getCardData, getIncomeProfitData, getCategoryData, getPredictionData, getTransactionHistoryData };
