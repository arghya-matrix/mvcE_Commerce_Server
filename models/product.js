const sequelize = require('../db/database');
const {DataTypes}= require('sequelize');
const Product = sequelize.define('Product',{
    product_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    product_name:{
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    c_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true
    },
    price:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imageUrl:{
        type: DataTypes.STRING
    }
},
{
    timestamps: false,
    id: false,
});

module.exports = Product;