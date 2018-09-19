'use strict'

import React from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export default class extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //
  //   }
  // }
  state = {
    password: '',
    showPassword: false
  }
  
handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  
  render() {
    return (
      <div style={{ marginRight: 32 }}>
        <Grid container spacing={32} direction="column" style={{ maxWidth: 480, margin: '32px auto' }}>
          <Grid item>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor="adornment-password">Password</InputLabel>
              <Input
                id="adornment-password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                onChange={this.handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}>
                      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item>
            <Button color="primary" variant="contained" style={{ display: 'block', width: '100%' }}>
              Sign In
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}