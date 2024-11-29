import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../../components/user/FormContainer'
import { toast } from 'react-toastify'

import { setCredentials } from '../../slices/user/authSlice.js'
import { useRegisterMutation } from '../../slices/user/usersApiSlice.js'
import Loader from '../../components/user/Loader.jsx'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)

  const [register, { isLoading }] = useRegisterMutation()

  useEffect(() => {
    if (userInfo) navigate('/')
  }, [navigate, userInfo])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (
      !email.trim() ||
      !name.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Please fill all fields.");
    } else if (!email.endsWith("@gmail.com")) {
      toast.error("Email should end with @gmail.com.");
    } else if (name.trim().length < 3) {
      toast.error("Name should be at least 3 characters.");
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      toast.error("Name should only contain letters and spaces.");
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password)
    ) {
      toast.error(
        "Password must be at least 6 characters long and include at least one uppercase letter, one number, and one special character."
      );
    } else if (password !== confirmPassword) {
      toast.error("Confirm Passwords do not match.");
    } else {
      try {
        const res = await register({ name, email, password }).unwrap()
        dispatch(setCredentials({ ...res }))
        navigate('/')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
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
        <h1 className="text-white">Sign Up</h1>

        <Form onSubmit={submitHandler} className="bg-dark text-white rounded">
          <Form.Group className="my-2" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary text-white"
            />
          </Form.Group>

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

          <Form.Group className="my-2" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-secondary text-white"
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Sign Up
          </Button>

          <Row className="py-3">
            <Col>
              Already have an account? <Link to='/login' className="text-primary">Login</Link>
            </Col>
          </Row>
        </Form>
      </FormContainer>
    </div>
  )
}

export default RegisterScreen
