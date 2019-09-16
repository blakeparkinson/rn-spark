import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import Auth0 from 'react-native-auth0';
const auth0 = new Auth0({
  domain: 'sparkgrills.auth0.com',
  clientId: '7Xn2X8mT7xcuiyjPIFxvZcx2CTlgiCVt',
});

class EmojiDict extends Component {
  constructor() {
    super();
    this.manager = new BleManager();
  }
  state = {
    '😃': '😃 Smiley',
    '🚀': '🚀 Rocket',
    '⚛️': '⚛️ Atom Symbol',
    accessToken: null,
  };

  componentDidMount() {
    this.onLogin();
    this.scanAndConnect();
  }
  onLogin = () => {
    auth0.webAuth
      .authorize({
        scope: 'openid profile',
        audience: 'https://sparkgrills.auth0.com/userinfo',
      })
      .then(credentials => {
        console.log('here');
        Alert.alert(
          'Success',
          'AccessToken: ' + credentials.accessToken,
          [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ],
          {cancelable: false},
        );
        this.setState({accessToken: credentials.accessToken});
      })
      .catch(error => console.log(error));
  };

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      console.log('here');
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
        // Stop scanning as it's not necessary if you are scanning for one device.
        this.manager.stopDeviceScan();

        // Proceed with connection.
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state['😃']}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EmojiDict;
