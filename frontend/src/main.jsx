import React from 'react'
import ReactDOM from 'react-dom/client'
import { 
  createBrowserRouter , 
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import store from './store.js'
import { Provider } from 'react-redux'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './app.css'

// user
import PrivateRoute from './components/user/PrivateRoute.jsx'
import HomeScreen from './screens/user/HomeScreen.jsx'
import LoginScreen from './screens/user/LoginScreen.jsx'
import RegisterScreen from './screens/user/RegisterScreen.jsx'
import ProfileScreen from './screens/user/ProfileScreen.jsx'
import ProfileCard from './components/user/ProfileCard.jsx'

// admin
import AdminPrivateRoute from './components/admin/AdminPrivateRoute.jsx'
import AdminLogin from './components/admin/AdminLogin.jsx'
import AdminHome from './screens/admin/AdminHome.jsx'
import UserListScreen from './screens/admin/UserListScreen.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    {/* user */}
      <Route path='/' element={<App/>}>
        <Route index={true} path='/' element={<HomeScreen/>}/>
        <Route path='/login' element={<LoginScreen/>}/>
        <Route path='/register' element={<RegisterScreen/>}/>

        <Route path='' element={<PrivateRoute/>}>
          <Route path='/edit-profile' element={<ProfileScreen/>}/>
          <Route path='/profile' element={<ProfileCard/>}/>
        </Route>
      </Route>

      {/* admin */}
      <Route path='/admin' element={<AdminLogin/>}/>
      <Route path='' element={<AdminPrivateRoute/>}>
        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path='/admin/users' element={<UserListScreen/>}/>
      </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={ router } />
    </React.StrictMode>
  </Provider>
)
