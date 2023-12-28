import { Month, WeekDay } from './enums';

// inputs
let year = 2024;
let month: Month = Month.Feb;
let restDay: WeekDay = WeekDay.Sun;
let targetKms = 300;

// formulas
let totalDaysOfMonth = new Date(year, month + 1, 0).getDate();
let trainingDays = 0;

// formulate amount of training days within the month
for (let day = 1; day <= totalDaysOfMonth; day++) {
    const date = new Date(year, month, day);
    if (date.getDay() !== restDay) {
        trainingDays++;
    }
}

// generate trainings
for (let day = 1; day <= totalDaysOfMonth; day++) {
    let training: string;
    const date = new Date(year, month, day);

    if (date.getDay() === restDay) {
        training = 'rest';
    } else {
        training = `${targetKms / trainingDays} km easy`;
    }

    console.log(`${date.toDateString()} -`, training);
}
