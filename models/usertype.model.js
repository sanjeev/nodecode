const mongoose = require("mongoose")

const usertypeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'UserType Name can not be blank']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: [true, 'CreatedBy can not be blank'],
        ref: "user"
    },
    modifiedBy: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }
}, {
    //timestamps: true
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    }
});

usertypeSchema.statics.isExists = async function isExists(name, id) {
    // console.log(id)
    // debugger;
    let usertype;
    if (id) { //for update case
        usertype = await this.findOne({ name: name, isActive: true, _id: { $ne: id } }, { name: 1 });
        return usertype ? true : false;
    } else { // for insert case
        usertype = await this.findOne({ name: name, isActive: true }, { name: 1 });
        return usertype ? true : false;
    }
}

const UserType = mongoose.model('usertype', usertypeSchema);

module.exports = { UserType };

