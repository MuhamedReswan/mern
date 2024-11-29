import { Spinner } from "react-bootstrap"

import React from 'react'

const Loader = () => {
  return (
    <Spinner
    animation="border"
    variant="light"
    role="status"
    style={{
        width : '65px',
        height : '65px',
        margin : 'auto',
        dispaly : 'block'
    }}
    ></Spinner>
  )
}

export default Loader