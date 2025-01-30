import React from 'react'
import { Link } from 'react-router-dom'

export default function Navigate() {
  return (
    <div>
      <Link to='/register'>Register</Link>
      <hr></hr>
      <Link to='/login'>Login</Link>
      <hr></hr>
      <Link to='/api'>api</Link>
      <hr></hr>
    </div>
  )
}
