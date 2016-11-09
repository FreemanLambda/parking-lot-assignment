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
		var arrivalMoment = new Date(this.arrival);
		var leaveMoment = new Date(this.leave);
    this.breaksMidnight = this.arrival.split('T')[0] !== this.leave.split('T')[0];
  	this.spansFullDay = leaveMoment.getTime() - arrivalMoment.getTime() >= 24 * 3600 * 1000;
  }
}

function ParkingEvent(time, action) {
	this.time = time;
	this.action = action;
}

function toTimestamp(minutes) {
	var hours = Math.floor(minutes / 60);
	var mins = minutes % 60;
	hours = hours < 10 ? '0' + hours : '' + hours;
	mins = mins < 10 ? '0' + mins : '' + mins;
	return hours + ':' + mins;
}

function toMinutes(timestamp) {
	var tsParts = timestamp.split(':');
	return 60 * parseInt(tsParts[0]) + parseInt(tsParts[1]);
}

function incrementTimestamp(ts, minutes) {
	return toTimestamp(toMinutes(ts) + parseInt(minutes));
}

function getHoursAndMinutes(datetime) {
	// datetime format: 2016-05-02T16:47:00
	var time = datetime.split('T')[1];
	var timeParts = time.split(':');
	return timeParts[0] + ':' + timeParts[1];
}

self.processRecords = function(response) {
  var records = response.map(function(record) {
    return new ParkingInterval(record);
  });
	var eventLibrary = [], timeline = [];

	// keep track of cars that should be considered as parked at minute 00:00
	var midnightBreaks = 0;
	// create parking events for every parking interval (pi)
	// parking intervals that span more than 24 hours should not be registered, because they are
	// considered as parked in every single minute of the day [00:00 - 23:59]
	records.forEach(function(pi) {
		if(pi.breaksMidnight) {
			midnightBreaks++;
		}
		if(!pi.spansFullDay) {
			var arrivalEvt = new ParkingEvent(getHoursAndMinutes(pi.arrival), 'arrival');
			// leave events should take place 1 minute after the actual leave time.
			// this stands to make sure that cars are counted as "inside" parking lot upon their
			// official leave time.
			var leaveEvt = new ParkingEvent(incrementTimestamp(getHoursAndMinutes(pi.leave), 1), 'leave');
			eventLibrary.push(arrivalEvt);
			eventLibrary.push(leaveEvt);
		}
	});

	// sort events by time [00:00 - 23:59]
	eventLibrary.sort(function(evt1, evt2) {
		if(evt1.time > evt2.time) {
			return 1;
		}
		else if(evt1.time < evt2.time) {
			return -1;
		}
		else {
			return 0;
		}
	});
	// place a dummy event for the sake of seekPin cycle completion
	eventLibrary.push(new ParkingEvent('23:59'));

	var seekPin = 0; // 00:00
	var totalCars = midnightBreaks;
	eventLibrary.forEach(function(evt) {
		// "print" current number of cars to the timeline
		while(toTimestamp(seekPin) < evt.time) {
			timeline.push(totalCars);
			seekPin++;
		}
		// increase/decrease number of cars based on event type
		if(evt.action === 'arrival') {
			totalCars++;
		}
		else if(evt.action === 'leave') {
			totalCars--;
		}

	});

	self.postMessage(JSON.stringify(timeline));
	self.close();
}

self.onmessage = function(event) {
	var data = event.data;
	var qs = '?days=' + data.nrDays + '&items=' + data.nrRecords + '&callback=processRecords';
	var url = data.url + qs;
	try {
		importScripts(url);
	}	catch(e) {
		self.postMessage({err: 'Failed to load data'});
		self.close();
	}

};
