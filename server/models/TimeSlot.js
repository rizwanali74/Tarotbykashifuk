import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    slotId: {
      type: String,
      unique: true,
      index: true,
      default: () => `SLOT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    },
    date: {
      type: String, // 'YYYY-MM-DD' in Pakistan time (Asia/Karachi)
      required: true,
      index: true,
    },
    startTime: {
      type: String, // 'HH:mm' 24-hr format (e.g. '15:00' PKT)
      required: true,
    },
    endTime: {
      type: String, // 'HH:mm' 24-hr format (e.g. '16:00' PKT)
      required: true,
    },
    title: {
      type: String,
      default: 'Tarot & Spiritual Guidance Session',
      trim: true,
    },
    serviceType: {
      type: String,
      default: 'All Services',
    },
    capacity: {
      type: Number,
      default: 1,
      min: 1,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'blocked'],
      default: 'available',
      index: true,
    },
    timezone: {
      type: String,
      default: 'Asia/Karachi', // Master timezone: Pakistan Standard Time
    },
    notes: {
      type: String,
      default: '',
    },
    bookingInfo: {
      clientName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      orderId: { type: String, default: '' },
      clientCountry: { type: String, default: '' },
      clientTimezone: { type: String, default: '' },
      clientConvertedTime: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

let MongooseTimeSlot;
try {
  MongooseTimeSlot = mongoose.model('TimeSlot', timeSlotSchema);
} catch {
  MongooseTimeSlot = mongoose.models.TimeSlot;
}

// In-Memory Repository for local development / fallback
class InMemoryTimeSlotRepository {
  constructor() {
    const today = new Date();
    const getFormattedDate = (daysAhead = 0) => {
      const d = new Date(today);
      d.setDate(d.getDate() + daysAhead);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    this.slots = [
      {
        _id: 'slot-1',
        slotId: 'SLOT-101',
        date: getFormattedDate(0),
        startTime: '14:00',
        endTime: '15:00',
        title: 'Tarot & Natal Consultation',
        serviceType: 'All Services',
        capacity: 1,
        bookedCount: 0,
        status: 'available',
        timezone: 'Asia/Karachi',
        notes: 'Afternoon reading window (PKT)',
        bookingInfo: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'slot-2',
        slotId: 'SLOT-102',
        date: getFormattedDate(0),
        startTime: '16:00',
        endTime: '17:00',
        title: 'Love & Relationship Tarot Guidance',
        serviceType: 'All Services',
        capacity: 1,
        bookedCount: 0,
        status: 'available',
        timezone: 'Asia/Karachi',
        notes: 'Peak international alignment (UK morning/afternoon)',
        bookingInfo: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'slot-3',
        slotId: 'SLOT-103',
        date: getFormattedDate(0),
        startTime: '18:30',
        endTime: '19:30',
        title: 'Complete Spiritual Life Path Reading',
        serviceType: 'All Services',
        capacity: 1,
        bookedCount: 1,
        status: 'booked',
        timezone: 'Asia/Karachi',
        notes: 'Confirmed session with UK client Eleanor',
        bookingInfo: {
          clientName: 'Eleanor Vance',
          email: 'eleanor.v@outlook.com',
          phone: '+44 7700 900142',
          orderId: 'TK-9402',
          clientCountry: 'United Kingdom',
          clientTimezone: 'Europe/London',
          clientConvertedTime: '2:30 PM - 3:30 PM BST',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'slot-4',
        slotId: 'SLOT-104',
        date: getFormattedDate(1),
        startTime: '15:00',
        endTime: '16:00',
        title: 'Numerology & Destiny Blueprint',
        serviceType: 'All Services',
        capacity: 1,
        bookedCount: 0,
        status: 'available',
        timezone: 'Asia/Karachi',
        notes: 'Available for instant booking',
        bookingInfo: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'slot-5',
        slotId: 'SLOT-105',
        date: getFormattedDate(1),
        startTime: '17:00',
        endTime: '18:00',
        title: 'Aura & Spiritual Consultation',
        serviceType: 'All Services',
        capacity: 1,
        bookedCount: 0,
        status: 'available',
        timezone: 'Asia/Karachi',
        notes: 'Convenient for Middle East & European clients',
        bookingInfo: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'slot-6',
        slotId: 'SLOT-106',
        date: getFormattedDate(2),
        startTime: '19:00',
        endTime: '20:00',
        title: 'Telepathy & Deep Soul Connection',
        serviceType: 'All Services',
        capacity: 1,
        bookedCount: 0,
        status: 'available',
        timezone: 'Asia/Karachi',
        notes: 'Evening reading in PKT',
        bookingInfo: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'slot-7',
        slotId: 'SLOT-107',
        date: getFormattedDate(2),
        startTime: '21:00',
        endTime: '22:00',
        title: 'Late Evening Global Session',
        serviceType: 'All Services',
        capacity: 1,
        bookedCount: 0,
        status: 'available',
        timezone: 'Asia/Karachi',
        notes: 'Optimal for US Eastern / Western clients',
        bookingInfo: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    this.availabilitySettings = {
      baseTimezone: 'Asia/Karachi',
      baseTimezoneName: 'Pakistan Standard Time (PKT / UTC+5)',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      defaultDailyStart: '14:00', // 2:00 PM PKT
      defaultDailyEnd: '22:00',   // 10:00 PM PKT
      slotDurationMinutes: 60,
      bufferMinutes: 15,
      instantBookingEnabled: true,
      maxAdvanceBookingDays: 30,
    };
  }

  async find(query = {}) {
    let result = [...this.slots];
    if (query.date) {
      result = result.filter(s => s.date === query.date);
    }
    if (query.status && query.status !== 'all') {
      result = result.filter(s => s.status === query.status);
    }
    // Sort by date then startTime
    return result.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  async findById(id) {
    return this.slots.find(s => s._id === id || s.slotId === id) || null;
  }

  async create(data) {
    const id = `slot-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const slotId = data.slotId || `SLOT-${Math.floor(100 + Math.random() * 900)}`;
    const newSlot = {
      _id: id,
      slotId,
      title: data.title || 'Tarot & Spiritual Guidance Session',
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      serviceType: data.serviceType || 'All Services',
      capacity: Number(data.capacity) || 1,
      bookedCount: 0,
      status: data.status || 'available',
      timezone: data.timezone || 'Asia/Karachi',
      notes: data.notes || '',
      bookingInfo: data.bookingInfo || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.slots.push(newSlot);
    return newSlot;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const index = this.slots.findIndex(s => s._id === id || s.slotId === id);
    if (index === -1) return null;
    const existing = this.slots[index];
    const updated = {
      ...existing,
      ...update,
      updatedAt: new Date(),
    };
    this.slots[index] = updated;
    return updated;
  }

  async findByIdAndDelete(id) {
    const index = this.slots.findIndex(s => s._id === id || s.slotId === id);
    if (index === -1) return null;
    const removed = this.slots.splice(index, 1)[0];
    return removed;
  }

  getSettings() {
    return this.availabilitySettings;
  }

  updateSettings(newSettings) {
    this.availabilitySettings = {
      ...this.availabilitySettings,
      ...newSettings,
    };
    return this.availabilitySettings;
  }
}

const inMemoryTimeSlots = new InMemoryTimeSlotRepository();

// Unified Proxy Wrapper matching Order model pattern
export const TimeSlot = {
  isMongooseActive() {
    return mongoose.connection.readyState === 1 && MongooseTimeSlot;
  },

  async find(query = {}) {
    if (this.isMongooseActive()) {
      return await MongooseTimeSlot.find(query).sort({ date: 1, startTime: 1 });
    }
    return await inMemoryTimeSlots.find(query);
  },

  async findById(id) {
    if (this.isMongooseActive()) {
      return await MongooseTimeSlot.findById(id);
    }
    return await inMemoryTimeSlots.findById(id);
  },

  async create(data) {
    const payload = {
      slotId: data.slotId || `SLOT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      ...data,
    };
    if (this.isMongooseActive()) {
      return await MongooseTimeSlot.create(payload);
    }
    return await inMemoryTimeSlots.create(payload);
  },

  async findByIdAndUpdate(id, update, options = { new: true }) {
    if (this.isMongooseActive()) {
      return await MongooseTimeSlot.findByIdAndUpdate(id, update, options);
    }
    return await inMemoryTimeSlots.findByIdAndUpdate(id, update, options);
  },

  async findByIdAndDelete(id) {
    if (this.isMongooseActive()) {
      return await MongooseTimeSlot.findByIdAndDelete(id);
    }
    return await inMemoryTimeSlots.findByIdAndDelete(id);
  },

  getAvailabilitySettings() {
    return inMemoryTimeSlots.getSettings();
  },

  updateAvailabilitySettings(settings) {
    return inMemoryTimeSlots.updateSettings(settings);
  },
};
