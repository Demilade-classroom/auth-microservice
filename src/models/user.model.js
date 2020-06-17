const mongoose = require('mongoose');
const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        app_name: {
            type: Schema.Types.ObjectId,
            required: true,
        }, 
        app_nice_name: String,
        username: {
            type: String,
            unique: true,
            trim: true,
            minlength: 4,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
        },
        token: String,
        verificationToken: String,
        role: {
            type: String,
            default: 'BASIC'
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
);

userSchema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'phoneNumber',
    nationalFormatField: 'nationalFormat',
    internationalFormat: 'internationalFormat',
    countryCodeField: 'countryCode',
});

module.exports = mongoose.model('User', userSchema);