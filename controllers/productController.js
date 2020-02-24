/**
 * Product Controller
 *  - Installed formidable, lodash package to image upload
 */
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Find By productId
exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: 'Product not found'
        });
      }
      req.product = product;
      next();
    });
};

// Read
exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

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

    // check for all fiels
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required!'
      });
    }

    let product = new Product(fields);

    /**
     * get access file system
     * 1 kb = 1000
     * 1 mb = 1000000
     */
    if (files.photo) {
      // console.log('Files photo: ', files.photo);
      /** check image size */
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size'
        });
      }
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

/** Remove Product */
exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deleteProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json({
      message: 'Product deleted successfully'
    });
  });
};

/** Update Product */
exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be updated'
      });
    }

    // check for all fiels to update
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required!'
      });
    }
    /**  */
    let product = req.product;
    /**
     * @method _.extend lodash method it comes from lodash lib
     * @description
     * - _.assign(object, [sources]): Assigns own enumerable
     * string keyed properties of source objects to the destination object.
     * Source objects are applied from left to right. Subsequent sources overwrite property assignments of previous sources.
     *
     * Note: This method mutates object and is loosely based on Object.assign.
     *
     * _.assignIn(object, [sources])
     * This method is like _.assign except that it iterates over own and inherited source properties.
     * Note: This method mutates object.
     * Aliases: _.extend
     * Arguments: object (Object): The destination object. / [sources] (...Object): The source objects.
     * @argument product, fields
     */
    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size.'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
};

/**
 * sell and arrival
 * If we want to return the product by sell ?sortBy=sold&order=desc&limit=6 it comes from front-end
 * If we want to return the product by based on arrival ?sortBy=createdAt&order=desc&limit=6 from front-end
 * If no params are sent, then all products are returned
 * Return the products based on the request queries
 */
exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'Product not found!'
        });
      }
      res.json(products);
    });
};

/**
 * Related Products list to the Sidebar menu
 * - It will find the products based on the req product category
 *   other products that has the same category, will be returned
 */
exports.relatedProductList = (req, res) => {
  // Create a variable called limit
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  // $ne (not include = except request product)
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found'
        });
      }
      res.json(products);
    });
};

// Get all the categories used in the product more distinct to product
exports.listCategories = (req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: 'Categories not found'
      });
    }
    res.json(categories);
  });
};

/**
 * Search to products list that is going to be front-end
 * It's going to implements product search in react frontend
 * It's going to show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * 's going to make api request and show the products to users based on what he wants
 */
exports.searchProductsList = (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {}; // arguments object

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      // extract price
      if (key === 'price') {
        // $gte -  greater than price [0-10]
        // $lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        // categories
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found'
        });
      }
      res.json({
        size: data.length, // count products
        data
      });
    });
};

/**
 * Send product photo to front-end
 */
exports.sendProductPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.listSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
    // assigne category value to query.category
    if (req.query.category && req.query.category != 'All') {
      query.category = req.query.category;
    }
    // find the product based on query object with 2 properties
    // search and category
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(products);
    }).select('-photo');
  }
};

/**
 * @description When user purchased product, it can decrease product quantity automatically.
 * @requestedFrom routes/orderRoutes.js - router.post(
  '/order/create/:userId',
  requireSignin,
  isAuth,
  addOrderToUserHistory,
  decreaseQuantity,
  createOrder
);
 */
exports.decreaseQuantity = (req, res, next) => {
  // item = product item
  let bulkOps = req.body.order.products.map(item => {
    return {
      updateOne: {
        // filter based on _id
        filter: { _id: item._id },
        // update $inc means update include decrease quantity of item and increase sold of item from front-end
        update: { $inc: { quantity: -item.count, sold: +item.count } }
      }
    };
  });
  /**
   * @method bulkWrite From mongoose
   * @argument bulkOps
   * @argument {}
   * @argument callback error, products
   */
  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: 'Could not update product'
      });
    }
    // continue second method of createOrder in orderRoutes.js
    next();
  });
};
