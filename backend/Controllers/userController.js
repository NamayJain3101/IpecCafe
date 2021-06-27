import asyncHandler from 'express-async-handler'
import User from '../Models/userModel.js'
import generateToken from '../utils/generateToken.js'
import nodemailer from 'nodemailer'
import sendgridTransport from 'nodemailer-sendgrid-transport'

// @desc    Auth User & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (password !== 'otp') {
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                wallet: user.wallet,
                token: generateToken(user._id)
            })
        } else {
            res.status(401)
            throw new Error('Invalid email or password')
        }
    } else {
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                wallet: user.wallet,
                token: generateToken(user._id)
            })
        } else {
            res.status(401)
            throw new Error('Invalid email or password')
        }
    }
})

// @desc    Send OTP
// @route   POST /api/users/otp
// @access  Public
const getOtp = asyncHandler(async(req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        res.status(404)
        throw new Error("User not found")
    } else {
        var otp = Math.floor(100000 + Math.random() * 900000)
        const options = {
            auth: {
                api_key: process.env.SENDGRID_API_KEY
            }
        }
        const transporter = nodemailer.createTransport(sendgridTransport(options))
        var mailOptions = {
            from: 'namayjain.jainnamay@gmail.com',
            to: email,
            subject: "Your OTP is: ",
            html: `
                    <h3>Your OTP is </h3>
                    <h1 style='font-weight:bold;'>${otp}</h1>
                    <h5 style='font-weight:bold;'>OTP is Valid for 3 minutes</h5>
                `
        }
        transporter.sendMail(mailOptions, async(error, info) => {
            if (error) {
                console.log(error)
                throw new Error('Error sending OTP')
            }
            user.otp = otp
            user.expireOtp = Date.now() + 180000
            const updatedUser = await user.save()
            if (updatedUser) {
                res.json({
                    otpSent: true,
                    email: req.body.email
                })
            } else {
                throw new Error('Error sending OTP')
            }
        });
    }
})

// @desc    Validate Email
// @route   POST /api/users/validate
// @access  Public
const validateUserEmail = asyncHandler(async(req, res) => {
    const { email } = req.body
    var otp = Math.floor(100000 + Math.random() * 900000)
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    }
    const transporter = nodemailer.createTransport(sendgridTransport(options))
    var mailOptions = {
        from: 'namayjain.jainnamay@gmail.com',
        to: email,
        subject: "Your OTP is: ",
        html: "<h3>Your OTP is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
    }
    transporter.sendMail(mailOptions, async(error, info) => {
        if (error) {
            console.log(error)
            throw new Error('Error sending OTP')
        }
        res.json({
            otp,
            email: req.body.email
        })
    });
})

// @desc    Verify OTP
// @route   POST /api/users/otp/verify
// @access  Public
const verifyOtp = asyncHandler(async(req, res) => {
    const { otp, email } = req.body
    if (!otp) {
        res.status(404)
        throw new Error("Invalid OTP")
    }
    const user = await User.findOne({ email: email })
    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }
    if (Date.now() > user.expireOtp) {
        res.status(401)
        throw new Error("OTP Expired")
    }
    if (otp.toString() === user.otp.toString()) {
        user.otp = ""
        user.expireOtp = undefined
        await user.save()
        res.status(200).json({ message: "OTP Verified" })
    }
    res.status(404)
    throw new Error("Invalid OTP")
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body

    const regExpName = /\s*([A-Za-z]+([\.,] |[-']| )?)[A-Za-z]*\s*$/g
    if (!regExpName.test(name)) {
        res.status(400)
        throw new Error('Invalid Name syntax')
    }

    const regExpPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*?>< ])[a-zA-Z0-9!@#$%^&*?>< ]{8,15}$/
    if (!regExpPassword.test(password)) {
        res.status(400)
        throw new Error('Password must contain at least 1 digit, 1 special character, 1 character and length between 8-15')
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    const user = await User.create({
        name,
        email,
        password
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            wallet: user.wallet,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            wallet: user.wallet,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {

        if (req.body.name) {
            const regExpName = /\s*([A-Za-z]+([\.,] |[-']| )?)[A-Za-z]*\s*$/g
            if (!regExpName.test(req.body.name)) {
                res.status(400)
                throw new Error('Invalid Name syntax')
            }
        }

        if (req.body.password) {
            const regExpPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*?>< ])[a-zA-Z0-9!@#$%^&*?>< ]{8,15}$/
            if (!regExpPassword.test(req.body.password)) {
                res.status(400)
                throw new Error('Password must contain at least 1 digit, 1 special character, 1 character and length between 8-15')
            }
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.wallet = req.body.wallet || user.wallet
        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            wallet: updatedUser.wallet,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user wallet to paid
// @route   PUT /api/users/:id/recharge
// @access  Private
const rechargeWallet = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        user.wallet = req.body.wallet
        user.paymentResult = {
            id: req.body.paymentResult.id,
            status: req.body.paymentResult.status,
            update_time: req.body.paymentResult.update_time,
            email_address: req.body.paymentResult.payer.email_address,
            amount: req.body.paymentResult.purchase_units[0].amount.value
        }

        const updatedUser = await user.save()
        res.json(updatedUser)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async(req, res) => {
    const pageSize = 8
    const page = Number(req.query.pageNumber) || 1

    const count = await User.countDocuments()

    const users = await User.find({}).sort({ name: +1 }).limit(pageSize).skip(pageSize * (page - 1))
    res.json({ users, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (user) {
        res.json({ message: 'User removed' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user 
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {

        if (req.body.name) {
            const regExpName = /\s*([A-Za-z]+([\.,] |[-']| )?)[A-Za-z]*\s*$/g
            if (!regExpName.test(req.body.name)) {
                res.status(400)
                throw new Error('Invalid Name syntax')
            }
        }

        if (req.body.password) {
            const regExpPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*?>< ])[a-zA-Z0-9!@#$%^&*?>< ]{8,15}$/
            if (!regExpPassword.test(req.body.password)) {
                res.status(400)
                throw new Error('Password must contain at least 1 digit, 1 special character, 1 character and length between 8-15')
            }
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.wallet = req.body.wallet || user.wallet
        user.isAdmin = req.body.isAdmin
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            wallet: updatedUser.wallet,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser,
    getUserProfile,
    registerUser,
    getOtp,
    verifyOtp,
    validateUserEmail,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    rechargeWallet
}