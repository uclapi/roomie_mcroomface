import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';

import { userLogin } from '../../actions/user';

import styles from './styles/loginStyles';

class LoginScreen extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: '#EFEFEF',
    navBarHidden: true,
    navBarButtonColor: '#007F80'
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.loginSubmit = this.loginSubmit.bind(this);
  }


  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  loginSubmit() {
    this.props.submit(this.state.username, this.state.password)
    .then((success) => {
      if (success) {
        this.props.navigator.resetTo({
          screen: 'roomie.MainScreen',
          animated: 'false', title: 'Roomie McRoom',
          navigatorButtons: {
            left: [
              {
                title: 'Config',
                id: 'config',
              },
            ],
          },
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.title}>
            Welcome to Roomie McRoom
          </Text>
          <View style={styles.fieldsContainer}>
            <TextInput
              style={styles.userField}
              autoCapitalize="none"
              onChangeText={(username) => this.setState({ username })}
              placeholder="Username"
            />
            <TextInput
              style={styles.passwordField}
              onChangeText={(password) => this.setState({ password })}
              secureTextEntry
              placeholder="Password"
            />
          </View>
          {this.props.error &&
            <Text style={styles.loginButton}>
              Wrong username or password
            </Text>
          }
          <TouchableOpacity onPress={this.loginSubmit}>
            <Text style={styles.loginButton}>
              Login
            </Text>
          </TouchableOpacity>
      </View>
    );
  }
}


LoginScreen.propTypes = {
  submit: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    error: state.user.isErrored,
  };
};

const mapDispatchToProps = (dispatch) => ({
  submit: (username, password) => {
    const u = userLogin(username, password);

    if (!u) {
      return Promise.reject();
    }

    return u(dispatch);
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
