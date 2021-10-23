const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`MongoDB connected here: \n${process.env.MONGODB_URI}`);
      } catch (error) {
        console.log('MongoDB server-тэй холбогдох үед алдаа гарлаа: '+error.message);
        process.exit(1);
      }
};

module.exports = connectDB;
