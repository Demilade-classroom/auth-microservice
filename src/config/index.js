require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    MONGODBURI: process.env.MONGOURI,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
};