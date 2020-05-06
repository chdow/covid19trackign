#Covid19Tracking
&copy; 2020 Christopher Dow [MIT](https://opensource.org/licenses/MIT) license
These are some tools to get data out of various data sources and into Google Sheets, as well as tools to run polynomial regressions and pick the "best" one that fits the current data, and update the sheets with the terms of those polynomials.

##License
This code is covered by the MIT license.

## Data Sources
###New York Times
The NYT data is available at git@github.com:nytimes/covid-19-data.git  This is where the data for counties and states is sourced.  

###Johns Hopkins
The Johns Hopkins data is available at git@github.com:CSSEGISandData/COVID-19.git  This is where data for countries is sourced.

##Google Sheets

In the end, all this data goes in to Google Sheets so the values can be seen and the results can be visualized.  

### Commonalities

Each sheet starts with a Data tab that contains all the case data in the data set.  After that, things are a bit different.  Counties has a sheet that simply counts the number of counties over time, while the global sheet has a map showing the relative number of cases in each country covered, and the states sheet has a line, then a stacked bar chart showing the number of cases in the states. 

After those differences, the sheets have pairs of sheets containing data for a particular entity and computed regression & extrapolation of that data, followed by a graph of those, including total and new cases, both measured and predicted.  

After the series of data/graph pairs, there are tabs that pull out the data for a particular entity, then a series of tabs that transpose that data from horizontal to vertical (which just makes futzing about with the graphs less annoying).

### Johns Hopkins Data
The [Hopkins Data Spreadsheet](https://docs.google.com/spreadsheets/d/1CdZ0GFiUOUmS4QHmdxsyaJUIX3hZW5mPPyDXUtDT0x8/edit?usp=sharing) has all the country case data in the Data tab, followed by a map tab, then a series of tabs alternating between country data and graphs of that data.  The countries selected are meaningful to me for various reasons.  You can copy the sheet and make your own list.  After the pairs of data/graphs, there is a sheet that sums up the global numbers, followed by a series of sheets that pull out the individual co

### New York Times Data
The [New York Times State Data](https://docs.google.com/spreadsheets/d/1ptKcB8kGJOfYSE9-64v4slYraY4CRpb5yb64WATUzH4/edit?usp=sharing) contains analysis of states that are interesting to me either because I have friends/family there, or the state is handling the pandemic in a way that (either good or bad) that makes me want to look at it.  

The [New York Times County Data](https://docs.google.com/spreadsheets/d/1A8EBz1u-tLTTVNtTJz0sXJqPt-QV7CC9OQTJ4cT5-lU/edit?usp=sharing) contains analysis of counties that are interesting to me.

##Scripts
The script update-states.js will update a spreadsheet with the state data, and update-counties.js will update the county data.  update-jh.js will update a sheet with the Hopkins country data.

The poorly-named get-numbers.js script will pull the data from the specified tab on the specified sheet, run polynomial regressions of order 1-7 on the data, select the order that most closely predicts the current case number, and update the tab in the spreadsheet with the terms of the equation, which will then recompute the regression and the extrapolation.

## Polynomial Regression
The spreadsheets use polynomials to get a curve that can be extrapolated to either predict future growth in cases, or to judge how well the data set is above or below the predicted curve.

The form of the polynomial is : 
>>y = ax<sup>7</sup> + bx<sup>6</sup> + cx<sup>5</sup> + dx<sup>4</sup> + ex<sup>3</sup> + fx<sup>2</sup> + gx<sup>1</sup> + hx<sup>0</sup>

Of course x<sup>0</sup> for any value of x is 1.

Each data tab pulls the terms of the equation from specific cells that are updated by get-numbers.js and does the regression or extrapolation by summing the terms on the same row as the data.  This made for easy debugging in the early days of these spreadsheets.

##Other Stuff in Here
There is also some code in here to process data from the [COVID Tracking Project](https://covidtracking.com), but it is less mature.