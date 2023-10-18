const sequelize = require("../db/database");
const { DataTypes, UUID } = require("sequelize");
const OrderDetails = sequelize.define(
  "Order_details",
  {
    id: {
      type: DataTypes.INTEGER(10),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    order_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER(20),
      allowNull: false,
      defaultValue: "1",
    },
    uuid: {
      type: UUID,
      allowNull: true,
    },
    invoice: {
      type: DataTypes.STRING,
    },
    shipped_to: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    id: false,
  }
);
 
module.exports = OrderDetails;
