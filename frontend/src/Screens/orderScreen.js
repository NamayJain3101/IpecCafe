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
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants'
import { getUserDetails, updateUserDetails } from '../Actions/userActions'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

const OrderScreen = ({ match, history }) => {

    const orderId = match.params.id

    const [sdkReady, setSdkReady] = useState(false)
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

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
            if (!user.wallet) {
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

    }, [dispatch, orderId, successPay, order, successDeliver, userInfo, history, user])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    const codPaymentHandler = () => {
        dispatch(payOrder(orderId, {
            id: uuid(),
            status: "COMPLETED",
            payer: {
                email_address: userInfo.email
            },
            update_time: Date.now()
        }))
    }

    const walletPaymentHandler = () => {
        dispatch(payOrder(orderId, {
            id: uuid(),
            status: "COMPLETED",
            payer: {
                email_address: userInfo.email
            },
            update_time: Date.now()
        }))
        const wallet = user.wallet - order.totalPrice
        dispatch(updateUserDetails({
            id: user._id,
            wallet: wallet.toFixed(2)
        }))
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
                <h1>Order {order._id}</h1>
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
                                <ListGroup variant='flush'>
                                    <ListGroupItem>
                                        <h2>Order Summary</h2>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Total</Col>
                                            <Col>&#8377;{order.totalPrice}</Col>
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

export default OrderScreen
