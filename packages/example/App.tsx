/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View,
  Button,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import BarcodePage from './pages/BarcodePage'
import RfidPage from './pages/RfidPage'

const Stack = createStackNavigator();

const Home = ({navigation}) => {
  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Barcode')}
      >
        <Text>{'Barcode'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Rfid')}
      >
        <Text>{'Rfid'}</Text>
      </TouchableOpacity>
    </View>
  )
}
export const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Home', headerShown: false}}
        />
        <Stack.Screen
          name="Barcode"
          component={BarcodePage}
        />
        <Stack.Screen
          name="Rfid"
          component={RfidPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    margin: 5,
  },
});
export default App;
