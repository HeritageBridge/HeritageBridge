import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import TargetResourceList from './TargetResourceList'
import LogoEamena from '../Svg/logo-eamena.svg'
import Svg from 'react-svg-inline'

export default class TargetResource extends React.Component {
  static defaultProps = {
    isLoading: false,
    onFilter: (filter) => {
    },
    onResourceSelected: (resource) => {
    },
    onResourceDeselected: (resource) => {
    },
    filter: '',
    resources: [],
    selectedResource: null,
  }

  constructor(props) {
    super(props);
  }

  handleResourceSearchChange = (event) => {
    this.setState({query: event.target.value})
    this.props.onFilter(event.target.value)
  };

  handleResourceSearchEnter = () => {
    this.props.onFilter(this.state.query)
  };

  handleResourceSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleResourceSearchEnter()
    }
  };

  handleResourceSelected = (resource) => {
    this.props.onResourceSelected(resource)
  };

  handleResourceDeselected = (resource) => {
    this.props.onResourceDeselected(resource)
  };

  getLoading = () => {
    return (
      <CircularProgress style={{
        display: 'block',
        margin: '32px auto'
      }}/>
    )
  }

  getEmptyState = () => {
    return (
      <div>
        <span style={{
          fontFamily: 'Roboto, Helvetica',
          display: 'block',
          margin: 32,
          textAlign: 'center',
          color: 'rgba(0,0,0,0.5)',
        }}>No resources found</span>
      </div>
    )
  }

  getResourceList = () => {
    return (
      <TargetResourceList
        resources={this.props.resources}
        onSelect={this.handleResourceSelected}
        onDeselect={this.handleResourceDeselected}
        selectedResource={this.props.selectedResource}
      />
    )
  }

  getMainContent = () => {
    const {resources} = this.props
    return (resources !== undefined && resources.length > 0) ? this.getResourceList() : this.getEmptyState()
  }

  render() {
    const {isLoading, filter} = this.props
    return (
      <Paper style={{margin: '0 auto'}}>
        <div className="amal-target-resource" style={{minHeight: 304, padding: 32}}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Typography variant="subheading">EAMENA Resources</Typography>
            </Grid>
            <Grid item xs={6} style={{display: 'table-cell', verticalAlign: 'middle'}}>
              <Svg svg={LogoEamena} style={{display: 'block', margin: '6px 0 0 auto', width: 69}}/>
            </Grid>
          </Grid>
          <Grid container spacing={8} direction="column" style={{marginTop: 16}}>
            <Grid item xs={12}>
              <TextField
                placeholder="EAMENA-XXXXXX"
                onChange={this.handleResourceSearchChange}
                onKeyPress={this.handleResourceSearchKeyPress}
                style={{width: '100%'}}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined/>
                    </InputAdornment>
                  ),
                }}
                value={filter}
              />
            </Grid>
            <Grid item xs={12}>
              {isLoading ? this.getLoading() : this.getMainContent()}
            </Grid>
          </Grid>
        </div>
      </Paper>
    )
  }
}
