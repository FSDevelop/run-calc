const training = [
  { distance: 5000, type: 'easy', intensity: 0.9 },
  { distance: 10000, type: 'easy', intensity: 0.9 },
  { distance: 0, type: 'rest', intensity: 1 },
  { distance: 14160, type: 'track', intensity: 1.6 },
  { distance: 12010, type: 'easy', intensity: 1 },
  { distance: 12000, type: 'hills', intensity: 1.6 },
  { distance: 19000, type: 'long', intensity: 0.9 },
  { distance: 0, type: 'rest', intensity: 1 },
  { distance: 0, type: 'rest', intensity: 1, injury: true },
  { distance: 7000, type: 'easy', intensity: 1 },
  { distance: 8020, type: 'easy', intensity: 1 },
  { distance: 4380, type: 'easy', intensity: 0.9 },
  { distance: 11680, type: 'race', intensity: 2 },
  { distance: 0, type: 'rest', intensity: 1 },
  { distance: 9830, type: 'track', intensity: 1.6 },
  { distance: 7880, type: 'easy', intensity: 1 },
  { distance: 12500, type: 'track', intensity: 1.6 },
  { distance: 0, type: 'rest', intensity: 1 },
  { distance: 11800, type: 'easy', intensity: 1 },
];

let calcInjuryStress = (i) => {
  if (training[i].injury || (i - 1 >= 0 && training[i - 1].injuryStress && training[i - 1].injuryStress !== 0)) {
    return training[i - 1].injuryStress && training[i - 1].injuryStress > 0.2 ? Math.round((training[i - 1].injuryStress - 0.1) * 10) / 10 : 1.5;
  }

  return null;
}

for (let i = 0; i < 10; i += 1) {
  training[i].injuryStress = calcInjuryStress(i);
}

for (let i = 10; i < training.length; i += 1) {
  training[i].stress = 0;
  training[i].injuryStress = 0;

  for (let j = i; j >= i - 10; j -= 1) {
    // currentDay = 1, yesterday = 0.9, before yesterday = 0.8 ... currentDay - 9 = 0.1
    const daySignificance = Math.round((1 - (i - j) / 10) * 10) / 10;
    training[i].stress += training[j].distance * training[j].intensity * daySignificance;
  }

  training[i].injuryStress = calcInjuryStress(i);
  training[i].stress = Math.round(training[i].stress * training[i].injuryStress / 1000);
}

console.log(training);

// OUTPUT:
// [
//   { distance: 5000, type: 'easy', intensity: 0.9, injuryStress: null },
//   { distance: 10000, type: 'easy', intensity: 0.9, injuryStress: null },
//   { distance: 0, type: 'rest', intensity: 1, injuryStress: null },
//   { distance: 14160, type: 'track', intensity: 1.6, injuryStress: null },
//   { distance: 12010, type: 'easy', intensity: 1, injuryStress: null },
//   { distance: 12000, type: 'hills', intensity: 1.6, injuryStress: null },
//   { distance: 19000, type: 'long', intensity: 0.9, injuryStress: null },
//   { distance: 0, type: 'rest', intensity: 1, injuryStress: null },
//   { distance: 0, type: 'rest', intensity: 1, injury: true, injuryStress: 1.5 },
//   { distance: 7000, type: 'easy', intensity: 1, injuryStress: 1.4 },
//   { distance: 8020, type: 'easy', intensity: 1, stress: 61, injuryStress: 1.3 },
//   { distance: 4380, type: 'easy', intensity: 0.9, stress: 49, injuryStress: 1.2 },
//   { distance: 11680, type: 'race', intensity: 2, stress: 61, injuryStress: 1.1 },
//   { distance: 0, type: 'rest', intensity: 1, stress: 44, injuryStress: 1 },
//   { distance: 9830, type: 'track', intensity: 1.6, stress: 46, injuryStress: 0.9 },
//   { distance: 7880, type: 'easy', intensity: 1, stress: 39, injuryStress: 0.8 },
//   { distance: 12500, type: 'track', intensity: 1.6, stress: 43, injuryStress: 0.7 },
//   { distance: 0, type: 'rest', intensity: 1, stress: 31, injuryStress: 0.6 },
//   { distance: 11800, type: 'easy', intensity: 1, stress: 28, injuryStress: 0.5 }
// ]