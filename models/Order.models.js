const { Schema, model} = require('mongoose')

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId, // toDo: test with Types.ObjectId, if it works
            ref: "User",
            required: [true, "userId must be provided."]
        },
        firstName: {
            type: String,
            required: [true, "First name is required."],
            trim: true,
          },
        lastName: {
        type: String,
        required: [true, "Last name is required."],
        trim: true,
        },
        streetHouseNumber: {
        type: String,
        required: [true, "Street and house number are required for order placement."],
        trim: true,
        },
        city: {
        type: String,
        required: [true, "City is required."],
        trim: true,
        },
        zipCode: {
        type: String,
        trim: true,
        required: [true, "ZIP code is required."],
        },
        orderItems: [
            {"productId": {
                type: Schema.Types.ObjectId, 
                ref: "Products", //toDo: rename Products to Product in model export
                required: [true, 'productId is required.']
                },
              "quantity": {
                type: Number, 
                required: [true, 'quantity is required.'],
                min: [1, "quantity must be at least 1"]
                },
            },           
        ],
        status: {
            type: String,
            enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], // toDO: also add route for oder cancellation, rest by admin
            default: "Pending",
        },
    },
    
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }

)

const Order = model('Order', orderSchema)

module.exports = Order
