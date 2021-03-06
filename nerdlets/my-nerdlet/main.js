import React from 'react';
import PropTypes from 'prop-types';
import SummaryBar from '../../components/summary-bar';
import { CircleMarker, Map, TileLayer } from 'react-leaflet';
import { Grid, GridItem, NrqlQuery, Spinner, AutoSizer, BillboardChart, navigation, BarChart, LineChart, TableChart, PieChart, Button, TextField, Modal, Toast } from 'nr1';

const COLORS = [
    "#2dc937",
    "#99c140",
    "#e7b416",
    "#db7b2b",
    "#cc3232"
];

export default class MyNerdlet extends React.Component {
    static propTypes = {
        launcherUrlState: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.accountId = 1966971;
        this.appName = "WebPortal",
            this.state = {
                value: '',
                center: [4.290, -75.096],
                zoom: 2
            }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    _getColor(value) {
        value = Math.round(value / 3);
        value = value < 0 ? 0 : value >= 5 ? 4 : value;
        return COLORS[value];
    }

    openDetails(pt) {
        navigation.openStackedNerdlet({
            id: 'details',
            urlState: {
                regionCode: pt.name[0],
                countryCode: pt.name[1],
                appName: this.appName,
                accountId: this.accountId
            }
        });
    }

    //Render for GraphQL
    _renderTable(data) {
        //console.debug(JSON.stringify(data));
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

    handleChange(e) {
        this.setState({ value: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({ hideModal: true })
    }

    render() {
        const { duration } = this.props.launcherUrlState.timeRange;
        const durationInMinutes = duration / 1000 / 60;
        const since = ` SINCE ${duration / 1000 / 60} MINUTES AGO `;
        const total_query = `SELECT count(*) FROM JavaScriptError FACET appName`;
        const chartHeight = 250;
        return <React.Fragment> <AutoSizer>
            {({ height, width }) => (
                <Grid>
                    <GridItem columnStart={1} columnEnd={12}>
                        <SummaryBar appName={this.appName} accountId={this.accountId} launcherUrlState={this.props.launcherUrlState} />
                    </GridItem>
                    <br></br>
                    <GridItem columnStart={1} columnEnd={8}>
                        <h3>Map</h3>
                        <NrqlQuery
                            formatType={NrqlQuery.FORMAT_TYPE.RAW}
                            accountId={this.accountId}
                            query={`SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView WHERE appName = '${this.appName}' facet regionCode, countryCode SINCE ${durationInMinutes} MINUTES AGO limit 2000`}>
                            {results => {
                                //console.debug(results);
                                if (results.loading) {
                                    return <Spinner />
                                } else {
                                    //console.debug(results.data.facets);
                                    return <Map
                                        className="containerMap"
                                        style={{ height: `${height - 250}px` }}
                                        center={this.state.center}
                                        zoom={this.state.zoom}
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
                                                onClick={() => { this.openDetails(facet); }}>
                                            </CircleMarker>
                                        })}
                                    </Map>
                                }
                            }}
                        </NrqlQuery>
                    </GridItem>


                    <GridItem columnStart={9} columnEnd={12}>
                        <h4>Total Javascript errors</h4>
                        <BillboardChart
                            style={{ height: `${height - 250}px`, width: `${width}px`}}
                            className="chart"
                            accountId={this.accountId}
                            query={total_query + since} />
                    </GridItem>                    
                    <GridItem columnStart={1} columnEnd={6}>
                        <h4>Requests</h4>
                        <PieChart
                            className="chart"
                            style={{ height: `${chartHeight}px` }}
                            accountId={this.accountId}
                            query={`SELECT count(requestUri) FROM JavaScriptError WHERE appName = '${this.appName}' FACET requestUri SINCE ${durationInMinutes} MINUTES AGO`} />
                    </GridItem>
                    <GridItem columnStart={7} columnEnd={12}>
                        <h4>Browsers</h4>
                        <PieChart
                            className="chart"
                            style={{ height: `${chartHeight}px` }}
                            accountId={this.accountId}
                            query={`SELECT count(userAgentName) FROM JavaScriptError WHERE appName = '${this.appName}' FACET userAgentName SINCE ${durationInMinutes} MINUTES AGO`} />
                    </GridItem>
                    <GridItem columnStart={1} columnEnd={12}>
                        <h4>Error Messages</h4>
                        <BarChart
                            className="chart"
                            style={{ height: `${height - 200}px` }}
                            accountId={this.accountId}
                            query={`SELECT count(errorMessage) FROM JavaScriptError WHERE appName = '${this.appName}' FACET errorMessage SINCE ${durationInMinutes} MINUTES AGO`} />
                    </GridItem>                    
                    <GridItem columnStart={1} columnEnd={12} style={{ marginTop: '20px' }}>
                        <TableChart
                            className="chart"
                            style={{ height: height - chartHeight - 50, width: '100%' }}
                            accountId={this.accountId}
                            query={`SELECT * from JavaScriptError WHERE appName = '${this.appName}' SINCE ${durationInMinutes} MINUTES AGO LIMIT 2000 `}
                        />
                    </GridItem>
                </Grid>
            )}</AutoSizer>
        </React.Fragment >
    }
}