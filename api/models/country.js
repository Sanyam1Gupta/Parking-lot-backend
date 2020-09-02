const mongoose = require("mongoose");

const registrationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, default: "Guest" },
  vehicleNo: { type: String, required: true },
  is2wh: { type: Boolean, default: false },
  wh2tc_id: { type: mongoose.Schema.Types.ObjectId, ref: "Wheel2TC", default: null },
  wh4tc_id: { type: mongoose.Schema.Types.ObjectId, ref: "Wheel4TC", default: null },
  parkingLot_id: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingLot", default: null },
});

const registrationStr = mongoose.model("Registration", registrationSchema);

const wheel2TCSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  vehicleNo: { type: String, required: true },
  ticketId: { type: String, required: true },
  createdAt: { type: String, required: true },
  // country: { type: String, required: true },
  //  zipcode: { type: Number, required: true },
});

const wheel2TCStr = mongoose.model("Wheel2TC", wheel2TCSchema);

const wheel4TCSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  vehicleNo: { type: String, required: true },
  ticketId: { type: String, required: true },
  createdAt: { type: String, required: true },
  // country: { type: String, required: true },
  // zipcode: { type: Number, required: true },
});

const wheel4TCStr = mongoose.model("Wheel4TC", wheel4TCSchema);

const parkingLotSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  zipcode: { type: Number, required: true },
  countW2: { type: Number, required: true },
  countW4: { type: Number, required: true },
  wheel2TC: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wheel2TC" }],
  wheel4TC: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wheel4TC" }],
});

const parkingLotStr = mongoose.model("ParkingLot", parkingLotSchema);

const countrySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  parkingLots: [{ type: mongoose.Schema.Types.ObjectId, ref: "ParkingLot" }],
});

const countryStr = mongoose.model("Country", countrySchema);

module.exports = {
  CountrySch: countryStr,
  ParkingLotSch: parkingLotStr,
  Wheel2TCSch: wheel2TCStr,
  Wheel4TCSch: wheel4TCStr,
  RegistrationSch: registrationStr,
};
