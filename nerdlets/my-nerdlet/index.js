import React, { Fragment } from 'react';

import { Grid, GridItem } from 'nr1';
//import the appropriate NR1 components
import { Tabs, TabsItem, Spinner, Stack, StackItem, NrqlQuery, navigation, PlatformStateContext, NerdletStateContext, EntityByGuidQuery, AutoSizer } from 'nr1';
//import our 3rd party libraries for the geo mapping features
import { CircleMarker, Map, TileLayer } from 'react-leaflet';
//import utilities we're going to need
import SummaryBar from '../../components/summary-bar';
import JavaScriptErrorSummary from './javascript-error-summary';
//Import for GraphQL
import { NerdGraphQuery, EntitiesByNameQuery, EntitiesByDomainTypeQuery, EntityCountQuery, HeadingText, BlockText } from 'nr1';
//Import for Dropdown GraphQL
import { Dropdown, DropdownItem, BillboardChart, PieChart, HistogramChart } from 'nr1';


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
            entityName: "Demo ASP.NET",
            center: [10.5731, -7.5898],
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
        const { accounts, selectedAccount } = this.state;
        const { filter } = (this.state || {})

        if (filter && filter.length > 0) {
            const re = new RegExp(filter, 'i')
            accounts = accounts.filter(a => {
                return a.name.match(re)
            })
        }

        if (accounts) {
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
                                        const { accountId } = entity;
                                        const { duration } = platformUrlState.timeRange;
                                        const durationInMinutes = duration / 1000 / 60;
                                        return (<Tabs>
                                            <TabsItem label={`Geographic Info`} value={1}>
                                                <Stack
                                                    fullWidth
                                                    horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                                                    directionType={Stack.DIRECTION_TYPE.VERTICAL}
                                                    gapType={Stack.GAP_TYPE.TIGHT}>
                                                    <StackItem>
                                                        <SummaryBar appName={entity.name} accountId={accountId} launcherUrlState={platformUrlState} />
                                                    </StackItem>
                                                    <StackItem>
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
                                                                        style={{ height: `${height - 125}px` }}
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
                                                    </StackItem>
                                                </Stack>
                                            </TabsItem>
                                            <TabsItem label={`Dashboard`} value={2}>
                                                <Stack
                                                    fullWidth
                                                    horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                                                    gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
                                                    directionType={Stack.DIRECTION_TYPE.VERTICAL}>
                                                    {selectedAccount &&
                                                        <StackItem>
                                                            <Dropdown title={selectedAccount.name} filterable label="Account"
                                                                onChangeFilter={(event) => this.setState({ filter: event.target.value })}>
                                                                {accounts.map(a => {
                                                                    return <DropdownItem key={a.id} onClick={() => this.selectAccount(a)}>
                                                                        {a.name}
                                                                    </DropdownItem>
                                                                })}
                                                            </Dropdown>
                                                        </StackItem>
                                                    }
                                                    {selectedAccount &&
                                                        <StackItem>
                                                            <Stack
                                                                fullWidth
                                                                horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                                                                gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
                                                                directionType={Stack.DIRECTION_TYPE.HORIZONTAL}>
                                                                {this.nrqlChartData(platformUrlState).map((d, i) => <StackItem key={i} shrink={true}>
                                                                    <h2>{d.title}</h2>
                                                                    {(d.chartType == 'pie') ? (<PieChart
                                                                        accountId={selectedAccount.id}
                                                                        query={d.nrql}
                                                                        className="chart"
                                                                    />)
                                                                        : ((d.chartType == 'billboard') ? (<BillboardChart
                                                                            accountId={selectedAccount.id}
                                                                            query={d.nrql}
                                                                            className="chart"
                                                                        />) : <HistogramChart
                                                                        accountId={selectedAccount.id}
                                                                        query={d.nrql}
                                                                        className="chart"
                                                                        />)}
                                                                </StackItem>)}
                                                            </Stack>
                                                        </StackItem>
                                                    }
                                                </Stack>
                                            </TabsItem>
                                            <TabsItem label={`GraphQL Info`} value={3}>
                                                <Stack fullWidth
                                                    horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                                                    directionType={Stack.DIRECTION_TYPE.VERTICAL}>
                                                    <StackItem>
                                                        <div className="container">
                                                            <NerdGraphQuery query={`{actor {accounts {id name}}}`}>
                                                                {({ loading, error, data }) => {
                                                                    console.debug([loading, data, error]); //eslint-disable-line
                                                                    if (loading) {
                                                                        return <Spinner />;
                                                                    }
                                                                    if (error) {
                                                                        return <BlockText>{error.message}</BlockText>;
                                                                    }

                                                                    return <Fragment>
                                                                        <HeadingText>Accounts</HeadingText>
                                                                        {this._renderTable(data.actor.accounts)}
                                                                    </Fragment>
                                                                }}
                                                            </NerdGraphQuery>
                                                        </div>
                                                    </StackItem>
                                                    <StackItem className="container">
                                                        <NerdletStateContext.Consumer>
                                                            {(nerdletUrlState) => {
                                                                return <EntityByGuidQuery entityGuid={nerdletUrlState.entityGuid}>
                                                                    {({ loading, error, data }) => {
                                                                        console.debug([loading, data, error]); //eslint-disable-line
                                                                        if (loading) {
                                                                            return <Spinner />;
                                                                        }
                                                                        if (error) {
                                                                            return <HeadingText>{error.message}</HeadingText>;
                                                                        }
                                                                        return <Fragment className="fragment">
                                                                            <HeadingText>Entity by ID</HeadingText>
                                                                            {this._renderTable(data.entities)}
                                                                        </Fragment>
                                                                    }}
                                                                </EntityByGuidQuery>

                                                            }}
                                                        </NerdletStateContext.Consumer>
                                                    </StackItem>
                                                    <StackItem className="container">
                                                        <EntitiesByDomainTypeQuery entityDomain="BROWSER" entityType="APPLICATION">
                                                            {({ loading, error, data }) => {
                                                                console.debug([loading, data, error]); //eslint-disable-line
                                                                if (loading) {
                                                                    return <Spinner />;
                                                                }
                                                                if (error) {
                                                                    return <BlockText>{JSON.stringify(error)}</BlockText>;
                                                                }
                                                                return <Fragment>
                                                                    <HeadingText>Entity by Domain Type</HeadingText>
                                                                    {this._renderTable(data.entities)}
                                                                </Fragment>
                                                            }}
                                                        </EntitiesByDomainTypeQuery>
                                                    </StackItem>

                                                </Stack>
                                            </TabsItem>
                                        </Tabs>);
                                    }}
                                </EntityByGuidQuery>)}
                            </AutoSizer>
                        )}
                    </NerdletStateContext.Consumer>
                )}
            </PlatformStateContext.Consumer>;
        } else {
            return <Spinner />
        }
    }
}