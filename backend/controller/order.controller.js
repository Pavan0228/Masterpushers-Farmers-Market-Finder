import { Order } from "../models/order.model.js";
import { Customer } from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const orderProducts = async (req, res) => {
    try {
        const { productId, totalAmount, quantity, paymentMethod, location } = req.body; 
        const customer = await Customer.findOne({ user: req.user._id });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        let paymentStatus;
        if (paymentMethod != "online") {
            paymentStatus = "pending";
        } else {
            paymentStatus = "completed";
        }


        const newOrder = new Order({
            customer: customer._id,
            product: productId,
            totalAmount: totalAmount,
            quantity: quantity,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            location: location,
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

