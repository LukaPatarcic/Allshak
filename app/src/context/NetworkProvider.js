import React from 'react';
import NetInfo from "@react-native-community/netinfo";

export const NetworkContext = React.createContext({ isConnected: true });

export class NetworkProvider extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: null
        };
    }


    componentDidMount() {
        NetInfo.fetch().then(state => {
            this.setState({isConnected: state.isConnected});
        });

        NetInfo.addEventListener(state => {
            this.setState({isConnected: state.isConnected});
        });
    }

    render() {
        return (
            <NetworkContext.Provider value={this.state}>
                {this.props.children}
            </NetworkContext.Provider>
        );
    }
}