import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Stack, StackItem, FunnelChart, ChartGroup, AreaChart, BarChart, LineChart, TableChart, PieChart, Button, TextField, Modal, Toast } from 'nr1';

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
            toastType: 'normal',
            toastTitle: '',
            toastDisplay: ''
        }
        console.debug("nerdlet props", this.props);

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
        const transaction_apdex_by_appname = `SELECT count(*) as 'transaction', apdex(duration) as 'apdex' FROM Transaction limit 25`;
        const plans_funnel = `SELECT funnel(session, where pageUrl='http://webportal.telco.nrdemo-sandbox.com/index.html' as 'Home', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/browse/plans' as 'Plan Catalog', where pageUrl like 'http://webportal.telco.nrdemo-sandbox.com/browse/plans/%' as 'Plan Details', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/login.jsp'  as 'Login', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/shoppingcart' as 'Shopping Cart', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/checkout' as 'Checkout') from PageView`
        const phones_funnel = `SELECT funnel(session, where pageUrl='http://webportal.telco.nrdemo-sandbox.com/index.html' as 'Home', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/browse/phones' as 'Phone Catalog', where pageUrl like 'http://webportal.telco.nrdemo-sandbox.com/browse/phones/%' as 'Phone Overview', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/login.jsp'  as 'Login',  where pageUrl='http://webportal.telco.nrdemo-sandbox.com/shoppingcart' as 'Shopping Cart', where pageUrl='http://webportal.telco.nrdemo-sandbox.com/checkout' as 'Checkout') from PageView`

        return <React.Fragment>
            {this.state.showToast &&
                <Toast
                    type={this.state.toastType}
                    title={this.state.toastTitle}
                    description={this.state.toastDisplay}
                    onHideEnd={() => { this.setState({ showToast: false }) }}
                />
            }
            <ChartGroup>
                <Grid className="grid">
                    <GridItem
                        columnSpan={12}>
                        <form onSubmit={this.onSubmit}>
                            <Stack fullWidth>
                                
                                <StackItem grow={true}>
                                    <TextField multiline spacingType={[TextField.SPACING_TYPE.LARGE]}
                                        value={this.state.value}
                                        onChange={this.handleChange}
                                    />
                                </StackItem>
                                <StackItem>
                                    <Button type={Button.TYPE.PRIMARY}>Facet</Button>
                                </StackItem>
                            </Stack>
                            <Modal
                                hidden={this.state.hideModal}
                                onClose={() => { this.setState({ facet: '', value: '', hideModal: true }) }}
                            >
                                <Stack>
                                    <StackItem>
                                        <h1 className="Modal-headline">Are you sure you want to apply this facet?</h1>
                                        <p className="facet-value">Facet by: <strong>{this.state.value}</strong></p>
                                        <Stack>
                                            <StackItem>
                                                <Button
                                                    onClick={this.rejectFacet}
                                                >No</Button>
                                            </StackItem>
                                            <StackItem>
                                                <Button
                                                    onClick={this.confirmFacet}
                                                >Yes</Button>
                                            </StackItem>
                                        </Stack>
                                    </StackItem>
                                </Stack>
                            </Modal>
                        </form>
                    </GridItem>
                    <GridItem
                        columnSpan={6}>
                            
                        <Stack
                            fullWidth
                            className="side-col"
                            gapType={Stack.GAP_TYPE.LOOSE}
                            directionType={Stack.DIRECTION_TYPE.VERTICAL}>
                            <StackItem>
                            <h4>Transactions by Application</h4>
                                <PieChart
                                    className="chart"
                                    query={transaction_apdex_by_appname + since + this.state.facet}
                                    accountId={this.accountId}
                                />
                            </StackItem>
                            <StackItem>
                            <h4>Customer Journey (Plans)</h4>
                                <FunnelChart accountId={this.accountId} query={plans_funnel + since} />
                            </StackItem>
                        </Stack>
                    </GridItem>
                    <GridItem columnSpan={6}>
                        <Stack
                            fullWidth
                            className="side-col"
                            gapType={Stack.GAP_TYPE.LOOSE}
                            directionType={Stack.DIRECTION_TYPE.HORIZONTAL}>
                            <StackItem>
                            <h4>Customer Journey (Phones)</h4>
                                <FunnelChart accountId={this.accountId} query={phones_funnel + since} />
                            </StackItem>
                            </Stack>
                    </GridItem>
                </Grid>
            </ChartGroup >
        </React.Fragment >
    }
}
//grid example
/*<Grid>
           {gridItems}
           <GridItem
               columnSpan={6}
               style={{backgroundColor: "#FF0000"}}
           >
               Six Column Grid Item
           </GridItem>
           <GridItem
               columnSpan={4}
               style={{backgroundColor: "#00FF00"}}
           >
               Four Column Grid Item
           </GridItem>
       </Grid>*/