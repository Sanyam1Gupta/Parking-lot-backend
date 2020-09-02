const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { ParkingLotSch } = require("../models/country");
const { Wheel2TCSch } = require("../models/country");

// Handle incoming GET requests to /orders
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const parkingLot = new ParkingLotSch({
    _id: new mongoose.Types.ObjectId(),
    zipcode: req.body.zipcode,
    countW2: req.body.countW2,
    countW4: req.body.countW4,
    wheel2TC: req.body.wheel2TC,
    wheel4TC: req.body.wheel4TC,
  });
  parkingLot
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created parking lot successfully",
        parkingLot: {
          zipcode: result.zipcode,
          countW2: result.countW2,
          countW4: result.countW4,
          wheel2TC: result.wheel2TC,
          wheel4TC: result.wheel4TC,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:parkingLotId", (req, res, next) => {
  const id = req.params.parkingLotId;
  ParkingLotSch.findById(id)
    .populate("wheel2TC")
    .populate("wheel4TC")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          parkingLot: doc,
        });
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:parkingLotId", (req, res, next) => {
  const id = req.params.parkingLotId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  ParkingLotSch.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Parking Lot updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { productId: "ID", quantity: "Number" },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
