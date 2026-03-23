const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI || 'mongodb+srv://aimarketplaceuser:visionprotectors@ai-marketplace.nji1hrv.mongodb.net/ai-marketplace?retryWrites=true&w=majority';
console.log('URI:', uri.replace(/(.{20}).*(.{20})/, '$1...$2'));

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connection SUCCESS');
    const stats = await mongoose.connection.db.stats();
    console.log('stats', { collections: stats.collections, objects: stats.objects });
  } catch (err) {
    console.error('MongoDB connection FAILED', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();