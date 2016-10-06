import { Navigation } from 'react-native-navigation';

import LoginScreen from './authentication/LoginScreen.js';
import MainScreen from './main/MainScreen.js';
import RoomDetails from './room/RoomDetails.js';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('roomie.LoginScreen', () => LoginScreen, store, Provider);
  Navigation.registerComponent('roomie.MainScreen', () => MainScreen, store, Provider);
  Navigation.registerComponent('roomie.RoomDetails', () => RoomDetails, store, Provider);
}
