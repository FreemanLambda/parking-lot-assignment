var	uiHandlers = require('./uiHandlers');

// $.ajax({
// 	url: 'http://parkingapi.gear.host/v1/parking',
// 	crossDomain: true,
// 	dataType: 'jsonp',
// 	data: {
// 		days: 7,
// 		items: 500
// 	},
// 	success: function(response) {
// 		records = response.map(function(record) {
// 			return new ParkingInterval(record);
// 		});
//
// 		var midnightBreaks = 0;
// 		records.forEach(function(pi) {
// 			if(pi.breaksMidnight) {
// 				midnightBreaks++;
// 			}
// 			else {
// 				eventLibrary.push(new ParkingEvent(pi.arrival.format('HH:mm'), 'arrival'));
// 				// leave events should take place 1 minute after the actual leave time.
// 				// this stands to make sure that cars are counted as "inside" parking lot upon their
// 				// official leave time.
// 				eventLibrary.push(new ParkingEvent(incrementTimestamp(pi.leave.format('HH:mm'), 1), 'leave'));
// 			}
// 		});
//
// 		eventLibrary.sort(function(evt1, evt2) {
// 			if(evt1.time > evt2.time) {
// 				return 1;
// 			}
// 			else if(evt1.time < evt2.time) {
// 				return -1;
// 			}
// 			else {
// 				return 0;
// 			}
// 		});
// 		eventLibrary.push(new ParkingEvent('23:59'));
//
// 		var seekPin = 0; // 00:00
// 		var totalCars = midnightBreaks;
// 		eventLibrary.filter(function(evt) {
// 			return !evt.spansFullDay;
// 		}).forEach(function(evt) {
// 			while(toTimestamp(seekPin) < evt.time) {
// 				timeline.push(totalCars);
// 				seekPin++;
// 			}
// 			if(evt.action === 'arrival') {
// 				totalCars++;
// 			}
// 			else if(evt.action === 'leave') {
// 				totalCars--;
// 			}
// 		});
//
// 		var start = '03:20';
// 		var stop  = '05:20';
//
// 		var timelineFragment = timeline.filter(function(nrCars, index) {
// 			var ts = toTimestamp(index);
// 			return ts >= start && ts <= stop;
// 		});
//
// 		var ctx = $('#timeline-chart');
// 		var myChart = new Chart(ctx, {
// 	    type: 'line',
// 	    data: {
//         labels: Object.keys(timelineFragment).map(function(k) {
// 					return incrementTimestamp(start, k);
// 				}),
//         datasets: [{
//           label: '# of Cars',
//           data: timelineFragment,
//           borderWidth: 1
//         }]
// 	    },
// 	    options: {
//         scales: {
// 					xAxes: [{
// 						display: false
// 					}]
//         }
// 	    }
// 	});
//
// 	},
// 	error: function(err) {
// 		console.log(err);
// 	}
// });

uiHandlers.init();
