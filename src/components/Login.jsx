import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Container, FormControl, TextField } from '@mui/material'
import AuthService from '../services/authService'
import { setSessionToken } from '../utils/auth'

function Login() {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    AuthService.login(userName, password).then(resp => {
    // console.log('resp=',resp.data)
    let data = resp.data;
        setSessionToken(data.data);
        navigate('/')
    })
    // console.log('test=',userName,' p=',password)
    .catch(error => {
        if (error.response && error.response.status) {
          alert(error.response.data.data.error[0].message)
          console.log('Error=',error.response.data.data)
        }
    });

    // checkSessionToken && redirect('/')
  }
  const handleChange = (e) => {
    // console.log('test=',userName,' p=',password)
    e.target.name === 'username' && setUserName(e.target.value)
    e.target.name === 'current-password' && setPassword(e.target.value)

  }
  return (
    <React.Fragment>
      <h1>LOGIN</h1>
      <Container maxWidth="sm">
          <form onSubmit={e => handleSubmit(e)} autoComplete='off'>
          <FormControl sx={{ m: 1, width: '50%' }} variant="outlined">
            <TextField id="username" label="User Name" variant="outlined" name="username" required onChange={e => handleChange(e)}/>
          </FormControl>
          <FormControl sx={{ m: 1, width: '50%' }} variant="outlined">
            <TextField id="current-password" label="Password" variant="outlined" name="current-password" required onChange={e => handleChange(e)} type='password'/>
          </FormControl>
          <FormControl sx={{ m: 1, width: '50%' }} variant="outlined">
          <Button variant="contained" type='submit'>Login</Button>
          </FormControl>

          </form>
      </Container>
    </React.Fragment>
  )
}

export default Login