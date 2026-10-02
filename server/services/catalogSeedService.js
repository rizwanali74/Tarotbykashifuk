import { siteData } from '../../client/src/data.js';
import { Category } from '../models/Category.js';
import { Service } from '../models/Service.js';

export const seedDefaultCatalog = async () => {
  const categoryNames = [...new Set(siteData.services.map((service) => service.category))];
  const categoryKeys = categoryNames.map((name) => name.trim().toLocaleLowerCase());
  const serviceIds = siteData.services.map((service) => service.id);

  const [existingCategoryCount, existingServiceCount] = await Promise.all([
    Category.countDocuments({ key: { $in: categoryKeys } }),
    Service.countDocuments({ id: { $in: serviceIds } }),
  ]);
  const alreadyCreated = existingCategoryCount === categoryNames.length
    && existingServiceCount === siteData.services.length;

  const categoriesByKey = new Map();
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

  return {
    alreadyCreated,
    categories: categoryNames.length,
    services: siteData.services.length,
  };
};