import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, AutoSizer, JsonChart, BillboardChart, AreaChart, BarChart, LineChart, TableChart, PieChart, Button, TextField, Modal, Toast } from 'nr1';

export default class DevNerdlet extends React.Component {
    static propTypes = {
        launcherUrlState: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.accountId = 1966971;
        this.state = {
            value: "SELECT count(*) as 'throughput' FROM Transaction TIMESERIES SINCE last week",
            value2: "",
            facet: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.confirmFacet = this.confirmFacet.bind(this);
        this.rejectFacet = this.rejectFacet.bind(this);
    }

    handleChange(e) {
        this.setState({ value: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({ hideModal: true })
    }

    confirmFacet(e) {
        e.preventDefault();
        this.popToast('normal', 'Facet Updated', `The FACET ${this.state.value} has been added to your query.`)
        this.setState({ facet: 'FACET ' + this.state.value, hideModal: true });
    }

    rejectFacet(e) {
        e.preventDefault();
        this.popToast('critical', 'Facet Rejected', `The FACET ${this.state.value} has been rejected.`)
        this.setState({ facet: '', value: '', hideModal: true });
    }




    render() {
        const { duration } = this.props.launcherUrlState.timeRange;
        const since = ` SINCE ${duration / 1000 / 60} MINUTES AGO `;
        const transaction_apdex_by_appname = `SELECT count(*) as 'transaction', apdex(duration) as 'apdex' FROM Transaction limit 25 FACET appName`;
        const infra_query = "SELECT average(cpuPercent) FROM SystemSample TIMESERIES FACET `entityId` WHERE (`entityId` in ('3843929980901582101', '9168366137134707439', '135745548140814589', '7026128218418353941', '1221567216879315335')) LIMIT 100"
        const infra_query_load = "SELECT average(loadAverageFiveMinute) FROM SystemSample TIMESERIES FACET `entityId` WHERE (`entityId` in ('3843929980901582101', '9168366137134707439', '135745548140814589', '7026128218418353941', '1221567216879315335')) LIMIT 100"
        const infra_query_mem = "SELECT average(memoryUsedBytes/memoryTotalBytes*100) FROM SystemSample TIMESERIES FACET `entityId` WHERE (`entityId` in ('3843929980901582101', '9168366137134707439', '135745548140814589', '7026128218418353941', '1221567216879315335')) LIMIT 100"
        return <React.Fragment> <AutoSizer>
            {({ height, width }) => (
                <Grid>
                    <GridItem columnStart={1} columnEnd={12}>
                        <h1><b>DevOps Dashboard</b></h1>
                    </GridItem>
                    <GridItem columnStart={1} columnEnd={12}>
                        <TextField label='Lets get querying' multiline spacingType={[TextField.SPACING_TYPE.LARGE]}
                            value={this.state.value}
                            onChange={this.handleChange}
                        />
                    </GridItem>
                    <GridItem columnStart={1} columnEnd={6}>
                        <AreaChart
                            style={{ height: `${height - 300}px` }}
                            query={this.state.value}
                            accountId={this.accountId}
                            className="chart"
                            onClickLine={(line) => {
                                //console.debug(line); //eslint-disable-line
                            }}
                        />
                    </GridItem>
                    <GridItem columnStart={7} columnEnd={12}>
                        <JsonChart
                            style={{ height: `${height - 300}px` }}
                            query={this.state.value}
                            accountId={this.accountId}
                            className="chart" //eslint-disable-line
                        />
                    </GridItem>
                    <GridItem columnStart={1} columnEnd={6}>
                        <h4>Transactions by Application</h4>
                        <PieChart
                            style={{ height: `${height - 300}px` }}
                            className="chart"
                            query={transaction_apdex_by_appname + since + this.state.facet}
                            accountId={this.accountId}
                        />
                    </GridItem>
                    <GridItem columnStart={7} columnEnd={12}>
                        <h4>CPU %</h4>
                        <LineChart
                            style={{ height: `${height - 300}px` }}
                            className="chart"
                            accountId={this.accountId}
                            query={infra_query + since} />
                    </GridItem>

                    <GridItem columnStart={1} columnEnd={6}>
                        <h4>Load Average </h4>
                        <BillboardChart
                            style={{ height: `${height - 300}px` }}
                            className="chart"
                            accountId={this.accountId}
                            query={infra_query_load + since} />

                    </GridItem>
                    <GridItem columnStart={7} columnEnd={12}>
                        <h4>Memory % </h4>
                        <LineChart
                            style={{ height: `${height - 300}px` }}
                            className="chart"
                            accountId={this.accountId}
                            query={infra_query_mem + since} />
                    </GridItem>
                </Grid>
            )}</AutoSizer>
        </React.Fragment >
    }
}