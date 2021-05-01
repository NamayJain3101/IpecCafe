import React, { useState } from 'react'
import { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listMyOrders } from '../Actions/orderActions'
import { getUserDetails, updateUserDetails } from '../Actions/userActions'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import styled from 'styled-components'
import { TiTick } from 'react-icons/ti'
import { GoDash } from 'react-icons/go'

const ProfileScreen = ({ history }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userDetails = useSelector((state) => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const orderListMy = useSelector((state) => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user.name || (user._id !== userInfo._id)) {
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, history, userInfo, user, success, orders])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            dispatch(updateUserDetails({
                id: user._id,
                name,
                email,
                password
            }))
        }
    }

    console.log(orders)

    return (
        <Row>
            <Col md={3}>
                <h1>User Profile</h1>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {success && <Message variant='success'>Profile Updated</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <FormGroup controlId='name'>
                        <FormLabel>Name: </FormLabel>
                        <FormControl type='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup controlId='email'>
                        <FormLabel>Email: </FormLabel>
                        <FormControl type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup controlId='password'>
                        <FormLabel>Password: </FormLabel>
                        <FormControl type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup controlId='confirmPassword'>
                        <FormLabel>Confirm Password: </FormLabel>
                        <FormControl type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></FormControl>
                    </FormGroup>
                    <Button type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
                {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'>{error}</Message> : (
                    <React.Fragment>
                        <OrderWrapper>
                            {orders.map(order => {
                                return (
                                    <div key={order._id} className='order'>
                                        <div className='id py-2 px-3 bg-danger text-light'>{order._id}</div>
                                        <div className='orderItems'>
                                            {order.orderItems.map(item => {
                                                return (
                                                    <div key={item._id}>
                                                        <img src={item.image} alt={item.name} className='img-fluid' />
                                                        <div className='qty'><FaTimes fontSize='1rem' />{item.qty}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className='price mb-3'>Total Amount: <span>&#8377;{order.totalPrice}</span></div>
                                        <div className='paid row mb-3'>
                                            <Col>
                                                Ordered At: {order.createdAt.substring(0, 10)}
                                            </Col>
                                        </div>
                                        <div className='paid row mb-3'>
                                            <Col sm={4}>
                                                Paid: {order.isPaid ? <TiTick fontSize='1.5rem' color='green' /> : <FaTimes fontSize='1.5rem' color='red' />}
                                            </Col>
                                            <Col sm={7}>
                                                Paid At: {order.paidAt ? order.paidAt.substring(0, 10) : <GoDash fontSize='2rem' color='blue' />}
                                            </Col>
                                        </div>
                                        <div className='delivered row mb-3'>
                                            <Col sm={4}>
                                                Delivered: {order.isDelivered ? <TiTick fontSize='1.5rem' color='green' /> : <FaTimes fontSize='1.5rem' color='red' />}
                                            </Col>
                                            <Col sm={7}>
                                                Delivered At: {order.deliveredAt ? order.deliveredAt.substring(0, 10) : <GoDash fontSize='2rem' color='blue' />}
                                            </Col>
                                        </div>
                                        <ButtonContainerWrapper>
                                            <Button
                                                variant='info'
                                                style={{
                                                    fontSize: '1.2rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '2px',
                                                    marginRight: '1rem'
                                                }}
                                                onClick={() => history.push(`/order/${order._id}`)}
                                            >
                                                View Order
                                        </Button>
                                        </ButtonContainerWrapper>
                                    </div>
                                )
                            })}
                        </OrderWrapper>
                    </React.Fragment>
                )}
            </Col>
        </Row>
    )
}

const OrderWrapper = styled.div`
    .order {
        margin-bottom: 2rem;
    }
    .orderItems {
        margin: 1rem auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        grid-row-gap: 1rem;
        grid-column-gap: 1rem;
    }
    .orderItems > div {
        position: relative;
        border: 1px solid black;
        overflow: hidden;
    }
    .qty {
        position: absolute;
        top: 0;
        right: 0;
        background: var(--warning);
        color: black;
        padding: 2px 4px 4px 8px;
        font-size: 1.5rem;
        font-weight: bold;
        border-bottom-left-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid black;
        border-left: 1px solid black;
    }
    .price, .id {
        font-size: 1.2rem;
        letter-spacing: 2px;
    }
    .price > span {
        font-family: sans-serif;
        font-weight: bold;
    }
    .paid, .delivered {
        font-size: 1.2rem;
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`

const ButtonContainerWrapper = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    margin-bottom: 4rem;
    button {
        border-radius: 0
    }
`

export default ProfileScreen
