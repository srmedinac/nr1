import React from 'react';
import DevNerdlet from './main';
import { PlatformStateContext, NerdletStateContext } from 'nr1';


export default class Wrapper extends React.PureComponent {
  render() {
    return (
      <PlatformStateContext.Consumer>
        {platformUrlState => (
          <NerdletStateContext.Consumer>
            {nerdletUrlState => (
                  <DevNerdlet
                    launcherUrlState={platformUrlState}
                    nerdletUrlState={nerdletUrlState}
                  />
            )}
          </NerdletStateContext.Consumer>
        )}
      </PlatformStateContext.Consumer>
    );
  }
}
