const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Wheel2TCSch } = require("../models/country");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const d1 = new Date();
  const wheel2 = new Wheel2TCSch({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    ticketId: req.body.vehicleNo+(req.body.countTotal - req.body.countFilled) + "2TC",
    vehicleNo: req.body.vehicleNo,
    createdAt: d1,
  });
  wheel2
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created wheel2 ticket successfully",
        createdwheel2t: {
          name: result.name,
          ticketId: result.ticketId,
          _id: result._id,
          vehicleNo: result.vehicleNo,
          createdAt: result.createdAt,
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

router.get("/:ticketId", (req, res, next) => {
  const id = req.params.ticketId;
  Wheel2TCSch.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          wh2tc: doc,
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

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
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

router.delete("/:ticketId", (req, res, next) => {
  const id = req.params.ticketId;
  Wheel2TCSch.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Ticket deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
