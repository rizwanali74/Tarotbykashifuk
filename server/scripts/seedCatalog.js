import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { seedDefaultCatalog } from '../services/catalogSeedService.js';

const seedCatalog = async () => {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB is unavailable; catalog seed was not written.');

  const result = await seedDefaultCatalog();
  console.log(`Catalog seed complete: ${result.categories} categories and ${result.services} services checked.`);
};

seedCatalog()
  .catch((error) => {
    console.error('Catalog seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
