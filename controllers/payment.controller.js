const formidable = require('formidable');

const { payment_type } = require('../models');

const form = formidable({ multiples: true });

const createPaymentTypeHandler = (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    payment_type.create(fields).then((paymnent_type) => {
      return res.status(201).json({
        message: 'Payment type created successfully',
        data: paymnent_type
      });
    }).catch((error) => {
      return res.status(400).json({ error: error.message });
    });
  });
};

const getAllPaymentTypeHandler = (req, res) => {
  payment_type.findAll().then((payment_types) => {
    return res.status(200).json({
      message: 'Get all payment types',
      data: payment_types
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const deletePaymentTypeHandler = (req, res) => {
  payment_type.findByPk(req.params.id).then((payment_type) => {
    if (!payment_type) {
      return res.status(404).json({
        message: 'Payment type not found'
      });
    }

    payment_type.destroy().then(() => {
      return res.status(200).json({
        message: 'Payment type deleted successfully'
      });
    }).catch((error) => {
      return res.status(400).json({ error: error.message });
    });
  });
};

module.exports = {
  createPaymentTypeHandler,
  getAllPaymentTypeHandler,
  deletePaymentTypeHandler
};
