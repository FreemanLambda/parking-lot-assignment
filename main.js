
function ParkingInterval(id, arrival, departure) {
	this.id = id;
	this.arrival = arrival;
	this.departure = departure;
}

$.ajax({
	url: 'http://parkingapi.gear.host/v1/parking',
	success: function(response) {
		console.log(response);
	},
	error: function(err) {
		console.log(err);
	}
});

