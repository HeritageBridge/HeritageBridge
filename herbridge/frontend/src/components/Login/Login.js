'use strict'

import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export default class extends React.Component {
  static defaultProps = {
    error: null,
    isLoading: false,
    onSubmit: (password) => {}
  }
  
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
  
    handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSubmit()
    }
  };
  
  handleSubmit = () => {
    const {password} = this.state
    this.props.onSubmit(password)
  }
  
  getPasswordForm = () => {
    const {password, showPassword} = this.state
    const {error, isLoading} = this.props
    return (
      <FormControl
        disabled={isLoading}
        required
        error={error !== null}
        style={{ width: '100%' }}>
        <InputLabel
          htmlFor="adornment-password">
          Password
        </InputLabel>
        <Input
          id="adornment-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange('password')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                disabled={isLoading}
                aria-label="Toggle password visibility"
                onClick={this.handleClickShowPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        { error !== null ? <FormHelperText>{error}</FormHelperText> : <div/> }
      </FormControl>
    )
  }
  
  render() {
    const {isLoading} = this.props
    return (
      <div style={{ marginRight: 32 }}>
        <Grid
          container
          spacing={32}
          direction="column"
          style={{ maxWidth: 480, margin: '32px auto' }}>
          <Grid item>
            { this.getPasswordForm() }
          </Grid>
          <Grid item>
            <Button
              disabled={isLoading}
              onClick={this.handleSubmit}
              color="primary"
              variant="contained"
              style={{ display: 'block', width: '100%' }}>
              Sign In
              { isLoading ?
                <CircularProgress
                  size={24}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -12,
                    marginLeft: -12,
                  }}/> : '' }
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}