import React from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route } from 'react-router-dom'
import Footer from './Components/Footer';
import Header from './Components/Header';
import CartScreen from './Screens/CartScreen';
import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen';
import OrderListScreen from './Screens/OrderListScreen';
import OrderScreen from './Screens/orderScreen';
import PaymentScreen from './Screens/PaymentScreen';
import PlaceOrderScreen from './Screens/PlaceOrderScreen';
import ProductEditScreen from './Screens/ProductEditScreen';
import ProductListScreen from './Screens/ProductListScreen';
import ProductScreen from './Screens/ProductScreen';
import ProfileScreen from './Screens/ProfileScreen';
import WalletScreen from './Screens/WalletScreen';
import RegisterScreen from './Screens/RegisterScreen';
import UserEditScreen from './Screens/UserEditScreen';
import UserListScreen from './Screens/UserListScreen';
import ReadyOrdersTokens from './Screens/ReadyOrdersTokens';
import CouponListScreen from './Screens/CouponListScreen';
import CouponCreateScreen from './Screens/CouponCreateScreen';

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <main className='py-3'>
                <Container>
                    <Route path='/order/:id' exact component={OrderScreen} />
                    <Route path='/placeorder' exact component={PlaceOrderScreen} />
                    <Route path='/payment' exact component={PaymentScreen} />
                    <Route path='/login' exact component={LoginScreen} />
                    <Route path='/register' exact component={RegisterScreen} />
                    <Route path='/profile' exact component={ProfileScreen} />
                    <Route path='/wallet/:id' exact component={WalletScreen} />
                    <Route path='/product/:id' exact component={ProductScreen} />
                    <Route path='/cart/:id?' exact component={CartScreen} />
                    <Route path='/admin/userlist' exact component={UserListScreen} />
                    <Route path='/admin/userlist/:pageNumber' exact component={UserListScreen} />
                    <Route path='/admin/user/:id/edit' component={UserEditScreen} />
                    <Route path='/admin/productlist' exact component={ProductListScreen} />
                    <Route path='/admin/productlist/:pageNumber' exact component={ProductListScreen} />
                    <Route path='/admin/product/:id/edit' component={ProductEditScreen} />
                    <Route path='/admin/orderlist' exact component={OrderListScreen} />
                    <Route path='/orders/ready' exact component={ReadyOrdersTokens} />
                    <Route path='/admin/orderlist/:pageNumber' exact component={OrderListScreen} />
                    <Route path='/admin/couponlist' exact component={CouponListScreen} />
                    <Route path='/admin/couponlist/create' exact component={CouponCreateScreen} />
                    <Route path='/search/:keyword' exact component={HomeScreen} />
                    <Route path='/search/:keyword/page/:pageNumber' component={HomeScreen} />
                    <Route path='/page/:pageNumber' exact component={HomeScreen} />
                    <Route path='/' exact component={HomeScreen} />
                </Container>
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;