import { Container, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector } from 'react-redux'
 

const AdminHero = () => {

  const { adminInfo } = useSelector((state) => state.adminAuth)

  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-dark w-75'>
          <h1 className='text-center mb-4 text-white'>Welcome Admin {adminInfo?.name}👋</h1>
          <p className='text-center mb-4 text-white '>
          Greetings and welcome to my React Application, We are delighted to see you as a part of our community.
          </p>
          <p className='text-center mb-4 text-white '>
            You are free to manage the Users , You can edit / delete existing users as well as you can add new user!! . 
          </p>
          <div className='d-flex'>
            <LinkContainer to='/admin/users'>
                <Button variant='primary' className='me-3'>
                    Manage Users
                </Button>
                </LinkContainer>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default AdminHero;