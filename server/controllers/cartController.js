// controllers/cartController.js
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
export const getCartByUserId = async (req, res) => {
    try {
        const userId = req.user._id; // Sử dụng thông tin người dùng đã được xác thực
        const cart = await Cart.findOne({ userId }).populate('items.product');
        return res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Nếu chưa có giỏ hàng, tạo mới và thêm sản phẩm với quantity là 1
            cart = new Cart({ userId, items: [{ product, quantity: 1 }] });
        } else {
            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            const productExists = cart.items.find(item => item.product.toString() === product);
            if (productExists) {
                // Nếu sản phẩm đã tồn tại, tăng quantity lên 1
                productExists.quantity += 1;
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm vào với quantity là 1
                cart.items.push({ product, quantity: 1 });
            }
        }

        // Cập nhật tổng tiền
        let totalPrice = 0;
        for (const item of cart.items) {
            const productInfo = await Product.findById(item.product);
            if (productInfo) {
                totalPrice += item.quantity * productInfo.price;
            }
        }
        cart.total = totalPrice.toFixed(2);

        await cart.save();
        res.json({ message: 'Sản phẩm đã được thêm vào giỏ hàng' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cartItemId } = req.params;
        const { action } = req.body;

        // Tìm giỏ hàng của người dùng
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng cho người dùng' });
        }

        // Tìm sản phẩm cụ thể trong giỏ hàng
        const cartItem = cart.items.find(item => item.product._id.toString() === cartItemId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        if (action === 'increase') {
            // Tăng quantity lên 1 đơn vị
            cartItem.quantity += 1;
        } else if (action === 'decrease') {
            // Giảm quantity đi 1 đơn vị, nếu quantity = 0, xóa sản phẩm khỏi giỏ hàng
            cartItem.quantity -= 1;
            if (cartItem.quantity === 0) {
                // Lọc ra các sản phẩm khác với _id không trùng với cartItemId để loại bỏ sản phẩm ra khỏi giỏ hàng
                cart.items = cart.items.filter(item => item.product._id.toString() !== cartItemId);
            }
        }

        // Cập nhật tổng tiền
        let totalPrice = 0;
        for (const item of cart.items) {
            const productInfo = await Product.findById(item.product);
            if (productInfo) {
                totalPrice += item.quantity * productInfo.price;
            }
        }
        cart.total = totalPrice.toFixed(2);

        // Lưu giỏ hàng đã cập nhật vào cơ sở dữ liệu
        await cart.save();

        res.json({ message: 'Số lượng sản phẩm đã được cập nhật trong giỏ hàng' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteAllItems = async (req, res) => {
    try {
        const userId = req.user._id; // Sử dụng thông tin người dùng đã được xác thực
        const cart = await Cart.findOne({ userId })
        cart.items = [];
        cart.total = 0;
        cart.save()
        return res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


