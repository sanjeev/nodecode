const mongoose = require("mongoose")

const colorSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Color Name can not be blank']
    },
    code: {
        type: String,
        required: [true, 'Color Code can not be blank']
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

colorSchema.statics.isExists = async function isExists(name, code, id) {
    // console.log(id)
    // debugger;
    let color;
    if (id) { //for update case
        color = await this.findOne({ $or: [{ name: name }, { code: code }], isActive: true, _id: { $ne: id } }, { name: 1, code: 1 });
        return color ? true : false;
    } else { // for insert case
        color = await this.findOne({ $or: [{ name: name }, { code: code }], isActive: true }, { name: 1, code: 1 });
        return color ? true : false;
    }
}

const Color = mongoose.model('color', colorSchema);

module.exports = { Color };

