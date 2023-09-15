const formidable = require('formidable');
const moment = require('moment');

const { transaction_history, payment_type, order_item, inventory, category } = require('../models');

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
            attributes: [] // Menghilangkan atribut tambahan dari tabel penghubung
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

const percentage = (value, total) => {
  const result = (((value - total) / total) * 100).toFixed(0);

  if (result === 'Infinity' || result === 'NaN') {
    return '';
  } else if (result > 0) {
    return `+${result}%`;
  } else {
    return `${result}%`;
  };
};

const dataTimeSeries = async (args) => {
  let data = [];
  const days = moment().diff(moment('2023-07-09'), 'days') + 1;
  const transactions = await transactionData();

  for (let i = -1; i < days; i++) {
    const transactionDataFiltered = await transactions.filter((item) => item.status === 'completed' && moment(formattedDate(item.createdAt)).isSame(formattedDate(moment().subtract(i, 'days'))));

    const total = await transactionDataFiltered.reduce((acc, curr) => acc + curr[args], 0);

    data.push({ x: new Date(moment().subtract(i, 'days')), y: total });
  };

  return data;
};

const getCardHandler = async (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    try {

      const transactions = await transactionData();
      const categories = await categoryData();
  
      const { startDate, endDate } = fields;
  
      const diffDays = moment(formattedDate(endDate)).diff(moment(formattedDate(startDate)), 'days') + 1;
  
      const transactionsFiltered = await transactions.filter((item) => item.status === 'completed' && moment(formattedDate(item.createdAt)).isSameOrAfter(formattedDate(startDate)) && moment(formattedDate(item.createdAt)).isSameOrBefore(formattedDate(endDate)));
  
      const transactionsFilteredBefore = await transactions.filter((item) => item.status === 'completed' && moment(formattedDate(item.createdAt)).isSameOrAfter(formattedDate(moment(startDate).subtract(diffDays, 'days'))) && moment(formattedDate(item.createdAt)).isSameOrBefore(formattedDate(moment(endDate).subtract(diffDays, 'days'))));
  
      for (let i = 0; i < categories.length; i++) {
        let qtyTotal = 0;
        
        transactionsFiltered.forEach((item) => {
          item.order_items.forEach((orderItem) => {
            if (orderItem.inventory.category.id === categories[i].id) {
              qtyTotal += orderItem.qty;
            };
          });
        });
  
        categories[i] = {...categories[i], qty: qtyTotal};
      };
  
      const transactionTotal = transactionsFiltered.length;
      const transactionTotalBefore = transactionsFilteredBefore.length;
      const transactionTotalPercentage = percentage(transactionTotal, transactionTotalBefore);
  
      const incomeTotal = transactionsFiltered.reduce((acc, curr) => acc + curr.total, 0);
      const incomeTotalBefore = transactionsFilteredBefore.reduce((acc, curr) => acc + curr.total, 0);
      const incomeTotalPercentage = percentage(incomeTotal, incomeTotalBefore);
  
      const profitTotal = transactionsFiltered.reduce((acc, curr) => acc + curr.total_profit, 0);
      const profitTotalBefore = transactionsFilteredBefore.reduce((acc, curr) => acc + curr.total_profit, 0);
      const profitTotalPercentage = percentage(profitTotal, profitTotalBefore);
  
      const bestSellerCategory = categories.sort((a, b) => b.qty - a.qty)[0].dataValues.name;
  
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

const getIncomeProfit = async (req, res) => {
  try {
    const dataIncome = await dataTimeSeries('total');
    const dataProfit = await dataTimeSeries('total_profit');

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
}

module.exports = { getCardHandler, getIncomeProfit };
