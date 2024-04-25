import Header from './Components/Header';
import Footer from './Components/Footer'
import { Container } from 'react-bootstrap'
import HomeScreen from './Screens/HomeScreen'
import ProductScreen from './Screens/ProductScreen'
import CartScreen from './Screens/CartScreen'
import LoginScreen from './Screens/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen'
import ShippingScreen from './Screens/ShippingScreen'
import PaymentScreen from './Screens/PaymentScreen'
import PlaceOrderScreen from './Screens/PlaceOrderScreen'
import OrderScreen from './Screens/OrderScreen'
import ProfileScreen from './Screens/ProfileScreen'
import AdminDashboardScreen from './Screens/AdminDashboardScreen'
import SellerDashboardScreen from './Screens/SellerDashboardScreen'
import UnauthorizedError from './Screens/UnauthorizedError'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} exact />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/shipping' element={<ShippingScreen />} />
            <Route path='/payment' element={<PaymentScreen />} />
            <Route path='/placeorder' element={<PlaceOrderScreen />} />
            <Route path='/order/:id' element={<OrderScreen />} />
            <Route path='/cart/:id?' element={<CartScreen />} />
            <Route path='/profile/admin_dashboard' element={<AdminDashboardScreen />} /> 
            <Route path='/profile/seller_dashboard' element={<SellerDashboardScreen />} /> 
            <Route path='/unauthorized' element={<UnauthorizedError />} /> 
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
