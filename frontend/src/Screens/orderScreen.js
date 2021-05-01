import React from 'react'
import axios from 'axios'
import uuid from 'react-uuid'
import { PayPalButton } from 'react-paypal-button-v2'
import { useEffect } from 'react'
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deliverOrder, getOrderDetails, payOrder } from '../Actions/orderActions'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { useState } from 'react'
import { ORDER_CREATE_RESET, ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants'
import { getUserDetails, updateUserDetails } from '../Actions/userActions'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { clearCart } from '../Actions/cartActions'
import { COUPON_GET_RESET, COUPON_UPDATE_RESET } from '../constants/couponConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'
import { getCoupon, updateCoupon } from '../Actions/couponActions'
import styled from 'styled-components'

const OrderScreen = ({ match, history }) => {

    const orderId = match.params.id

    const [sdkReady, setSdkReady] = useState(false)
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { shippingAddress, paymentMethod, cartItems } = cart

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDetails = useSelector((state) => state.userDetails)
    const { loading: loadingUser, error: errorUser, user } = userDetails

    const couponGet = useSelector((state) => state.couponGet)
    const { success: successCoupon, loading: loadingCoupon, error: errorCoupon, coupon } = couponGet

    const couponUpdate = useSelector((state) => state.couponUpdate)
    const { success: successCouponUpdate } = couponUpdate

    const [couponCode, setCouponCode] = useState('')
    const [discount, setDiscount] = useState(0)
    const [payAmount, setPayAmount] = useState('')

    if (!loading) {
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }
        order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    }

    useEffect(() => {
        if (userInfo) {
            const addPaypalScript = async () => {
                const { data: clientId } = await axios.get('/api/config/paypal')
                const script = document.createElement('script')
                script.type = 'text/javascript'
                script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=INR`
                script.async = true
                script.onload = () => {
                    setSdkReady(true)
                }
                document.body.appendChild(script)
            }
            if (!user.name) {
                dispatch(getUserDetails('profile'))
            }
            if (!order || (order._id !== orderId) || successPay || successDeliver) {
                dispatch({ type: ORDER_PAY_RESET })
                dispatch({ type: ORDER_DELIVER_RESET })
                dispatch(getOrderDetails(orderId))
            } else if (!order.isPaid) {
                if (!window.paypal) {
                    addPaypalScript()
                } else {
                    setSdkReady(true)
                }
            }
        } else {
            history.push('/login')
        }
        if (order) {
            setPayAmount(order.totalPrice)
        }
        if (!couponCode) {
            dispatch({
                type: COUPON_GET_RESET
            })
        }
        if (successCoupon) {
            if (coupon.discountType === 'flat') {
                setDiscount(Number(coupon.discountAmount).toFixed(2))
                setPayAmount(Number(order.totalPrice - coupon.discountAmount).toFixed(2))
            } else {
                const discount = (addDecimals(Number(((coupon.discountAmount / 100) * order.itemsPrice).toFixed(2)))) > coupon.discountUpto ? coupon.discountUpto : (addDecimals(Number(((coupon.discountAmount / 100) * order.itemsPrice).toFixed(2))))
                setDiscount(Number(discount).toFixed(2))
                setPayAmount(Number(order.totalPrice - discount).toFixed(2))
            }
        }
        if (successCouponUpdate) {
            dispatch({
                type: COUPON_UPDATE_RESET
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, orderId, successPay, order, successDeliver, userInfo, history, user, successCoupon])

    console.log(discount)

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult, { discount: discount }))
    }

    const applyCouponHandler = () => {
        dispatch({
            type: COUPON_GET_RESET
        })
        dispatch(getCoupon(couponCode, order.totalPrice))
    }

    const codPaymentHandler = () => {
        dispatch(payOrder(orderId, {
            id: uuid(),
            status: "COMPLETED",
            payer: {
                email_address: userInfo.email
            },
            update_time: Date.now()
        }, { discount: discount }))
        if (coupon && coupon.code) {
            dispatch(updateCoupon(coupon.code))
        }
        dispatch(clearCart())
    }

    const walletPaymentHandler = () => {
        dispatch(payOrder(orderId, {
            id: uuid(),
            status: "COMPLETED",
            payer: {
                email_address: userInfo.email
            },
            update_time: Date.now()
        }, { discount: discount }))
        // const wallet = user.wallet - order.totalPrice
        // dispatch(updateUserDetails({
        //     id: user._id,
        //     wallet: wallet.toFixed(2)
        // }))
        const amount = Number(user.wallet) - Number(payAmount)
        dispatch(updateUserDetails({
            id: user._id,
            wallet: amount.toFixed(2)
        }))
        if (coupon && coupon.code) {
            dispatch(updateCoupon(coupon.code))
        }
        dispatch(clearCart())
    }

    const deliverHandler = (code) => {
        confirmAlert({
            title: `DELIVER ORDER`,
            message: 'Enter Code',
            childrenElement: () => <input type='number' name='delivery-code' id='delivery-code' />,
            buttons: [
                {
                    label: 'Confirm',
                    onClick: () => {
                        if (document.getElementById('delivery-code').value.toString() === code.toString()) {
                            dispatch(deliverOrder(order))
                            setMessage('')
                            window.open('/orders/ready', 'mainWindow')
                        } else {
                            setMessage('Incorrect code')
                        }
                    }
                },
                {
                    label: 'Cancel',
                    onClick: () => { }
                },
            ],
        })
    }

    return (
        loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <React.Fragment>
                {userInfo && userInfo.isAdmin && <Link to='/admin/orderlist' className='btn btn-light my-3'>Go Back</Link>}
                <h1 style={{ overflow: 'auto' }}>Order {order._id}</h1>
                {userInfo && order && !order.isDelivered && (
                    <h3>
                        Token: {order.token}
                    </h3>
                )}
                {loadingUser ? <Loader /> : errorUser ? <Message variant='danger'>{error}</Message> : (
                    <Row>
                        <Col md={8}>
                            <ListGroup variant='flush'>
                                <ListGroupItem>
                                    <h2>USER</h2>
                                    <p><strong>Name: </strong>{order.user.name.toUpperCase()}</p>
                                    <p>
                                        <strong>Email: </strong>
                                        <a href={`mailto: ${order.user.email}`}>{order.user.email}</a>
                                    </p>
                                    {userInfo && userInfo.email === order.user.email && order.isPaid && !order.isDelivered && (
                                        <Message variant='info'>Code: {order.deliveryCode}</Message>
                                    )}
                                    {order.isDelivered
                                        ? <Message variant='success'>Delivered on {new Date(`${order.deliveredAt.toString()}`).toDateString()} {new Date(`${order.deliveredAt.toString()}`).toLocaleTimeString()}</Message>
                                        : <Message variant='danger'>Not Delivered</Message>
                                    }
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {order.isPaid && order.paymentMethod !== 'Cash'
                                        ? <Message variant='success'>Paid on {new Date(`${order.paidAt.toString()}`).toDateString()} {new Date(`${order.paidAt.toString()}`).toLocaleTimeString()}</Message>
                                        : (order.isPaid && order.paymentMethod === 'Cash')
                                            ? <Message variant='success'>Pay On Delivery</Message>
                                            : <Message variant='danger'>Not Paid</Message>
                                    }
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h2>Order Items</h2>
                                    {order.orderItems.length === 0 ? <Message>Your cart is empty</Message> : (
                                        <ListGroup variant='flush'>
                                            {order.orderItems.map((item, index) => {
                                                return (
                                                    <ListGroupItem key={index}>
                                                        <Row>
                                                            <Col md={1}>
                                                                <Image src={item.image} alt={item.name} fluid rounded />
                                                            </Col>
                                                            <Col className='py-2 py-md-0'>
                                                                <Link to={`/product/${item.product}`}>
                                                                    {item.name}
                                                                </Link>
                                                            </Col>
                                                            <Col md={4}>
                                                                {item.qty} x &#8377;{item.price} =  &#8377;{item.qty * item.price}
                                                            </Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                )
                                            })}
                                        </ListGroup>
                                    )}
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                        <Col md={4}>
                            <Card>
                                {!order.isPaid && (
                                    <div className="px-2 py-4 px-lg-3 px-xl-4 mt-4">
                                        {loadingCoupon ? <Loader /> : (
                                            <React.Fragment>
                                                <div className='title mt-2 mb-3'>
                                                    <h5 className='font-weight-bold text-capitalize'>
                                                        {'Apply Coupon'.toUpperCase()}
                                                    </h5>
                                                </div>
                                                <CouponsWrapper>
                                                    <div className='mb-2'>
                                                        <input style={{ border: '1px solid black' }} className='w-100 py-2 px-2' type="text" name="coupon" id="coupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
                                                        <Button variant='success' className='py-2 px-3' style={{ borderRadius: '0', border: '0', height: '42.4px' }} disabled={couponCode.length === 0} onClick={applyCouponHandler}>APPLY</Button>
                                                    </div>
                                                </CouponsWrapper>
                                                {errorCoupon && <p className='text-danger mt-2 text-center text-capitalize error'>{errorCoupon}</p>}
                                            </React.Fragment>
                                        )}
                                    </div>
                                )}
                            </Card>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroupItem>
                                        <h2>Order Summary</h2>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Total</Col>
                                            <Col>&#8377;{order.totalPrice}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Payable Amount</Col>
                                            <Col>&#8377;{payAmount}</Col>
                                        </Row>
                                    </ListGroupItem>
                                    {!order.isPaid && (order.paymentMethod === 'PayPal') && (
                                        <ListGroupItem>
                                            {loadingPay && <Loader />}
                                            {!sdkReady ? <Loader /> : (
                                                <PayPalButton amount={order.totalPrice} currency='INR' onSuccess={successPaymentHandler} />
                                            )}
                                        </ListGroupItem>
                                    )}
                                    {!order.isPaid && (order.paymentMethod === 'Cash') && (
                                        <ListGroupItem>
                                            <Button onClick={codPaymentHandler} className='btn btn-block'>Pay On Delivery</Button>
                                        </ListGroupItem>
                                    )}
                                    {!order.isPaid && (order.paymentMethod === 'Wallet') && (
                                        <ListGroupItem>
                                            <Button onClick={walletPaymentHandler} className='btn btn-block'>Pay through Wallet</Button>
                                        </ListGroupItem>
                                    )}
                                    {loadingDeliver && <Loader />}
                                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                        <ListGroupItem>
                                            <Button type='button' className='btn btn-block' onClick={(code) => deliverHandler(order.deliveryCode)}>
                                                Mark as Delivered
                                            </Button>
                                        </ListGroupItem>
                                    )}
                                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && message && (
                                        <ListGroupItem>
                                            <Message variant='danger'>{message}</Message>
                                        </ListGroupItem>
                                    )}
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                )}
            </React.Fragment>
        )
    )
}

const CouponsWrapper = styled.div`
    div{
        display: flex;
        align-items: center;
        justify-content: center
    }
    @media(min-width: 768px) and (max-width: 1200px){
        div{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center
        }
    }
`

export default OrderScreen
