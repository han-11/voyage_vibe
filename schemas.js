const Joi = require('joi');


const destinationSchema = Joi.object({
    destination: Joi.object({
      location: Joi.string().required(),
      title: Joi.string().required(),
      date: Joi.date().required(),
      description: Joi.string().required()
    }).required()
  });

  


module.exports = destinationSchema;