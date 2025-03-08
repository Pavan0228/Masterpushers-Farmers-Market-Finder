import { Order } from "../models/order.model.js";
import { Customer } from "../models/customer.model.js";
import Product from "../models/product.model.js";
import { Courier } from "../models/courier.model.js";
import { Farmer } from "../models/farmer.model.js";
import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";

export const orderProducts = async (req, res) => {
    try {
        const { productId, totalAmount, quantity, paymentMethod, location } =
            req.body;
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
        res.status(201).json({
            message: "Order created successfully",
            order: newOrder,
            status: "success",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        const customer = await Customer.findById(order.customer);
        const user = await User.findById(customer.user);
        console.log(user.email);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const product = await Product.findById(order.product);
        const farmer = await Farmer.findById(order.farmer);

        // Update order with courier information
        order.courier = courier._id;
        order.isAvailable = false;
        await order.save();

        // Send email notification to customer

        // Create transporter with your specific email credentials
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "random53763@gmail.com",
                pass: "fqllnszflzxyfwle",
            },
        });

        // Create farm-themed HTML email template
        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Order Has Been Picked Up</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                    background-color: #4CAF50;
                    color: white;
                    border-radius: 8px 8px 0 0;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 10px;
                }
                .content {
                    padding: 20px;
                }
                .order-details {
                    background-color: #f5f9f5;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    border-left: 4px solid #4CAF50;
                }
                .courier-details {
                    background-color: #f0f7ff;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    border-left: 4px solid #2196F3;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-size: 14px;
                }
                h1 {
                    color: #ffffff;
                    margin: 0;
                }
                h2 {
                    color: #4CAF50;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin-top: 15px;
                }
                .divider {
                    height: 1px;
                    background-color: #e0e0e0;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://autofinancetrack-pennytracker.s3.ap-south-1.amazonaws.com/uploads/farmerLogo.png" alt="Farm Fresh Logo" class="logo">
                    <h1>Your Order Has Been Picked Up!</h1>
                </div>
                <div class="content">
                    <p>Hello ${user.fullName || "Valued Customer"},</p>
                    <p>Great news! Your order has been picked up by our courier and is on its way to you.</p>
                    
                    <div class="order-details">
                        <h2>Order Details</h2>
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>Product:</strong> ${product ? product.name : "Your product"}</p>
                        <p><strong>Quantity:</strong> ${order.quantity}</p>
                        <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
                        <p><strong>Farm Source:</strong> ${farmer ? farmer.name : "Local Farm"}</p>
                    </div>
                    
                    <div class="courier-details">
                        <h2>Courier Information</h2>
                        <p><strong>Courier Name:</strong> ${courier.fullName}</p>
                        <p><strong>Contact Number:</strong> ${courier.phoneNumber || "Not available"}</p>
                    </div>
                    
                    <p>Your order is expected to arrive at your location soon. The courier may contact you for delivery coordination.</p>
                    
                    <p>If you have any questions about your delivery, please feel free to contact our customer service or reach out directly to the courier.</p>
                    <div class="divider"></div>
                    
                    <p>Thank you for supporting local farmers and choosing fresh, farm-to-table products!</p>
                    
                    <p>Warm regards,<br>The Farm Fresh Team</p>
                </div>
                <div class="footer">
                    <p>© 2023 Farm Fresh Market. All rights reserved.</p>
                    <p>If you have any questions, please contact our support team.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: "random53763@gmail.com",
            to: user.email,
            subject: "Your Order Has Been Picked Up",
            html: emailHtml,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message:
                "Order assigned to courier and notification sent to customer",
            success: true,
        });
    } catch (error) {
        console.error("Error in orderAssign:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        const pickupLocations = {};

        for (const order of orders) {
            const farmer = await Farmer.findById(order.farmer);
            if (farmer) {
                const location = farmer.location;
                if (!pickupLocations[location]) {
                    pickupLocations[location] = [];
                }
                pickupLocations[location].push(order);
            }
        }

        res.status(200).json({ pickupLocations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFarmerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ farmer: req.user._id }).select(
            "totalAmount quantity status"
        );
        res.status(200).json({
            message: "Orders retrieved successfully",
            orders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCustomerOrders = async (req, res) => {
    try {
        const customer = await Customer.findOne({ user: req.user._id });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        const orders = await Order.find({ customer: customer._id });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
