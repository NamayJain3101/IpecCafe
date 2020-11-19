import React, { useEffect } from 'react'
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { addToCart, removeFromCart } from '../Actions/cartActions'
import Message from '../Components/Message'

const CartScreen = ({ match, location, history }) => {

    const productId = match.params.id

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    const dispatch = useDispatch();
    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId))
        }
    }, [dispatch, productId])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = (id) => {
        history.push('/login?redirect=payment')
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {
                    cartItems.length === 0 ? (
                        <Message>
                            Your Cart Is Empty
                            <Link to='/'>Go Back</Link>
                        </Message>
                    ) : (
                            <ListGroup variant='flush'>
                                {
                                    cartItems.map(item => {
                                        return (
                                            <ListGroupItem key={item.product}>
                                                <Row>
                                                    <Col md={2}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Link to={`/products/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={2}>
                                                        &#8377;{item.price}
                                                    </Col>
                                                    <Col md={2}>
                                                        <Button type='button' variant='danger' onClick={() => removeFromCartHandler(item.product)}>
                                                            <FaTrash />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </ListGroupItem>
                                        )
                                    })
                                }
                            </ListGroup>
                        )
                }
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h2>
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) Items
                            </h2>
                            &#8377;{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroupItem>
                        <ListGroupItem>
                            <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                                Proceed To Checkout
                            </Button>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen
