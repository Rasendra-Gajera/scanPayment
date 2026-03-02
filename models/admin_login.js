const { mongoose } = require("mongoose")

adminSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date(Date.now())
    },
})

const adminModel = mongoose.model("admin_master", adminSchema)
module.exports = adminModel