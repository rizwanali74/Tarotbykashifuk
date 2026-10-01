import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientName: {
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
    services: {
      type: [String],
      required: true,
      default: [],
    },
    total: {
      type: String,
      required: true,
      default: '£0',
    },
    totalNumeric: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'GBP',
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Session Scheduled', 'Completed', 'Cancelled'],
      default: 'Pending Review',
    },
    paymentStatus: {
      type: String,
      enum: ['Awaiting PayPal Confirmation', 'Paid via PayPal', 'Case Quote Agreed', 'Refunded'],
      default: 'Awaiting PayPal Confirmation',
    },
    paypalOrderId: {
      type: String,
      default: null,
    },
    paypalCaptureId: {
      type: String,
      default: null,
    },
    details: {
      dob: { type: String, default: '' },
      birthTime: { type: String, default: '' },
      unknownBirthTime: { type: Boolean, default: false },
      birthPlace: { type: String, default: '' },
      motherName: { type: String, default: '' },
      currentLocation: { type: String, default: '' },
      relationshipStatus: { type: String, default: '' },
      questions: { type: String, default: '' },
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

let MongooseOrder;
try {
  MongooseOrder = mongoose.model('Order', orderSchema);
} catch {
  MongooseOrder = mongoose.models.Order;
}

// In-Memory Order Repository with default sanctuary demo orders
class InMemoryOrderRepository {
  constructor() {
    this.orders = [
      {
        orderId: 'TK-9402',
        clientName: 'Eleanor Vance',
        email: 'eleanor.v@outlook.com',
        phone: '+44 7700 900142',
        services: ['Tarot Card Reading', 'Numerology Reading'],
        total: '£115',
        totalNumeric: 115,
        currency: 'GBP',
        status: 'Pending Review',
        paymentStatus: 'Awaiting PayPal Confirmation',
        details: {
          dob: '1992-04-18',
          birthTime: '11:30 AM',
          birthPlace: 'London, UK',
          questions: 'Focusing on upcoming career crossroads and relationship transition.'
        },
        notes: 'Client requested guidance on London job offer vs relocation.',
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        orderId: 'TK-9388',
        clientName: 'Marcus Sterling',
        email: 'marcus.s@gmail.com',
        phone: '+44 7891 223401',
        services: ['Complete Spiritual Guidance Package'],
        total: '£169',
        totalNumeric: 169,
        currency: 'GBP',
        status: 'Session Scheduled',
        paymentStatus: 'Paid via PayPal',
        details: {
          dob: '1988-06-14',
          birthTime: '06:45 AM',
          birthPlace: 'Edinburgh, UK',
          questions: 'Born 14th June 1988 in Edinburgh. Full natal analysis.'
        },
        notes: 'Session scheduled for Saturday 4:00 PM GMT via WhatsApp Audio.',
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        orderId: 'TK-9372',
        clientName: 'Amina Al-Mansoor',
        email: 'amina.m@domain.ae',
        phone: '+971 50 123 4567',
        services: ['Telepathy Reading'],
        total: '£60',
        totalNumeric: 60,
        currency: 'GBP',
        status: 'Completed',
        paymentStatus: 'Paid via PayPal',
        details: {
          dob: '1995-11-03',
          birthPlace: 'Dubai, UAE',
          questions: 'Relationship clarity regarding emotional distance and commitment.'
        },
        notes: 'Session delivered with detailed audio notes sent.',
        createdAt: new Date(Date.now() - 86400000 * 2),
      }
    ];
  }

  async find(query = {}) {
    let result = [...this.orders];
    if (query.status && query.status !== 'All') {
      result = result.filter(o => o.status === query.status);
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findOne(query) {
    if (query.orderId) {
      return this.orders.find(o => o.orderId.toLowerCase() === query.orderId.toLowerCase()) || null;
    }
    if (query._id) {
      return this.orders.find(o => o._id === query._id) || null;
    }
    return null;
  }

  async create(data) {
    const newOrder = {
      _id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  async findOneAndUpdate(query, update, options = {}) {
    const order = await this.findOne(query);
    if (!order) return null;

    if (update.$set) {
      Object.assign(order, update.$set);
    } else {
      Object.assign(order, update);
    }
    order.updatedAt = new Date();
    return order;
  }

  async countDocuments(query = {}) {
    const list = await this.find(query);
    return list.length;
  }

  reset() {
    this.orders = [];
  }
}

export const inMemoryOrderRepo = new InMemoryOrderRepository();

export const Order = {
  async find(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseOrder.find(query).sort({ createdAt: -1 });
    }
    return inMemoryOrderRepo.find(query);
  },

  async findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return MongooseOrder.findOne(query);
    }
    return inMemoryOrderRepo.findOne(query);
  },

  async create(data) {
    if (mongoose.connection.readyState === 1) {
      return MongooseOrder.create(data);
    }
    return inMemoryOrderRepo.create(data);
  },

  async findOneAndUpdate(query, update, options = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseOrder.findOneAndUpdate(query, update, { new: true, ...options });
    }
    return inMemoryOrderRepo.findOneAndUpdate(query, update, options);
  },

  async countDocuments(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseOrder.countDocuments(query);
    }
    return inMemoryOrderRepo.countDocuments(query);
  }
};
