const fs = require("fs/promises");

const Joi = require("joi");

const Contacts = require("../models/Contact");

const getAll = async (_, res) => {
  try {
    const contacts = await Contacts.find();

    res.status(200).json({ message: "OK", data: contacts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    //VALIDATION
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      subject: Joi.string().required(),
      message: Joi.string().required(),
    });

    const { error } = schema.validate({
      name,
      email,
      subject,
      message,
    });
    if (error) {
      return res.status(403).json({ error: error.message });
    }

    Contacts.create({ name, email, subject, message });

    res.status(201).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const _delete = async (req, res) => {
  try {
    const { id } = req.params;

    await Contacts.findByIdAndDelete(id);

    res.status(200).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAll, create, _delete };
