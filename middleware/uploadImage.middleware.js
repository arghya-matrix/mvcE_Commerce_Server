const multer = require("multer");
const db = require("../models/index");
const path = require("path");
const { Op } = require("sequelize");
const fs = require("fs");

const imageStorage = multer.diskStorage({
  destination: "./upload",
  filename: (req, file, cb) => {
    console.log(req.body, "Inside upload func");
    const text = req.body.product_name;
    const textWithoutSpaces = text.replace(/\s/g, "");

    return cb(
      null,
      `${textWithoutSpaces}_${file.fieldname}_${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".png", ".jpg", ".jpeg"];
  // const fileExtension = path.extname(file.originalname).toLowerCase();
  const base64Image = req.body.image;
  const match = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,/);
  const fileExtension = match[1];
  const text = req.body.product_name;
  const textWithoutSpaces = text.replace(/\s/g, "");
  const fileName = `${textWithoutSpaces}_image.${fileExtension}`;

  if (allowedExtensions.includes(fileExtension)) {
    return cb(null, fileName); // Accept the file
  }

  return cb(
    new Error(
      "Invalid file type. Only .png, .jpg, and .jpeg files are allowed."
    )
  );
};

const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 1000000000000 },
  fileFilter: fileFilter,
}).single("images");

async function uploadImage(req, res, next) {
  upload(req, res, async function (err) {
    console.log(req.body, "<-----Body Data");
    if (err) {
      console.log(err, "<------Error HAndling the file");
      return res.status(400).json({ error: `File upload failed${err}` });
    }

    const data = req.body;
    if (
      !data.product_name ||
      !data.c_id ||
      !data.description ||
      !data.price ||
      !data.quantity
    ) {
      if (!req.file) {
        next();
      } else if (req.file) {
        fs.unlinkSync(req.file.path);
        next();
      }
    } else {
      const base64Image = req.body.image;

      const result = base64Image.replace(
        /^data:image\/(png|jpeg|jpg|gif);base64,/,
        ""
      );
      const match = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,/);
      const fileExtension = match[1];
      const text = req.body.product_name;
      const textWithoutSpaces = text.replace(/\s/g, "");
      const fileName = `${textWithoutSpaces}_image.${fileExtension}`;
      const imageBuffer = Buffer.from(result, "base64");
      const uploadpath = path.join(__dirname, "/upload", fileName);
      fs.writeFileSync(uploadpath, imageBuffer);
      req.url = `http://localhost:3300/upload/${fileName}`;
      console.log(req.url, "image url");
      next();
    }
  });
}

async function uploadImageForSignup(req, res, next) {
  upload(req, res, async function (err) {
    console.log(req.body, "<-----Body Data");
    if (err) {
      console.log(err, "<------Error HAndling the file");
      return res.status(400).json({ error: `File upload failed${err}` });
    }

    const data = req.body;
    if (
      !data.firstName ||
      !data.lastName ||
      !data.EmailAddress ||
      !data.password ||
      !data.images
    ) {
      if (!req.file) {
        next();
      } else if (req.file) {
        fs.unlinkSync(req.file.path);
        next();
      }
    } else {
      const base64Image = req.body.images;

      const result = base64Image.replace(
        /^data:image\/(png|jpeg|jpg|gif);base64,/,
        ""
      );
      const match = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,/);
      const fileExtension = match[1];
      const text = req.body.firstName;
      const textWithoutSpaces = text.replace(/\s/g, "");
      const fileName = `${textWithoutSpaces}_image_${Date.now()}.${fileExtension}`;
      const imageBuffer = Buffer.from(result, "base64");
      const uploadpath = path.join(__dirname, "..", "/upload", fileName);
      console.log("uploapath==>", uploadpath);

      fs.writeFileSync(uploadpath, imageBuffer);
      req.url = `http://localhost:3300/upload/${fileName}`;
      console.log(req.url, "image url");
      next();
    }
  });
}

async function updateUserImage(req, res, next) {
  const user = await db.User.findOne({
    where: {
      user_id: req.userdata.user_id,
    },
    raw: true,
  });
  const url = new URL(user.imageUrl);
  const pathname = url.pathname;
  const directory = path.join(__dirname, "..", pathname);
  fs.unlink(directory, (err) => {
    if (err) throw err;
  });
  upload(req, res, async function (err) {
    console.log(req.body, "<-----Body Data");
    if (err) {
      console.log(err, "<------Error HAndling the file");
      return res.status(400).json({ error: `File upload failed${err}` });
    }
    const base64Image = req.body.images;

    const result = base64Image.replace(
      /^data:image\/(png|jpeg|jpg|gif);base64,/,
      ""
    );
    const match = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,/);
    const fileExtension = match[1];
    const text = user.userName;
    const textWithoutSpaces = text.replace(/\s/g, "");
    const fileName = `${textWithoutSpaces}_image_${Date.now()}.${fileExtension}`;
    const imageBuffer = Buffer.from(result, "base64");
    const uploadpath = path.join(__dirname, "/upload", fileName);
    fs.writeFileSync(uploadpath, imageBuffer);
    req.url = `http://localhost:3300/upload/${fileName}`;
    console.log(req.url, "image url");
    return res.json({
      message: `User Image updated`
    })
  });
}

async function updateProductImage(req, res, next) {
  const product = await db.Product.findOne({
    where: {
      user_id: req.query.product_id,
    },
    raw: true,
  });
  const url = new URL(product.imageUrl);
  const pathname = url.pathname;
  const directory = path.join(__dirname, "..", pathname);
  fs.unlink(directory, (err) => {
    if (err) throw err;
  });
  upload(req, res, async function (err) {
    console.log(req.body, "<-----Body Data");
    if (err) {
      console.log(err, "<------Error HAndling the file");
      return res.status(400).json({ error: `File upload failed${err}` });
    }
    const base64Image = req.body.image;

    const result = base64Image.replace(
      /^data:image\/(png|jpeg|jpg|gif);base64,/,
      ""
    );
    const match = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,/);
    const fileExtension = match[1];
    const text = product.product_name;
    const textWithoutSpaces = text.replace(/\s/g, "");
    const fileName = `${textWithoutSpaces}_image_${Date.now()}.${fileExtension}`;
    const imageBuffer = Buffer.from(result, "base64");
    const uploadpath = path.join(__dirname, "/upload", fileName);
    fs.writeFileSync(uploadpath, imageBuffer);
    req.url = `http://localhost:3300/upload/${fileName}`;
    console.log(req.url, "image url");
    next();
  });
}

module.exports = {
  uploadImage,
  uploadImageForSignup,
  updateUserImage,
  updateProductImage
};
