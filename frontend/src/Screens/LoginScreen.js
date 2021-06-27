import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { login, getOtp, verifyUserOtp } from '../Actions/userActions'
import FormContainer from '../Components/FormContainer'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { USER_OTP_VERIFY_RESET } from '../constants/userConstants'

const LoginScreen = ({ location, history }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [verifiedOtp, setVerifiedOtp] = useState(false)
    const [successVerification, setSuccessVerification] = useState('')
    const [otp, setOtp] = useState('')

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { loading, error, userInfo } = userLogin

    const userOtp = useSelector(state => state.userOtp)
    const { otp: recievedOtp, loading: loadingOtp } = userOtp

    const otpVerify = useSelector(state => state.otpVerify)
    const { success, error: errorVerifyingOtp } = otpVerify

    let redirect = location.search ? location.search.split('=')[1] : '/'

    const sendOtp = () => {
        dispatch(getOtp(email))
    }

    const verifyOtp = () => {
        dispatch(verifyUserOtp(email, otp))
    }

    useEffect(() => {
        if (success) {
            dispatch({
                type: USER_OTP_VERIFY_RESET
            })
            setVerifiedOtp(true)
            setSuccessVerification('OTP Verified')
            dispatch(login(email, "otp"))
        }
    }, [dispatch, email, success])

    useEffect(() => {
        if (verifiedOtp && userInfo) {
            history.push('/profile')
        }
        if (!otp && userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect, verifiedOtp, otp])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {errorVerifyingOtp && <Message variant='danger'>{errorVerifyingOtp}</Message>}
            {recievedOtp && <Message variant='success'>OTP Sent</Message>}
            {successVerification && <Message variant='success'>{successVerification}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <FormGroup controlId='email'>
                    <FormLabel>Email: </FormLabel>
                    <FormControl type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}></FormControl>
                </FormGroup>
                {recievedOtp ? (
                    <FormGroup controlId='otp'>
                        <FormLabel>OTP: </FormLabel>
                        <FormControl type='password' placeholder='OTP' value={otp} onChange={(e) => setOtp(e.target.value)}></FormControl>
                    </FormGroup>
                ) : (
                    <FormGroup controlId='password'>
                        <FormLabel>Password: </FormLabel>
                        <FormControl type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}></FormControl>
                    </FormGroup>
                )}
                {recievedOtp ? <Button variant='success' onClick={() => verifyOtp()} className='btn btn-block'>Verify OTP</Button> : <Button variant='success' type='submit' className='btn btn-block'>LOGIN</Button>}
                <Button variant='warning' className="btn btn-block mt-3" onClick={() => sendOtp(email)}>
                    {loadingOtp ? "Sending OTP" : recievedOtp ? "Resend OTP" : "Forgot Password"}
                </Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
