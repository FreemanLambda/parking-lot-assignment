var apiFetcher = require('./apiFetcher'),
    storage = require('./storage'),
    ParkingInterval = require('./models/ParkingInterval');

var myChart;

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

function drawChart(start, stop) {
  var timelineFragment = storage.timeline.filter(function(nrCars, index) {
    var ts = toTimestamp(index);
    return ts >= start && ts <= stop;
  });

  // show max nr of cars result
  var results = {
    maxCars: 0,
    maxTime: '00:00'
  }
  results = timelineFragment.reduce(function(oldResults, nrCars, time) {
    return (nrCars > oldResults.maxCars)  ? { maxCars: nrCars, maxTime: incrementTimestamp(start, time) } : oldResults;
  }, results);
  $('#results').html('Max cars: ' + results.maxCars + ' at: ' + results.maxTime);

  // destroy old chart (if any) and draw new chart
  var ctx = $('#timeline-chart');
  if(myChart) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(timelineFragment).map(function(k) {
        return incrementTimestamp(start, k);
      }),
      datasets: [{
        label: '# of Cars',
        data: timelineFragment,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          display: false
        }]
      }
    }
  });
}

exports = module.exports = {
  init: function() {
    // get data modal
    var $apiInfo = $('.api-info');
    $('#get-data').on('click', function() {
      var nrDays = $('#nr-days').val();
      var nrRecords = $('#nr-records').val();

      $apiInfo.html('<i class="fa fa-spinner fa-spin"></i>')
      apiFetcher(nrDays, nrRecords).then(function(response) {
        var records = response.map(function(record) {
          return new ParkingInterval(record);
        });
        $apiInfo.html('Successfully loaded data as requested.');
        var timelineWorker = new Worker('/timelineWorker.js');
        timelineWorker.addEventListener('message', function(event) {
          storage.timeline = JSON.parse(event.data);
        } );
        timelineWorker.postMessage(JSON.stringify(records));
      }, function(err) {
        console.log(err);
        $apiInfo.html('Failed to load requested data.');
      });
    });

    // select parking lot modal
    $('#select-lot-modal').on('shown.bs.modal', function() {
      $('#parking-lot-url').val(storage.lotUrl);
    });
    $('#select-lot').on('click', function() {
      storage.lotUrl = $('#parking-lot-url').val();
    });

    // timeline selection
    $('#start-time').timepicker({
      minuteStep: 1,
      showMeridian: false,
      defaultTime: '00:00'
    });
    $('#end-time').timepicker({
      minuteStep: 1,
      showMeridian: false,
      defaultTime: '23:59'
    });
    $('#narrow-timeline').on('click', function() {
      var start = toTimestamp(toMinutes($('#start-time').val()));
      var stop = toTimestamp(toMinutes($('#end-time').val()));
      drawChart(start, stop);
    });
    $('#all-time').on('click', function(e) {
      e.preventDefault();
      $('#start-time').val('00:00');
      $('#end-time').val('23:59');
      $('#narrow-timeline').click();
    });
  }
}
