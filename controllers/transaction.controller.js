const formidable = require('formidable');

const { transaction_history, payment_type } = require('../models');

const form = formidable({ multiples: true });

const addTransactionHandler = async (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    try {
      const paymentType = await payment_type.findOne({
        where: {
          name: fields.payment_type,
        },
      });
  
      if (!paymentType) {
        return res.status(400).json({ message: 'Payment type not found' });
      }

      const subtotal = parseFloat(fields.subtotal);
      const totalDiscount = parseFloat(fields.total_discount);
      const total = subtotal - totalDiscount;
      const totalProfit = parseFloat(fields.total_profit);
  
      const transactionPayload = {
        payment_type_id: paymentType.id,
        status: fields.status,
        subtotal: subtotal,
        total_discount: totalDiscount,
        total: total,
        total_profit: totalProfit,
        note: fields.note,
      };
  
      const transaction = await transaction_history.create(transactionPayload);
  
      return res.status(201).json({
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

const getAllTransactionHandler = (req, res) => {
  transaction_history.findAll({
    include: {
      model: payment_type,
      attributes: ['name'],
    },
  }).then((transactions) => {
    return res.status(200).json({
      message: 'Get all transactions',
      data: transactions,
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const getTransactionByIdHandler = (req, res) => {
  transaction_history.findByPk(req.params.id, {
    include: {
      model: payment_type,
      attributes: ['name'],
    },
  }).then((transaction) => {
    return res.status(200).json({
      message: 'Get transaction by id',
      data: transaction,
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const updateTransactionHandler = async (req, res) => {
  transaction_history.findByPk(req.params.id).then((transaction) => {
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error parsing form data' });
      }

      try {
        const paymentId = await payment_type.findOne({
          where: {
            name: fields.payment_type,
          },
        });

        if (!paymentId) {
          return res.status(400).json({ message: 'Payment type not found' });
        }

        const transactionPayload = {
          payment_type_id: paymentId.id,
          status: fields.status,
          subtotal: fields.subtotal,
          total_discount: fields.total_discount,
          total: fields.total,
          total_profit: fields.total_profit,
          note: fields.note,
        };

        const updatedTransaction = await transaction.update(transactionPayload);

        return res.status(200).json({
          message: 'Transaction updated successfully',
          data: updatedTransaction,
        });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const deleteTransactionHandler = (req, res) => {
  transaction_history.findByPk(req.params.id).then((transaction) => {
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.destroy().then(() => {
      return res.status(200).json({ message: 'Transaction deleted successfully' });
    }).catch((error) => {
      return res.status(500).json({ error: error.message });
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

module.exports = {
  addTransactionHandler,
  getAllTransactionHandler,
  getTransactionByIdHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
};
