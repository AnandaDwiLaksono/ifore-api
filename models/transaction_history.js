'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.order_item, {
        foreignKey: 'transaction_id',
      });
      this.belongsTo(models.payment_type, {
        foreignKey: 'payment_type_id',
      });
    }
  }
  transaction_history.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    payment_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'canceled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_profit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction_history',
  });
  return transaction_history;
};