const mongoose = require("mongoose")

const sizeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Size Name can not be blank']
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

sizeSchema.statics.isExists = async function isExists(name, id) {
    // console.log(id)
    // debugger;
    let size;
    if (id) { //for update case
        size = await this.findOne({ name: name, isActive: true, _id: { $ne: id } }, { name: 1 });
        return size ? true : false;
    } else { // for insert case
        size = await this.findOne({ name: name, isActive: true }, { name: 1 });
        return size ? true : false;
    }
}

const Size = mongoose.model('size', sizeSchema);

module.exports = { Size };

