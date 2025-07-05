const { galleryProduct } = require("../models/galleryProduct");
const { order } = require("../models/order");

class OrderController {
  async getOrders(req, res, next) {
    try {
      const orders = await order
        .find({})
        .populate({
          path: "payer",
          select: "_id email name",
        })
        .sort({ createdAt: -1 })
        .lean();

      const transformedOrders = await Promise.all(
        orders.map(async (order) => {
          const transformedItems = await Promise.all(
            order.items.map(async (item) => {
              const { product, productType, ...restItem } = item;

              const galleryItem = await galleryProduct.findById(product).lean();

              const images =
                galleryItem?.images?.length > 0 ? [galleryItem.images[0]] : [];

              return {
                ...restItem,
                productType,
                ...galleryItem,
                images,
              };
            })
          );

          return {
            ...order,
            payer: {
              _id: order.payer._id,
              email: order.payer.email,
              name: order.payer.name || null,
            },
            items: transformedItems,
          };
        })
      );

      res.send(transformedOrders);
    } catch (e) {
      console.error(e);
      res.status(400).send("Error occurred");
    }
  }
}

module.exports = new OrderController();
