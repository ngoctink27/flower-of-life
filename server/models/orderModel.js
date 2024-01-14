import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        products: [
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
        payment: {},
        buyer: {
            type: mongoose.ObjectId,
            ref: "users",
        },
        status: {
            type: String,
            default: "Not Process",
            enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
        },
        total: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);