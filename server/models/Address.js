import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  street:    { type: String, required: true },
  city:      { type: String, required: true },
  state:     { type: String, required: true },
  zipcode:   { type: String, required: true }, // string for flexibility
  country:   { type: String, required: true },
  phone:     { type: String, required: true }
}, { timestamps: true }); // 👈 timestamps for createdAt & updatedAt

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
