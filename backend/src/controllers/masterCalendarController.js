const MasterCalendarEvent = require('../models/MasterCalendarEvent');

// ── Seed data: Iraq Watch recurring monitoring events ─────────────
const RECURRING_SEED = [
  { slNo: 1,  occasion: 'New Year\'s Day',                                          date: '1 January',    monitoringRange: '31 Dec – 2 Jan',   keywords: 'New Year, Iraq, Baghdad, celebrations',                  remarks: '' },
  { slNo: 2,  occasion: 'Iraqi Army Day',                                           date: '6 January',    monitoringRange: '5 Jan – 7 Jan',    keywords: 'Iraqi Army Day, military, Baghdad, parade',              remarks: 'High priority' },
  { slNo: 3,  occasion: 'Ramadan Start',                                            date: '1 March',      monitoringRange: '28 Feb – 2 Mar',   keywords: 'Ramadan, Ramzan, fasting, Iraq, Islamic',                remarks: 'Date varies each year' },
  { slNo: 4,  occasion: 'Shab-e-Qadar (Laylat al-Qadr)',                           date: '27 March',     monitoringRange: '26 Mar – 28 Mar',  keywords: 'Laylat al-Qadr, Shab-e-Qadar, Ramadan, Iraq',           remarks: 'Date varies each year' },
  { slNo: 5,  occasion: 'Eid al-Fitr',                                              date: '31 March',     monitoringRange: '29 Mar – 2 Apr',   keywords: 'Eid al-Fitr, Eid, Ramadan, Iraq',                        remarks: 'Date varies each year; High priority' },
  { slNo: 6,  occasion: 'Liberation of Fao Anniversary',                            date: '17 April',     monitoringRange: '16 Apr – 18 Apr',  keywords: 'Fao liberation, Iraq-Iran war, anniversary',             remarks: '' },
  { slNo: 7,  occasion: 'Iraqi Republic Day (July 14 Revolution)',                  date: '14 July',      monitoringRange: '13 Jul – 15 Jul',  keywords: 'Iraq Republic Day, July 14, Revolution, Baghdad',        remarks: 'High priority' },
  { slNo: 8,  occasion: 'Liberation of Mosul Anniversary',                          date: '10 July',      monitoringRange: '9 Jul – 11 Jul',   keywords: 'Mosul liberation, ISIS defeat, Nineveh, Iraq army',      remarks: '' },
  { slNo: 9,  occasion: 'Eid al-Adha',                                              date: '7 June',       monitoringRange: '5 Jun – 9 Jun',    keywords: 'Eid al-Adha, sacrifice, Hajj, Iraq',                     remarks: 'Date varies each year; High priority' },
  { slNo: 10, occasion: 'Ashura / Muharram Mourning',                               date: '6 July',       monitoringRange: '4 Jul – 10 Jul',   keywords: 'Ashura, Muharram, Karbala, Najaf, Shia, procession',     remarks: 'Date varies each year; Sensitive — monitor closely' },
  { slNo: 11, occasion: 'Arbaeen Pilgrimage',                                       date: '14 August',    monitoringRange: '12 Aug – 16 Aug',  keywords: 'Arbaeen, Karbala, pilgrimage, Shia, Iraq, Imam Hussein', remarks: 'Date varies each year; Largest annual gathering in world' },
  { slNo: 12, occasion: 'Mawlid al-Nabi (Prophet\'s Birthday)',                    date: '5 September',  monitoringRange: '4 Sep – 6 Sep',    keywords: 'Mawlid, Prophet birthday, Milad, Iraq',                  remarks: 'Date varies each year' },
  { slNo: 13, occasion: 'Iraqi Constitution Day',                                   date: '15 October',   monitoringRange: '14 Oct – 16 Oct',  keywords: 'Iraq Constitution, referendum, 2005, national day',      remarks: '' },
  { slNo: 14, occasion: 'Iraqi Parliamentary Elections Season',                     date: '15 October',   monitoringRange: '1 Oct – 31 Oct',   keywords: 'Iraq elections, parliament, COR, voting, political',     remarks: 'Date varies — high priority during election years' },
  { slNo: 15, occasion: 'Anniversary of 2019 Iraq Protests (Tishreen)',             date: '1 October',    monitoringRange: '1 Oct – 3 Oct',    keywords: 'Tishreen protests, Iraq protests, October revolution',   remarks: 'Sensitive anniversary — monitor unrest' },
  { slNo: 16, occasion: 'Kurdistan National Day',                                   date: '14 July',      monitoringRange: '13 Jul – 15 Jul',  keywords: 'Kurdistan, KRG, Erbil, Sulaymaniyah, Kurdish',          remarks: '' },
  { slNo: 17, occasion: 'Nowruz (Kurdish/Iraqi New Year)',                          date: '21 March',     monitoringRange: '20 Mar – 22 Mar',  keywords: 'Nowruz, Kurdish New Year, spring, Erbil, KRG',          remarks: 'Celebrated in Kurdish region' },
  { slNo: 18, occasion: 'Good Friday / Easter',                                     date: '18 April',     monitoringRange: '17 Apr – 20 Apr',  keywords: 'Good Friday, Easter, Christian, church, Iraq',           remarks: 'Date varies each year — Iraqi Christian community' },
  { slNo: 19, occasion: 'Christmas Celebrations',                                   date: '25 December',  monitoringRange: '24 Dec – 26 Dec',  keywords: 'Christmas, church, Iraq Christians, celebration',        remarks: '' },
  { slNo: 20, occasion: 'Hajj Season (Pilgrimage)',                                 date: '5 June',       monitoringRange: '3 Jun – 7 Jun',    keywords: 'Hajj, pilgrims, Mecca, Iraq, Saudi Arabia',              remarks: 'Date varies each year' },
  { slNo: 21, occasion: 'Iraqi Council of Representatives Session',                 date: '20 February',  monitoringRange: '18 Feb – 30 Mar',  keywords: 'Iraq parliament, Council of Representatives, budget, Baghdad', remarks: '' },
  { slNo: 22, occasion: 'Kirkuk Status Tensions Annual Review',                     date: '15 October',   monitoringRange: '1 Oct – 31 Oct',   keywords: 'Kirkuk, disputed territory, Kurdish, Arab, Turkmen',     remarks: 'Sensitive period — monitor political statements' },
  { slNo: 23, occasion: 'PMF (Hashd al-Sha\'abi) Founding Anniversary',            date: '13 June',      monitoringRange: '12 Jun – 14 Jun',  keywords: 'PMF, Hashd al-Shaabi, popular mobilization, Fatwa',     remarks: 'High priority — monitor related protests and statements' },
  { slNo: 24, occasion: 'Baghdad International Fair',                               date: '1 November',   monitoringRange: '1 Nov – 15 Nov',   keywords: 'Baghdad fair, trade, exhibition, Iraq economy',          remarks: 'Date varies each year' },
];

// Ensure recurring seed events exist in the DB (replaces old data with updated list)
const seedRecurringEvents = async () => {
  try {
    // Remove old seed data and re-insert the updated 48 events
    const existing = await MasterCalendarEvent.find({ isRecurring: true, createdBy: 'system' });
    const existingSlNos = new Set(existing.map(e => e.slNo));
    const seedSlNos = new Set(RECURRING_SEED.map(e => e.slNo));

    // Delete old system events whose slNo no longer exists in seed
    for (const evt of existing) {
      if (!seedSlNos.has(evt.slNo)) {
        await MasterCalendarEvent.deleteOne({ _id: evt._id });
      }
    }

    // Upsert all seed events
    for (const evt of RECURRING_SEED) {
      await MasterCalendarEvent.findOneAndUpdate(
        { isRecurring: true, slNo: evt.slNo },
        { $set: { ...evt, isRecurring: true, createdBy: 'system' } },
        { upsert: true, new: true }
      );
    }
    console.log('[MasterCalendar] 48 HCP recurring events seeded');
  } catch (err) {
    console.error('[MasterCalendar] Seed error:', err.message);
  }
};

// ── CRUD controllers ──────────────────────────────────────

const listEvents = async (req, res) => {
  try {
    const { recurring } = req.query;
    const query = {};
    if (recurring === 'true') query.isRecurring = true;
    else if (recurring === 'false') query.isRecurring = false;

    const events = await MasterCalendarEvent.find(query).sort({ slNo: 1, createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { occasion, date, monitoringRange, keywords, remarks, isRecurring } = req.body;
    if (!occasion || !date) {
      return res.status(400).json({ message: 'Occasion and date are required' });
    }

    // Auto-assign slNo
    const maxDoc = await MasterCalendarEvent.findOne({ isRecurring: !!isRecurring })
      .sort({ slNo: -1 }).select('slNo').lean();
    const slNo = (maxDoc?.slNo || 0) + 1;

    const event = await MasterCalendarEvent.create({
      slNo,
      occasion,
      date,
      monitoringRange: monitoringRange || '',
      keywords: keywords || '',
      remarks: remarks || '',
      isRecurring: !!isRecurring,
      createdBy: req.user?.email || 'unknown'
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const event = await MasterCalendarEvent.findOne({ id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const allowedFields = ['occasion', 'date', 'monitoringRange', 'keywords', 'remarks'];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) event[field] = updates[field];
    }
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await MasterCalendarEvent.findOne({ id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await MasterCalendarEvent.deleteOne({ id });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  seedRecurringEvents,
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
