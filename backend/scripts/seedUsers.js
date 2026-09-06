import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

async function seedUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  const usersCol = mongoose.connection.db.collection("users");

  const adminPassHash = await bcrypt.hash("qwerty123", 10);
  await usersCol.updateOne(
    { email: "admin@forever.com" },
    {
      $set: {
        name: "Admin User",
        email: "admin@forever.com",
        password: adminPassHash,
        cartData: {},
      },
    },
    { upsert: true }
  );

  const userPassHash = await bcrypt.hash("password123", 10);
  await usersCol.updateOne(
    { email: "user@example.com" },
    {
      $set: {
        name: "Demo Customer",
        email: "user@example.com",
        password: userPassHash,
        cartData: {},
      },
    },
    { upsert: true }
  );

  const count = await usersCol.countDocuments();
  console.log("Total users in DB now:", count);
  const all = await usersCol.find({}).toArray();
  all.forEach((u) => console.log(" - User:", u.email, `(${u.name})`));
  process.exit(0);
}

seedUsers();
