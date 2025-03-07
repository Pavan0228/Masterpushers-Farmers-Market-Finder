import { Order } from "../models/order.model.js";
import { Customer } from "../models/customer.model.js";
import Product from "../models/product.model.js";
import { Courier } from "../models/courier.model.js";

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
            farmer: product.farmerId,
            product: productId,
            totalAmount: totalAmount,
            quantity: quantity,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            location: location,
            isAvailable: true,
        });

        await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder, status: "success" });
    } catch (error) {
        res.status(500).json({ message: error.message ,  });
    }
};

export const orderAssign = async (req, res) => {
    try {
        const { orderId } = req.params;
        const courier = await Courier.findOne({ user: req.user._id });
        if (!courier) {
            return res.status(404).json({ message: "Courier not found" });
        }
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.courier = courier._id;
        order.isAvailable = false;
        await order.save();
        res.status(200).json({ message: "Order assigned to courier" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
