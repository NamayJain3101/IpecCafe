import asyncHandler from 'express-async-handler'
import Token from '../Models/tokenModel.js'

// @desc    Fetch all tokens
// @route   GET /api/tokens
// @access  Private/Admin
const getTokens = asyncHandler(async(req, res) => {
    const token = await Token.find({ active: true })
    if (token) {
        res.json(token)
    } else {
        res.status(404)
        throw new Error('Token not found')
    }
})

// @desc    Fetch single token
// @route   GET /api/tokens/:id
// @access  Private
const getTokenById = asyncHandler(async(req, res) => {
    const token = await Token.find({ order: req.params.id })
    if (token) {
        res.json(token[0])
    } else {
        res.status(404)
        throw new Error('Token not found')
    }
})

// @desc    Create a token
// @route   POST /api/tokens
// @access  Private
const createToken = asyncHandler(async(req, res) => {
    const order = await Token.find({ order: req.body.order })
    if (order && order.length !== 0) {
        res.status(401)
        throw new Error('Invalid request')
    } else {
        const currentDate = (new Date().getDate())
        const prevDate = new Date
        prevDate.setDate(prevDate.getDate() - 1)
        const numTokens = await Token.find({ createdAt: { $gt: prevDate } }).countDocuments()
        const tempToken = (currentDate * 10) + parseInt(numTokens)
        const token = await Token.create({
            name: req.body.name,
            email: req.body.email,
            order: req.body.order,
            token: tempToken
        })
        res.status(201).json(token)
    }
})

// @desc    Update a token
// @route   PUT /api/tokens/:id/disable
// @access  Private
const updateTokenToDisable = asyncHandler(async(req, res) => {
    const token = await Token.find({ order: req.params.id })
    if (token && token.length !== 0) {
        token[0].active = false
        const updatedToken = await token[0].save()
        res.json(updatedToken)
    } else {
        res.status(404)
        throw new Error('Token not found')
    }
})

export {
    getTokens,
    createToken,
    getTokenById,
    updateTokenToDisable
}