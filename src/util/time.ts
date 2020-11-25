import moment from 'moment';

const getUnixTimeForAFutureDay = (days: number): number => {
  return moment().add(days, 'days').unix();
}

export default getUnixTimeForAFutureDay;
