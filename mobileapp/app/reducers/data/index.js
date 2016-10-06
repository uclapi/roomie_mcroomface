import * as actionTypes from '../../constants/actions';

const initialState = {
  openRoom: undefined,
  isFetchingRooms: false,
  isFetchingTimetable: false,
  isBookingSlot: false,
  isErrored: false,
  rooms: [],
  timetables: {},
};

const startHour = 8;
const endHour = 21;

function roomsListReducer(state = initialState, action) {
  switch (action.status) {
    case 'started':
      return { ...state, isFetchingRooms: true };
    case 'success':
      return {
        ...state,
        isErrored: false,
        isFetchingRooms: false,
        rooms: [...action.rooms],
      };
    case 'error':
      return {
        ...state,
        isErrored: true,
        isFetchingRooms: false,
      };

    default:
      return state;
  }
}

function roomTimetableReducer(state = initialState, action) {
  switch (action.status) {
    case 'started':
      return { ...state, isFetchingTimetable: true };
    case 'success': {
      let timetables = Object.assign({}, state.timetables);
      let slotsArray = [];

      for (let i = startHour; i < endHour; i++) {
        const start = i > 9 ? `${i}:01` : `0${i}:01`;
        const end = i + 1 > 9 ? `${i + 1}:00` : `0${i + 1}:00`;

        slotsArray = [...slotsArray, { start, end }];
      }

      const info = action.info;
      const bookings = info[2];

      if (bookings) {
        for (let i = 0; i < bookings.length; i++) {
          const start = +bookings[i].start.split(':')[0];
          const end = +bookings[i].end.split(':')[0];
          slotsArray[start - startHour] = bookings[i];

          if (end - start > 1) {
            const first = start + 1 - startHour;
            const last = end - startHour;
            for (let t = first; t < last; t++) {
              slotsArray[t] = Object.assign({}, slotsArray[0], { ignore: true });
            }
          }
        }
      }

      const classTimetable = Object.assign({}, timetables[info[0]] || {}, { [info[1]]: slotsArray });
      timetables = Object.assign(timetables, { [info[0]]: classTimetable });

      return {
        ...state,
        isErrored: false,
        isFetchingTimetable: false,
        timetables,
      };
    }
    case 'error':
      return {
        ...state,
        isErrored: true,
        isFetchingTimetable: false,
      };

    default:
      return state;
  }
}

function bookRoomReducer(state = initialState, action) {
  switch (action.status) {
    case 'started':
      return { ...state, isBookingSlot: true };
    case 'success':
      return {
        ...state,
        isErrored: false,
        isBookingSlot: false,
      };
    case 'error':
      return {
        ...state,
        isErrored: true,
        isBookingSlot: false,
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
    case actionTypes.ROOMS_LIST:
      return roomsListReducer(state, action);
    case actionTypes.ROOM_TIMETABLE:
      return roomTimetableReducer(state, action);
    case actionTypes.ROOM_BOOK:
      return bookRoomReducer(state, action);
    case actionTypes.OPEN_ROOM:
      return {
        ...state,
        openRoom: action.roomId,
      };
    default:
      return state;
  }
}

export default userReducer;
