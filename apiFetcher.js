var storage = require('./storage');

exports = module.exports = function(nrDays, nrRecords) {
  return $.ajax({
  	url: storage.lotUrl,
  	crossDomain: true,
  	dataType: 'jsonp',
  	data: {
  		days: nrDays,
  		items: nrRecords
  	}
  });
}
