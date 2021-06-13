import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { register, validateEmail } from '../Actions/userActions'
import { USER_OTP_RESET, USER_REGISTER_RESET } from '../constants/userConstants'
import FormContainer from '../Components/FormContainer'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { FiSend } from 'react-icons/fi'
import { TiRefresh, TiTick } from 'react-icons/ti'

const RegisterScreen = ({ location, history }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const [otp, setOtp] = useState('')
    const [otpMessage, setOtpMessage] = useState('')
    const [verifiedOtp, setVerifiedOtp] = useState(false)
    const [successVerification, setSuccessVerification] = useState('')

    const dispatch = useDispatch()

    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo } = userRegister

    const emailValidation = useSelector(state => state.emailValidation)
    const { otp: recievedOtp, loading: loadingOtp } = emailValidation

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            dispatch({
                type: USER_REGISTER_RESET
            })
            setMessage('Passwords do not match')
        } else if (!verifiedOtp) {
            dispatch({
                type: USER_REGISTER_RESET
            })
            setOtpMessage('Email not verified')
        } else {
            dispatch(register(name, email, password))
            setMessage('')
            dispatch({
                type: USER_OTP_RESET
            })
        }
    }

    const sendOtp = () => {
        dispatch(validateEmail(email))
    }

    const verifyOtp = () => {
        if (otp.toString() === recievedOtp.otp.toString() && email === recievedOtp.email) {
            setVerifiedOtp(true)
            setOtpMessage('')
            setSuccessVerification('Email verified successfully')
        } else {
            setSuccessVerification('')
            setOtpMessage('OTP did not match or email has been changed')
        }
    }

    return (
        <FormContainer>
            <h1>Sign Up</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {successVerification && <Message variant='success'>{successVerification}</Message>}
            {otpMessage && <Message variant='danger'>{otpMessage}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <FormGroup controlId='name'>
                    <FormLabel>Name: </FormLabel>
                    <FormControl type='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}></FormControl>
                </FormGroup>
                <FormGroup controlId='email'>
                    <FormLabel>Email: </FormLabel>
                    <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                        <FormControl type='email' disabled={verifiedOtp} placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}></FormControl>
                        <Button
                            variant="info"
                            style={recievedOtp ? { borderRadius: "5px", height: "43.5px", width: "60px", cursor: "not-allowed" } : { borderRadius: "5px", height: "43.5px", width: "60px", cursor: "pointer" }}
                            disabled={recievedOtp}
                            onClick={() => sendOtp(email)}
                        ><FiSend fontSize="1.5rem" /></Button>
                    </div>
                </FormGroup>
                <FormGroup controlId='otp'>
                    <FormLabel>Otp: </FormLabel>
                    <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                        <FormControl type='password' disabled={verifiedOtp} placeholder='OTP' value={otp} onChange={(e) => setOtp(e.target.value)}></FormControl>
                        <Button
                            variant="success"
                            style={verifiedOtp ? { borderRadius: "5px", height: "43.5px", width: "60px", cursor: "not-allowed" } : { borderRadius: "5px", height: "43.5px", width: "60px", cursor: "pointer" }}
                            disabled={verifiedOtp}
                            onClick={() => verifyOtp()}
                        ><TiTick fontSize="1.8rem" /></Button>
                        <Button variant='warning' style={verifiedOtp ? { borderRadius: "5px", height: "43.5px", width: "60px", cursor: "not-allowed" } : { borderRadius: "5px", height: "43.5px", width: "60px", cursor: "pointer" }} disabled={verifiedOtp} onClick={() => sendOtp(email)} className='btn btn-block getotp text-uppercase'>
                            {loadingOtp ? <Spinner size="sm" style={{ margin: "0.25rem 5px" }} animation="border" role="status"></Spinner> : <TiRefresh fontSize="1.5rem" />}
                        </Button>
                    </div>
                </FormGroup>
                <FormGroup controlId='password'>
                    <FormLabel>Password: </FormLabel>
                    <FormControl disabled={!verifiedOtp} type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}></FormControl>
                </FormGroup>
                <FormGroup controlId='confirmPassword'>
                    <FormLabel>Confirm Password: </FormLabel>
                    <FormControl disabled={!verifiedOtp} type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></FormControl>
                </FormGroup>
                <Button type='submit' variant='primary'>
                    Register
                </Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen