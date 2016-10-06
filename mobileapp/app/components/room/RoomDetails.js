import React, { Component } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ListView,   ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import SGListView from 'react-native-sglistview';

import styles from './styles/roomDetailsStyles';

import { getRoomTimetable, bookRoomSlot } from '../../actions/rooms';

class RoomDetails extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: '#EFEFEF',
    navBarNoBorder: true,
    navBarHidden: false,
    navBarButtonColor: '#FF711B',
  };

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => { return this.props.isFetchingTimetable || r1 !== r2; } });

    this.state = {
      dataSource: ds.cloneWithRows([]),
      currentDate: new Date(),
    };

    this.day = this.day.bind(this);
    this.handleGetTimetable = this.handleGetTimetable.bind(this);
    this.handleNextDay = this.handleNextDay.bind(this);
    this.handlePreviousDay = this.handlePreviousDay.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.renderSlotRow = this.renderSlotRow.bind(this);
    this.handleBookRoom = this.handleBookRoom.bind(this);
  }

  componentWillMount() {
    this.handleGetTimetable();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timetable[this.day(true)]) {
      const slots = nextProps.timetable[this.day(true)].filter(s => !s.ignore);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(slots),
      });
    }
  }

  reloadData() {
    this.handleGetTimetable();
  }

  isToday(date) {
    const today = new Date();
    if (date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()) {
      return true;
    }

    return false;
  }

  day(request) {
    const day = this.state.currentDate;
    const dd = day.getDate();
    const mm = day.getMonth();
    const yyyy = day.getFullYear();

    const test = new Date();

    let date;
    if (request) {
      return `${yyyy}${mm < 9 ? `0${mm + 1}` : mm + 1}${dd}`;
    } else {
      date = `${dd}/${mm + 1}/${yyyy}`;
    }

    const today = new Date();
    if (this.isToday(day)) {
      return `${date} (today)`;
    }

    return date;
  }

  handleGetTimetable() {
    this.props.getRoomTimetable(this.props.roomId, this.day(true));
  }

  handleNextDay() {
    const newDay =
    this.setState({ currentDate: new Date(this.state.currentDate.getTime() + (24 * 60 * 60 * 1000)) },
    () => this.handleGetTimetable());
  }

  handlePreviousDay() {
    this.setState({ currentDate: new Date(this.state.currentDate.getTime() - (24 * 60 * 60 * 1000)) },
    () => this.handleGetTimetable());
  }

  handleBookRoom(slot) {
    this.props.bookSlot(this.props.roomId, this.day(true), slot.start, slot.end)
    .then(() => {
      this.reloadData();

    })
    .catch(() => {

    });
  }

  renderSlotRow(slot) {
    return (
      <View style={styles.slotRowContainer}>
        <View style={styles.slotRow}>
          <View>
            <Text style={styles.slotRowTime}>
              {slot.start} to {slot.end}
            </Text>
            {slot.username ?
              <Text style={styles.slotRowTitle} ellipsizeMode="tail" numerOfLines={2}>
                {`Booked by: ${slot.username}`}
              </Text>
              :
              <Text style={styles.slotRowTitleFree}>
                Free
              </Text>
            }
          </View>
          {!slot.username &&
            <TouchableOpacity style={styles.bookButton} onPress={() => this.handleBookRoom(slot)}>
              <Text style={styles.bookButtonLabel}>
                Book
              </Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={this.handlePreviousDay}>
            <Text style={styles.dateButton}>
              Previous
            </Text>
          </TouchableOpacity>
          <Text style={styles.dateLabel}>
            {this.day()}
          </Text>
          <TouchableOpacity onPress={this.handleNextDay}>
            <Text style={styles.dateButton}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
        <SGListView
          dataSource={this.state.dataSource}
          renderRow={this.renderSlotRow}
          enableEmptySections
          pageSize={1}
          initialListSize={1}
          stickyHeaderIndices={[]}
          onEndReachedThreshold={1}
          scrollRenderAheadDistance={1}
          style={[styles.listView]}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isFetchingTimetable}
              onRefresh={this.reloadData}
            />
          }
        />
        {this.props.isBookingSlot &&
          <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0,
            backgroundColor: '#000', opacity: 0.6, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator
              animating={this.state.creatingPost}
              style={{ height: 80 }}
              size="large"
            />
          </View>
        }
      </View>
    );
  }
}


RoomDetails.propTypes = {
  roomId: React.PropTypes.string,
  timetable: React.PropTypes.object.isRequired,
  getRoomTimetable: React.PropTypes.func.isRequired,
  isFetchingTimetable: React.PropTypes.bool.isRequired,
  isBookingSlot: React.PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    userId: state.data.username,
    timetable: state.data.timetables[state.data.openRoom] || {},
    roomId: state.data.openRoom,
    isFetchingTimetable: state.data.isFetchingTimetable,
    isBookingSlot: state.data.isBookingSlot,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getRoomTimetable: (roomId, date) => {
    dispatch(getRoomTimetable(roomId, date));
  },
  bookSlot: (roomId, date, start, end) => {
    return dispatch(bookRoomSlot(roomId, date, start, end));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomDetails);
