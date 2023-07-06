const fs = require("fs/promises");

const Joi = require("joi");

const Projects = require("../models/Project");

const getAll = async (_, res) => {
  try {
    const projects = await Projects.find();

    res.status(200).json({ message: "OK", data: projects });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCompletes = async(req, res)=>{
    try {
        const {status} = req.query;

        const filteredProjects = await Projects.find({status: status});

        res.status(200).json({message: "OK", data: filteredProjects});

    } catch (error) {
        
    }
}

const create = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.imageName;

    //VALIDATION
    const schema = Joi.object({
      title: Joi.string().required()
    });

    const { error } = schema.validate({title });
    if (error) {
      return res.status(403).json({ error: error.message });
    }

    Projects.create({title, image});

    res.status(201).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const put = async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;
  
      //VALIDATION
      const schema = Joi.object({
        status: Joi.string().required(),
      });
  
      const { error } = schema.validate({ status });
      if (error) {
        return res.status(403).json({ error: error.message });
      }
  
      await Projects.findByIdAndUpdate(id, { status });
  
      res.status(200).json({ message: "OK" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
const _delete = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Projects.findById(id);

    fs.unlink(`${process.cwd()}/uploads/${project.image}`);

    await Projects.findByIdAndDelete(id);

    res.status(200).json({ message: "OK" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAll, getCompletes, create, put, _delete };
