import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    serviceInterest: {
      type: String,
      default: 'General Enquiry',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
    },
  },
  {
    timestamps: true,
  }
);

let MongooseContact;
try {
  MongooseContact = mongoose.model('ContactMessage', contactMessageSchema);
} catch {
  MongooseContact = mongoose.models.ContactMessage;
}

class InMemoryContactRepository {
  constructor() {
    this.messages = [];
  }

  async find() {
    return [...this.messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async create(data) {
    const newMsg = {
      _id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      status: 'unread',
      createdAt: new Date(),
    };
    this.messages.unshift(newMsg);
    return newMsg;
  }
}

export const inMemoryContactRepo = new InMemoryContactRepository();

export const ContactMessage = {
  async find() {
    if (mongoose.connection.readyState === 1) {
      return MongooseContact.find().sort({ createdAt: -1 });
    }
    return inMemoryContactRepo.find();
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return MongooseContact.create(data);
    }
    return inMemoryContactRepo.create(data);
  }
};
