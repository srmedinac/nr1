import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Stack, StackItem, ChartGroup, AreaChart, JsonChart, BarChart, LineChart, TableChart, PieChart, Button, TextField, Modal, Toast } from 'nr1';
// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class Insights extends React.Component {

    constructor(props) {
        super(props);
        this.accountId = 1966971;
        this.state = {
            value: "SELECT count(*) as 'throughput' FROM Transaction TIMESERIES SINCE last week",
            
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ value: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({ hideModal: true })
    }

    render() {
        return <React.Fragment>
            <ChartGroup>
                <form onSubmit={this.onSubmit}>
                    <Stack
                        fullWidth
                        gapType={Stack.GAP_TYPE.LOOSE}>
                        <StackItem grow={true}>
                            <TextField label='Lets get querying' multiline spacingType={[TextField.SPACING_TYPE.LARGE]}
                                value={this.state.value}
                                onChange={this.handleChange}
                            />
                        </StackItem>
                    </Stack>
                </form>
                <Grid className="grid">
                    <GridItem
                        columnSpan={6}>
                        <Stack
                            fullWidth
                            gapType={Stack.GAP_TYPE.LOOSE}>
                            <StackItem grow>
                                <AreaChart
                                    query={this.state.value}
                                    accountId={this.accountId}
                                    className="chart"
                                    onClickLine={(line) => {
                                        console.debug(line); //eslint-disable-line
                                    }}
                                />
                            </StackItem>
                        </Stack>
                    </GridItem>
                    <GridItem
                        columnSpan={6}>
                        <Stack
                            fullWidth
                            gapType={Stack.GAP_TYPE.LOOSE}>
                            <StackItem grow>
                                <JsonChart
                                    query={this.state.value}
                                    accountId={this.accountId}
                                    className="chart" //eslint-disable-line

                                />
                            </StackItem>
                        </Stack>
                    </GridItem>
                </Grid>
            </ChartGroup>
        </React.Fragment>
    }
}

