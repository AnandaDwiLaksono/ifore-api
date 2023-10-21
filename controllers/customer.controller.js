const formidable = require('formidable');

const { customers } = require('../models');

const form = formidable({ multiples: true });

const createCustomerHandler = (req, res) => {
  form.parse(req, (err, fields, files) => {
    customers.create({
      name: fields.name,
      phone_number: fields.phone_number,
      email: fields.email,
      address: fields.address
    }).then((customers) => {
      return res.status(201).json({
        message: 'Customer created successfully',
        data: customers
      });
    }).catch((error) => {
      return res.status(400).json({ error: error.message });
    });
  });
};

const getAllCustomerHandler = (req, res) => {
  customers.findAll().then((customers) => {
    return res.status(200).json({
      message: 'Get all customers',
      data: customers
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const updateCustomerHandler = (req, res) => {
  customers.findByPk(req.params.id).then((customer) => {
    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    form.parse(req, (err, fields, files) => {
      customer.update({
        name: fields.name,
        phone_number: fields.phone_number,
        email: fields.email,
        address: fields.address
      }).then((customers) => {
        return res.status(200).json({
          message: 'Customer updated successfully',
          data: customers
        });
      }).catch((error) => {
        return res.status(400).json({ error: error.message });
      });
    });
  });
};

const deleteCustomerHandler = (req, res) => {
  customers.findByPk(req.params.id).then((customer) => {
    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    customer.destroy().then(() => {
      return res.status(200).json({
        message: 'Customer deleted successfully',
      });
    }).catch((error) => {
      return res.status(400).json({ error: error.message });
    });
  });
};

module.exports = {
  createCustomerHandler,
  getAllCustomerHandler,
  updateCustomerHandler,
  deleteCustomerHandler
};