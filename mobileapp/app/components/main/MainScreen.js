import React, { Component } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ListView } from 'react-native';
import { connect } from 'react-redux';
import SGListView from 'react-native-sglistview';

import styles from './styles/mainStyles';

import { getListRooms, openRoom } from '../../actions/rooms';

class MainScreen extends Component {
  static navigatorStyle = {
    navBarBackgroundColor: '#EFEFEF',
    navBarNoBorder: true,
    navBarHidden: false,
    navBarButtonColor: '#FF711B',
  };

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => { return this.props.isFetchingRooms || r1 !== r2; } });

    this.state = {
      dataSource: ds.cloneWithRows([]),
    };

    this.reloadData = this.reloadData.bind(this);
    this.renderRoomRow = this.renderRoomRow.bind(this);
    this.handleOpenRoom = this.handleOpenRoom.bind(this);
  }

  componentWillMount() {
    this.props.getRooms();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.rooms),
    });
  }

  reloadData() {
    this.props.getRooms();
  }

  handleOpenRoom(room) {
    this.props.openRoom(room.room_id);
    this.props.navigator.push({
      screen: 'roomie.RoomDetails',
      passProps: {
        room_id: room.room_id,
      },
      backButtonTitle: '',
      title: room.room_name,
    });
  }

  renderRoomRow(room) {
    return (
      <TouchableOpacity onPress={() => this.handleOpenRoom(room)}>
        <View style={styles.roomRow} key={room.room_id}>
          <Text style={styles.roomRowTitle}>
            {room.room_name}
          </Text>
          <Text style={styles.roomRowInfo}>
            Capacity: {room.capacity}
          </Text>
          <Text style={styles.roomRowInfo}>
            {room.coffee && 'Coffee '}
            {room.water_fountain && 'Watter '}
            {room.printers && 'Printer '}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <SGListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRoomRow}
          enableEmptySections
          pageSize={1}
          initialListSize={1}
          stickyHeaderIndices={[]}
          onEndReachedThreshold={1}
          scrollRenderAheadDistance={1}
          style={[styles.listView]}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isFetchingRooms}
              onRefresh={this.reloadData}
            />
          }
        />
      </View>
    );
  }
}


MainScreen.propTypes = {
  isFetchingRooms: React.PropTypes.bool.isRequired,
  rooms: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isFetchingRooms: state.data.isFetchingRooms,
    rooms: state.data.rooms,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getRooms: () => {
    dispatch(getListRooms());
  },
  openRoom: (roomId) => {
    dispatch(openRoom(roomId));
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
