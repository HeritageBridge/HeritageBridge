import React from "react";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export default class TargetResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Paper>
                <div className="amal-target-resource" style={{ minHeight: 100, padding: 32 }}>
                    <Grid container spacing={16}>
                        <Grid item xs={6}>
                            <Typography variant="subheading">EAMENA Resources</Typography>
                        </Grid>
                        <Grid item xs={6} style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                            <img src="static/frontend/logo-eamena.svg" style={{ display: 'block', margin: '6px 0 0 auto' }} />
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        )
    }
}
