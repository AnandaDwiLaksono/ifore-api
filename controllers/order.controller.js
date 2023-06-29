const formidable = require('formidable');

const { order_item, inventory, category } = require('../models');

const form = formidable({ multiples: true });

const addOrderHandler = (req, res) => {
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({ message: 'Error parsing form data' });
      return;
    }

    order_item.create({
      item_id: fields.item_id,
      qty: fields.qty,
      discount: fields.discount,
      total: fields.total,
      profit: fields.profit,
    }).then((result) => {
      res.status(201).json({
        message: 'Order added successfully',
        order: result,
      });
    }).catch((err) => {
      res.status(400).json({ message: err.message });
    });
  });
};

const getAllOrderHandler = (req, res) => {
  order_item.findAll({
    include: {
      model: inventory,
      attributes: ['name', 'selling_price'],
      include: {
        model: category,
        attributes: ['name'],
      },
    },
    attributes: { exclude: ['transaction_id'] },
  }).then((orders) => {
    res.status(200).json({
      message: 'Get all orders',
      data: orders,
    });
  }).catch((err) => {
    res.status(500).json({ message: err.message });
  });
}

const getOrderByIdHandler = (req, res) => {
  order_item.findByPk(req.params.id, {
    include: {
      model: inventory,
      attributes: ['name', 'selling_price', 'qty_stock', 'purchase_price'],
      include: {
        model: category,
        attributes: ['name'],
      },
    },
  }).then((order) => {
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({
      message: 'Get order by id',
      data: order,
    });
  }).catch((err) => {
    res.status(500).json({ message: err.message });
  });
}

const updateOrderHandler = (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ message: 'Error parsing form data' });
      return;
    }

    order_item.update({
      item_id: fields.item_id,
      qty: fields.qty,
      discount: fields.discount,
      total: fields.total,
      profit: fields.profit,
    }, {
      where: {
        id: req.params.id,
      },
    }).then((result) => {
      order_item.findByPk(req.params.id, {
        include: {
          model: inventory,
          attributes: ['name', 'selling_price', 'qty_stock', 'purchase_price'],
          include: {
            model: category,
            attributes: ['name'],
          },
        },
      }).then((order) => {
        res.status(200).json({
          message: 'Order updated successfully',
          order: order,
        });
      }).catch((err) => {
        res.status(404).json({ message: 'Order not found' });
      });
    }).catch((err) => {
      res.status(404).json({ message: 'Order not found' });
    });
  });
}

const deleteOrderHandler = (req, res) => {
  order_item.destroy({
    where: {
      id: req.params.id,
    },
  }).then((result) => {
    res.status(200).json({
      message: 'Order deleted successfully',
    });
  }).catch((err) => {
    res.status(404).json({ message: 'Order not found' });
  });
}

module.exports = {
  addOrderHandler,
  getAllOrderHandler,
  getOrderByIdHandler,
  updateOrderHandler,
  deleteOrderHandler,
};
