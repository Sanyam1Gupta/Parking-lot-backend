const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { RegistrationSch } = require("../models/country");

router.get("/", (req, res, next) => {
  Product.find()
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

router.post("/register/", (req, res, next) => {
  RegistrationSch.find({ vehicleNo: req.body.vehicleNo })
    .exec()
    .then((docs) => {
      if (docs.length > 0) {
        res.status(404).json({
          message: "user already exists",
        });
      } else {
        const registration = new RegistrationSch({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          vehicleNo: req.body.vehicleNo,
          is2wh: req.body.is2wh,
        });

        registration
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "Created registration user successfully",
              registration: {
                name: result.name,
                vehicleNo: result.vehicleNo,
                _id: result._id,
                is2wh: result.is2wh,
              },
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/login/", (req, res, next) => {
  RegistrationSch.find({ vehicleNo: req.body.vehicleNo })
    .exec()
    .then((docs) => {
      const response = {
        registeredUsers: docs.map((doc) => {
          return {
            user: doc,
          };
        }),
      };
      if (docs.length > 0) {
        if (docs[0].name !== req.body.name) {
          res.status(200).json({
            message: "No entry with same name found",
            error: true,
          });
        } else res.status(200).json(response);
      } else {
        res.status(200).json({
          message: "No entries found",
          error: true,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products",
          },
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

router.patch("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  RegistrationSch.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" },
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

module.exports = router;
