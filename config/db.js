const mongoose = require("mongoose")

const connectDB = async ()=>{
    try {
        const connectingDB = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        
        console.log(`MOngoDB connected: ${connectingDB.connection.host}`);

    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit()
    }
}

module.exports = connectDB;