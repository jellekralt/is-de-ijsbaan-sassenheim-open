const moment = require('moment');
const express = require('express');
const app = express();

const schedule = require('./schedule.json');

app.set('port', (process.env.PORT || 5000))
app.set('view engine', 'ejs');
app.set('views', './views')

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {

  let today = null;
  let tomorrow = null;

  for (let date in schedule.dates) {
    
    if (schedule.dates.hasOwnProperty(date)) {

      if (moment().isSame(date, 'day')) {
        today = schedule.dates[date];
      } else if (moment().add(1, 'day').isSame(date, 'day')) {
        tomorrow = schedule.dates[date];
      }
      
    }
  }

  if (today) {
    today.open = (moment().hour() >= today.from && moment().hour() < today.until);
    today.openLater = (moment().hour() < today.from);
  }

  res.render('index', { 
    today: today,
    tomorrow: tomorrow
  });
})

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'))
})
