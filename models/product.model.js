const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name can not be blank']
    },
    title: {
        type: String,
        required: [true, 'Title can not be blank']
    },
    code: {
        type: String,
        required: [true, 'Code can not be blank']
    },
    price: {
        type: Number,
        required: [true, 'Price can not be blank']
    },
    salePrice: {
        type: Number,
        required: [true, 'Sale Price can not be blank']
    },
    discount: {
        type: Number
    },
    size: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Size can not be blank'],
        ref: "size"
    },
    tag: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Tag can not be blank'],
        ref: "tag"
    },
    color: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Color can not be blank'],
        ref: "color"
    },
    category: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Category can not be blank'],
        ref: "category"
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity can not be blank']
    },
    isSale: {
        type: Boolean
    },
    isNewProduct: {
        type: Boolean
    },
    shortDetails: {
        type: String
    },
    description: {
        type: String
    },
    images: {
        type: []
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
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    }
});

productSchema.statics.isExists = async function isExists(name, id) {
    let product;
    if (id) { //for update case
        product = await this.findOne({ name: name, isActive: true, _id: { $ne: id } }, { name: 1 });
        return product ? true : false;
    } else { // for insert case
        product = await this.findOne({ name: name, isActive: true }, { name: 1 });
        return product ? true : false;
    }
}

const Product = mongoose.model('product', productSchema);

module.exports = { Product };

