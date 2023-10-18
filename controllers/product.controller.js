const productServices = require("../services/product.services");
const invertoryServices = require("../services/inventory.services");
const { Op } = require("sequelize");

async function getAll(req, res) {
  const whereOptions = {};
  const orderOptions = [];
  if (req.query.Name) {
    whereOptions.product_name = {
      [Op.substring]: req.query.Name,
    };
  }
  orderOptions.push(["product_name", "ASC"]);

  const allProduct = await productServices.getAll({
    orderOptions: orderOptions,
    whereOptions: whereOptions,
  });
  if (allProduct.count > 0) {
    res.json({
      message: `${allProduct.count} Product Found `,
      data: allProduct.rows,
    });
  } else {
    res.json({
      message: `No product found`,
    });
  }
}

async function insertProduct(req, res) {
  const data = req.body;
  console.log(req.url, "inside controller");
  if (!data.product_name) {
    return res.json({
      message: `Name is required to add product`,
    });
  }
  if (!data.c_id) {
    return res.json({
      message: `Category id is required to add product`,
    });
  }
  if (!data.description) {
    return res.json({
      message: `description is required to add product`,
    });
  }
  if (!data.price) {
    return res.json({
      message: `price is required to add product`,
    });
  }
  if (!data.quantity) {
    return res.json({
      message: `quantity is required to add product`,
    });
  }
  const product = await productServices.insertProduct({
    product_name: data.product_name,
    c_id: data.c_id,
    description: data.description,
    price: data.price,
    imageUrl: req.url,
  });
  const productData = product.toJSON();
  console.log("Product Data", product.toJSON());
  const inventory = await invertoryServices.addToInventory({
    price: productData.price * data.quantity,
    product_id: productData.product_id,
    quantity: data.quantity,
  });
  const inventoryData = inventory.toJSON();
  res.json({
    message: "Product Added",
    data: product,
  });
}

async function findCategoryProduct(req, res) {
  const data = req.query;
  const orderOptions = [];
  const whereOptions = {};

  if (req.query.price) {
    if (req.query.price == "High to Low") {
      orderOptions.push(["price", "ASC"]);
    } else if (req.query.price == "Low to High") {
      orderOptions.push(["price", "DESC"]);
    }
  } else {
    orderOptions.push(["product_name", "ASC"]);
  }
  if (data.Name) {
    whereOptions.product_name = { [Op.substring]: data.Name };
  } if(data.c_id){
    whereOptions.cat_id = data.c_id
  }
  const product = await productServices.findCategoryProduct({
    whereOptions: whereOptions,
    orderOptions: orderOptions,
  });
  res.json({
    count: product.count,
    data: product.rows,
  });
}

async function findProduct(req, res) {
  const data = req.body;
  const product = await productServices.findProduct({
    id: data.id,
  });
  res.json({
    product: product,
  });
}

async function deleteProduct(req, res) {
  const data = req.body;
  const product = await productServices.deleteProduct({
    id: data.id,
  });
  res.json({
    message: `Details from id= ${data.id} deleted`,
    data: product,
  });
}

async function updateProduct(req, res) {
  const data = req.body;
  const product = await productServices.updateProduct({
    id: data.id,
    Name: data.Name,
  });
  res.json({
    message: `${data.id} Updated`,
    data: product,
  });
}

module.exports = {
  getAll,
  insertProduct,
  findCategoryProduct,
  deleteProduct,
  findProduct,
  updateProduct,
};
