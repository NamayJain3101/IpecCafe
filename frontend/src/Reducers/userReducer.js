import { USER_DELETE_FAIL, USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_RESET, USER_DETAILS_SUCCESS, USER_LIST_FAIL, USER_LIST_REQUEST, USER_LIST_RESET, USER_LIST_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_OTP_FAIL, USER_OTP_REQUEST, USER_OTP_RESET, USER_OTP_SUCCESS, USER_OTP_VERIFY_FAIL, USER_OTP_VERIFY_REQUEST, USER_OTP_VERIFY_RESET, USER_OTP_VERIFY_SUCCESS, USER_RECHARGE_WALLET_FAIL, USER_RECHARGE_WALLET_REQUEST, USER_RECHARGE_WALLET_RESET, USER_RECHARGE_WALLET_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_RESET, USER_REGISTER_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_RESET, USER_UPDATE_PROFILE_SUCCESS, USER_UPDATE_REQUEST, USER_UPDATE_RESET, USER_UPDATE_SUCCESS, VALIDATE_EMAIL_FAIL, VALIDATE_EMAIL_REQUEST, VALIDATE_EMAIL_RESET, VALIDATE_EMAIL_SUCCESS } from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return {
                loading: true
            }
        case USER_LOGIN_SUCCESS:
            return {
                loading: false,
                userInfo: action.payload
            }
        case USER_LOGIN_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_LOGOUT:
            return {}
        default:
            return {...state }
    }
}

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return {
                loading: true
            }
        case USER_REGISTER_SUCCESS:
            return {
                loading: false,
                userInfo: action.payload
            }
        case USER_REGISTER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_REGISTER_RESET:
            return {
                loading: false,
                userInfo: {}
            }
        case USER_LOGOUT:
            return {}
        default:
            return {...state }
    }
}

export const validateEmailReducer = (state = {}, action) => {
    switch (action.type) {
        case VALIDATE_EMAIL_REQUEST:
            return {
                loading: true
            }
        case VALIDATE_EMAIL_SUCCESS:
            return {
                loading: false,
                otp: action.payload
            }
        case VALIDATE_EMAIL_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case VALIDATE_EMAIL_RESET:
            return {}
        default:
            return {...state }
    }
}

export const userOtpReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_OTP_REQUEST:
            return {
                loading: true
            }
        case USER_OTP_SUCCESS:
            return {
                loading: false,
                otp: action.payload
            }
        case USER_OTP_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_OTP_RESET:
            return {}
        default:
            return {...state }
    }
}

export const otpVerifyReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_OTP_VERIFY_REQUEST:
            return {
                loading: true,
                success: false
            }
        case USER_OTP_VERIFY_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case USER_OTP_VERIFY_FAIL:
            return {
                loading: false,
                success: false,
                error: action.payload
            }
        case USER_OTP_VERIFY_RESET:
            return {}
        default:
            return {...state }
    }
}

export const userDetailsReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case USER_DETAILS_SUCCESS:
            return {
                loading: false,
                user: action.payload
            }
        case USER_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_DETAILS_RESET:
            return { user: {} }
        default:
            return {...state }
    }
}

export const userUpdateProfileReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_UPDATE_PROFILE_REQUEST:
            return {
                loading: true,
                success: false
            }
        case USER_UPDATE_PROFILE_SUCCESS:
            return {
                loading: false,
                success: true,
                userInfo: action.payload
            }
        case USER_UPDATE_PROFILE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_UPDATE_PROFILE_RESET:
            return { user: {} }
        default:
            return {...state }
    }
}

export const userListReducer = (state = { users: [] }, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return {
                loading: true
            }
        case USER_LIST_SUCCESS:
            return {
                loading: false,
                users: action.payload.users,
                page: action.payload.page,
                pages: action.payload.pages,
            }
        case USER_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_LIST_RESET:
            return { users: [] }
        default:
            return {...state }
    }
}

export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return {
                loading: true,
                success: false
            }
        case USER_DELETE_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case USER_DELETE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return {...state }
    }
}

export const userUpdateReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return {
                loading: true,
                success: false
            }
        case USER_UPDATE_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case USER_UPDATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_UPDATE_RESET:
            return { user: {} }
        default:
            return {...state }
    }
}

export const rechargeWalletReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_RECHARGE_WALLET_REQUEST:
            return {
                loading: true,
                success: false
            }
        case USER_RECHARGE_WALLET_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case USER_RECHARGE_WALLET_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_RECHARGE_WALLET_RESET:
            return {}
        default:
            return {...state }
    }
}