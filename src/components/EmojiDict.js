import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, FlatList} from 'react-native';
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
    this.onLogin = this.onLogin.bind(this);
    this.scanAndConnect = this.scanAndConnect.bind(this);
  }
  state = {
    '😃': '😃 Smiley',
    '🚀': '🚀 Rocket',
    '⚛️': '⚛️ Atom Symbol',
    accessToken: null,
    devices: [],
    isScanning: false,
    scanText: 'Scan',
  };

  componentDidMount() {
    // this.onLogin();
    // this.scanAndConnect();
  }
  onLogin = () => {
    auth0.webAuth
      .authorize({
        scope: 'openid profile',
        audience: 'https://sparkgrills.auth0.com/userinfo',
      })
      .then(credentials => {
        console.log(credentials);
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
    console.log('here');
    if (this.state.isScanning) {
      //already scanning, be done
      this.manager.stopDeviceScan();
      this.setState({
        isScanning: false,
      });
      return;
    }
    this.setState({
      isScanning: true,
    });
    this.manager.startDeviceScan(null, null, (error, foundDevice) => {
      const existingDevice = this.state.devices.find(device => {
        return device.id == foundDevice.id;
      });
      if (!existingDevice) {
        this.setState({devices: [...this.state.devices, foundDevice]});
      }
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (
        foundDevice.name === 'TI BLE Sensor Tag' ||
        foundDevice.name === 'SensorTag'
      ) {
        // Stop scanning as it's not necessary if you are scanning for one device.
        this.manager.stopDeviceScan();

        // Proceed with connection.
      }
      console.log(this.state.devices);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state['😃']}</Text>
        <Button title="Authenticate" onPress={this.onLogin} />
        <Button
          title={this.state.isScanning ? 'Stop Scan' : 'Scan'}
          onPress={this.scanAndConnect}
        />
        <FlatList
          data={this.state.devices}
          renderItem={({item}) => <Text style={styles.item}>{item.name}</Text>}
        />
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
