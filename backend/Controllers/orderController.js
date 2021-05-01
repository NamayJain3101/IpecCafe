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
        name,
        email
    } = req.body
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No Order Items')
    } else {
        const currentDate = (new Date().getDate())
        const prevDate = new Date
        prevDate.setDate(prevDate.getDate() - 1)
        const numTokens = await Order.find({ createdAt: { $gt: prevDate } }).countDocuments()
        const tempToken = (currentDate * 10) + parseInt(numTokens)

        const order = new Order({
            orderItems,
            user: req.user._id,
            paymentMethod,
            totalPrice,
            deliveryCode,
            name: name,
            email: email,
            token: tempToken
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
    const { discount } = req.body.discount
    console.log(discount)
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.paymentResult.id,
            status: req.body.paymentResult.status,
            update_time: req.body.paymentResult.update_time,
            email_address: req.body.paymentResult.payer.email_address
        }
        order.couponDiscount = discount
        order.payAmount = discount !== 0 ? (order.totalPrice - discount) : order.totalPrice
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
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
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
        order.ready = false

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc    Update order to ready
// @route   GET /api/orders/:id/ready
// @access  Private/Admin
const updateOrderToReady = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.ready = true
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc    get ready orders
// @route   GET /api/orders/ready
// @access  Private/Admin
const getReadyOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({ ready: true })
    if (orders && orders.length > 0) {
        res.json(orders)
    } else {
        res.status(404)
        throw new Error('No orders ready currently')
    }
})

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered, updateOrderToReady, getReadyOrders }