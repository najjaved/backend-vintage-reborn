const { Schema, model} = require('mongoose')

const CartSchema = new Schema(
	{
		userId: { 
			type: Schema.Types.ObjectId, 
			ref: 'User', 
			required: [true, 'productId is required.']
				},
		items: [
			{
				productId: { 
				  type: Schema.Types.ObjectId, 
				  ref: 'Product', 
				  required: [true, 'productId is required.']
				  },
				quantity: { 
				  type: Number, 
				  required: [true, 'quantity is required.'],
				  min: [1, "quantity must be at least 1"] 
			  },
		}
		]
	}
);

const Cart = model('Cart', CartSchema);

module.exports = Cart