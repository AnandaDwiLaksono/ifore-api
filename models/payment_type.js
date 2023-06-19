'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transaction_history, {
        foreignKey: 'payment_type_id',
      });
    }
  }
  payment_type.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'payment_type',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return payment_type;
};