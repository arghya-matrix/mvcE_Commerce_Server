const db = require("../models/index");

async function userProfile({ userName }) {
  const user = await db.User.findOne({
    where: {
      userName: userName,
    },
    raw: true,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const userId = user.user_id;

  const result = await db.User.findAll({
    attributes: ["userName"],
    include: [
      {
        model: db.Cart,
        attributes: ["price", "quantity"],
      },
      {
        model: db.Order,
        attributes: ["order_id", "total", "date"],
      },
      {
        model: db.Address,
      }
    ],
    where: {
      user_id: userId,
    },
  });
  const Order = await db.Order.findAll({
    where: {
      user_id: userId,
    }
  });

    const userOrder = Order.map(order=> order.toJSON());
  // console.log(userOrder);

  const orderIds = userOrder.map((order) => order.order_id);
  console.log(orderIds);

  const OrderDetails = await db.OrderDetails.findAll({
    attributes: [ "product_id","order_id", "price", "quantity","invoice"],
    include: [
      {
        model: db.Product,
        attributes: ["product_id","product_name", "description","c_id","imageUrl"],
        include: [
          {
            model: db.Category,
            attributes: ["Name"],
          },
        ]
      },
    ],
    where: {
      order_id: orderIds,
    },
  });
  // console.log(OrderDetails);
  
  return {result,OrderDetails};
}



async function checkOut({ user_id }) {
  const data = await db.Cart.findAll({
    where: {
      user_id: user_id,
    },
  });

  // console.log(data);
  const cartData = [];
  for (let i = 0; i < data.length; i++) {
    cartData[i] = data[i].dataValues;
  }
  
  // await db.Cart.destroy({
  //   where: {
  //     user_id: user_id,
  //   },
  // });

  //  console.log(cartData);
  return cartData;
}

module.exports = {
  userProfile,
  checkOut,
};
