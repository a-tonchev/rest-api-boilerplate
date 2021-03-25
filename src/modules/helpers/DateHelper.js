const DateHelper = {
  getNow() {
    return new Date(Date.now());
  },

  getBefore(dateObject) {
    return new Date(Date.now() - this.getDateBase(dateObject));
  },

  getAfter(dateObject) {
    return new Date(Date.now() + this.getDateBase(dateObject));
  },

  getDateAt(dateObject) {
    return new Date(this.getDateBase(dateObject));
  },

  getDateToDay(dateObject) {
    return new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
  },

  getTimestamp() {
    return Date.now();
  },

  getTimestampBefore(dateObject) {
    return this.getTimestamp() - this.getDateBase(dateObject);
  },

  getTimestampAfter(dateObject) {
    return this.getTimestamp() + this.getDateBase(dateObject);
  },

  getDateBase({
    seconds = 0,
    minutes = 0,
    hours = 0,
    days = 0,
    weeks = 0,
    months = 0,
    years = 0,
  }) {
    return (
      this.getSecondsBase(seconds) +
      this.getMinutesBase(minutes) +
      this.getHoursBase(hours) +
      this.getDaysBase(days) +
      this.getWeeksBase(weeks) +
      this.getMonthsBase(months) +
      this.getYearsBase(years)
    );
  },

  getSecondsBase(seconds = 0) {
    return seconds * 1000;
  },

  getMinutesBase(minutes = 0) {
    return minutes * 60 * 1000;
  },

  getHoursBase(hours = 0) {
    return hours * 60 * 60 * 1000;
  },

  getDaysBase(days = 0) {
    return days * 24 * 60 * 60 * 1000;
  },

  getWeeksBase(weeks = 0) {
    return weeks * 7 * 24 * 60 * 60 * 1000;
  },

  getMonthsBase(months = 0) {
    return months * 30 * 24 * 60 * 60 * 1000;
  },

  getYearsBase(years = 0) {
    return years * 365 * 24 * 60 * 60 * 1000;
  },
};

export default DateHelper;
