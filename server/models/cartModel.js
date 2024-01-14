import mongoose from "mongoose";

const CartModel = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Tham chiếu tới schema của người dùng nếu cần
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products', // Tham chiếu tới schema của sản phẩm
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    total: {
        type: Number,
        default: 0
    }
});

const Cart = mongoose.model('Cart', CartModel);

export default Cart;
