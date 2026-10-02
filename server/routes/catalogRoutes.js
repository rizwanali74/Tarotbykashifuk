import express from 'express';
import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { isValidRasterImage, uploadServiceImage } from '../middleware/serviceImageUpload.js';
import { Category } from '../models/Category.js';
import { Service } from '../models/Service.js';

const router = express.Router();
const categoryKey = (name) => name.trim().toLocaleLowerCase();

router.post('/admin/services/image', protectAdmin, (req, res, next) => {
  uploadServiceImage.single('image')(req, res, (error) => {
    if (!error) return next();
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Image must be 5 MB or smaller.'
      : error.message;
    return res.status(400).json({ success: false, error: message });
  });
}, async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'Choose an image to upload.' });

  try {
    const handle = await fs.open(req.file.path, 'r');
    const header = Buffer.alloc(12);
    await handle.read(header, 0, header.length, 0);
    await handle.close();

    if (!isValidRasterImage(req.file.mimetype, header)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ success: false, error: 'The uploaded file is not a valid image.' });
    }

    return res.status(201).json({
      success: true,
      image: `/uploads/services/${req.file.filename}`,
    });
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(500).json({ success: false, error: 'Could not process the uploaded image.' });
  }
});

const serializeCategory = (category) => ({
  id: category._id.toString(),
  name: category.name,
});

const serializeService = (service) => {
  const plain = service.toObject();
  const category = plain.categoryId && typeof plain.categoryId === 'object'
    ? plain.categoryId
    : null;

  return {
    ...plain,
    category: category?.name || '',
    categoryId: category?._id?.toString() || String(plain.categoryId || ''),
  };
};

const getServiceValues = async (body, current = {}) => {
  const name = String(body.name ?? current.name ?? '').trim();
  const shortDescription = String(body.shortDescription ?? current.shortDescription ?? '').trim();
  const price = String(body.price ?? current.price ?? '').trim();
  const categoryId = body.categoryId ?? current.categoryId;
  const priceNumeric = Number(body.priceNumeric ?? current.priceNumeric ?? 0);

  if (!name || !shortDescription || !price) {
    return { error: 'Name, short description, and price are required.' };
  }
  if (!Number.isFinite(priceNumeric) || priceNumeric < 0) {
    return { error: 'Numeric price must be zero or greater.' };
  }
  if (!mongoose.isValidObjectId(categoryId)) {
    return { error: 'Choose a valid category.' };
  }

  const category = await Category.findById(categoryId);
  if (!category) return { error: 'The selected category does not exist.' };

  const details = body.details ?? current.details ?? {};
  const tags = body.tags ?? current.tags ?? [];
  if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === 'string')) {
    return { error: 'Tags must be a list of text values.' };
  }

  return {
    values: {
      name,
      categoryId: category._id,
      price,
      priceNumeric,
      isCaseBased: Boolean(body.isCaseBased ?? current.isCaseBased),
      image: String(body.image ?? current.image ?? '').trim(),
      badge: String(body.badge ?? current.badge ?? '').trim(),
      shortDescription,
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
      details: {
        description: String(details.description || '').trim(),
        whatYouCanExplore: Array.isArray(details.whatYouCanExplore)
          ? details.whatYouCanExplore.map((item) => String(item).trim()).filter(Boolean)
          : [],
        beforeYourSession: String(details.beforeYourSession || '').trim(),
        note: String(details.note || '').trim(),
      },
      isActive: body.isActive ?? current.isActive ?? true,
    },
  };
};

router.get('/', async (req, res) => {
  try {
    const [categories, services] = await Promise.all([
      Category.find().sort({ name: 1 }),
      Service.find({ isActive: true }).populate('categoryId', 'name').sort({ createdAt: 1 }),
    ]);

    return res.json({
      success: true,
      categories: categories.map(serializeCategory),
      services: services.map(serializeService),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/admin', protectAdmin, async (req, res) => {
  try {
    const [categories, services] = await Promise.all([
      Category.find().sort({ name: 1 }),
      Service.find().populate('categoryId', 'name').sort({ createdAt: 1 }),
    ]);

    return res.json({
      success: true,
      categories: categories.map(serializeCategory),
      services: services.map(serializeService),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/admin/categories', protectAdmin, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ success: false, error: 'Category name is required.' });

    const key = categoryKey(name);
    if (await Category.exists({ key })) {
      return res.status(409).json({ success: false, error: 'A category with that name already exists.' });
    }

    const category = await Category.create({ name, key });
    return res.status(201).json({ success: true, category: serializeCategory(category) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/admin/categories/:id', protectAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, error: 'Category not found.' });

    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ success: false, error: 'Category name is required.' });

    const key = categoryKey(name);
    if (await Category.exists({ key, _id: { $ne: category._id } })) {
      return res.status(409).json({ success: false, error: 'A category with that name already exists.' });
    }

    category.name = name;
    category.key = key;
    await category.save();
    return res.json({ success: true, category: serializeCategory(category) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/admin/categories/:id', protectAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, error: 'Category not found.' });
    if (await Service.exists({ categoryId: category._id })) {
      return res.status(409).json({ success: false, error: 'Move or remove this category services before deleting it.' });
    }

    await category.deleteOne();
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/admin/services', protectAdmin, async (req, res) => {
  try {
    const { values, error } = await getServiceValues(req.body);
    if (error) return res.status(400).json({ success: false, error });

    const service = await Service.create({ id: randomUUID(), ...values });
    await service.populate('categoryId', 'name');
    return res.status(201).json({ success: true, service: serializeService(service) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/admin/services/:id', protectAdmin, async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found.' });

    const { values, error } = await getServiceValues(req.body, service);
    if (error) return res.status(400).json({ success: false, error });

    Object.assign(service, values);
    await service.save();
    await service.populate('categoryId', 'name');
    return res.json({ success: true, service: serializeService(service) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/admin/services/:id', protectAdmin, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ id: req.params.id });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found.' });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
