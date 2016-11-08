var moment = require('moment');

function ParkingInterval(record) {
	this.id = record.Id;
	this.arrival = record.ArrivalTime;
	this.leave = record.LeaveTime;
  this.evaluateInterval();
}

ParkingInterval.prototype = {
  /**
   * Check if this interval includes a midnight break inbetween
   * Check if this interval spans for more than 24 hours
   */
  evaluateInterval: function() {
		var arrivalMoment = new moment(this.arrival);
		var leaveMoment = new moment(this.leave);
    this.breaksMidnight = arrivalMoment.format('YYYY-MM-DD') !== leaveMoment.format('YYYY-MM-DD');
  	this.spansFullDay = leaveMoment.diff(arrivalMoment) >= 24 * 3600 * 1000;
  }
}

exports = module.exports = ParkingInterval;
