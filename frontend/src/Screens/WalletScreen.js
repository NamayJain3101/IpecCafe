import React from 'react'
import axios from 'axios'
import uuid from 'react-uuid'
import { useState } from 'react'
import { useEffect } from 'react'
import { Button, Col, Form, FormControl, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, recharge } from '../Actions/userActions'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { listMyCoupons } from '../Actions/couponActions'
import { USER_RECHARGE_WALLET_RESET, USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { PayPalButton } from 'react-paypal-button-v2'
import styled from 'styled-components'

const WalletScreen = ({ history, match }) => {
    const userId = match.params.id

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDetails = useSelector(state => state.userDetails)
    const { user, loading, error } = userDetails

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const rechargeWallet = useSelector(state => state.rechargeWallet)
    const { loading: loadingPay, success: successPay } = rechargeWallet

    const couponListMy = useSelector(state => state.couponListMy)
    const { coupons, loading: loadingCoupons, error: errorCoupons } = couponListMy

    const [wallet, setWallet] = useState(0)
    const [sdkReady, setSdkReady] = useState(false)
    const [codeValid, setCodeValid] = useState(true)
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

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
            if (!user || success || (user._id !== userId) || successPay) {
                dispatch({ type: USER_RECHARGE_WALLET_RESET })
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
            } else {
                if (!window.paypal) {
                    addPaypalScript()
                } else {
                    setSdkReady(true)
                }
            }
            dispatch(listMyCoupons())
        } else {
            history.push('/login')
        }

    }, [dispatch, successPay, userInfo, history, user, userId, success])

    const successPaymentHandler = (paymentResult) => {
        if (wallet) {
            setMessage('')
            const amount = user.wallet + wallet
            dispatch(recharge(userId, paymentResult, amount))
        } else {
            setMessage('Please select Amount')
        }
    }

    const rechargeHandler = (e) => {
        e.preventDefault()
        if (wallet) {
            setMessage('')
            const amount = user.wallet + wallet
            var code = prompt("Enter code : ", "");
            if (code === '123456') {
                setCodeValid(true)
                dispatch(recharge(userId, {
                    id: uuid(),
                    status: 'COMPLETED',
                    update_time: Date.now(),
                    payer: {
                        email_address: user.email,
                    },
                    purchase_units: [
                        {
                            amount: {
                                value: String(wallet.toFixed(2))
                            }
                        }
                    ]
                }, amount))
            } else {
                setCodeValid(false)
            }
        } else {
            setMessage('Please select Amount')
        }
    }

    return (
        <Row>
            <Col md={4}>
                <h1 className='mb-5'>My Wallet</h1>
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h4>Wallet: &#8377;{user.wallet}</h4>
                        </ListGroupItem>
                        {successPay && <Message variant='success'>Wallet Recharged with amount &#8377;{wallet}</Message>}
                        {codeValid === false && <Message variant='danger'>Enter a valid code</Message>}
                        {message !== '' && <Message variant='danger'>{message}</Message>}
                        <ListGroupItem>
                            <Form onSubmit={rechargeHandler}>
                                <FormControl as='select' value={wallet} onChange={(e) => setWallet(Number(e.target.value))}>
                                    <option>Select Amount...</option>
                                    <option value={200}>200</option>
                                    <option value={500}>500</option>
                                </FormControl>
                                <Button type='submit' className='my-3 btn-block'>Recharge via Cash</Button>
                            </Form>
                        </ListGroupItem>
                        <ListGroupItem>
                            {loadingPay && <Loader />}
                            {!sdkReady ? <Loader /> : (
                                <PayPalButton amount={wallet} currency='INR' onSuccess={successPaymentHandler} />
                            )}
                        </ListGroupItem>
                    </ListGroup>
                )}
            </Col>
            <Col md={8}>
                <h1 className='mb-5'>Available Coupons</h1>
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <React.Fragment>
                        <CouponWrapper>
                            {coupons && coupons.map(coupon => {
                                return (
                                    <div key={coupon._id} className='coupon'>
                                        <div className='id py-2 px-3 mb-3 bg-dark text-light'>{coupon._id}</div>
                                        <Button variant='success' style={{ borderRadius: '0' }} className='mb-3 price'>Code: {coupon.code}</Button>
                                        <div className='mb-3 price'>Discount Type: <span className="text-uppercase">{coupon.discountType}</span></div>
                                        {coupon.discountType.toLowerCase() === 'flat' ? (
                                            <div className='mb-3 price'>Discount: &#8377;{coupon.discountAmount}</div>
                                        ) : (
                                            <div className='mb-3 price'>Discount: {coupon.discountAmount}% upto &#8377;{coupon.discountUpto}</div>
                                        )}
                                        <div className='mb-3 price'>Min amount required: &#8377;{coupon.minAmountRequired}</div>
                                    </div>
                                )
                            })}
                        </CouponWrapper>
                    </React.Fragment>
                )}
            </Col>
        </Row>
    )
}

const CouponWrapper = styled.div`
    .coupon {
        margin-bottom: 2rem;
    }
    .price, .id {
        font-size: 1.2rem;
        letter-spacing: 2px;
    }
`

export default WalletScreen
