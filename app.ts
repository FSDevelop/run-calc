import { Month, WeekDay } from './enums';

// inputs
let year = 2024;
let month: Month = Month.Feb;
let restDays: WeekDay[] = [ WeekDay.Sun ];
let targetKms = 300;

// long run config
let longRunDay: WeekDay = WeekDay.Sat;
let longRunRate: number = 23; // % of the week

// formulas
let totalDaysOfMonth = new Date(year, month + 1, 0).getDate();
let trainingDays = 0;

// formulate amount of training days within the month
for (let day = 1; day <= totalDaysOfMonth; day++) {
    // if current day is not rest
    if (!restDays.includes(new Date(year, month, day).getDay())) {
        trainingDays++;
    }
}

// week calculations
const weekTrainingDays = 7 - restDays.length;
const weekDistance = targetKms / trainingDays * weekTrainingDays;
const longRunDistance = Math.floor(weekDistance / 100 * longRunRate);
const defaultDayDistance = Math.floor((weekDistance - longRunDistance) / (weekTrainingDays - 1));

// generate trainings
for (let day = 1; day <= totalDaysOfMonth; day++) {
    const date = new Date(year, month, day);
    let trainingType = 'easy run';
    let dayDistance = defaultDayDistance;

    if (restDays.includes(date.getDay())) {
        console.log('rest'); continue;
    }

    else if (date.getDay() === longRunDay) {
        trainingType = 'long run';
        dayDistance = longRunDistance;
    }

    console.log(`${date.toDateString()} -`, `${dayDistance} km ${trainingType}`);
}
