import React, { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { TiTick } from 'react-icons/ti'
import { GoDash } from 'react-icons/go'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { Button, Col } from 'react-bootstrap'
import { cancelOrder, listOrders, markOrderAsReady } from '../Actions/orderActions'
import { ORDER_DETAILS_RESET } from '../constants/orderConstants'
import Paginate from '../Components/Paginate'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { updateUser } from '../Actions/userActions'

const OrderListScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber

    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders, pages, page } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderReady = useSelector(state => state.orderReady)
    const { success } = orderReady

    const orderCancel = useSelector(state => state.orderCancel)
    const { loading: loadingCancel } = orderCancel

    const userDetails = useSelector(state => state.userDetails)
    const { user } = userDetails

    useEffect(() => {
        dispatch({
            type: ORDER_DETAILS_RESET
        })
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders(pageNumber))
        } else {
            history.push('/login')
        }
    }, [dispatch, userInfo, history, pageNumber, success])

    const readyOrderHandler = (order) => {
        dispatch(markOrderAsReady(order))
    }

    const cancelOrderHandler = (order) => {
        confirmAlert({
            title: `Cancel Order`,
            message: 'Are you sure??',
            buttons: [
                {
                    label: 'Confirm',
                    onClick: () => {
                        dispatch(cancelOrder(order))
                        if (order.isPaid) {
                            const amount = Number(user.wallet) + Number(order.totalPrice)
                            dispatch(updateUser({
                                id: user._id,
                                wallet: amount.toFixed(2),
                            }))
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

    console.log(orders)

    return (
        <React.Fragment>
            <h1>Orders</h1>
            {loading || loadingCancel ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <React.Fragment>
                    <OrderWrapper>
                        {orders.map(order => {
                            return (
                                <div key={order._id} className='order'>
                                    <div className='id py-2 px-3 mb-3 bg-dark text-light'>{order._id}</div>
                                    <ButtonContainerWrapper style={{ marginBottom: '0' }}>
                                        <Button
                                            variant='danger'
                                            style={{
                                                fontSize: '1.2rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '2px',
                                                marginRight: '1rem'
                                            }}
                                        >
                                            Token No: {order.token}
                                        </Button>
                                    </ButtonContainerWrapper>
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
                                    <div className='cancelled row mb-3'>
                                        <Col sm={4}>
                                            Cancelled: {order.isCancelled ? <TiTick fontSize='1.5rem' color='green' /> : <FaTimes fontSize='1.5rem' color='red' />}
                                        </Col>
                                        <Col sm={7}>
                                            Cancelled At: {order.cancelledAt ? order.cancelledAt.substring(0, 10) : <GoDash fontSize='2rem' color='blue' />}
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
                                        {!order.isDelivered && !order.isCancelled && (
                                            <Link to='/orders/ready' target={'mainWindow'}>
                                                <Button
                                                    variant='success'
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '2px',
                                                        marginRight: '1rem'
                                                    }}
                                                    disabled={order.ready}
                                                    onClick={(o) => readyOrderHandler(order)}
                                                >
                                                    Mark as ready
                                                </Button>
                                            </Link>
                                        )}
                                        {!order.isDelivered && !order.isPaid && !order.isCancelled && (
                                            <Button
                                                variant='danger'
                                                style={{
                                                    fontSize: '1.2rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '2px',
                                                }}
                                                onClick={(o) => cancelOrderHandler(order)}
                                            >
                                                Cancel Order
                                            </Button>
                                        )}
                                    </ButtonContainerWrapper>
                                </div>
                            )
                        })}
                    </OrderWrapper>
                    <Paginate pages={pages} page={page} isAdmin={true} url='/admin/orderlist' />
                </React.Fragment>
            )}
        </React.Fragment>
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
    .paid, .delivered, .cancelled {
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

export default OrderListScreen