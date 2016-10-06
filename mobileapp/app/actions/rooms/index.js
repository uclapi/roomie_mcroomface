import * as actionTypes from '../../constants/actions';
import * as endpoints from '../../constants/endpoints';


// Room's list
function getListRoomsStarted(dispatch) {
  dispatch({
    type: actionTypes.ROOMS_LIST,
    status: 'started',
  });
}

function getListRoomsSuccess(rooms, dispatch) {
  dispatch({
    type: actionTypes.ROOMS_LIST,
    status: 'success',
    rooms,
  });
}

export function getListRooms() {
  return (dispatch, getState) => {
    getListRoomsStarted(dispatch);

    const token = getState().user.token;

    return fetch(endpoints.roomsList, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
      mode: 'cors',
    }).then(res => {
      return res.json().then(json => {
        getListRoomsSuccess(json, dispatch);
      });
    });
  };
}

// Open room
export function openRoom(roomId) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.OPEN_ROOM,
      status: 'success',
      roomId,
    });
  };
}

// Room timetable
function getRoomTimetableStarted(dispatch) {
  dispatch({
    type: actionTypes.ROOM_TIMETABLE,
    status: 'started',
  });
}

function getRoomTimetableSuccess(info, dispatch) {
  dispatch({
    type: actionTypes.ROOM_TIMETABLE,
    status: 'success',
    info,
  });
}

function getRoomTimetableError(error, dispatch) {
  dispatch({
    type: actionTypes.ROOM_TIMETABLE,
    status: 'error',
    error,
  });
}

export function getRoomTimetable(roomId, date) {
  return (dispatch, getState) => {
    getRoomTimetableStarted(dispatch);

    const token = getState().user.token;

    return fetch(`${endpoints.roomTimetable}?room_id=${roomId}&date=${date}`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
      mode: 'cors',
    }).then(res => {
      return res.json().then(json => {
        getRoomTimetableSuccess([roomId, date, json], dispatch);
      });
    });
  };
}


// Book room
function bookRoomStarted(dispatch) {
  dispatch({
    type: actionTypes.ROOM_BOOK,
    status: 'started',
  });
}

function bookRoomSuccess(info, dispatch) {
  dispatch({
    type: actionTypes.ROOM_BOOK,
    status: 'success',
    info,
  });
}

function bookRoomError(error, dispatch) {
  dispatch({
    type: actionTypes.ROOM_BOOK,
    status: 'error',
    error,
  });
}

export function bookRoomSlot(roomId, date, start, end) {
  return (dispatch, getState) => {
    if (!roomId || !date || !start || !end) {
      bookRoomError('Missing params', dispatch);
    }

    bookRoomStarted(dispatch);

    const token = getState().user.token;

    console.log(roomId, date, start, end);

    return fetch(`${endpoints.roomBook}`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      mode: 'cors',
      body: `room_id=${roomId}&date=${date}&start_time=${start}&end_time=${end}&notes=h`,
    }).then(res => {
      return res.json().then(json => {
        if (json.error) {
          bookRoomError(json.error, dispatch);
          return Promise.reject();
        }
        console.log(json);
        bookRoomSuccess(json, dispatch);
        return Promise.resolve();
      });
    });
  };
}
