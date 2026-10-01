import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['superadmin'],
      default: 'superadmin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose Pre-save hook to hash password with 12 rounds of bcrypt
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

let MongooseAdmin;
try {
  MongooseAdmin = mongoose.model('Admin', adminSchema);
} catch {
  MongooseAdmin = mongoose.models.Admin;
}

// In-Memory Fallback Store for offline / pre-MongoDB setups
class InMemoryAdminRepository {
  constructor() {
    this.admins = [];
  }

  async countDocuments() {
    return this.admins.length;
  }

  async findOne(query) {
    let admin = null;
    if (query.email) {
      admin = this.admins.find(a => a.email.toLowerCase() === query.email.toLowerCase());
    } else if (query.username) {
      admin = this.admins.find(a => a.username.toLowerCase() === query.username.toLowerCase());
    } else if (query._id) {
      admin = this.admins.find(a => a._id === query._id);
    }
    if (!admin) return null;

    return {
      ...admin,
      comparePassword: async (candidate) => bcrypt.compare(candidate, admin.password),
      save: async function () {
        return this;
      }
    };
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(data) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newAdmin = {
      _id: `admin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      username: data.username,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
    };
    this.admins.push(newAdmin);

    return {
      ...newAdmin,
      comparePassword: async (candidate) => bcrypt.compare(candidate, newAdmin.password),
      save: async function () {
        return this;
      }
    };
  }

  reset() {
    this.admins = [];
  }
}

export const inMemoryAdminRepo = new InMemoryAdminRepository();

export const Admin = {
  async countDocuments() {
    if (mongoose.connection.readyState === 1) {
      return MongooseAdmin.countDocuments();
    }
    return inMemoryAdminRepo.countDocuments();
  },

  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return MongooseAdmin.findOne(query);
    }
    return inMemoryAdminRepo.findOne(query);
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return MongooseAdmin.findById(id);
    }
    return inMemoryAdminRepo.findById(id);
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return MongooseAdmin.create(data);
    }
    return inMemoryAdminRepo.create(data);
  },

  resetMemory() {
    inMemoryAdminRepo.reset();
  }
};
