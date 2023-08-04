const Joi = require('joi');


module.exports.destinationSchema = Joi.object({
    destination: Joi.object({
      location: Joi.string().required(),
      title: Joi.string().required(),
      date: Joi.date().required(),
      description: Joi.string().required(),
      // image: Joi.string().required()
    }).required(),
  deleteImages: Joi.array()
  });

  

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
});