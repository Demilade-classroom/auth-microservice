require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    MONGODBURI: process.env.MONGOURI,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
};