/**
 * @format
 */
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import '@react-native-firebase/app';
import '@react-native-firebase/auth';
AppRegistry.registerComponent(appName, () => App);
