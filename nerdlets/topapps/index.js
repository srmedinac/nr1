import React from 'react';
import { BillboardChart, TableChart, Stack, StackItem, ChartGroup, LineChart, ScatterChart, Button, navigation, nerdlet, PlatformStateContext, NerdletStateContext, NrqlQuery, Grid, GridItem } from 'nr1';


// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class Topapps extends React.Component {

    constructor(props) {
        super(props);
        this.accountId = 1966971;
        this.openEntity = this.openEntity.bind(this);
        this.state = {
            entityGuid: null,
            appName: null
        };
        //console.debug("Nerdlet constructor", this); //eslint-disable-line
    }

    setApplication(inAppId, inAppName) {
        this.setState({ entityGuid: inAppId, appName: inAppName });
        this.openEntity()
    }

    openEntity(entityGuid) {
        //const { entityGuid, appName } = this.state;
        //nerdlet.setUrlState({ entityGuid, appName });
        console.log('EntityGuid', entityGuid);
        navigation.openStackedEntity('MTk2Njk3MXxBUE18QVBQTElDQVRJT058MTMyNDM1OTcz'); //openStackedEntity for popup
    }



    render() {
        const { entityGuid, appName } = this.state;
        const bilboarderrors = `SELECT count(error) as 'error' FROM Transaction TIMESERIES AUTO FACET appName`;
        const bilboardtrans = `SELECT count(*) as 'transactions' FROM Transaction TIMESERIES AUTO FACET appName`;

        return (
            <PlatformStateContext.Consumer>
                {(platformUrlState) => {
                    //console.debug here for learning purposes
                    const { duration } = platformUrlState.timeRange;
                    const since = ` SINCE ${duration / 60 / 1000} MINUTES AGO`;
                    return (<Grid>
                        <GridItem >
                            <h2>Top 10 Apps With Errors</h2>
                            <NrqlQuery accountId={this.accountId} query={bilboarderrors + since}>

                                {({ data }) => {
                                    //console.log('dataError', data)
                                    var resultApp1 = [];
                                    var metaApp1 = {};
                                    var resultApp2 = [];
                                    var metaApp2 = {};
                                    var resultApp3 = [];
                                    var metaApp3 = {};
                                    var resultApp4 = [];
                                    var metaApp4 = {};
                                    var resultApp5 = [];
                                    var metaApp5 = {};
                                    var resultApp6 = [];
                                    var metaApp6 = {};
                                    var resultApp7 = [];
                                    var metaApp7 = {};
                                    var resultApp8 = [];
                                    var metaApp8 = {};
                                    var resultApp9 = [];
                                    var metaApp9 = {};
                                    var resultApp10 = [];
                                    var metaApp10 = {};
                                    var resultApp11 = [];
                                    var metaApp11 = {};
                                    if (data) {
                                        //var result = ((data[0].data)[0].Home / (data[0].data)[0].Checkout);
                                        resultApp1 = ((data[0].data)[0].y / (data[0].data)[29].y);
                                        metaApp1 = data[0].metadata;
                                        //console.debug(resultApp1);
                                        //console.debug(metaApp1);
                                        resultApp2 = ((data[1].data)[0].y / (data[1].data)[29].y);
                                        metaApp2 = data[1].metadata;
                                        resultApp3 = ((data[2].data)[0].y / (data[2].data)[29].y);
                                        metaApp3 = data[2].metadata;
                                        resultApp4 = ((data[3].data)[0].y / (data[3].data)[29].y);
                                        metaApp4 = data[3].metadata;
                                        resultApp5 = ((data[4].data)[0].y / (data[4].data)[29].y);
                                        metaApp5 = data[4].metadata;
                                        resultApp6 = ((data[5].data)[0].y / (data[5].data)[29].y);
                                        metaApp6 = data[5].metadata;
                                        resultApp7 = ((data[6].data)[0].y / (data[6].data)[29].y);
                                        metaApp7 = data[6].metadata;
                                        resultApp8 = ((data[7].data)[0].y / (data[7].data)[29].y);
                                        metaApp8 = data[7].metadata;
                                        resultApp9 = ((data[8].data)[0].y / (data[8].data)[29].y);
                                        metaApp9 = data[8].metadata;
                                        resultApp10 = ((data[9].data)[0].y / (data[9].data)[29].y);
                                        metaApp10 = data[9].metadata;
                                        resultApp11 = ((data[10].data)[0].y / (data[10].data)[29].y);
                                        metaApp11 = data[10].metadata;
                                    }
                                    const chart_dataApp1 = [{
                                        metadata: metaApp1,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp1 }
                                        ],
                                    }]

                                    const chart_dataApp2 = [{
                                        metadata: metaApp2,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp2 }
                                        ],
                                    }]

                                    const chart_dataApp3 = [{
                                        metadata: metaApp3,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp3 }
                                        ],
                                    }]

                                    const chart_dataApp4 = [{
                                        metadata: metaApp4,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp4 }
                                        ],
                                    }]

                                    const chart_dataApp5 = [{
                                        metadata: metaApp5,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp5 }
                                        ],
                                    }]

                                    const chart_dataApp6 = [{
                                        metadata: metaApp6,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp6 }
                                        ],
                                    }]

                                    const chart_dataApp7 = [{
                                        metadata: metaApp7,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp7 }
                                        ],
                                    }]

                                    const chart_dataApp8 = [{
                                        metadata: metaApp8,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp8 }
                                        ],
                                    }]

                                    const chart_dataApp9 = [{
                                        metadata: metaApp9,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp9 }
                                        ],
                                    }]

                                    const chart_dataApp10 = [{
                                        metadata: metaApp10,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp10 }
                                        ],
                                    }]

                                    const chart_dataApp11 = [{
                                        metadata: metaApp11,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp11 }
                                        ],
                                    }]
                                    return <Grid >
                                        <GridItem columnStart={1} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp1} onClickBillboard={() => this.openEntity(metaApp1.id)} />
                                        </GridItem>
                                        <GridItem columnStart={2} columnEnd={2}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp2} />
                                        </GridItem>
                                        <GridItem columnStart={1} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp3} />
                                        </GridItem>
                                        <GridItem columnStart={2} columnEnd={2}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp4} />
                                        </GridItem>
                                        <GridItem columnStart={1} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp5} />
                                        </GridItem>
                                        <GridItem columnStart={2} columnEnd={2}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp6} />
                                        </GridItem>
                                        <GridItem columnStart={1} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp7} />
                                        </GridItem>
                                        <GridItem columnStart={2} columnEnd={2}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp8} />
                                        </GridItem>
                                        <GridItem columnStart={1} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp9} />
                                        </GridItem>
                                        <GridItem columnStart={2} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp10} />
                                        </GridItem>
                                    </Grid>
                                }}
                            </NrqlQuery>
                        </GridItem>
                        <GridItem >
                            <h2>Top 10 Apps Transaction Load</h2>
                            <NrqlQuery accountId={this.accountId} query={bilboardtrans + since}>

                                {({ data }) => {
                                    //console.log('dataTotal', data)
                                    var resultApp1 = [];
                                    var metaApp1 = {};
                                    var resultApp2 = [];
                                    var metaApp2 = {};
                                    var resultApp3 = [];
                                    var metaApp3 = {};
                                    var resultApp4 = [];
                                    var metaApp4 = {};
                                    var resultApp5 = [];
                                    var metaApp5 = {};
                                    var resultApp6 = [];
                                    var metaApp6 = {};
                                    var resultApp7 = [];
                                    var metaApp7 = {};
                                    var resultApp8 = [];
                                    var metaApp8 = {};
                                    var resultApp9 = [];
                                    var metaApp9 = {};
                                    var resultApp10 = [];
                                    var metaApp10 = {};
                                    var resultApp11 = [];
                                    var metaApp11 = {};
                                    if (data) {
                                        //var result = ((data[0].data)[0].Home / (data[0].data)[0].Checkout);
                                        resultApp1 = ((data[0].data)[0].y / (data[0].data)[29].y);
                                        metaApp1 = data[0].metadata;
                                        //console.debug(resultApp1);
                                        //console.debug(meta);
                                        resultApp2 = ((data[1].data)[0].y / (data[1].data)[29].y);
                                        metaApp2 = data[1].metadata;
                                        resultApp3 = ((data[2].data)[0].y / (data[2].data)[29].y);
                                        metaApp3 = data[2].metadata;
                                        resultApp4 = ((data[3].data)[0].y / (data[3].data)[29].y);
                                        metaApp4 = data[3].metadata;
                                        resultApp5 = ((data[4].data)[0].y / (data[4].data)[29].y);
                                        metaApp5 = data[4].metadata;
                                        resultApp6 = ((data[5].data)[0].y / (data[5].data)[29].y);
                                        metaApp6 = data[5].metadata;
                                        resultApp7 = ((data[6].data)[0].y / (data[6].data)[29].y);
                                        metaApp7 = data[6].metadata;
                                        resultApp8 = ((data[7].data)[0].y / (data[7].data)[29].y);
                                        metaApp8 = data[7].metadata;
                                        resultApp9 = ((data[8].data)[0].y / (data[8].data)[29].y);
                                        metaApp9 = data[8].metadata;
                                        resultApp10 = ((data[9].data)[0].y / (data[9].data)[29].y);
                                        metaApp10 = data[9].metadata;
                                        resultApp11 = ((data[10].data)[0].y / (data[10].data)[29].y);
                                        metaApp11 = data[10].metadata;
                                    }
                                    const chart_dataApp1 = [{
                                        metadata: metaApp1,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp1 }
                                        ],
                                    }]

                                    const chart_dataApp2 = [{
                                        metadata: metaApp2,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp2 }
                                        ],
                                    }]

                                    const chart_dataApp3 = [{
                                        metadata: metaApp3,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp3 }
                                        ],
                                    }]

                                    const chart_dataApp4 = [{
                                        metadata: metaApp4,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp4 }
                                        ],
                                    }]

                                    const chart_dataApp5 = [{
                                        metadata: metaApp5,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp5 }
                                        ],
                                    }]

                                    const chart_dataApp6 = [{
                                        metadata: metaApp6,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp6 }
                                        ],
                                    }]

                                    const chart_dataApp7 = [{
                                        metadata: metaApp7,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp7 }
                                        ],
                                    }]

                                    const chart_dataApp8 = [{
                                        metadata: metaApp8,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp8 }
                                        ],
                                    }]

                                    const chart_dataApp9 = [{
                                        metadata: metaApp9,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp9 }
                                        ],
                                    }]

                                    const chart_dataApp10 = [{
                                        metadata: metaApp10,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp10 }
                                        ],
                                    }]

                                    const chart_dataApp11 = [{
                                        metadata: metaApp11,
                                        data: [
                                            { y: 2.0 },
                                            { y: resultApp11 }
                                        ],
                                    }]
                                    return <Grid >
                                        <GridItem columnStart={1} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp1} />
                                        </GridItem>
                                        <GridItem columnStart={2} columnEnd={2}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp2} />
                                        </GridItem>
                                        <GridItem columnStart={1} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp3} />
                                        </GridItem>
                                        <GridItem columnStart={2} columnEnd={2}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp4} />
                                        </GridItem>
                                        <GridItem columnStart={1} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp5} />
                                        </GridItem>
                                        <GridItem columnStart={2} columnEnd={2}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp6} />
                                        </GridItem>
                                        <GridItem columnStart={1} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp7} />
                                        </GridItem>
                                        <GridItem columnStart={2} columnEnd={2}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp8} />
                                        </GridItem>
                                        <GridItem columnStart={1} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp9} />
                                        </GridItem>
                                        <GridItem columnStart={2} columnEnd={1}>
                                            <BillboardChart className="chart" style={{ height: "200px" }} fullWidth fullHeight data={chart_dataApp10} />
                                        </GridItem>
                                    </Grid>
                                }}
                            </NrqlQuery>
                        </GridItem>
                    </Grid>);
                }}
            </PlatformStateContext.Consumer>
        )
    }
}
