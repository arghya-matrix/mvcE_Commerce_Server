const { v4: uuidv4 } = require("uuid");
const db = require("../models/index");

const getOrderDetails = async function ({ uuid }) {
  const details = await db.OrderDetails.findAll({
    include: [
      {
        model: db.Product,
        include: {
          model: db.Category,
          attributes: ["Name"],
        },
      },
      {
        model: db.Address,
      },
    ],
    where: {
      uuid: uuid,
    },
  });
  // console.log("Db data", details);
  return details;
};

async function addOrderDetails({ user_id, cartData }) {
  const Order = await db.Order.findAll({
    where: {
      user_id: user_id,
    },
  });
  const address = await db.Address.findOne({
    where: {
      user_id: user_id,
    },
    raw: true,
  });
  const userOrder = Order.map((order) => order.toJSON());
  const uuid = uuidv4();
  await Promise.all(
    userOrder.map(async (obj) => {
      const order_id = obj.order_id;
      const cartItem = cartData.find((item) => item.cart_id === obj.cart_id);

      if (cartItem) {
        await db.OrderDetails.bulkCreate([
          {
            order_id: order_id,
            product_id: obj.product_id,
            price: obj.total,
            quantity: cartItem.quantity,
            uuid: uuid,
            shipped_to: address.id,
          },
        ]);
      }
    })
  );

  const orderDetails = await db.Product.findAll({
    include: {
      model: db.OrderDetails,
      attributes: ["price", "quantity", "uuid"],
      include: db.Address,
      where: {
        uuid: uuid,
      },
      include: [
        {
          model: db.Order,
          attributes: ["order_id"],
          include: {
            model: db.User,
            attributes: ["userName"],
          },
        },{
          model: db.Address
        }
      ],
    },
  });
  return { orderDetails, uuid };
}

module.exports = {
  getOrderDetails,
  addOrderDetails,
};
