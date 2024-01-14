import orderModel from "../models/orderModel.js";
//orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products.product", "-photo")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

export const createOrderController = async (req, res) => {
    let newOrder = new orderModel({ ...req.body, buyer: req.user._id });
    try {
        newOrder = await newOrder.save();
        //add product to inventory
        return res.status(200).json({ message: "Success" })
    } catch (error) {
        return res.json({ message: "error" })
    }
}

export const deleteOrderController = async (req, res) => {
    try {
        const deletedOrder = await orderModel.deleteOne({ _id: req.params.id, buyer: req.user._id });
        res.status(200).send({
            success: true,
            message: "Order Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
}

