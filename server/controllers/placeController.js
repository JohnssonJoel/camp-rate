import Place from "../models/Place.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

export const getAllPlaces = async (req, res) => {
  try {
    const { type, dogFriendly } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (dogFriendly !== undefined) {
      filter.dogFriendly = dogFriendly === "true";
    }

    const places = await Place.find(filter).populate("createdBy", "name email");

    const placesWithRatings = await Promise.all(
      places.map(async (place) => {
        const reviews = await Review.find({ placeId: place._id });
        const averageRating =
          reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

        return {
          ...place.toObject(),
          averageRating: Number(averageRating.toFixed(1)),
        };
      })
    );

    res.status(200).json(placesWithRatings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch places", error: error.message });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate("createdBy", "name email");

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch place", error: error.message });
  }
};

export const createPlace = async (req, res) => {
  try {
    const { name, type, location, hasElectricity, dogFriendly, pricePerNight, createdBy } =
      req.body;

    if (!name || !type || !location || pricePerNight === undefined || !createdBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPlace = new Place({
      name,
      type,
      location,
      hasElectricity,
      dogFriendly,
      pricePerNight,
      createdBy,
    });

    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({ message: "Failed to create place", error: error.message });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json(updatedPlace);
  } catch (error) {
    res.status(500).json({ message: "Failed to update place", error: error.message });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);

    if (!deletedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    await Review.deleteMany({ placeId: req.params.id });

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete place", error: error.message });
  }
};