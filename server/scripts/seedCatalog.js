import mongoose from 'mongoose';
import { siteData } from '../../client/src/data.js';
import { connectDB } from '../config/db.js';
import { Category } from '../models/Category.js';
import { Service } from '../models/Service.js';

const seedCatalog = async () => {
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB is unavailable; catalog seed was not written.');

  const categoriesByKey = new Map();
  const categoryNames = [...new Set(siteData.services.map((service) => service.category))];

  for (const name of categoryNames) {
    const key = name.trim().toLocaleLowerCase();
    const category = await Category.findOneAndUpdate(
      { key },
      { $setOnInsert: { name, key } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    categoriesByKey.set(key, category);
  }

  for (const service of siteData.services) {
    const category = categoriesByKey.get(service.category.trim().toLocaleLowerCase());
    const { category: _categoryName, ...serviceFields } = service;
    await Service.updateOne(
      { id: service.id },
      { $setOnInsert: { ...serviceFields, categoryId: category._id, isActive: true } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Catalog seed complete: ${categoryNames.length} categories and ${siteData.services.length} services checked.`);
};

seedCatalog()
  .catch((error) => {
    console.error('Catalog seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
