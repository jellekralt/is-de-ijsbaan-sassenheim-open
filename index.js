const { format, isTomorrow, isToday } = require('date-fns');
const nlLocale = require('date-fns/locale/nl')
const express = require('express');
const helmet = require('helmet');
const app = express();
const getPlanning = require('./src/planning');

const schedule = require('./schedule.json');

app.use(helmet())

app.set('port', (process.env.PORT || 5000))
app.set('view engine', 'ejs');
app.set('views', './views')

app.use(express.static(__dirname + '/public'))

app.get('/', async (req, res) => {
  let planning;

  try {
    planning = await getPlanning();
  } catch (err) {
    planning = {};
    console.error('Error getting items: ', err);
  }

  res.render('index', { 
    planning,
    isTomorrow,
    isToday,
    format: (date, formatString) => {
      return format(date, formatString, { locale: nlLocale });
    }
  });
})

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'))
});
