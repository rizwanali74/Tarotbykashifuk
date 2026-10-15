import express from 'express';
import { TimeSlot } from '../models/TimeSlot.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Utility: Convert PKT (Asia/Karachi, UTC+5) slot to target client timezone
export function convertSlotToClientTime(dateStr, startTimeStr, endTimeStr, targetTimezone = 'Asia/Karachi') {
  try {
    // Construct ISO string with +05:00 offset (Pakistan Standard Time)
    const startIso = `${dateStr}T${startTimeStr.length === 5 ? startTimeStr : startTimeStr.padStart(5, '0')}:00+05:00`;
    const endIso = `${dateStr}T${endTimeStr.length === 5 ? endTimeStr : endTimeStr.padStart(5, '0')}:00+05:00`;

    const startDate = new Date(startIso);
    const endDate = new Date(endIso);

    const timeOpts = {
      timeZone: targetTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const dateOpts = {
      timeZone: targetTimezone,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    const startTimeFormatted = new Intl.DateTimeFormat('en-US', timeOpts).format(startDate);
    const endTimeFormatted = new Intl.DateTimeFormat('en-US', timeOpts).format(endDate);
    const clientDateFormatted = new Intl.DateTimeFormat('en-US', dateOpts).format(startDate);

    // Timezone abbreviation / code
    const tzName = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTimezone,
      timeZoneName: 'short',
    }).formatToParts(startDate).find(p => p.type === 'timeZoneName')?.value || targetTimezone;

    return {
      clientDate: clientDateFormatted,
      clientStartTime: startTimeFormatted,
      clientEndTime: endTimeFormatted,
      clientTimeRange: `${startTimeFormatted} - ${endTimeFormatted} (${tzName})`,
      clientTimezoneAbbr: tzName,
      targetTimezone,
    };
  } catch (err) {
    console.error(`Time conversion error for tz ${targetTimezone}:`, err);
    return {
      clientDate: dateStr,
      clientStartTime: startTimeStr,
      clientEndTime: endTimeStr,
      clientTimeRange: `${startTimeStr} - ${endTimeStr} (PKT)`,
      clientTimezoneAbbr: 'PKT',
      targetTimezone: 'Asia/Karachi',
    };
  }
}

// 1. GET /api/slots - Fetch Slots (Public & Admin, with optional timezone conversion)
router.get('/', async (req, res) => {
  try {
    const { date, status, timezone } = req.query;
    const query = {};
    if (date) query.date = date;
    if (status && status !== 'all') query.status = status;

    const rawSlots = await TimeSlot.find(query);
    const targetTz = timezone || 'Asia/Karachi';

    const convertedSlots = rawSlots.map((slot) => {
      const slotObj = slot.toObject ? slot.toObject() : { ...slot };
      const converted = convertSlotToClientTime(slotObj.date, slotObj.startTime, slotObj.endTime, targetTz);
      return {
        ...slotObj,
        conversion: converted,
      };
    });

    return res.json({
      success: true,
      count: convertedSlots.length,
      slots: convertedSlots,
      targetTimezone: targetTz,
      baseTimezone: 'Asia/Karachi (PKT / UTC+5)',
    });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve time slots.' });
  }
});

// 2. GET /api/slots/availability - Get standard availability operational settings
router.get('/availability', (req, res) => {
  try {
    const settings = TimeSlot.getAvailabilitySettings();
    return res.json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to load availability settings.' });
  }
});

// 3. PUT /api/slots/availability - Update standard availability settings (Admin only)
router.put('/availability', protectAdmin, (req, res) => {
  try {
    const updated = TimeSlot.updateAvailabilitySettings(req.body);
    return res.json({ success: true, settings: updated, message: 'Availability operational settings saved.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update availability settings.' });
  }
});

// 4. POST /api/slots - Create New Time Slot in Pakistan Time (Admin only)
router.post('/', protectAdmin, async (req, res) => {
  try {
    const {
      date,
      startTime,
      endTime,
      title,
      serviceType,
      capacity,
      notes,
      status,
    } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'Date (YYYY-MM-DD), Start Time (HH:mm), and End Time (HH:mm) in Pakistan Time are required.',
      });
    }

    const slot = await TimeSlot.create({
      date,
      startTime,
      endTime,
      title: title || 'Tarot & Spiritual Guidance Session',
      serviceType: serviceType || 'All Services',
      capacity: Number(capacity) || 1,
      notes: notes || '',
      status: status || 'available',
      timezone: 'Asia/Karachi',
    });

    return res.status(201).json({
      success: true,
      message: 'Time slot created successfully in Pakistan Standard Time.',
      slot,
    });
  } catch (error) {
    console.error('Error creating time slot:', error);
    return res.status(500).json({ success: false, error: 'Failed to create time slot.' });
  }
});

// 5. POST /api/slots/batch-generate - Quick Batch Generate Daily Slots (Admin only)
router.post('/batch-generate', protectAdmin, async (req, res) => {
  try {
    const {
      date,
      startHour = 14, // 2:00 PM PKT
      endHour = 21,   // 9:00 PM PKT
      durationMinutes = 60,
      breakMinutes = 15,
      title = 'Tarot & Spiritual Guidance Session',
    } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, error: 'Date is required for batch slot generation.' });
    }

    const createdSlots = [];
    let currentTotalMinutes = Number(startHour) * 60;
    const endTotalMinutes = Number(endHour) * 60;

    while (currentTotalMinutes + durationMinutes <= endTotalMinutes) {
      const startH = Math.floor(currentTotalMinutes / 60);
      const startM = currentTotalMinutes % 60;
      const endSlotTotal = currentTotalMinutes + durationMinutes;
      const endH = Math.floor(endSlotTotal / 60);
      const endM = endSlotTotal % 60;

      const startTimeStr = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
      const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

      const slot = await TimeSlot.create({
        date,
        startTime: startTimeStr,
        endTime: endTimeStr,
        title,
        serviceType: 'All Services',
        capacity: 1,
        status: 'available',
        timezone: 'Asia/Karachi',
        notes: `Generated ${durationMinutes}-min PKT slot`,
      });

      createdSlots.push(slot);
      currentTotalMinutes = endSlotTotal + breakMinutes;
    }

    return res.status(201).json({
      success: true,
      message: `Successfully generated ${createdSlots.length} slots for ${date} in Pakistan Time.`,
      slots: createdSlots,
    });
  } catch (error) {
    console.error('Error batch generating slots:', error);
    return res.status(500).json({ success: false, error: 'Failed to batch generate slots.' });
  }
});

// 6. POST /api/slots/auto-generate-weekly - Auto-generate slots for the upcoming week based on working hours
router.post('/auto-generate-weekly', protectAdmin, async (req, res) => {
  try {
    const { daysAhead = 7, durationMinutes = 60, breakMinutes = 15 } = req.body;
    const settings = TimeSlot.getAvailabilitySettings ? TimeSlot.getAvailabilitySettings() : {};
    const workingDays = settings.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const startHour = settings.defaultDailyStart ? parseInt(settings.defaultDailyStart.split(':')[0], 10) : 14;
    const endHour = settings.defaultDailyEnd ? parseInt(settings.defaultDailyEnd.split(':')[0], 10) : 21;

    const today = new Date();
    const createdSlots = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < daysAhead; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dayName = dayNames[d.getDay()];

      if (!workingDays.includes(dayName)) continue;

      const dateStr = d.toISOString().split('T')[0];

      // Check if slots already exist for this date
      const existing = await TimeSlot.find({ date: dateStr });
      if (existing && existing.length > 0) continue;

      let currentMin = startHour * 60;
      const endMin = endHour * 60;

      while (currentMin + durationMinutes <= endMin) {
        const sh = Math.floor(currentMin / 60);
        const sm = currentMin % 60;
        const eh = Math.floor((currentMin + durationMinutes) / 60);
        const em = (currentMin + durationMinutes) % 60;

        const startTime = `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
        const endTime = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;

        const slot = await TimeSlot.create({
          date: dateStr,
          startTime,
          endTime,
          title: 'Tarot & Spiritual Guidance Session',
          serviceType: 'All Services',
          capacity: 1,
          status: 'available',
          timezone: 'Asia/Karachi',
          notes: `Auto-generated weekly slot (${dayName})`,
        });

        createdSlots.push(slot);
        currentMin += durationMinutes + breakMinutes;
      }
    }

    return res.status(201).json({
      success: true,
      message: `Weekly schedule auto-generated: ${createdSlots.length} slots created across the week.`,
      count: createdSlots.length,
      slots: createdSlots,
    });
  } catch (error) {
    console.error('Error auto-generating weekly slots:', error);
    return res.status(500).json({ success: false, error: 'Failed to auto-generate weekly slots.' });
  }
});

// 6. PUT /api/slots/:id - Update Time Slot (Admin only)
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await TimeSlot.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Time slot not found.' });
    }
    return res.json({ success: true, message: 'Time slot updated successfully.', slot: updated });
  } catch (error) {
    console.error('Error updating time slot:', error);
    return res.status(500).json({ success: false, error: 'Failed to update time slot.' });
  }
});

// 7. DELETE /api/slots/:id - Delete Time Slot (Admin only)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TimeSlot.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Time slot not found.' });
    }
    return res.json({ success: true, message: 'Time slot deleted successfully.', slot: deleted });
  } catch (error) {
    console.error('Error deleting time slot:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete time slot.' });
  }
});

export default router;
