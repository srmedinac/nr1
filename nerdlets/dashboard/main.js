import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Stack, StackItem, FunnelChart, NrqlQuery, StackedBarChart, BillboardChart, ChartGroup, AreaChart, BarChart, LineChart, TableChart, PieChart, Button, TextField, Modal, Toast } from 'nr1';

export default class MyNerdlet extends React.Component {
    static propTypes = {
        launcherUrlState: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.accountId = 1966971;
        this.state = {
            value: '',
            facet: '',
            hideModal: true,
            showToast: false,
            toastType: 'critical',
            toastTitle: 'Conversion rate warning',
            toastDisplay: ''
        }
        //console.debug("nerdlet props", this.props);

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.confirmFacet = this.confirmFacet.bind(this);
        this.rejectFacet = this.rejectFacet.bind(this);
        this.popToast = this.popToast.bind(this);


    }

    handleChange(e) {
        this.setState({ value: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({ hideModal: false })
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

    popToast(toastType, toastTitle, toastDisplay) {
        this.setState({ showToast: true, toastType, toastTitle, toastDisplay });
    }


    render() {
        const { duration } = this.props.launcherUrlState.timeRange;
        const since = ` SINCE ${duration / 1000 / 60} MINUTES AGO `;
        const errors = `SELECT count(error) FROM Transaction TIMESERIES`;
        const throughput = `SELECT count(*) as 'throughput' FROM Transaction TIMESERIES`;
        const transaction_apdex_by_appname = `SELECT count(*) as 'transaction', apdex(duration) as 'apdex' FROM Transaction limit 25 FACET appName`;
        const plans_funnel = `SELECT funnel(session, where pageUrl='http://webportal.telco.nrdemo-sandbox.com/index.html' as 'Home', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/browse/plans' as 'Plan Catalog', where pageUrl like 'http://webportal.telco.nrdemo-sandbox.com/browse/plans/%' as 'Plan Details', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/login.jsp'  as 'Login', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/shoppingcart' as 'Shopping Cart', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/checkout' as 'Checkout') from PageView`;
        const phones_funnel = `SELECT funnel(session, where pageUrl='http://webportal.telco.nrdemo-sandbox.com/index.html' as 'Home', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/browse/phones' as 'Phone Catalog', where pageUrl like 'http://webportal.telco.nrdemo-sandbox.com/browse/phones/%' as 'Phone Overview', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/login.jsp'  as 'Login',  where pageUrl='http://webportal.telco.nrdemo-sandbox.com/shoppingcart' as 'Shopping Cart', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/checkout' as 'Checkout') from PageView`;
        const customers_by_country = `SELECT count(*) FROM PageView` + since + `FACET countryCode`;
        const live_sessions = `SELECT Count(session) from PageView TIMESERIES 1 MINUTE `;
        const browser_usage = "SELECT SUM(browserPageViewCount) as Pageviews FROM NrDailyUsage WHERE `productLine` = 'Browser' AND `usageType` = 'Application' AND `isPrimaryApp` = 'true' FACET monthOf(timestamp) SINCE 12 months ago LIMIT 100"
        const least_sold_query = "From PageView SELECT uniques(pageUrl) WHERE appName ='WebPortal' AND pageUrl LIKE 'http://telco.nrdemo-sandbox.com/browse/phones/%' since 30 minutes ago"
        const chartHeight = 250;

        return <React.Fragment>
            {this.state.showToast &&
                <Toast
                    type={this.state.toastType}
                    title={this.state.toastTitle}
                    description={this.state.toastDisplay}
                    onHideEnd={() => { this.setState({ showToast: false }) }}
                />
            }
            <Grid>
                <GridItem columnStart={1} columnEnd={12}>
                    <h1><b>Management Dashboard</b></h1>
                </GridItem>
                <GridItem columnStart={1} columnEnd={6}>
                    <h4>Transactions by Application</h4>
                    <PieChart
                        style={{ height: `${chartHeight}px` }}
                        className="chart"
                        query={transaction_apdex_by_appname + since + this.state.facet}
                        accountId={this.accountId}
                    />
                </GridItem>
                <GridItem columnStart={7} columnEnd={12}>
                    <h4>Customers by Country</h4>
                    <PieChart
                        style={{ height: `${chartHeight}px` }}
                        className="chart"
                        query={customers_by_country}
                        accountId={this.accountId}
                    />
                </GridItem>
                <GridItem columnStart={1} columnEnd={6}>
                    <h4>Customer Journey <b>(Plans)</b></h4>
                    <FunnelChart
                        style={{ height: `${chartHeight}px` }}
                        className="chart"
                        accountId={this.accountId}
                        query={plans_funnel + since} />
                </GridItem>
                <GridItem columnStart={7} columnEnd={12}>

                    <h4>Customer Journey <b>(Phones)</b></h4>
                    <FunnelChart
                        style={{ height: `${chartHeight}px` }}
                        className="chart"
                        accountId={this.accountId}
                        query={phones_funnel + since} />
                </GridItem>
                <GridItem columnStart={1} columnEnd={6}>
                    <h4>Live Application Sessions</h4>
                    <BillboardChart
                        style={{ height: `${chartHeight}px` }}
                        className="chart"
                        accountId={this.accountId}
                        query={live_sessions} />

                </GridItem>
                <GridItem columnStart={7} columnEnd={12}>
                    <h4>Browser Yearly Usage</h4>
                    <StackedBarChart
                        style={{ height: `${chartHeight}px` }}
                        className="chart"
                        accountId={this.accountId}
                        query={browser_usage} />

                </GridItem>
                <GridItem columnStart={1} columnEnd={6}>
                    <h4>Conversion rate</h4>
                    <NrqlQuery accountId={this.accountId} query={phones_funnel + since}>

                        {({ data }) => {
                            if (data) {
                                var result = ((data[0].data)[0].Home / (data[0].data)[0].Checkout);
                                console.debug(result);
                                var conversion_rate = result;
                                if (result >= 9) {
                                }
                            }
                            const chart_data = [{
                                metadata: {
                                    id: 'conversion-rate-phones',
                                    name: '\% of Phones',
                                    viz: 'main',
                                    units_data: {
                                        y: "percent"
                                    }
                                },
                                data: [
                                    { y: result }
                                ],
                            }]
                            return <BillboardChart className="chart" style={{ height: `200px` }} fullWidth fullHeight data={chart_data} />;
                        }}
                    </NrqlQuery>
                </GridItem>
                <GridItem columnStart={7} columnEnd={12}>
                    <h4>Conversion rate</h4>
                    <NrqlQuery accountId={this.accountId} query={plans_funnel + since}>

                        {({ data }) => {
                            if (data) {
                                var result = ((data[0].data)[0].Home / (data[0].data)[0].Checkout);
                                var chart_data = [];
                                data.forEach(({ metadata }) => metadata.color = '#FF0000');
                                console.debug(result);
                            }
                            chart_data = [{
                                metadata: {
                                    id: 'conversion-rate-phones',
                                    name: '\% of Plans',
                                    color: '#FF0000',
                                    viz: 'main',
                                    units_data: {
                                        y: "percent"
                                    }
                                },
                                data: [
                                    { y: result }
                                ],
                            }]
                            return <BillboardChart className="chart" style={{ height: `200px`, color: "red" }} fullWidth fullHeight data={chart_data} />;
                        }}
                    </NrqlQuery>
                </GridItem>
                <GridItem columnStart={1} columnEnd={6}>
                    <h4>These items could use a promo</h4>
                    <TableChart
                        style={{ height: `${chartHeight}px` }}
                        className="chart"
                        style={{ height: `200px` }}
                        fullWidth
                        fullHeight
                        query={least_sold_query}
                        accountId={this.accountId} />
                </GridItem>

            </Grid>
        </React.Fragment >
    }
}