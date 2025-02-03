const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://iansari:SWEproject@clusteransari.ijfn3.mongodb.net/projectMentalHealth?retryWrites=true&w=majority&appName=ClusterAnsari', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected to newProjectDB...');
    } catch (err) {
        console.error('Database Connection Error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;