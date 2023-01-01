# HTMLCalendar
A simple calendar for selecting dates on a web application

The javascript file provides a calendar class which can be used to select dates.

Example Usage:

```
//Initalize the calendar
//The month is represented from 0 to 11, January - December
let cal = new Calendar(0, 2023, {month: 0, day: 1, year: 2023};

//Build the calendar in the DOM
cal.buildDomCal(document.body);

//Process information from the selected date
cal.dateSelected((date) => {
    console.log("a new date was selected: ", date);
    //Do something with the selected date
});
```
