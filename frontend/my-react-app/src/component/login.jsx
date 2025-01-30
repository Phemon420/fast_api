import React,{useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
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
      
      const response = await axios.post(`${BASE_URL}login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
      // Assuming the token is in response.data.token
      const token = response.data.token;
    
      if (token) {
        // Create a cookie that stores the token
        document.cookie = `token=${token}; path=/; secure; `;
        console.log('Cookie created successfully.');
        console.log(document.cookie);
      } else {
        console.error('Token not found in response.');
      }
    } catch(error){
      console.log(error);
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      Login
      <Box>
        <TextField id="email" label="Email" type="email" variant="outlined" value={formData.email}
          onChange={handleChange}/>
      </Box>
      <Box>
        <TextField id="password" label="Password" type="password" variant="outlined" value={formData.password}
          onChange={handleChange}/>
      </Box>
      <Box>
        <Button variant="contained" onClick={handler}>LogIn</Button>
      </Box>
    </div>
  )
}

export default Login;