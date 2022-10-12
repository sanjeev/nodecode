const mongoose = require("mongoose")

const tagSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tag Name can not be blank']
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

tagSchema.statics.isExists = async function isExists(name, id) {
    // console.log(id)
    // debugger;
    let tag;
    if (id) { //for update case
        tag = await this.findOne({ name: name, isActive: true, _id: { $ne: id } }, { name: 1 });
        return tag ? true : false;
    } else { // for insert case
        tag = await this.findOne({ name: name, isActive: true }, { name: 1 });
        return tag ? true : false;
    }
}

const Tag = mongoose.model('tag', tagSchema);

module.exports = { Tag };

