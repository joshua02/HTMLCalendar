const monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthAbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const dayAbr = ["S", "M", "T", "W", "T", "F", "S"];

//month is 0-11 representing Jan - December
function determineDaysInMonth(month, year) {
    //Additional logic for leap years
    if (month == 1) {
        if (year % 4 == 0) {
            //divisible by 4
            if (year % 100 == 0) {
                //divisible by 100
                if (year % 400 == 0) {
                    //divisible by 400
                    return 29;
                }
                return 28;
            }
            return 29;
        }
    }
    return daysInMonth[month];
}

function getDate(date = new Date()) {
    return {
        month: date.getMonth(),
        day: date.getDate(),
        year: date.getFullYear(),
    };
}

function getDayFromDate(month, day, year) {
    let date = new Date(year, month, day);
    let dayNumber = date.getDay();

    return dayNumber;
}

function getPreviousMonthYear(month, year) {
    if (month == 0) {
        return {
            month: 11,
            year: year - 1,
        };
    } else {
        return {
            month: month - 1,
            year: year,
        };
    }
}

function getNextMonthYear(month, year) {
    if (month == 11) {
        return {
            month: 0,
            year: year + 1,
        };
    } else {
        return {
            month: month + 1,
            year: year,
        };
    }
}

function areDatesEqual(date1, date2) {
    return date1.month == date2.month && date1.day == date2.day && date1.year == date2.year;
}

//Calendar class for selecting dates
class Calendar {
    constructor(month, year, selectedDate) {
        this.month = month;
        this.year = year;
        this.prompting = false;
        this.selectedDate = selectedDate;
        this.runWhenSelected = null;
    }
    buildDomCal(parentElement) {
        this.domCal = {};
        //build the calendar container
        this.domCal.container = createDiv("Calendar", parentElement);

        //build the header
        this.domCal.header = createDiv("CalendarHeader", this.domCal.container);

        this.domCal.leftButton = createButton(
            "CalendarLeftButton",
            this.domCal.header,
            () => {
                let next = getPreviousMonthYear(this.month, this.year);
                this.updateDomCal(next.month, next.year);
            },
            "<"
        );

        this.domCal.headerDate = createButton(
            "CalendarHeaderDate",
            this.domCal.header,
            () => {
                this.promptDateInput();
            },
            monthNames[this.month] + " " + this.year
        );

        this.domCal.rightButton = createButton(
            "CalendarRightButton",
            this.domCal.header,
            () => {
                let next = getNextMonthYear(this.month, this.year);
                this.updateDomCal(next.month, next.year);
            },
            ">"
        );

        //build the day header
        this.domCal.daysHeader = createDiv("CalendarDaysHeader", this.domCal.container);
        this.domCal.dayHeaders = Array(7);
        for (let i = 0; i < 7; i++) {
            this.domCal.dayHeaders[i] = createDiv("CalendarDayHeader", this.domCal.daysHeader);
            this.domCal.dayHeaders[i].innerHTML = dayAbr[i];
        }

        //build the day squares
        let offset = getDayFromDate(this.month, 1, this.year);

        this.domCal.daysArray = Array(35);
        this.domCal.calBody = createDiv("CalendarBody", this.domCal.container);

        let daysInCurrentMonth = determineDaysInMonth(this.month, this.year);

        let prevMonth = getPreviousMonthYear(this.month, this.year);
        let previousMonthDays = determineDaysInMonth(prevMonth.month, prevMonth.year);
        let nextMonth = getNextMonthYear(this.month, this.year);

        //create each day button on the calendar
        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                //determine if the day would be a part of the previous or next month
                let prev = false;
                let next = false;

                let dayNumber = 1 - offset + week * 7 + day;
                if (dayNumber < 1) {
                    //TODO: also grey out the buttons
                    dayNumber = previousMonthDays + dayNumber;
                    prev = true;
                } else if (dayNumber > daysInCurrentMonth) {
                    dayNumber = dayNumber - daysInCurrentMonth;
                    next = true;
                }

                //create the day button
                this.domCal.daysArray[week * 7 + day] = createButton(
                    "CalendarDay",
                    this.domCal.calBody,
                    () => {
                        //Make the buttons do stuff
                        let selection = {};
                        if (prev) {
                            selection.month = prevMonth.month;
                            selection.day = dayNumber;
                            selection.year = prevMonth.year;
                        } else if (next) {
                            selection.month = nextMonth.month;
                            selection.day = dayNumber;
                            selection.year = nextMonth.year;
                        } else {
                            selection.month = this.month;
                            selection.day = dayNumber;
                            selection.year = this.year;
                        }

                        if (areDatesEqual(this.selectedDate, selection)) return;

                        this.domCal.daysArray[week * 7 + day].className = "CalendarDay CalendarDaySelected";
                        this.changeSelection(selection);

                        this.domSelected.className = "CalendarDay";
                        this.domSelected = this.domCal.daysArray[week * 7 + day];
                    },
                    dayNumber
                );

                //determine if the created button is the currently selected date and highlight if so
                if (prev) {
                    if (areDatesEqual(this.selectedDate, { month: prevMonth.month, day: dayNumber, year: prevMonth.year })) {
                        this.domSelected = this.domCal.daysArray[week * 7 + day];
                        this.domSelected.className = "CalendarDay CalendarDaySelected";
                    }
                } else if (next) {
                    if (areDatesEqual(this.selectedDate, { month: nextMonth.month, day: dayNumber, year: nextMonth.year })) {
                        this.domSelected = this.domCal.daysArray[week * 7 + day];
                        this.domSelected.className = "CalendarDay CalendarDaySelected";
                    }
                } else {
                    if (areDatesEqual(this.selectedDate, { month: this.month, day: dayNumber, year: this.year })) {
                        this.domSelected = this.domCal.daysArray[week * 7 + day];
                        this.domSelected.className = "CalendarDay CalendarDaySelected";
                    }
                }

                //display the date being hovered over
                this.domCal.daysArray[week * 7 + day].onmouseover = () => {
                    if (prev) {
                        this.domCal.headerDate.innerHTML = monthNames[prevMonth.month] + " " + dayNumber + ", " + prevMonth.year;
                    } else if (next) {
                        this.domCal.headerDate.innerHTML = monthNames[nextMonth.month] + " " + dayNumber + ", " + nextMonth.year;
                    } else {
                        this.domCal.headerDate.innerHTML = monthNames[this.month] + " " + dayNumber + ", " + this.year;
                    }
                };

                //reset the display when nothing is hovered
                this.domCal.daysArray[week * 7 + day].onmouseleave = () => {
                    this.domCal.headerDate.innerHTML = monthNames[this.month] + " " + this.year;
                };
            }
        }
    }
    updateDomCal(month, year) {
        this.domCal.container.remove();
        this.month = month;
        this.year = year;
        this.buildDomCal(document.body);
    }
    promptDateInput() {
        if (this.prompting) {
            return;
        }
        this.prompting = true;

        this.domCal.headerDate.remove();

        this.domCal.prompt = createDiv("CalendarInputDate", this.domCal.header);
        let monthIn = createTextInput("CalendarInputField", this.domCal.prompt, "Month");
        let dayIn = createTextInput("CalendarInputField", this.domCal.prompt, "Day");
        let yearIn = createTextInput("CalendarInputField", this.domCal.prompt, "Year");
        let button = createButton(
            "CalendarInputButton",
            this.domCal.prompt,
            () => {
                let month;
                let day;
                let year;

                if (yearIn.value == "") {
                    //assume year is current year if left blank
                    year = getDate().year;
                } else if (isValidYear(yearIn.value)) {
                    year = Number(yearIn.value);
                }
                if (isValidMonth(monthIn.value)) {
                    month = Number(monthIn.value);
                }
                if (isValidDay(dayIn.value, month, year)) {
                    day = Number(dayIn.value);
                }
                if (month && day && year) {
                    //Valid date entered
                    this.domCal.prompt.remove();

                    this.changeSelection({ month: month - 1, day: day, year: year });

                    this.updateDomCal(month - 1, year);

                    this.domCal.header.appendChild(this.domCal.headerDate);
                    this.prompting = false;
                } else {
                    //Invalid date
                }
            },
            "Go"
        );
    }

    //runs the given function when a selection is made
    dateSelected(func) {
        this.runWhenSelected = func;
    }

    changeSelection(date) {
        this.selectedDate = date;
        this.runWhenSelected(date);
    }
}

function createDiv(className, parentElement) {
    let div = document.createElement("div");
    div.className = className;
    parentElement.appendChild(div);
    return div;
}

function createButton(className, parentElement, onClick, innerHTML) {
    let button = document.createElement("button");
    button.className = className;

    button.onclick = onClick;
    button.innerHTML = innerHTML;
    parentElement.appendChild(button);
    return button;
}

function createTextInput(className, parentElement, placeholderText) {
    let inp = document.createElement("input");
    inp.type = "text";
    inp.placeholder = placeholderText;
    inp.className = className;
    parentElement.appendChild(inp);
    return inp;
}

function isValidMonth(input) {
    let inp = Number(input);
    return !isNaN(inp) && inp >= 1 && inp <= 12;
}

function isValidDay(input, month, year) {
    let n = determineDaysInMonth(month - 1, year);
    let inp = Number(input);
    return !isNaN(inp) && inp >= 1 && inp <= n;
}

function isValidYear(input) {
    if (input == "") {
        return false;
    }
    let n = Number(input);
    return !isNaN(n) && n >= 0;
}

//Set up the calendar
let cal = new Calendar(getDate().month, getDate().year, getDate());
cal.buildDomCal(document.body);

cal.dateSelected((date) => {
    console.log("a new date was selected: ", date);
});
