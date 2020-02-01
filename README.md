# saxon-date

### An Anglo-Saxon Lunar Date generator - and BitBar plugin

According the Venerable Bede, the pre-Christian Angles, Saxons, Jutes and Frisians used a soli-lunar calendar. In his book, De Temporum Ratione, published in the 700s, Bede lays out the rules by which this calendar worked, and the names of the months among the English peoples.

I became curious how this calendar worked. So, using Bede's rules, I coded this Lunar calendar in Javascript. Because I could. Thanks, Bede.

1.  Each month begins at the new moon. There are 12 months in a regular year, and 13 in an intercalary year.
2.  The year begins with the full moon following the winter solstice. (For purely aesethic reasons, I changed this to the first new moon after the winter solstice).
3.  If, within a fortnight following the summer solstice, a new moon occurs, the next new moon (i.e., the one that will happen approximately 29 days later) is an intercalary month, which occurs every three to five years, making it a 13 month year.

My lunar calendar, based on these ancient rules, calculates the current date in the Saxon calendar mathematically by calculating the dates of the summer solstice and each new moon. Saxon-Date does not use tables.

Currently, it fails on dates before 1899, due to the method of moon phase I am using. If you find any other bug or defect in this code, please message me!

This readme.md was updated on the 13th day of Afteryule in the Runic Year 2270.

## Bitbar Notes
Run `chmod +x plugin.sh.` on file so Bitbar can run it.

filename: saxon-date.1h.js
The "1h" part causes the date to refresh every hour. This is adjustable, as a Bitbar feature.

## Command Line Notes
Entering `node saxon-date 2011.06.11` in the terminal will produce the Saxon Date for June 11th 2011 (so, big endian), which is 11 Afterlitha 2261 (which is little endian). Sorry if that's confusing.
