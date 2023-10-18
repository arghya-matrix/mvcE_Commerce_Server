const express = require("express");
const server = express();
const port = 3300;

const categoryRoutes = require("./routes/category.route");
const userRoutes = require("./routes/user.route");
const cartRoutes = require("./routes/cart.route");
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");
const orderDetailsRoutes = require("./routes/order_details.route");
const userSignup = require("./routes/user.signup");
const usersignIn = require("./routes/user.signin");
const userProfile = require("./routes/user.profile");
const cartListing = require("./routes/cartListing.route");
const inventory = require("./routes/inventory.route");
const cors = require("cors");
const path = require("path");

server.use(express.json());
server.use((req, res, next) => {
  console.log(req.method, req.ip, req.path);
  next();
});
server.use(cors());

server.use("/upload", express.static(path.join(__dirname, "upload")));
server.use("/category", categoryRoutes);
server.use("/user", userRoutes);
server.use("/cart", cartRoutes);
server.use("/product", productRoutes);
server.use("/order", orderRoutes);
server.use("/orderDetails", orderDetailsRoutes);
server.use("/user", userSignup);
server.use("/user", usersignIn);
server.use("/user", userProfile);
server.use("/user", cartListing);
server.use("/inventory", inventory);

server.listen(port, () => {
  console.log("Server started at", port);
});
