import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Place from "../models/Place.js";
import Review from "../models/Review.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding");

    await Review.deleteMany({});
    await Place.deleteMany({});
    await User.deleteMany({});

    const users = await User.insertMany([
      { name: "Joel", email: "joel@example.com" },
      { name: "Emma", email: "emma@example.com" },
      { name: "Lucas", email: "lucas@example.com" },
      { name: "Sara", email: "sara@example.com" },
      { name: "Anton", email: "anton@example.com" },
    ]);

    const places = await Place.insertMany([
      {
        name: "Böda Sand Camping",
        type: "camping",
        location: "Öland",
        hasElectricity: true,
        dogFriendly: true,
        pricePerNight: 450,
        createdBy: users[0]._id,
      },
      {
        name: "Lögnäs Ställplats",
        type: "stallplats",
        location: "Laholm",
        hasElectricity: true,
        dogFriendly: false,
        pricePerNight: 220,
        createdBy: users[1]._id,
      },
      {
        name: "Tivedens Camping",
        type: "camping",
        location: "Tiveden",
        hasElectricity: true,
        dogFriendly: true,
        pricePerNight: 390,
        createdBy: users[2]._id,
      },
      {
        name: "Kosta Bad & Camping",
        type: "camping",
        location: "Kosta",
        hasElectricity: true,
        dogFriendly: true,
        pricePerNight: 350,
        createdBy: users[3]._id,
      },
      {
        name: "Varberg Ställplats",
        type: "stallplats",
        location: "Varberg",
        hasElectricity: false,
        dogFriendly: true,
        pricePerNight: 180,
        createdBy: users[4]._id,
      },
    ]);

    await Review.insertMany([
      {
        rating: 5,
        comment: "Fantastisk plats nära stranden och bra servicehus.",
        visitDate: new Date("2025-07-10"),
        userId: users[0]._id,
        placeId: places[0]._id,
      },
      {
        rating: 4,
        comment: "Lugn ställplats och enkelt att parkera husbilen.",
        visitDate: new Date("2025-07-14"),
        userId: users[1]._id,
        placeId: places[1]._id,
      },
      {
        rating: 5,
        comment: "Väldigt fin natur och bra elplatser.",
        visitDate: new Date("2025-07-18"),
        userId: users[2]._id,
        placeId: places[2]._id,
      },
      {
        rating: 3,
        comment: "Bra läge men lite dyrt under högsäsongen.",
        visitDate: new Date("2025-07-20"),
        userId: users[3]._id,
        placeId: places[3]._id,
      },
      {
        rating: 4,
        comment: "Prisvärd ställplats nära centrum och havet.",
        visitDate: new Date("2025-07-22"),
        userId: users[4]._id,
        placeId: places[4]._id,
      },
    ]);

    users[0].favorites = [places[0]._id, places[2]._id];
    users[1].favorites = [places[1]._id];
    users[2].favorites = [places[0]._id, places[4]._id];
    users[3].favorites = [places[3]._id];
    users[4].favorites = [places[2]._id, places[4]._id];

    await Promise.all(users.map((user) => user.save()));

    console.log("Seed data inserted successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();