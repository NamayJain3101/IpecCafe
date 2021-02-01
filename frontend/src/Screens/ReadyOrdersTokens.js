import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { listReadyOrders } from '../Actions/orderActions'
import Loader from '../Components/Loader'
import Message from '../Components/Message'

const ReadyOrdersTokens = ({ history }) => {

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderGetReady = useSelector(state => state.orderGetReady)
    const { loading, error, orders } = orderGetReady

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listReadyOrders())
        } else {
            history.push('/login')
        }
    }, [dispatch, userInfo, history])

    return (
        <div>
            {loading ? <Loader /> : error ? (
                <Message variant='danger'>
                    <h1 className='m-3 text-uppercase text-center' style={{ letterSpacing: '4px' }}>{error}</h1>
                </Message>
            ) : (
                    <ReadyOrdersTokensWrappers>
                        {orders.map((order, index) => {
                            return (
                                <h1
                                    key={order._id}
                                    style={index % 2 === 0 ? { background: 'cyan' } : { background: 'lime' }}
                                >{order.token}</h1>
                            )
                        })}
                    </ReadyOrdersTokensWrappers>
                )}
        </div>
    )
}

const ReadyOrdersTokensWrappers = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
    margin: auto;
    h1 {
        font-size: 8rem;
        text-align: center;
        margin: 0;
        border: 1px solid black;
    }
`

export default ReadyOrdersTokens