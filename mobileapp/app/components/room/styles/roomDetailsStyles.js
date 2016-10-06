import * as colors from '../../../constants/colors';

export default {
  container: {
    flex: 1,
  },
  dateContainer: {
    height: 40,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 18,
    color: 'white',
  },
  dateButton: {
    marginLeft: 15,
    marginRight: 15,
    fontSize: 15,
    color: 'white',
  },
  listView: {
    flex: 1,
  },
  slotRowContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: colors.lightPrimary,
  },
  slotRow: {
    padding: 10,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  slotRowTitle: {
    color: colors.grey,
    fontSize: 16,
  },
  slotRowTitleFree: {
    color: colors.green,
    fontSize: 17,
  },
  slotRowTime: {
    color: 'black',
    fontSize: 17,
  },
  bookButton: {
    width: 60,
    height: 30,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonLabel: {
    fontSize: 14,
    color: 'white',
  },
};
