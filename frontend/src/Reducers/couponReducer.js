import { COUPON_CREATE_FAIL, COUPON_CREATE_REQUEST, COUPON_CREATE_RESET, COUPON_CREATE_SUCCESS, COUPON_DELETE_FAIL, COUPON_DELETE_REQUEST, COUPON_DELETE_SUCCESS, COUPON_GET_FAIL, COUPON_GET_REQUEST, COUPON_GET_RESET, COUPON_GET_SUCCESS, COUPON_LIST_FAIL, COUPON_LIST_MY_FAIL, COUPON_LIST_MY_REQUEST, COUPON_LIST_MY_SUCCESS, COUPON_LIST_REQUEST, COUPON_LIST_SUCCESS, COUPON_UPDATE_FAIL, COUPON_UPDATE_REQUEST, COUPON_UPDATE_RESET, COUPON_UPDATE_SUCCESS } from "../constants/couponConstants"

export const couponCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case COUPON_CREATE_REQUEST:
            return {
                loading: true
            }
        case COUPON_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
                coupon: action.payload
            }
        case COUPON_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case COUPON_CREATE_RESET:
            return {}
        default:
            return {...state }
    }
}

export const couponListReducer = (state = { coupons: [] }, action) => {
    switch (action.type) {
        case COUPON_LIST_REQUEST:
            return {
                ...state,
                loading: true
            }
        case COUPON_LIST_SUCCESS:
            return {
                loading: false,
                coupons: action.payload
            }
        case COUPON_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return {...state }
    }
}

export const couponDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case COUPON_DELETE_REQUEST:
            return {
                loading: true
            }
        case COUPON_DELETE_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case COUPON_DELETE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return {...state }
    }
}

export const couponGetReducer = (state = { coupon: {} }, action) => {
    switch (action.type) {
        case COUPON_GET_REQUEST:
            return {
                ...state,
                loading: true
            }
        case COUPON_GET_SUCCESS:
            return {
                loading: false,
                success: true,
                coupon: action.payload
            }
        case COUPON_GET_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case COUPON_GET_RESET:
            return { coupon: {} }
        default:
            return {...state }
    }
}

export const couponUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case COUPON_UPDATE_REQUEST:
            return {
                loading: true
            }
        case COUPON_UPDATE_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case COUPON_UPDATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case COUPON_UPDATE_RESET:
            return {}
        default:
            return {...state }
    }
}

export const couponListMyReducer = (state = { coupons: [] }, action) => {
    switch (action.type) {
        case COUPON_LIST_MY_REQUEST:
            return {
                ...state,
                loading: true
            }
        case COUPON_LIST_MY_SUCCESS:
            return {
                loading: false,
                coupons: action.payload
            }
        case COUPON_LIST_MY_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return {...state }
    }
}