const Joi = require("joi");
const bcrypt = require("bcrypt");

const Admins = require("../models/Admin");

const getAll = async (_, res) => {
  try {
    const admins = await Admins.find();

    res.status(200).json({ message: "OK", data: admins });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    //VALIDATION
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
    });

    const { error } = schema.validate({ username, password, role });
    if (error) {
      return res.status(403).json({ error: error.message });
    };

    const hashedPass = await bcrypt.hash(password, 12);

    Admins.create({ username, password: hashedPass, role });

    res.status(201).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const put = async (req, res) => {
    try {
      const { username, password } = req.body;
      const { id } = req.verified;
  
      //VALIDATION
      const schema = Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required()
        });
    
        const { error } = schema.validate({ username, password });
        if (error) {
          return res.status(403).json({ error: error.message });
        }
  
      await Admins.findByIdAndUpdate(id, { username, password });
  
      res.status(200).json({ message: "OK" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

const _delete = async (req, res) => {
  try {
    const { id } = req.params;

    await Admins.findByIdAndDelete(id);

    res.status(200).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAll, put,  create, _delete };
