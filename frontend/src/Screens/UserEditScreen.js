import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Form, FormCheck, FormControl, FormGroup, FormLabel, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getOtp, getUserDetails, updateUser } from '../Actions/userActions'
import { USER_OTP_RESET, USER_UPDATE_RESET } from '../constants/userConstants'
import FormContainer from '../Components/FormContainer'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { TiRefresh, TiTick } from 'react-icons/ti'

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [wallet, setWallet] = useState(0)
    const [isAdmin, setIsAdmin] = useState(false)

    const [otpMessage, setOtpMessage] = useState('')
    const [otp, setOtp] = useState('')

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, success: successUpdate, error: errorUpdate } = userUpdate

    const userOtp = useSelector(state => state.userOtp)
    const { otp: recievedOtp, loading: loadingOtp } = userOtp

    const sendOtp = () => {
        dispatch(getOtp(email))
    }

    const verifyOtp = () => {
        if (otp.toString() === recievedOtp.otp.toString() && email === recievedOtp.email) {
            dispatch(updateUser({
                _id: userId,
                name,
                email,
                wallet,
                isAdmin
            }))
        } else {
            setOtpMessage('OTP did not match or email has been changed')
        }
    }

    useEffect(() => {
        if (successUpdate) {
            dispatch({
                type: USER_UPDATE_RESET
            })
            dispatch({
                type: USER_OTP_RESET
            })
            history.push('/admin/userlist')
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setWallet(user.wallet)
                setIsAdmin(user.isAdmin)
            }
        }
    }, [dispatch, userId, user, successUpdate, history])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({
            _id: userId,
            name,
            email,
            wallet,
            isAdmin
        }))
    }

    return (
        <React.Fragment>
            <Link to='/admin/userlist' className='btn btn-light my-3'>Go back</Link>
            <FormContainer>
                <h1>Edit User {userId}p</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {otpMessage && <Message variant='danger'>{otpMessage}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <FormGroup controlId='name'>
                            <FormLabel>Name: </FormLabel>
                            <FormControl type='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}></FormControl>
                        </FormGroup>
                        <FormGroup controlId='email'>
                            <FormLabel>Email: </FormLabel>
                            <FormControl disabled type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}></FormControl>
                        </FormGroup>
                        <FormGroup controlId='wallet'>
                            <FormLabel>Wallet: </FormLabel>
                            <FormControl type='number' placeholder='Wallet' value={wallet} onChange={(e) => setWallet(e.target.value)}></FormControl>
                        </FormGroup>
                        <FormGroup controlId='isAdmin'>
                            <FormCheck type='checkbox' label='Is Admin' checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                        </FormGroup>
                        <Button
                            variant='success'
                            disabled={recievedOtp}
                            className='btn btn-block text-uppercase mb-4'
                            onClick={() => sendOtp(email)}
                        >
                            {loadingOtp ? "sending OTP..." : recievedOtp ? "OTP Sent" : "update"}
                        </Button>
                        {recievedOtp && (
                            <FormGroup controlId='otp'>
                                <FormLabel>Otp: </FormLabel>
                                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                                    <FormControl type='password' required placeholder='Enter OTP' value={otp} onChange={(e) => setOtp(e.target.value)}></FormControl>
                                    <Button
                                        variant="success"
                                        style={{ borderRadius: "5px", height: "43.5px", width: "60px", cursor: "pointer" }}
                                        onClick={() => verifyOtp()}
                                    ><TiTick fontSize="1.8rem" /></Button>
                                    <Button variant='warning' style={{ borderRadius: "5px", height: "43.5px", width: "60px", cursor: "pointer" }} onClick={() => sendOtp(email)} className='btn btn-block getotp text-uppercase'>
                                        {loadingOtp ? <Spinner size="sm" style={{ margin: "0.25rem 5px" }} animation="border" role="status"></Spinner> : <TiRefresh fontSize="1.8rem" />}
                                    </Button>
                                </div>
                            </FormGroup>
                        )}
                    </Form>
                )}
            </FormContainer>
        </React.Fragment>
    )
}

export default UserEditScreen