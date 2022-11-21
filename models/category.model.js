const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category Name can not be blank']
    },

    imagePath: {
        type: String,
        required: [true, 'Category Image Path can not be blank']
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

categorySchema.statics.isExists = async function isExists(name, id) {
    // console.log(id)
    // debugger;
    let category;
    if (id) { //for update case
        category = await this.findOne({ name: name, isActive: true, _id: { $ne: id } }, { name: 1 });
        return category ? true : false;
    } else { // for insert case
        category = await this.findOne({ name: name, isActive: true }, { name: 1 });
        return category ? true : false;
    }
}

const Category = mongoose.model('category', categorySchema);

module.exports = { Category };

