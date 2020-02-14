/**
 * Product Controller
 *  - Installed formidable, lodash package to image upload
 */
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  // recieve image
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; // to images type: gif, jpg...
  /** image parse using callback func */
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }
    let product = new Product(fields);

    // get access file system
    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    // Create Product using callback func
    product.save((err, result) => {
      if (err) {
        console.log('Product create error! ', err);
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
};
