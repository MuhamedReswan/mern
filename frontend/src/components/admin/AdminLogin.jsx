import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import Loader from '../../components/user/Loader.jsx'
import FormContainer from '../../components/user/FormContainer'
import { useAdminLoginMutation } from '../../slices/admin/adminApiSlice.js'
import { setCredentials } from '../../slices/admin/adminAuthSlice.js'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { adminInfo } = useSelector((state) => state.adminAuth)

  const [login, { isLoading }] = useAdminLoginMutation()


  useEffect(() => {
    if (adminInfo) navigate('/admin/home')
  }, [navigate, adminInfo])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setCredentials({ ...res }))
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <div className="position-relative">
      {isLoading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <FormContainer>
        <h1 className="text-white">Admin Login</h1>
        <ToastContainer/>
        <Form onSubmit={submitHandler} className="bg-dark text-white p-4 rounded">
          <Form.Group className="my-2" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary text-white"
            />
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary text-white"
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Sign In
          </Button>

        </Form>
      </FormContainer>
    </div>
  )
}

export default AdminLogin
