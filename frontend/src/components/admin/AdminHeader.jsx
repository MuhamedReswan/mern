import { Navbar , Nav , Container, NavDropdown , Badge } from 'react-bootstrap'
import { FaSignOutAlt} from 'react-icons/fa'
import { useSelector , useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminLogoutMutation } from '../../slices/admin/adminApiSlice'

import { logout } from '../../slices/admin/adminAuthSlice'

const AdminHeader = () =>
{
    const { adminInfo } = useSelector((state) => state.adminAuth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [logoutApiCall] = useAdminLogoutMutation()
    const logoutHandler = async () =>
    {
        try
        {
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate('/admin')
        }
        catch(err)
        {
            console.log(err);
        }
    }

    return(
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <ToastContainer/>
                <Container>
                    <LinkContainer to='/admin/home'>
                        <Navbar.Brand>Admin</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            <NavDropdown title={adminInfo.name} id='username'>
                                <NavDropdown.Item onClick={logoutHandler}>
                                <FaSignOutAlt/>Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default AdminHeader;