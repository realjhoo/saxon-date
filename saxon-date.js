#!/usr/bin/env /usr/local/bin/node
// bash line for bitbar - comment out for non-node

/*
Saxon Date Node App / BitBar Plugin / Web Page
by jan Uwe 2019.12.04 (8 Ereyule 2269)
Updated 2020.12.29 (16 Ereyule 2270)
Added Command Line option 4 Afteryule 2270
Adding Calendar feature (20 Sol 2271)
* Equinox algorithm adapted from:
* Juergen Giesen 6.5.2012
* Moon Phase algorithm by Endel Dreyer Github @endel
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

// dates do not work before March 1 AD 1900
"use strict";
// --------------------------------------------------------
function getSaxonMonth(index) {
  return [
    "Afterlitha",
    "Trilitha",
    "Weed",
    "Holy",
    "Winterful",
    "Blot",
    "Ereyule",
    "Afteryule",
    "Sol",
    "Retha",
    "Easter",
    "Trimilch",
    "Erelitha",
  ][index];
}

// ========================================================
function getJulianDate(date, month, year) {
  // returns julian date
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let JD =
    date +
    Math.floor((153 * m + 2) / 5) +
    y * 365 +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  return JD;
}

// ========================================================
function getSolsticeJD(year) {
  // returns the julian date of the summer solstice in a given year
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

  ssJD = JDE0 + (0.00001 * S(T)) / dL - (66.0 + (year - 2000) * 1.0) / 86400.0;

  return ssJD;
}

// ======Helper Function for sSolstice=====================
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
  let date, month, year;
  let B, D, F;
  let JD0, C, E;

  JD0 = Math.floor(JD + 0.5);
  B = Math.floor((JD0 - 1867216.25) / 36524.25);
  C = JD0 + B - Math.floor(B / 4) + 1525.0;
  D = Math.floor((C - 122.1) / 365.25);
  E = 365.0 * D + Math.floor(D / 4);
  F = Math.floor((C - E) / 30.6001);
  date = Math.floor(C - E + 0.5) - Math.floor(30.6001 * F);

  month = F - 1 - 12 * Math.floor(F / 14);
  year = D - 4715 - Math.floor((7 + month) / 10);

  return [date, month, year];
}

// ========================================================
function isNewMoon(date, month, year) {
  // use min and max to tune the sensitivity for new moon detection
  const maxNewMoon = 0.98; // moon is almost new
  const minNewMoon = 0.02; // moon is just past new

  let newMoon = false;

  if (month < 3) {
    year--;
    month += 12;
  }

  month++; // because jan = 0

  let c = 365.25 * year; // mean length of calendar year
  let e = 30.6 * month; // mean length of calendar month

  let moonAge = c + e + date - 694039.09; // num of days since known new moon 1900.01.01
  moonAge /= 29.5305882; // average duration of lunation

  // remove the whole number, leave fraction (current age of moon)
  let moonAgeInteger = parseInt(moonAge);
  moonAge -= moonAgeInteger; // a number between 0 & 1

  if (moonAge > maxNewMoon || moonAge < minNewMoon) {
    newMoon = true;
  } else {
    newMoon = false;
  }

  return newMoon;
}

// ========================================================
function adjustYear(day, month, year) {
  // if solstice hasnt happened yet, use last year's solstice
  const MAY = 4; // solstice hasnt happened yet
  const JUNE = 5; // solstice happens in june

  if (month <= MAY) {
    year--;
  }
  if (month === JUNE) {
    // find date of solstice. Returns array but m & y not used
    let [dayOfss, m, y] = JDtoDateString(getSolsticeJD(year));

    // if date is before solstice decrement year
    if (day < dayOfss) {
      year--;
    }
  }

  return year;
}

// ========================================================
function isIntercalary(d, m, y) {
  let intercalary = false;
  let justChanged = false;
  const fortnight = 14; // a new moon within 14 days of solstice triggers intercalary month following Afterlitha

  for (let i = 0; i < fortnight; i++) {
    let newMoon = isNewMoon(d + i, m, y);
    if (newMoon && !justChanged) {
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
  if (getSaxonMonth(moon) === "Afteryule" && today.getMonth() === 11) {
    saxonYear += 251;
  } else {
    saxonYear += 250;
  }

  return saxonYear;
}

// ========================================================
function isBetween(julianDateToday, julianDateSS) {
  // is the the date between the solstice and the new moon?
  let newMoon = false;
  let ctr = 0;

  do {
    // start at solstice: check following days for new moon
    let [day, month, year] = JDtoDateString(julianDateSS + ctr);
    newMoon = isNewMoon(day, month, year);

    if (newMoon) {
      let julianDateNM = getJulianDate(day, month, year);

      if (julianDateToday < julianDateNM && julianDateToday > julianDateSS) {
        return true;
      }
    }
    ctr++;
  } while (newMoon === false);
}

// ========================================================
function fixTheDate(julianDateSS) {
  let newMoon = false;
  let ctr = 0;

  do {
    // start at solstice: walk back days & check for new moon
    let [day, month, year] = JDtoDateString(julianDateSS + ctr);
    newMoon = isNewMoon(day, month, year);

    if (newMoon) {
      return ctr;
    }
    ctr--;
  } while (newMoon === false);
}

// ========================================================
function getSaxonDate(intercalary, ssDateString, today, year) {
  // ss = summer solstice
  const ssDate = new Date(ssDateString);
  const ssDay = ssDate.getDate();
  const ssMonth = ssDate.getMonth() + 1;
  const ssYear = ssDate.getFullYear();

  const currDate = new Date();
  const currDay = currDate.getDate();
  const currMonth = currDate.getMonth() + 1;
  const currYear = currDate.getFullYear();

  const ssJulianDate = getJulianDate(ssDay, ssMonth, ssYear);
  const todayJulianDate = getJulianDate(currDay, currMonth, currYear);
  let daysSinceSolstice = todayJulianDate - ssJulianDate;

  // initialize and scope vars
  let saxonDay = 0;
  let moon = -1; // will this break at the summer solstice???
  let justChanged = false;
  let daysElapsed = 0;

  // dates between solstice and 1st new moon need fixing
  let dateIsBetween = isBetween(todayJulianDate, ssJulianDate);

  if (dateIsBetween) {
    daysElapsed = Math.abs(fixTheDate(ssJulianDate));
  }

  for (let i = 0; i <= daysSinceSolstice; i++) {
    saxonDay++;

    // Convert date of solstice to d,m,y -> test for new moon
    let [day, month, year] = JDtoDateString(ssJulianDate + i);
    let newMoon = isNewMoon(day, month, year);

    if (newMoon && !justChanged) {
      justChanged = true;

      if (intercalary === false && moon === 0) {
        // moon increments twice to skip Trilitha when not intercalary
        moon++;
      }
      moon++;
      // in case of moon overflow: 0-12 so 13 is always wrong
      if (moon > 12) {
        moon = 0;
      }
      saxonDay = 1; // reset date at new moon
    } else {
      justChanged = false;
    }

    // debug output
    // ***************************
    // gregorian date
    // console.log(month, day, year);
    // saxon month, moon#, day of 'moonth'
    // console.log(saxonMonth[moon], moon, saxonDay);
    // ***************************
  }

  saxonDay += daysElapsed + 1; // now agrees with day of the week
  const saxonYear = getSaxonYear(today, moon, year);
  const saxonDate = saxonDay + " " + getSaxonMonth(moon) + " " + saxonYear;

  return saxonDate;
}

// ========================================================
function main(dateArg) {
  // update CAREFULLY
  // let intercalary = false;
  let today; // to give proper scope

  // handle command arguments
  if (dateArg === "") {
    today = new Date();
  } else {
    today = new Date(dateArg);
  }

  const day = today.getDate(),
    month = today.getMonth(),
    year = today.getFullYear();

  // before summer solstice? decrement year
  let ssyear = adjustYear(day, month, year);

  // get date string of summer solstice
  const [d, m, y] = JDtoDateString(getSolsticeJD(ssyear));
  const ssDateString = y + "/" + m + "/" + d; // use / for Safari

  // 13 moons or 12?
  let intercalary = isIntercalary(d, m, y);

  // get computed Saxon Date
  let saxonDate = getSaxonDate(intercalary, ssDateString, today, year);

  // logs out saxon date for BitBar
  console.log(saxonDate);
}

// ========================================================
// for node apps
let dateArg = "";
dateArg = process.argv.slice(2).toString();
main(dateArg);
// -------------

// for testing
//main("2019.06.26");
// -----------
