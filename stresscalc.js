// (d) .distance = distance in meters for the day
// .type = type of training
// (i) .intensity = level of intensity of training (from 0.9 to 2.0) (ideally auto-calculated based on BPM, but TODO)
// .injury = if for the given day you felt an injury
// .injuryLevel = minor or major. If major, recovery is longer
// (i2) .injuryStress = rate of exposure to reinjure (from 1.1 to 2.0)
// (d2) daySignificance = rate of significance of a previous day compared to the current being calculated (from 0.9 to 0.1)
// (S) .stress = value autocalculated based on the previous factors, so: Σ (d2 = 1, d2 -= 0.1) [ S = d * i * d2 * i2 ]

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
    return training[i - 1].injuryStress && training[i - 1].injuryStress > 1 ? Math.round((training[i - 1].injuryStress - 0.1) * 10) / 10 : training[i].injury ? 1.5 : 1;
  }

  return 1;
}

for (let i = 0; i < training.length; i += 1) {
  training[i].stress = 0;
  training[i].injuryStress = 0;

  for (let j = i; j >= i - 10; j -= 1) {
    if (training[j]) {
      // currentDay = 1, yesterday = 0.9, before yesterday = 0.8 ... currentDay - 9 = 0.1
      const daySignificance = Math.round((1 - (i - j) / 10) * 10) / 10;
      training[i].stress += training[j].distance * training[j].intensity * daySignificance;
    }
  }

  training[i].injuryStress = calcInjuryStress(i);
  training[i].stress = Math.round(training[i].stress * training[i].injuryStress / 1000);
}

for (let d of training) {
  console.log(JSON.stringify(d));
}

// OUTPUT:
// {"distance":5000,  "type":"easy",  "intensity":0.9,  "stress":5,   "injuryStress":1}
// {"distance":10000, "type":"easy",  "intensity":0.9,  "stress":13,  "injuryStress":1}
// {"distance":0,     "type":"rest",  "intensity":1,    "stress":12,  "injuryStress":1}
// {"distance":14160, "type":"track", "intensity":1.6,  "stress":33,  "injuryStress":1}
// {"distance":12010, "type":"easy",  "intensity":1,    "stress":41,  "injuryStress":1}
// {"distance":12000, "type":"hills", "intensity":1.6,  "stress":56,  "injuryStress":1}
// {"distance":19000, "type":"long",  "intensity":0.9,  "stress":66,  "injuryStress":1}
// {"distance":0,     "type":"rest",  "intensity":1,    "stress":58,  "injuryStress":1}
// {"distance":0,     "type":"rest",  "intensity":1,    "injury":true,  "stress":74,  "injuryStress":1.5}
// {"distance":7000,  "type":"easy",  "intensity":1,    "stress":67,  "injuryStress":1.4}
// {"distance":8020,  "type":"easy",  "intensity":1,    "stress":61,  "injuryStress":1.3}
// {"distance":4380,  "type":"easy",  "intensity":0.9,  "stress":49,  "injuryStress":1.2}
// {"distance":11680, "type":"race",  "intensity":2,    "stress":61,  "injuryStress":1.1}
// {"distance":0,     "type":"rest",  "intensity":1,    "stress":44,  "injuryStress":1}
// {"distance":9830,  "type":"track", "intensity":1.6,  "stress":51,  "injuryStress":1}
// {"distance":7880,  "type":"easy",  "intensity":1,    "stress":49,  "injuryStress":1}
// {"distance":12500, "type":"track", "intensity":1.6,  "stress":61,  "injuryStress":1}
// {"distance":0,     "type":"rest",  "intensity":1,    "stress":52,  "injuryStress":1}
// {"distance":11800, "type":"easy",  "intensity":1,    "stress":56,  "injuryStress":1}