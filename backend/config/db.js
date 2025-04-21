const mongoose = require('mongoose');

const connDB = () => {
    mongoose.connect(process.env.MONGO_URL )
            .then(console.log('Mongodb connnect successfully'))
            .catch((err) => console.log(err));
}

module.exports = connDB;