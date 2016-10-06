import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { configureStore } from './store';
import { registerScreens } from './components/registerScreens';
let store;

export default class App {
  constructor() {
    configureStore(newStore => {
      store = newStore;
      registerScreens(store, Provider);

      const user = newStore.getState().user;
      this.startApp(user.token !== undefined);
    });
  }

  startApp(isLogged) {
    Navigation.startSingleScreenApp({
      screen: {
        screen: isLogged ? 'roomie.MainScreen' : 'roomie.LoginScreen',
        title: isLogged ? 'Roomie McRoom' : '',
        navigatorStyle: {
          navBarHidden: !isLogged,
          navBarBackgroundColor: '#EFEFEF',
          navBarNoBorder: true,
          navBarButtonColor: '#FF711B',
        },
      },
      passProps: {},
    });
  }
}
