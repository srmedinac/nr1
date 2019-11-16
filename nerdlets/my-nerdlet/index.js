import React, { Fragment } from 'react';

import { Grid, GridItem } from 'nr1';
//import the appropriate NR1 components
import { Tabs, TabsItem, Spinner, Stack, StackItem, NrqlQuery, navigation, PlatformStateContext, NerdletStateContext, EntityByGuidQuery, AutoSizer } from 'nr1';
//import our 3rd party libraries for the geo mapping features
import { CircleMarker, Map, TileLayer } from 'react-leaflet';
//import utilities we're going to need
import SummaryBar from '../../components/summary-bar';
//Import for GraphQL
import { NerdGraphQuery, EntitiesByNameQuery, EntitiesByDomainTypeQuery, EntityCountQuery, HeadingText, BlockText } from 'nr1';
//Import for Dropdown GraphQL
import { Dropdown, DropdownItem, BillboardChart, PieChart, HistogramChart, BarChart, TableChart } from 'nr1';


const COLORS = [
    "#2dc937",
    "#99c140",
    "#e7b416",
    "#db7b2b",
    "#cc3232"
];

export default class MyNerdlet extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            entity: null,
            accounts: null,
            selectedAccount: null,
            entityName: "WebPortal",
            center: [4.290, -75.096],
            zoom: 2
        }
        this.openDetails = this.openDetails.bind(this);
    }
    _getColor(value) {
        value = Math.round(value / 3);
        value = value < 0 ? 0 : value >= 5 ? 4 : value;
        return COLORS[value];
    }

    openDetails(pt, entity) {
        navigation.openStackedNerdlet({
            id: 'details',
            urlState: {
                regionCode: pt.name[0],
                countryCode: pt.name[1],
                appName: entity.name,
                accountId: entity.accountId
            }
        });
    }

    //Render for GraphQL
    _renderTable(data) {
        console.debug(JSON.stringify(data));
        const headings = Object.keys(data[0]).filter(k => k != '__typename' && k != 'id' && k != 'tags' && k != 'reporting');
        return <table className="table">
            <tbody>
                <tr>
                    {headings.map((name, i) => <th key={i}>{name}</th>)}
                </tr>
                {data.length > 1 ? data.map((item, i) => {
                    return <tr key={i}>
                        {headings.map((name, j) => <td key={j} className="table-data">{item[name]}</td>)}
                    </tr>
                }) : <tr>
                        {headings.map((name, j) => <td key={j} className="table-data">{data[0][name]}</td>)}
                    </tr>
                }
            </tbody>
        </table>
    }

    /**
     * Build the array of NRQL statements based on the duration from the Time Picker.
     * Dropfown GraphQL
     */
    nrqlChartData(platformUrlState) {
        const { duration } = platformUrlState.timeRange;
        const durationInMinutes = duration / 1000 / 60;
        return [
            {
                title: 'Page Views per City',
                nrql: `SELECT count(*) FROM PageView WHERE appName = 'Demo ASP.NET' SINCE 1 week ago FACET city`,
                chartType: 'pie'
            },
            {
                title: 'Response Time Distribution (ms)',
                nrql: `SELECT histogram(duration,20,20) FROM PageView SINCE yesterday`
            },
            {
                title: 'Engagement by Hour',
                nrql: `SELECT uniqueCount(session) FROM PageView SINCE 7 days ago FACET hourOf(timestamp)`,
                chartType: 'pie'
            },
            {
                title: 'Browsers',
                nrql: `SELECT percentage(uniqueCount(session), WHERE userAgentName = 'IE') AS '% of IE Users', percentage(uniqueCount(session), WHERE userAgentName = 'Chrome') AS '% of Chrome Users', percentage(uniqueCount(session), WHERE userAgentName = 'Firefox') AS '% of Firefox Users', percentage(uniqueCount(session), WHERE userAgentName = 'Safari') AS '% of Safari Users' FROM PageView SINCE 7 days ago`,
                chartType: 'billboard'
            }
        ];
    }

    //Test of Graph in console
    componentDidMount() {
        //being verbose for demonstration purposes only
        const q = NerdGraphQuery.query({
            query: `{
            actor {
              accounts {
                id
                name
              }
            }
          }` });
        q.then(results => {
            //logged for learning purposes
            console.debug(results); //eslint-disable-line
            const accounts = results.data.actor.accounts.map(account => {
                return account;
            });
            const account = accounts.length > 0 && accounts[0];
            this.setState({ selectedAccount: account, accounts });
        }).catch((error) => { console.log(error); })
    }

    /**
     * Option contains a label, value, and the account object.
     * @param {Object} option
     */
    selectAccount(option) {
        this.setState({ selectedAccount: option });
    }

    render() {
        const { zoom, center } = this.state;
        //const { accounts, selectedAccount } = this.state;
        const { filter } = (this.state || {})

        /* if (filter && filter.length > 0) {
             const re = new RegExp(filter, 'i')
             accounts = accounts.filter(a => {
                 return a.name.match(re)
             })
         }*/

        // if (accounts) {
        return <PlatformStateContext.Consumer>
            {(platformUrlState) => (
                <NerdletStateContext.Consumer>
                    {(nerdletUrlState) => (
                        <AutoSizer>
                            {({ height, width }) => (<EntityByGuidQuery entityGuid={nerdletUrlState.entityGuid}>
                                {({ data, loading, error }) => {
                                    console.debug("EntityByGuidQuery", [loading, data, error]); //eslint-disable-line
                                    if (loading) {
                                        return <Spinner fillContainer />;
                                    }
                                    if (error) {
                                        return <BlockText>{error.message}</BlockText>
                                    }
                                    const entity = data.entities[0];
                                    const appName = entity.name;
                                    const { accountId } = entity;
                                    const { duration } = platformUrlState.timeRange;
                                    const durationInMinutes = duration / 1000 / 60;
                                    const chartHeight = 250;
                                    const TotalQuery = "SELECT count(*) FROM JavaScriptError WHERE appName = " + { appName } + " SINCE " + { durationInMinutes } + " MINUTES AGO"
                                    console.log("TotalQuery", TotalQuery);
                                    return (
                                        <Grid>
                                            <GridItem columnStart={1} columnEnd={12}>
                                                <SummaryBar appName={entity.name} accountId={accountId} launcherUrlState={platformUrlState} />
                                            </GridItem>
                                            <GridItem columnStart={1} columnEnd={6}>
                                                <h3>Map</h3>
                                                <NrqlQuery
                                                    formatType={NrqlQuery.FORMAT_TYPE.RAW}
                                                    accountId={accountId}
                                                    query={`SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView WHERE appName = '${entity.name}' facet regionCode, countryCode SINCE ${durationInMinutes} MINUTES AGO limit 2000`}>
                                                    {results => {
                                                        console.debug(results);
                                                        if (results.loading) {
                                                            return <Spinner />
                                                        } else {
                                                            console.debug(results.data.facets);
                                                            return <Map
                                                                className="containerMap"
                                                                style={{ height: `${height - 200}px` }}
                                                                center={center}
                                                                zoom={zoom}
                                                                zoomControl={true}
                                                                ref={(ref) => { this.mapRef = ref }}>
                                                                <TileLayer
                                                                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                />
                                                                {results.data.facets.map((facet, i) => {
                                                                    const pt = facet.results;
                                                                    return <CircleMarker
                                                                        key={`circle-${i}`}
                                                                        center={[pt[2].result, pt[3].result]}
                                                                        color={this._getColor(pt[1].average)}
                                                                        radius={Math.log(pt[0].count) * 3}
                                                                        onClick={() => { this.openDetails(facet, entity); }}>
                                                                    </CircleMarker>
                                                                })}
                                                            </Map>
                                                        }
                                                    }}
                                                </NrqlQuery>
                                            </GridItem>
                                            <GridItem columnStart={1} columnEnd={12}>
                                                <h1><b>Summary</b></h1>
                                            </GridItem>
                                            <GridItem columnStart={1} columnEnd={3}>
                                                <h4>Total</h4>
                                                <BillboardChart
                                                    className="chart"
                                                    accountId={accountId}
                                                    query={TotalQuery} />
                                            </GridItem>
                                            <GridItem columnStart={4} columnEnd={6}>
                                                <h4>Requests</h4>
                                                <PieChart style={{ height: `${chartHeight}px` }} accountId={accountId} query={`SELECT count(requestUri) FROM JavaScriptError WHERE appName = '${entity.name}' FACET requestUri SINCE ${durationInMinutes} MINUTES AGO`} />
                                            </GridItem>
                                            <GridItem columnStart={7} columnEnd={9}>
                                                <h4>Browsers</h4>
                                                <PieChart style={{ height: `${chartHeight}px` }} accountId={accountId} query={`SELECT count(userAgentName) FROM JavaScriptError WHERE appName = '${entity.name}' FACET userAgentName SINCE ${durationInMinutes} MINUTES AGO`} />
                                            </GridItem>
                                            <GridItem columnStart={10} columnEnd={12}>
                                                <h4>Error Messages</h4>
                                                <BarChart style={{ height: `${chartHeight}px` }} accountId={accountId} query={`SELECT count(errorMessage) FROM JavaScriptError WHERE appName = '${entity.name}' FACET errorMessage SINCE ${durationInMinutes} MINUTES AGO`} />
                                            </GridItem>
                                            <GridItem columnStart={1} columnEnd={12} style={{ marginTop: '20px' }}>
                                                <TableChart
                                                    style={{ height: height - chartHeight - 50, width: '100%' }}
                                                    accountId={accountId}
                                                    query={`SELECT * from JavaScriptError WHERE appName = '${appName}' SINCE ${durationInMinutes} MINUTES AGO LIMIT 2000 `}
                                                />
                                            </GridItem>
                                        </Grid>
                                    );
                                }}
                            </EntityByGuidQuery>)}
                        </AutoSizer>
                    )}
                </NerdletStateContext.Consumer>
            )}
        </PlatformStateContext.Consumer>;
        /*} else {
            return <Spinner />
        }*/
    }
}