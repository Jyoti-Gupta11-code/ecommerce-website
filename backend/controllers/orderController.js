import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

const currency = "inr";
const deliveryCharge = 50;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ==================== COD Order ====================
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ==================== Stripe Order ====================
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment"
        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ==================== Verify Stripe ====================
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ==================== Razorpay Order ====================
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items in order" });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            currency: currency.toUpperCase(),
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: Math.round(amount * 100),
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        };

        const order = await razorpayInstance.orders.create(options);

        // Save Razorpay order ID in MongoDB
        await orderModel.findByIdAndUpdate(newOrder._id, {
            razorpayOrderId: order.id
        });

        res.json({ success: true, order });

    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== Verify Razorpay ====================
const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Check for missing payment information
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment information (order ID, payment ID, or signature)"
            });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            console.error("RAZORPAY_KEY_SECRET is not configured");
            return res.status(500).json({
                success: false,
                message: "Payment gateway configuration error"
            });
        }

        // Generate expected HMAC-SHA256 signature
        const signData = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(signData.toString())
            .digest("hex");

        let isAuthentic = false;
        try {
            isAuthentic = crypto.timingSafeEqual(
                Buffer.from(expectedSignature, "utf-8"),
                Buffer.from(razorpay_signature, "utf-8")
            );
        } catch (compErr) {
            isAuthentic = false;
        }

        if (!isAuthentic) {
            console.error("Razorpay Signature Mismatch! Verification Failed.");
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Locate order in MongoDB by razorpayOrderId
        let order = await orderModel.findOne({ razorpayOrderId: razorpay_order_id });

        // Fallback: If for any reason razorpayOrderId lookup fails, check by Razorpay order info receipt
        if (!order) {
            try {
                const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
                if (orderInfo && orderInfo.receipt) {
                    order = await orderModel.findById(orderInfo.receipt);
                }
            } catch (fetchErr) {
                console.error("Error fetching order from Razorpay:", fetchErr);
            }
        }

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Verify order belongs to the authenticated user
        if (order.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized order verification"
            });
        }

        // Mark order as paid and store transaction details
        await orderModel.findByIdAndUpdate(order._id, {
            payment: true,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            transactionId: razorpay_payment_id
        });

        // Clear user cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        return res.status(200).json({
            success: true,
            message: "Payment Successful"
        });

    } catch (error) {
        console.error("Verify Razorpay Catch Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error during payment verification"
        });
    }
};

// ==================== Admin - All Orders ====================
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ==================== User - Own Orders ====================
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// ==================== Admin - Update Status ====================
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, placeOrderStripe, verifyStripe, placeOrderRazorpay, verifyRazorpay, allOrders, userOrders, updateStatus }