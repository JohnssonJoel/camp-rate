import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["camping", "stallplats"],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    hasElectricity: {
      type: Boolean,
      default: false,
    },
    dogFriendly: {
      type: Boolean,
      default: false,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model("Place", placeSchema);

export default Place;