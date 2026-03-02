const { Types } = require("mongoose")

loginTokenSchema = new mongoose.Schema({
    user_id: {
        type: Types.ObjectId,
    },
    token: {
        type: String
    },
    created_at: {
        type: Date,
        default: new Date(Date.now())
    },
})

const loginTokenModel = mongoose.model("login_token", loginTokenSchema)
module.exports = loginTokenModel