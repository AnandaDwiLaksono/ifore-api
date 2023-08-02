'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventory_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.inventory, {
        foreignKey: 'item_id',
      });
    }
  }
  inventory_history.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    change_type: {
      type: DataTypes.ENUM('in', 'out'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'inventory_history',
  });
  return inventory_history;
};