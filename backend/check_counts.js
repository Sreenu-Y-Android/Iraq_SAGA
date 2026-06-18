const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const since30 = new Date();
    since30.setDate(since30.getDate() - 30);

    const since365 = new Date();
    since365.setDate(since365.getDate() - 365);

    const total = await db.collection('grievances').countDocuments();
    const count30 = await db.collection('grievances').countDocuments({post_date: {$gte: since30}});
    const count365 = await db.collection('grievances').countDocuments({post_date: {$gte: since365}});
    const countConst = await db.collection('grievances').countDocuments({'detected_location.constituency': {$exists: true, $ne: ''}});

    const baghdad30 = await db.collection('grievances').countDocuments({
        post_date: {$gte: since30},
        $or: [
            { 'detected_location.city': /baghdad/i },
            { 'detected_location.district': /baghdad/i },
            { 'detected_location.constituency': /baghdad/i }
        ]
    });

    const baghdad365 = await db.collection('grievances').countDocuments({
        post_date: {$gte: since365},
        $or: [
            { 'detected_location.city': /baghdad/i },
            { 'detected_location.district': /baghdad/i },
            { 'detected_location.constituency': /baghdad/i }
        ]
    });

    const keywords30 = await db.collection('grievances').countDocuments({
        post_date: {$gte: since30},
        $or: [
            { 'content.text': /iraq|baghdad|داعش|العراق/i },
        ]
    });

    console.log('Total grievances:', total);
    console.log('Grievances in last 30 days:', count30);
    console.log('Grievances in last 365 days:', count365);
    console.log('Grievances with constituency:', countConst);
    console.log('Baghdad scope in last 30 days:', baghdad30);
    console.log('Baghdad scope in last 365 days:', baghdad365);
    console.log('Iraq keyword matches (30d):', keywords30);

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
