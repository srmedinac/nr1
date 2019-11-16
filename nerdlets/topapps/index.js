import React from 'react';
import { BillboardChart, TableChart, Stack, StackItem, ChartGroup, LineChart, ScatterChart, Button, navigation, nerdlet, PlatformStateContext, NerdletStateContext  } from 'nr1';


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
        console.debug("Nerdlet constructor", this); //eslint-disable-line
    }

    setApplication(inAppId, inAppName) {
        this.setState({ entityGuid: inAppId, appName: inAppName })
    }

    openEntity() {
        const {entityGuid, appName } = this.state;
        nerdlet.setUrlState({ entityGuid, appName});
        navigation.openStackedEntity(entityGuid); //openStackedEntity for popup
    }



    render() {
        const { entityGuid, appName } = this.state;
        const bilboardnqrl = 'SELECT count(*) FROM Transaction TIMESERIES AUTO FACET appName'; 
        const bilboardnqrl2 = ' ';
        const nrql = `SELECT count(*) as 'transactions', apdex(duration) as 'apdex', percentile(duration, 99, 90, 70) FROM Transaction facet appName`;
        
        return (
            <PlatformStateContext.Consumer>
              {(platformUrlState) => {
                  //console.debug here for learning purposes
                  console.debug(platformUrlState); //eslint-disable-line
                  const { duration } = platformUrlState.timeRange;
                  const since = ` SINCE ${duration/60/1000} MINUTES AGO`;
                  return (<Stack
                        fullWidth
                        verticalType={Stack.VERTICAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                        <StackItem>
                            <Stack
                                fullWidth
                                horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                                directionType={Stack.DIRECTION_TYPE.VERTICAL}
                                gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                                <StackItem>
                                    <BillboardChart query={bilboardnqrl + since} accountId={this.accountId} className="chart"/>
                                </StackItem>

                                
                                <StackItem>
                                    <TableChart query={nrql + since} accountId={this.accountId} className="chart" onClickTable={(dataEl, row, chart) => {
                                    //for learning purposes, we'll write to the console.
                                    console.debug([dataEl, row, chart]) //eslint-disable-line
                                    this.setApplication(row.entityGuid, row.appName)
                                }}/>
                                </StackItem>
                            </Stack>
                        </StackItem>
                    </Stack>);
            }}
            </PlatformStateContext.Consumer>
        )
    }
}
