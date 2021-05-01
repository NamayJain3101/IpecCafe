import asyncHandler from 'express-async-handler'
import Coupon from '../Models/couponsModel.js'

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async(req, res) => {
    const { code, discountType, discountAmount, minAmountRequired } = req.body.coupon
    const discountUpto = req.body.coupon.discountType.toLowerCase() === 'flat' ? discountAmount : req.body.coupon.discountUpto
    const couponExist = await Coupon.findOne({ code })

    const regExpCode = /([A-Z0-9]){3,}$/g
    if (!regExpCode.test(code)) {
        res.status(400)
        throw new Error('Coupon Code can contain only alphabets and numbers')
    }

    if (couponExist) {
        res.status(400)
        throw new Error('Coupon Code already exists')
    } else {
        const coupon = new Coupon({
            code,
            discountType,
            discountAmount,
            discountUpto,
            minAmountRequired
        })
        const createdCoupon = await coupon.save()
        res.status(201).json(createdCoupon)
    }
})

// @desc    Get all coupon
// @route   GET /api/coupons
// @access  Public
const getAllCoupons = asyncHandler(async(req, res) => {
    const coupons = await Coupon.find({})
    if (coupons) {
        res.json(coupons)
    } else {
        res.status(404)
        throw new Error('No coupons found')
    }
})

// @desc    Get logged in users coupon
// @route   GET /api/coupons/myCoupons
// @access  Private
const getMyCoupons = asyncHandler(async(req, res) => {
    const coupons = await Coupon.find({})
    let availableCoupons = coupons.map(coupon => {
        const userExist = (coupon.users.find(x => {
            return coupon
        }))
        if (!userExist) {
            return coupon
        }
    })
    availableCoupons = availableCoupons.filter(coupon => coupon)
    if (availableCoupons && availableCoupons.length !== 0) {
        res.json(availableCoupons)
    } else {
        res.status(404)
        throw new Error('No coupons available currently')
    }
})

// @desc    Get coupon by code
// @route   GET /api/coupons/:id
// @access  Private
const getCouponByCode = asyncHandler(async(req, res) => {
    const coupon = await Coupon.findOne({ code: req.params.id })
    const amount = req.query.amount
    if (coupon) {
        if (amount < coupon.minAmountRequired) {
            throw new Error(`Coupon applicable on min transaction of Rs${coupon.minAmountRequired}`)
        }
        const alreadyApplied = coupon.users.find(r => r.user.toString() === req.user._id.toString())
        if (alreadyApplied) {
            res.status(400)
            throw new Error('Coupon already applied')
        } else {
            res.json(coupon)
        }
    } else {
        res.status(404)
        throw new Error('No coupon found')
    }
})

// @desc    update coupon by code
// @route   PUT /api/coupons/:id
// @access  Private
const updateCouponByCode = asyncHandler(async(req, res) => {
    const coupons = await Coupon.find({ code: req.params.id })
    if (coupons && coupons.length !== 0) {
        const coupon = coupons[0]
        const user = req.user._id
        coupon.users.push({ user })
        await coupon.save()
        res.status(201).json({
            message: 'User added'
        })
    } else {
        res.status(404)
        throw new Error('No coupon found')
    }
})

// @desc    Delete coupon by ID
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCouponById = asyncHandler(async(req, res) => {
    const coupon = await Coupon.findById(req.params.id)
    if (coupon) {
        await coupon.remove()
        res.json({
            message: 'Coupon removed'
        })
    } else {
        res.status(404)
        throw new Error('No coupon found')
    }
})

export {
    createCoupon,
    getAllCoupons,
    getMyCoupons,
    deleteCouponById,
    getCouponByCode,
    updateCouponByCode
}