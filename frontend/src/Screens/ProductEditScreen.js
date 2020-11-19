import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Form, FormControl, FormFile, FormGroup, FormLabel } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { listProductDetails, updateProduct } from '../Actions/ProductActions'
import FormContainer from '../Components/FormContainer'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(false)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({
                type: PRODUCT_UPDATE_RESET
            })
            history.push('/admin/productlist')
        } else {
            if (!product.name || product._id !== productId) {
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
    }, [dispatch, productId, product, history, successUpdate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const { data } = await axios.post('/api/upload', formData, config)
            setImage(data)
            setUploading(false)
        } catch (error) {
            console.log(error)
            setUploading(false)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        console.log(name, price)
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            category,
            description,
            countInStock
        }))
    }

    return (
        <React.Fragment>
            <Link to='/admin/productlist' className='btn btn-light my-3'>Go back</Link>
            <FormContainer>
                <h1>Edit Product {productId}</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <FormGroup controlId='name'>
                            <FormLabel>Name: </FormLabel>
                            <FormControl type='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}></FormControl>
                        </FormGroup>
                        <FormGroup controlId='price'>
                            <FormLabel>Price: </FormLabel>
                            <FormControl type='number' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)}></FormControl>
                        </FormGroup>
                        <FormGroup controlId='image'>
                            <FormLabel>Image: </FormLabel>
                            <FormControl type='text' placeholder='Image' value={image} onChange={(e) => setImage(e.target.value)}></FormControl>
                            <FormFile id='image-file' label='Choose File' custom onChange={uploadFileHandler} />
                            {uploading && <Loader />}
                        </FormGroup>
                        <FormGroup controlId='category'>
                            <FormLabel>Category: </FormLabel>
                            <FormControl type='text' placeholder='Category' value={category} onChange={(e) => setCategory(e.target.value)}></FormControl>
                        </FormGroup>
                        <FormGroup controlId='countInStock'>
                            <FormLabel>Count In Stock: </FormLabel>
                            <Form.Control as='select' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}>
                                <option value={true}>Available</option>
                                <option value={false}>Not Available</option>
                            </Form.Control>
                        </FormGroup>
                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </React.Fragment>
    )
}

export default ProductEditScreen