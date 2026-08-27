import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Place from '../models/Place.js';

dotenv.config();

const checkPlaces = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const places = await Place.find({});
    console.log(`Total places in MongoDB: ${places.length}`);
    for (const p of places) {
      console.log(`- [${p._id}] "${p.name}": nearby=${p.nearbyPlaces?.length || 0}, coRelated=${p.coRelatedPlaces?.length || 0}, timeline=${p.visualTimeline?.length || 0}, history=${p.historyContent?.length || 0}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkPlaces();
