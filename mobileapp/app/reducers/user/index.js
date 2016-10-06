import * as actionTypes from '../../constants/actions';

const initialState = {
  isLoggingIn: false,
  isErrored: false,
  email: undefined,
  username: undefined,
  societyPowers: false,
  quota: undefined,
  token: undefined,
};


function userLoginReducer(state = initialState, action) {
  switch (action.status) {
    case 'started':
      return { ...state, isLoggingIn: true };
    case 'success': {
      const info = action.info;
      return {
        ...state,
        isLoggingIn: false,
        username: info.username,
        email: info.email,
        societyPowers: info.groups.indexOf('Group_3') !== -1,
        quota: info.quota_left,
        token: info.token,
      };
    }
    case 'error':
      return {
        ...state,
        isErrored: true,
        isLoggingIn: false,
      };

    default:
      return state;
  }
}

function userLogoutReducer(state = initialState, action) {
  switch (action.status) {
    case 'started':
      return {
        ...state,
        isLoggingOut: true,
      };
    case 'success':
      return {
        ...initialState,
        isLoggingOut: false,
        isLogged: false,
      };
    case 'error':
      return {
        ...initialState,
        isErrored: true,
        isLoggingOut: false,
      };

    default:
      return state;
  }
}

function userReducer(state = initialState, action) {
  if (!action) {
    return state;
  }

  switch (action.type) {
    case actionTypes.USER_LOGIN:
      return userLoginReducer(state, action);
    case actionTypes.USER_LOGOUT:
      return userLogoutReducer(state, action);
    default:
      return state;
  }
}

export default userReducer;
