import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, listUsers } from '../Actions/userActions'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { Button } from 'react-bootstrap'
import Paginate from '../Components/Paginate'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const UserListScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber

    const dispatch = useDispatch()

    const userList = useSelector(state => state.userList)
    const { loading, error, users, pages, page } = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers(pageNumber))
        } else {
            history.push('/login')
        }
    }, [dispatch, userInfo, history, successDelete, pageNumber])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteUser(id))
        }
    }

    return (
        <React.Fragment>
            <h1>Users</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <React.Fragment>
                    <UserWrapper>
                        {users.map(user => {
                            return (
                                <div key={user._id} className='user'>
                                    <div className='id py-2 px-3 mb-3 bg-dark text-light'>{user._id}</div>
                                    <div className='mb-3 price'>Name: {user.name}</div>
                                    <div className='mb-3 price'>Email: <a href={`mailto:${user.email}`}>{user.email}</a></div>
                                    <div className='mb-3 price'>Wallet: &#8377;{user.wallet}</div>
                                    <ButtonContainerWrapper>
                                        <Link to={`/admin/user/${user._id}/edit`}>
                                            <Button
                                                variant='info'
                                                style={{
                                                    fontSize: '1.2rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '2px',
                                                    marginRight: '1rem'
                                                }}
                                            >
                                                Edit user
                                            </Button>
                                        </Link>
                                        <Button
                                            variant='danger'
                                            style={{
                                                fontSize: '1.2rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '2px',
                                                marginRight: '1rem'
                                            }}
                                            onClick={() => deleteHandler(user._id)}
                                        >
                                            Delete User
                                        </Button>
                                    </ButtonContainerWrapper>
                                </div>
                            )
                        })}
                    </UserWrapper>
                    <Paginate pages={pages} page={page} isAdmin={true} url='/admin/userlist' />
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

const UserWrapper = styled.div`
    .user {
        margin-bottom: 2rem;
    }
    .price, .id {
        font-size: 1.2rem;
        letter-spacing: 2px;
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

export default UserListScreen