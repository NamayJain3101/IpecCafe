import React from 'react'
import { useEffect } from 'react'
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { createOrder } from '../Actions/orderActions'
import { getUserDetails } from '../Actions/userActions'
import CheckoutSteps from '../Components/CheckoutSteps'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'
import randtoken from 'rand-token'

const PlaceOrderScreen = ({ history }) => {
    const cart = useSelector(state => state.cart)

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))

    const dispatch = useDispatch()

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    const userDetails = useSelector(state => state.userDetails)
    const { user, loading: loadingUser, error: errorUser } = userDetails

    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`)
            dispatch({ type: USER_DETAILS_RESET })
            dispatch({ type: ORDER_CREATE_RESET })
        } else {
            dispatch(getUserDetails('profile'))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, success])

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod.paymentMethod,
            totalPrice: cart.itemsPrice,
            deliveryCode: randtoken.generator({ chars: '0-9' }).generate(3),
        }))
    }

    return (
        <React.Fragment>
            <CheckoutSteps step1 step2 step3 step4 />
            {loadingUser ? <Loader /> : errorUser ? <Message variant='danger'>{error}</Message> : (
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroupItem>
                                <h2>Payment Method</h2>
                                <strong>Method: </strong>
                                {cart.paymentMethod.paymentMethod}
                            </ListGroupItem>
                            <ListGroupItem>
                                <h2>Order Items</h2>
                                {cart.cartItems.length === 0 ? <Message>Your cart is empty</Message> : (
                                    <ListGroup variant='flush'>
                                        {cart.cartItems.map((item, index) => {
                                            return (
                                                <ListGroupItem key={index}>
                                                    <Row>
                                                        <Col md={1}>
                                                            <Image src={item.image} alt={item.name} fluid rounded />
                                                        </Col>
                                                        <Col>
                                                            <Link to={`/product/${item.product}`}>
                                                                {item.name}
                                                            </Link>
                                                        </Col>
                                                        <Col md={4}>
                                                            {item.qty} * &#8377;{item.price} =  &#8377;{item.qty * item.price}
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
                                        <Col>&#8377;{cart.itemsPrice}</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    {error && <Message variant='danger'>{error}</Message>}
                                    {(cart.paymentMethod.paymentMethod === 'Wallet' && Number(user.wallet) < cart.totalPrice) && <Message>Not enough balance in your wallet. Please change the payment method or recharge your wallet.</Message>}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Button
                                        type='button'
                                        className='btn-block'
                                        disabled={cart.cartItems === 0 || (cart.paymentMethod.paymentMethod === 'Wallet' && Number(user.wallet) < cart.totalPrice)}
                                        onClick={placeOrderHandler}
                                    >
                                        Place Order
                                </Button>
                                </ListGroupItem>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )}
        </React.Fragment>
    )
}

export default PlaceOrderScreen