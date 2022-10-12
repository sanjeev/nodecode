const mongoose = require("mongoose")

const brandlogoSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'BrandLogo Name can not be blank']
    },
    imagePath: {
        type: String,
        required: [true, 'BrandLogo Image Path can not be blank']
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

brandlogoSchema.statics.isExists = async function isExists(name, id) {
    // console.log(id)
    // debugger;
    let brandlogo;
    if (id) { //for update case
        brandlogo = await this.findOne({ name: name, isActive: true, _id: { $ne: id } }, { name: 1 });
        return brandlogo ? true : false;
    } else { // for insert case
        brandlogo = await this.findOne({ name: name, isActive: true }, { name: 1 });
        return brandlogo ? true : false;
    }
}

const BrandLogo = mongoose.model('brandlogo', brandlogoSchema);

module.exports = { BrandLogo };

