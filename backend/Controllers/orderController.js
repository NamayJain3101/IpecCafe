import asyncHandler from 'express-async-handler'
import Order from '../Models/orderModel.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async(req, res) => {
    const {
        orderItems,
        paymentMethod,
        totalPrice,
        deliveryCode,
    } = req.body
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No Order Items')
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            paymentMethod,
            totalPrice,
            deliveryCode
        })
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc    Get loggedIn user Orders
// @route   GET /api/orders/myOrders
// @access  Private
const getMyOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async(req, res) => {
    const pageSize = 8
    const page = Number(req.query.pageNumber) || 1

    const count = await Order.countDocuments()


    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * (page - 1))
    res.json({ orders, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered }