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
import { USER_RECHARGE_WALLET_RESET } from '../constants/userConstants'
import { PayPalButton } from 'react-paypal-button-v2'

const WalletScreen = ({ history, match }) => {
    const userId = match.params.id

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDetails = useSelector(state => state.userDetails)
    const { user, loading, error } = userDetails

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { userInfo: updatedUser } = userUpdateProfile

    const rechargeWallet = useSelector(state => state.rechargeWallet)
    const { loading: loadingPay, success: successPay } = rechargeWallet

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
            if (!user || (user._id !== userId) || successPay) {
                dispatch({ type: USER_RECHARGE_WALLET_RESET })
                dispatch(getUserDetails('profile'))
            } else {
                if (!window.paypal) {
                    addPaypalScript()
                } else {
                    setSdkReady(true)
                }
            }
        } else {
            history.push('/login')
        }

    }, [dispatch, successPay, userInfo, history, user, userId, updatedUser])

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
        </Row>
    )
}

export default WalletScreen
