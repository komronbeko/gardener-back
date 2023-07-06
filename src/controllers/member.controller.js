const fs = require("fs/promises");

const Joi = require("joi");

const Members = require("../models/Member");

const getAll = async (_, res) => {
  try {
    const members = await Members.find();

    res.status(200).json({ message: "OK", data: members });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, job, facebook_link, twitter_link, instagram_link } = req.body;
    const image = req.imageName;

    //VALIDATION
    const schema = Joi.object({
      name: Joi.string().required(),
      job: Joi.string().required(),
      facebook_link: Joi.string().required(),
      twitter_link: Joi.string().required(),
      instagram_link: Joi.string().required(),
    });

    const { error } = schema.validate({ name, job, facebook_link, twitter_link, instagram_link });
    if (error) {
      return res.status(403).json({ error: error.message });
    }

    Members.create({name, image, job, facebook_link, twitter_link, instagram_link});

    res.status(201).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const put = async (req, res) => {
  try {
    const { name, job, facebook_link, twitter_link, instagram_link } = req.body;
    const { id } = req.params;

    //VALIDATION
    const schema = Joi.object({
        name: Joi.string().required(),
        job: Joi.string().required(),
        facebook_link: Joi.string().required(),
        twitter_link: Joi.string().required(),
        instagram_link: Joi.string().required(),
      });
  
      const { error } = schema.validate({ name, job, facebook_link, twitter_link, instagram_link });
      if (error) {
        return res.status(403).json({ error: error.message });
      }

    await Members.findByIdAndUpdate(id, { name, job, facebook_link, twitter_link, instagram_link });

    res.status(200).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const _delete = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Members.findById(id);

    fs.unlink(`${process.cwd()}/uploads/${member.image}`);

    await Members.findByIdAndDelete(id);

    res.status(200).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAll, create, put, _delete };
