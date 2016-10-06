import * as actionTypes from '../../constants/actions';
import * as endpoints from '../../constants/endpoints';

function userLoginStarted(dispatch) {
  dispatch({
    type: actionTypes.USER_LOGIN,
    status: 'started',
  });
}

function userLoginSuccess(info, dispatch) {
  dispatch({
    type: actionTypes.USER_LOGIN,
    status: 'success',
    info,
  });
}

function userLoginError(error, dispatch) {
  dispatch({
    type: actionTypes.USER_LOGIN,
    status: 'error',
    error,
  });
}

export function userLogin(username, password) {
  return (dispatch) => {
    if (!username || !password) {
      dispatch(userLoginError('Missing params', dispatch));
    }

    userLoginStarted(dispatch);

    return fetch(endpoints.userLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      mode: 'cors',
      body: `username=${username}&password=${password}`,
    }).then(res => {
      return res.json().then(json => {
        if (json.token) {
          userLoginSuccess(Object.assign({}, json, { username }), dispatch);
          return true;
        }
        userLoginError({ code: 404 }, dispatch);
        return false;
      });
    });
  };
}
