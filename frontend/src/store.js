import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productCreateReducer, productDeleteReducer, productDetailsReducer, productListReducer, productReviewCreateReducer, productTopRatedReducer, productUpdateReducer } from './Reducers/productReducers'
import { cartReducer } from './Reducers/cartReducers'
import { rechargeWalletReducer, userDeleteReducer, userDetailsReducer, userListReducer, userLoginReducer, userRegisterReducer, userUpdateProfileReducer, userUpdateReducer } from './Reducers/userReducer'
import { orderCreateReducer, orderdeliverReducer, orderDetailsReducer, orderGetReadyReducer, orderListMyReducer, orderListReducer, orderPayReducer, orderReadyReducer } from './Reducers/orderReducer'
import { couponCreateReducer, couponDeleteReducer, couponGetReducer, couponListMyReducer, couponListReducer, couponUpdateReducer } from './Reducers/couponReducer'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    rechargeWallet: rechargeWalletReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderdeliverReducer,
    orderReady: orderReadyReducer,
    orderGetReady: orderGetReadyReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
    couponListMy: couponListMyReducer,
    couponGet: couponGetReducer,
    couponUpdate: couponUpdateReducer,
    couponCreate: couponCreateReducer,
    couponList: couponListReducer,
    couponDelete: couponDeleteReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}
const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : ''

const initialState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage,
        paymentMethod: paymentMethodFromStorage
    },
    userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;