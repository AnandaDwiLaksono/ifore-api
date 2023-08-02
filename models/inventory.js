'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.order_item, {
        foreignKey: 'item_id',
      });
      this.belongsTo(models.category, {
        foreignKey: 'category_id',
      });
      this.hasMany(models.inventory_history, {
        foreignKey: 'item_id',
      });
    }
  }
  inventory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchase_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    selling_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qty_stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'inventory',
  });
  return inventory;
};