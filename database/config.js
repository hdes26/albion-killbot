const config = require("config");
const mongoose = require('mongoose');


const dbConnection = async () => {

    try {

        await mongoose.connect(config.get("mongodb.uri"));

        console.log('Connected database')


    } catch (error) {
        console.log(error);
        throw new Error('Error when starting the database');
    }


}

const dbDisconnect = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    } catch (error) {
        console.log(error);
        throw new Error('Error when disconnecting from the database');
    }
};



module.exports = {
    dbConnection,
    dbDisconnect
}