const mongoose = require('mongoose');
const { Schema } = mongoose;

const appSchema = new Schema(
    {
        app_name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 4,
        },
        app_nice_name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        app_unique_key: {
            type: String,
            enum: ['email', 'username'],
            default: 'username',
        },
        token: String,
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
    },
    {
        timestamps: true
    },
);

module.exports = mongoose.model('App', appSchema);