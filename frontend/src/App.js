import React from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route } from 'react-router-dom'
import Loader from './Components/Loader';

const Footer = React.lazy(() => import('./Components/Footer'))
const Header = React.lazy(() => import('./Components/Header'))
const ContactUs = React.lazy(() => import('./Screens/ContactUsScreen'))
const CartScreen = React.lazy(() => import('./Screens/CartScreen'))
const HomeScreen = React.lazy(() => import('./Screens/HomeScreen'))
const LoginScreen = React.lazy(() => import('./Screens/LoginScreen'))
const OrderListScreen = React.lazy(() => import('./Screens/OrderListScreen'))
const OrderScreen = React.lazy(() => import('./Screens/orderScreen'))
const PaymentScreen = React.lazy(() => import('./Screens/PaymentScreen'))
const PlaceOrderScreen = React.lazy(() => import('./Screens/PlaceOrderScreen'))
const ProductEditScreen = React.lazy(() => import('./Screens/ProductEditScreen'))
const ProductListScreen = React.lazy(() => import('./Screens/ProductListScreen'))
const ProductScreen = React.lazy(() => import('./Screens/ProductScreen'))
const ProfileScreen = React.lazy(() => import('./Screens/ProfileScreen'))
const WalletScreen = React.lazy(() => import('./Screens/WalletScreen'))
const RegisterScreen = React.lazy(() => import('./Screens/RegisterScreen'))
const UserEditScreen = React.lazy(() => import('./Screens/UserEditScreen'))
const UserListScreen = React.lazy(() => import('./Screens/UserListScreen'))
const ReadyOrdersTokens = React.lazy(() => import('./Screens/ReadyOrdersTokens'))
const CouponListScreen = React.lazy(() => import('./Screens/CouponListScreen'))
const CouponCreateScreen = React.lazy(() => import('./Screens/CouponCreateScreen'))

const App = () => {
    return (
        <BrowserRouter>
            <React.Suspense fallback={<Loader />}>
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
                        <Route path='/contact-us' exact component={ContactUs} />
                        <Route path='/' exact component={HomeScreen} />
                    </Container>
                </main>
                <Footer />
            </React.Suspense>
        </BrowserRouter>
    );
}

export default App;