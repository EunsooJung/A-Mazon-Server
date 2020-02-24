/**
 * Order Controller
 */
const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

/**
 * @description
 * @arguments req, res, next, id
 * @requestedBy
 * @usedIn - @method updateOrderStatus
 */
exports.orderById = (req, res, next, id) => {
  Order.findById(id)
    .populate('products.product', 'name price')
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      req.order = order;
      next();
    });
};

/**
 * @method createOrder
 */
exports.createOrder = (req, res) => {
  // console.log("CREATE ORDER: ", req.body);
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }
    res.json(data);
  });
};

/**
 * @method listOrders
 * @requestedBy OrderRoutes.js - router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders);
 */
exports.listOrders = (req, res) => {
  Order.find()
    .populate('user', '_id name address')
    .sort('-created')
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error)
        });
      }
      res.json(orders);
    });
};

/**
 * @requestedBy src/admin/adminApi.js : front-end
 */
exports.getStatusValues = (req, res) => {
  // from front-end
  res.json(Order.schema.path('status').enumValues);
};
/**
 * @requestedBy src/admin/adminApi.js - const updateOrderStatus = (userId, token, orderId, status) ... : back-end
 */
exports.updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(order);
    }
  );
};
