const getItems = require('./calendar');
const { parse, isSameDay, isAfter, isBefore } = require('date-fns');

async function getPlanning() {
  let items = await getItems();

  items = items.map((item) => {
    item.start.dateTime = parse(item.start.dateTime);
    item.end.dateTime = parse(item.end.dateTime);
    return item;
  })
  .sort((a, b) => {
    return a.start.dateTime - b.start.dateTime;
  });  
  
  let next = items.filter((item) => {
    return isAfter(item.start.dateTime, new Date());
  })[0];
  let now = items.filter((item) => {
    return isAfter(new Date(), item.start.dateTime) && isBefore(new Date(), item.end.dateTime);
  })[0];
  let isOpenNow = items.some((item) => {
    return isAfter(new Date(), item.start.dateTime) && isBefore(new Date(), item.end.dateTime);
  });
  
  return {
    isOpenNow,
    now,
    next
  }
}

module.exports = getPlanning;