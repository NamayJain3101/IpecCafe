import axios from 'axios'
import { COUPON_CREATE_FAIL, COUPON_CREATE_REQUEST, COUPON_CREATE_SUCCESS, COUPON_DELETE_FAIL, COUPON_DELETE_REQUEST, COUPON_DELETE_SUCCESS, COUPON_GET_FAIL, COUPON_GET_REQUEST, COUPON_GET_SUCCESS, COUPON_LIST_FAIL, COUPON_LIST_MY_FAIL, COUPON_LIST_MY_REQUEST, COUPON_LIST_MY_SUCCESS, COUPON_LIST_REQUEST, COUPON_LIST_SUCCESS, COUPON_UPDATE_FAIL, COUPON_UPDATE_REQUEST, COUPON_UPDATE_SUCCESS } from "../constants/couponConstants"

export const createCoupon = (coupon) => async(dispatch, getState) => {
    try {
        dispatch({
            type: COUPON_CREATE_REQUEST
        })
        const { userLogin: { userInfo } } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.post('/api/coupons', { coupon }, config)
        dispatch({
            type: COUPON_CREATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: COUPON_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const listCoupons = () => async(dispatch, getState) => {
    try {
        dispatch({
            type: COUPON_LIST_REQUEST
        })
        const { userLogin: { userInfo } } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.get('/api/coupons', config)
        dispatch({
            type: COUPON_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: COUPON_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const deleteCoupon = (couponId) => async(dispatch, getState) => {
    try {
        dispatch({
            type: COUPON_DELETE_REQUEST
        })
        const { userLogin: { userInfo } } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        await axios.delete(`/api/coupons/${couponId}`, config)
        dispatch({
            type: COUPON_DELETE_SUCCESS
        })
    } catch (error) {
        dispatch({
            type: COUPON_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getCoupon = (couponCode, amount) => async(dispatch, getState) => {
    try {
        dispatch({
            type: COUPON_GET_REQUEST
        })
        const { userLogin: { userInfo } } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.get(`/api/coupons/${couponCode}?amount=${amount}`, config)
        dispatch({
            type: COUPON_GET_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: COUPON_GET_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateCoupon = (couponCode, amount) => async(dispatch, getState) => {
    try {
        dispatch({
            type: COUPON_UPDATE_REQUEST
        })
        const { userLogin: { userInfo } } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        await axios.put(`/api/coupons/${couponCode}`, {}, config)
        dispatch({
            type: COUPON_UPDATE_SUCCESS
        })
    } catch (error) {
        dispatch({
            type: COUPON_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const listMyCoupons = () => async(dispatch, getState) => {
    try {
        dispatch({
            type: COUPON_LIST_MY_REQUEST
        })
        const { userLogin: { userInfo } } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.get('/api/coupons/myCoupons', config)
        dispatch({
            type: COUPON_LIST_MY_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: COUPON_LIST_MY_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}