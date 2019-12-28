#!/usr/bin/env /usr/local/bin/node

/*
Saxon Date Node App
  Equinox algorithm adapted from:
  Juergen Giesen 6.5.2012
  based on 
    Equinoxes and Solstices
    algorithm from Meeus
  Moon Phase algorithm by Endel Dreyer Github @endel
  by Jerry L Hoover 2019.12.04 (8 Ereyule 2269)
  Command Line option added 4 Afteryule 2270
*/

//BitBar metadata
// bitbar.title - Saxon Date
// bitbar.version - Version 1.0
// bitbar.author - Jerry L Hoover
// bitbar.author.github - realjhoo
// bitbar.desc - Calculates the date using the Saxon lunisolar calendar
// bitbar.image - working...
// bitbar.dependencies - working...
// bitbar.abouturl - Absolute URL to about information

// ========================================================
function sSolstice(year) {
  const K = Math.PI / 180.0;
  let T, W, dL, ssJD;
  let y = (year - 2000) / 1000;
  let JDE0 =
    2451716.56767 +
    365241.62603 * y +
    0.00325 * y * y +
    0.00888 * y * y * y -
    0.0003 * y * y * y * y;

  T = (JDE0 - 2451545.0) / 36525.0;
  W = 35999.373 * T - 2.47;
  W *= K;
  dL = 1.0 + 0.0334 * Math.cos(W) + 0.0007 * Math.cos(2 * W);

  // summer solstice Julian Date = ssJD
  ssJD = JDE0 + (0.00001 * S(T)) / dL - (66.0 + (year - 2000) * 1.0) / 86400.0;

  return ssJD;
}

// ========================================================
function S(T) {
  const K = Math.PI / 180.0;
  let x;
  x = 485 * Math.cos(K * (324.96 + 1934.136 * T));
  x += 203 * Math.cos(K * (337.23 + 32964.467 * T));
  x += 199 * Math.cos(K * (342.08 + 20.186 * T));
  x += 182 * Math.cos(K * (27.85 + 445267.112 * T));
  x += 156 * Math.cos(K * (73.14 + 45036.886 * T));
  x += 136 * Math.cos(K * (171.52 + 22518.443 * T));
  x += 77 * Math.cos(K * (222.54 + 65928.934 * T));
  x += 74 * Math.cos(K * (296.72 + 3034.906 * T));
  x += 70 * Math.cos(K * (243.58 + 9037.513 * T));
  x += 58 * Math.cos(K * (119.81 + 33718.147 * T));
  x += 52 * Math.cos(K * (297.17 + 150.678 * T));
  x += 50 * Math.cos(K * (21.02 + 2281.226 * T));

  x += 45 * Math.cos(K * (247.54 + 29929.562 * T));
  x += 44 * Math.cos(K * (325.15 + 31555.956 * T));
  x += 29 * Math.cos(K * (60.93 + 4443.417 * T));
  x += 18 * Math.cos(K * (155.12 + 67555.328 * T));

  x += 17 * Math.cos(K * (288.79 + 4562.452 * T));
  x += 16 * Math.cos(K * (198.04 + 62894.029 * T));
  x += 14 * Math.cos(K * (199.76 + 31436.921 * T));
  x += 12 * Math.cos(K * (95.39 + 14577.848 * T));
  x += 12 * Math.cos(K * (287.11 + 31931.756 * T));
  x += 12 * Math.cos(K * (320.81 + 34777.259 * T));
  x += 9 * Math.cos(K * (227.73 + 1222.114 * T));
  x += 8 * Math.cos(K * (15.45 + 16859.074 * T));

  return x;
}

// ========================================================
function JDtoDateString(JD) {
  let hour, day, month, year;
  let B, D, F;
  let JD0, C, E;
  let diff, min, str, timeStr;

  JD0 = Math.floor(JD + 0.5);
  B = Math.floor((JD0 - 1867216.25) / 36524.25);
  C = JD0 + B - Math.floor(B / 4) + 1525.0;
  D = Math.floor((C - 122.1) / 365.25);
  E = 365.0 * D + Math.floor(D / 4);
  F = Math.floor((C - E) / 30.6001);

  // DAY
  day = Math.floor(C - E + 0.5) - Math.floor(30.6001 * F);
  dayStr = "" + day;
  if (day < 10) dayStr = " " + dayStr;

  // MONTH
  month = F - 1 - 12 * Math.floor(F / 14);

  // YEAR
  year = D - 4715 - Math.floor((7 + month) / 10);

  // TIME
  hour = 24.0 * (JD + 0.5 - JD0);
  diff = Math.abs(hour) - Math.floor(Math.abs(hour));
  min = Math.floor(Math.round(diff * 60.0));

  // roll over the minutes at 60
  if (min == 60) {
    min = 0;
    hour += 1;
  }

  // Possible correction for time zone
  // hour -= 6; // central standard time
  // hour -= 5; // central daylight time

  // format : and leading zeros
  if (min > 9) str = ":";
  else str = ":0";
  timeStr = Math.floor(hour) + str + min;
  if (Math.floor(hour) < 10) timeStr = "0" + timeStr;

  return [day, month, year];
}

// ========================================================
function moonPhase(date, month, yr) {
  let c = (e = jd = b = 0);

  if (month < 3) {
    yr--;
    month += 12;
  }

  month++; // because js months start with 0

  c = 365.25 * yr;
  e = 30.6 * month;
  jd = c + e + date - 694039.09;

  jd /= 29.5305882;

  b = parseInt(jd);
  jd -= b;

  return jd;

  // jd represents the age of the moon,
  // where 0 is new, 50 is full and 99 is about to be new
}

// ========================================================
function adjustYear(month, date, year) {
  const MAY = 4,
    JUNE = 5;

  if (month <= MAY) {
    year--;
  }
  if (month === JUNE) {
    // get day of solstice
    let [dayOfss, m, y] = JDtoDateString(sSolstice(year));

    // if date is before solstice decrement year
    if (date < dayOfss) {
      year--;
    }
  }

  return year;
}

// ========================================================
function isIntercalary(d, m, y) {
  const minNewMoon = 0.02;
  const maxNewMoon = 0.98;
  let intercalary = false;
  let justChanged = false;

  for (i = 0; i < 14; i++) {
    let moonAge = moonPhase(d + i, m, y);
    if (moonAge > maxNewMoon || (moonAge < minNewMoon && !justChanged)) {
      intercalary = true;
      justChanged = true;
    } else {
      justChanged = false;
    }
  }
  return intercalary;
}

// ========================================================
function getSaxonYear(today, moon, year) {
  let saxonYear = year;

  // New Year is 1 Afteryule, so adjust year
  if (saxonMonth[moon] === "Afteryule" && today.getMonth() === 11) {
    saxonYear += 251;
  } else {
    saxonYear += 250;
  }

  return saxonYear;
}

// ========================================================
function getSaxonDate(intercalary, ssDateString, today, year) {
  const minNewMoon = 0.02;
  const maxNewMoon = 0.98;
  const ssDate = new Date(ssDateString);
  const ssJulianDate =
    Math.floor(ssDate.valueOf() / (1000 * 60 * 60 * 24) - 0.5) + 2440588;
  const todayJulianDate =
    Math.floor(today.valueOf() / (1000 * 60 * 60 * 24) - 0.5) + 2440588;
  let saxonDayCount = todayJulianDate - ssJulianDate;
  let saxonDay = (moon = 0);
  let justChanged = false;

  for (let i = 0; i <= saxonDayCount; i++) {
    saxonDay++;

    // CONVERT ssJulianDate TO m d y
    let [tago, monato, jaro] = JDtoDateString(ssJulianDate + i);

    // CHECK MOONPHASE
    let moonAge = moonPhase(tago, monato, jaro);

    if (moonAge > maxNewMoon || (moonAge < minNewMoon && !justChanged)) {
      justChanged = true;
      // skip Thrilitha if a 12 moon year
      if (intercalary === false && moon === 0) {
        moon++;
      }
      moon++;
      saxonDay = 1; // reset date, new moon
    } else {
      justChanged = false;
    }
    // ***************************
    //console.log(saxonMonth[moon]);
    // ***************************
  }

  const saxonYear = getSaxonYear(today, moon, year);

  const saxonDate = saxonDay + " " + saxonMonth[moon] + " " + saxonYear;

  return saxonDate;
}

// ========================================================
function main(dateArg) {
  let intercalary = false;
  let today; // to give proper scope

  if (dateArg === "") {
    today = new Date();
  } else {
    today = new Date(dateArg);
  }

  let day = today.getDate(),
    month = today.getMonth(),
    ssyear = today.getFullYear(),
    year = today.getFullYear();

  // if before summer solstice, decrement year
  ssyear = adjustYear(month, day, ssyear);

  // get day month and year of summer solstice
  const [d, m, y] = JDtoDateString(sSolstice(ssyear));
  const ssDateString = y + "/" + m + "/" + d; // use / for Safari

  // 13 moons or 12?
  intercalary = isIntercalary(d, m, y);

  // get computed Saxon Date
  let saxonDate = getSaxonDate(intercalary, ssDateString, today, year);

  // bit bar grabs display from this log statement
  console.log(saxonDate + "     ");
}

// ========================================================
const saxonMonth = [
  "Afterlitha",
  "Trilitha",
  "Weed",
  "Holy",
  "Winterful",
  "Blot",
  "Ereyule",
  "Afteryule",
  "Sol",
  "Reda",
  "Easter",
  "Trimilch",
  "Erelitha"
];

let dateArg = "";
dateArg = process.argv.slice(2).toString();
main(dateArg);
