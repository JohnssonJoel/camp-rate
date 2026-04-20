import Review from "../models/Review.js";

export const getReviewsByPlace = async (req, res) => {
  try {
    const reviews = await Review.find({
      placeId: req.params.placeId,
    }).populate("userId", "name");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment, visitDate, userId, placeId } = req.body;

    if (!rating || !comment || !visitDate || !userId || !placeId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const newReview = await Review.create({
      rating,
      comment,
      visitDate,
      userId,
      placeId,
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create review",
      error: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update review",
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
};