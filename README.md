# saxon-date

### An Anglo-Saxon Lunar Date generator - and BitBar plugin

According to the Venerable Bede, the pre-Christian Angles, Saxons, Jutes and Frisians used a soli-lunar calendar. In his book, *De Temporum Ratione*, published in the 725, Bede lays out the rules by which this calendar worked, and the names of the months among the English peoples.

I became curious how this calendar worked. So, using Bede's rules, I coded this Lunar calendar in Javascript. Because I could. Thanks, Bede.

## Rules
1.  Each month begins at the new moon. There are 12 months in a regular year, and 13 in an intercalary year.
2.  The year begins with the new moon following the winter solstice.
3.  Although the beginning of the year is linked to the winter solstice, the rule on intercalary months is goverened by the summer solstice: If, within a fortnight following the summer solstice, a new moon occurs, the next new moon (i.e., the one that will happen approximately 29 days later) is an intercalary month (Trilitha), which occurs every three to five years, making it a 13 month year, which keeps the seasons aligned. This was especially important for an agricultural society.

Using these ancient rules, saxon-date calculates the current date on the Anglo-Saxon calendar. It converts the date (either the current date, or one given to it on the command line) to the Julian Date (JD), then uses javascript libraries to calculate the JD of both the summer and winter solstice, as well as the date of the new moon, and the number of days that have elapsed since that time. It converts that JD into the equivalent Anglo-Saxon date, and returns that date as a string.

## Some Limitations
Saxon-date fails on dates that fall before April 1899, as that is the limit of accuracy for the moon phase calculation code that I am using. Future versions of saxon-date may use a different moon phase algorithm, or retrieve the phase information from an API.

Beginning in June 2020, saxon-date gained a month relative to the actual month, pointing out that there is a bug somewhere in the intercalary code. I havent had time to address it, or even look for it. I have temporarily forced the month to decrement, which will "fix" the error until June 2021. Hopefully, I will have enough time to look at it before then. 

If you find any other bug or defect in my code, please message me!

## What Year is It
For the purpose of saxon-date, I am using the Runic Era (RE) year. The RE is not a real thing. It basically just adds 250 years to the current Gregorian year. I wanted to use a year/era that was older than the current era to show that this traditional indigenous calendar, and the culture it is attached to, pre-dates the Christianization of Europe. However, since the Germanic peoples of northwest Europe were largely illiterate at that time, there does not seem to a historical era that fits the bill. 

## Command Line Notes
Entering `node saxon-date 2011.06.11` in the terminal will produce the Saxon Date for June 11th 2011 (so, big endian), which is 11 Afterlitha 2261 (which is little endian). So note that, the date on the command line should be entered numerically, year.month.day. You can use other separators, I just temd to use periods, but dashes and slashes work. But, be warned Frenchmen, you cannot use Roman numerals for the months.

## Bitbar Notes
Run `chmod +x plugin.sh.` on saxon-date.js to change the permissions on the file so Bitbar can run it.

filename: saxon-date.1h.js
The "1h" part causes the date to refresh every hour. This is adjustable, as a Bitbar feature.

**Note:** It may be necessary to comment out (or in) certain lines. I left comments in the code to indicate that.

This readme.md was updated on the 13th day of Afteryule in the Runic Year 2270.
Readme.md was updated on the 6th day of Holymonth in 2270.
