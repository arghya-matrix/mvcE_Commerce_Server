const userServices = require("../services/user.services");

async function getAll(req, res) {
  const users = await userServices.getAll();
  res.json({
    messege: "All user from the Users table",
    data: users,
  });
}

async function update(req, res) {
  const data = req.body;
  const updateOptions = {};
  const whereOptions = {};

  if (data.firstName) {
    updateOptions.firstName = data.firstName;
  }
  if (data.lastName) {
    updateOptions.lastName = data.lastName;
  }
  if (data.EmailAddress) {
    updateOptions.EmailAddress = data.EmailAddress;
  }
  if (data.userName) {
    updateOptions.userName = data.userName;
  }
  if (req.url) {
    updateOptions.imageUrl = req.url;
  }
  whereOptions.user_id = req.userdata.user_id;

  const userUpdate = await userServices.updateUser({
    updateOptions: updateOptions,
    whereOptions: whereOptions,
  });

  res.json({
    message: `Details updated`,
    updatedData: userUpdate,
    imageUrl: req.url ? req.url : null,
  });
}

async function deleteUser(req, res) {
  const data = req.body;
  const deleteUser = await userServices.deleteUser({
    firstName: data.firstName,
  });
  res.json({
    message: `Details of ${data.firstName} deleted`,
  });
}

async function addAddress(req, res) {
  try {
    const createObject = {};
    const data = req.body;
    createObject.user_id = req.userdata.user_id;
    createObject.address = data.address;
    createObject.zip_code = data.zip_code;
    createObject.city = data.city;
    createObject.state = data.state;
    createObject.country = data.country;
    const address = await userServices.addAddress({
      createObject: createObject,
    });
    res.status(200).json({
      message: `Address added`,
      address: address,
    });
  } catch (error) {
    console.log("Internal error", error);
    res.status(500).json({
      message: `Server error`,
      error: error,
    });
  }
}

module.exports = {
  getAll,
  update,
  deleteUser,
  addAddress
};
