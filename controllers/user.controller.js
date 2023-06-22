const formidable = require('formidable');

const cloudinary = require('../config/cloudinary');
const { user } = require('../models');

const form = formidable({ multiples: true });

const createUserHandler = (req, res) => {
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    cloudinary.uploader.upload(files.logo.filepath, (err, result) => {
      if (err) {
        return res.status(400).send(err.message);
      }

      user.create({
        logo: result.secure_url,
        name: fields.name,
        phone_number: fields.phone_number,
        email: fields.email,
        address: fields.address,
      }).then((user) => {
        return res.status(201).json({
          message: 'User created successfully',
          data: user
        });
      }).catch((error) => {
        return res.status(400).json({ error: error.message });
      });
    });
  });
};

const getUserHandler = (req, res) => {
  user.findAll().then((users) => {
    return res.status(200).json({
      message: 'Get all users',
      data: users
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const updateUserHandler = (req, res) => {
  user.findByPk(req.params.id).then((user) => {
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      user.update({
        name: fields.name,
        phone_number: fields.phone_number,
        email: fields.email,
        address: fields.address,
      }).then((user) => {
        return res.status(200).json({
          message: 'User updated successfully',
          data: user
        });
      }).catch((error) => {
        return res.status(400).json({ error: error.message });
      });
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const updateLogoHandler = (req, res) => {
  user.findByPk(req.params.id).then((user) => {
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      cloudinary.uploader.upload(fields.logo, (err, result) => {
        if (err) {
          return res.status(400).send(err.message);
        }

        user.update({
          logo: result.secure_url,
        }).then((user) => {
          return res.status(200).json({
            message: 'User updated successfully',
            data: user
          });
        }).catch((error) => {
          return res.status(400).json({ error: error.message });
        });
      });
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

module.exports = {
  createUserHandler,
  getUserHandler,
  updateUserHandler,
  updateLogoHandler
};