import React,{useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handler=async()=>{
    try {
      const BASE_URL='http://127.0.0.1:8000/';
      
      const response = await axios.post(`${BASE_URL}signup`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
    }
    catch(error){
      console.log(error);
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      Register
      <Box>
        <TextField id="email" label="Email" type="email" variant="outlined" value={formData.email}
          onChange={handleChange}/>
      </Box>
      <Box>
        <TextField id="first_name" label="First Name" type="text" variant="outlined" value={formData.first_name}
          onChange={handleChange}/>
      </Box>
      <Box>
        <TextField id="last_name" label="Last Name" type="text" variant="outlined" value={formData.last_name}
          onChange={handleChange}/>
      </Box>  
      <Box>
        <TextField id="password" label="Password" type="password" variant="outlined" value={formData.password}
          onChange={handleChange}/>
      </Box>
      <Box>
        <Button variant="contained" onClick={handler}>Register</Button>
      </Box>
    </div>
  )
}

export default Register;