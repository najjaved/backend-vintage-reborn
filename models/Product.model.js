const { Schema, model, Types } = require('mongoose')

const productsSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required.'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required.'],
            trim: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: [true, 'Price is required.'],
            min: [0, "Price must be provided"],
        },
        discount: {
            type: Number,
            required: [true, 'Discount is required']
        },
        stock: {
            type: Number,
            required: [true, 'Stock must be provided'],
            default: 0,
        },
        images: {
            type: String,
            default: ''
        }, 
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
)

const Product = model('Product', productsSchema)

module.exports = Product
