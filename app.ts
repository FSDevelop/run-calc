import { Month, WeekDay } from './enums';

// inputs
let year = 2024;
let month: Month = Month.Jun;
let restDays: WeekDay[] = [ WeekDay.Sun ];
let targetMonthDistance = 300;

// long run config
let longRunEnabled = true;
let longRunDay: WeekDay = WeekDay.Sat;
let longRunRate: number = 25; // % of the week

// formulas
const totalDaysOfMonth = new Date(year, month + 1, 0).getDate();

// formulate amount of training days within the month
let trainingDays = 0;
for (let day = 1; day <= totalDaysOfMonth; day++)
    if (!restDays.includes(new Date(year, month, day).getDay()))
        trainingDays++;

const weekTrainingDays = 7 - restDays.length;
const weekDistance = targetMonthDistance / trainingDays * weekTrainingDays;
const longRunDistance = longRunEnabled ? Math.floor(weekDistance / 100 * longRunRate) : 0;
const longRunDistanceDecimal = longRunEnabled ? weekDistance / 100 * longRunRate : 0;
const defaultDayDistance = Math.floor((weekDistance - longRunDistanceDecimal) / (weekTrainingDays - 1));
const defaultDayDistanceDecimal = (weekDistance - longRunDistanceDecimal) / (weekTrainingDays - 1);

let cumulativeDayDecimalDistanceLeft = 0;

let totalFinalDistance = 0;
// generate trainings
for (let day = 1; day <= totalDaysOfMonth; day++) {
    const date = new Date(year, month, day);
    let trainingType = 'Easy Run';
    let dayDistance = 0;

    if (cumulativeDayDecimalDistanceLeft >= 1) {
        dayDistance += 1;
        cumulativeDayDecimalDistanceLeft--;
    }

    if (restDays.includes(date.getDay())) {
        console.log(`${date.toDateString()} -`, 'Rest'); continue;
    }

    else if (longRunEnabled && date.getDay() === longRunDay) {
        trainingType = 'Long Run';
        dayDistance += longRunDistance;
        cumulativeDayDecimalDistanceLeft += longRunDistanceDecimal - longRunDistance;
    }

    else {
        dayDistance += defaultDayDistance;
        cumulativeDayDecimalDistanceLeft += defaultDayDistanceDecimal - defaultDayDistance;
    }

    totalFinalDistance+= dayDistance;

    if ((day === totalDaysOfMonth && !restDays.includes(date.getDay())) || (day + 1 === totalDaysOfMonth && restDays.includes(new Date(year, month, day + 1).getDay()))) {
        if (targetMonthDistance - totalFinalDistance > 0) {
            dayDistance += targetMonthDistance - totalFinalDistance;
            totalFinalDistance += targetMonthDistance - totalFinalDistance;
        }
    }

    console.log(`${date.toDateString()} -`, `${dayDistance} km ${trainingType}`);
}

console.log();
console.log('Total KM planned: ', totalFinalDistance);
console.log('Total KM requested: ', targetMonthDistance);
