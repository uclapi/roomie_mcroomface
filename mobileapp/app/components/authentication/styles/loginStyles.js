import * as colors from '../../../constants/colors';

export default {
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    color: 'white',
  },
  fieldsContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  userField: {
    width: 200,
    height: 40,
    padding: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
  passwordField: {
    width: 200,
    marginTop: 30,
    height: 40,
    paddingLeft: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
  loginButton: {
    marginTop: 20,
    fontSize: 20,
  },
};
