import React from "react";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchOutlined from '@material-ui/icons/SearchOutlined';

export default class TargetResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: ''
        };
    }

    handleResourceSearchChange = (event) => {
        this.setState({ query: event.target.value })
    };

    handleResourceSearchEnter = () => {
        console.log('enter', this.state.query)
    };

    handleResourceSearchKeyPress = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.handleResourceSearchEnter()
        }
    };

    render() {
        return (
            <Paper style={{ maxWidth: 480, margin: '0 auto' }}>
                <div className="amal-target-resource" style={{ minHeight: 100, padding: 32 }}>
                    <Grid container spacing={0} direction="column">
                        <Grid item xs={12}>
                            <Grid container spacing={16}>
                                <Grid item xs={6}>
                                    <Typography variant="subheading">EAMENA Resources</Typography>
                                </Grid>
                                <Grid item xs={6} style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                    <img src="static/frontend/logo-eamena.svg" style={{ display: 'block', margin: '6px 0 0 auto' }} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Resource No." placeholder="EAMENA-XXXXXX" style={{ width: '100%' }} InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlined/>
                                    </InputAdornment>
                                ),
                            }} onKeyPress={this.handleResourceSearchKeyPress} onChange={this.handleResourceSearchChange}/>
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        )
    }
}
