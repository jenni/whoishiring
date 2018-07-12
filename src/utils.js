import groupBy from "lodash/groupBy";

var colors = [
    "aqua",
    "blue",
    "fuchsia",
    "green",
    "lime",
    "maroon",
    "navy",
    "olive",
    "orange",
    "purple",
    "red",
    "silver",
    "teal",
    "yellow"
  ];

export const chartOptions =  {

	///Boolean - Whether grid lines are shown across the chart
	scaleShowGridLines : true,

	//String - Colour of the grid lines
	scaleGridLineColor : "rgba(0,0,0,.05)",

	//Number - Width of the grid lines
	scaleGridLineWidth : 1,

	//Boolean - Whether to show horizontal lines (except X axis)
	scaleShowHorizontalLines: true,

	//Boolean - Whether to show vertical lines (except Y axis)
	scaleShowVerticalLines: true,

	//Boolean - Whether the line is curved between points
	bezierCurve : true,

	//Number - Tension of the bezier curve between points
	bezierCurveTension : 0.4,

	//Boolean - Whether to show a dot for each point
	pointDot : true,

	//Number - Radius of each point dot in pixels
	pointDotRadius : 4,

	//Number - Pixel width of point dot stroke
	pointDotStrokeWidth : 1,

	//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
	pointHitDetectionRadius : 20,

	//Boolean - Whether to show a stroke for datasets
	datasetStroke : true,

	//Number - Pixel width of dataset stroke
	datasetStrokeWidth : 2,

	//Boolean - Whether to fill the dataset with a colour
	datasetFill : false,
	//String - A legend template
	legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",
	
	//Boolean - Whether to horizontally center the label and point dot inside the grid
	offsetGridLines : false
};

export const formatData = (data, monthFilter, yearFilter) => {
    const newData = data.map(company => {
      // this is to find the max number of open positions if the data contains several values for the same day
      const openpositionsByDay = groupBy(
        company.data,
        companyData => new Date(companyData.date.substring(0, 10))
      );
      const days = Object.keys(openpositionsByDay);
      let temp = {};
      days.forEach(day => {
        const date = new Date(day);
        const month = date.getMonth();
        const year = date.getFullYear();
        // get data only for the specified month
        if (month === monthFilter && year === yearFilter) {
          const positionsInSameDay = openpositionsByDay[day];
          temp = {
            ...temp,
            [date.getDate()]: Math.max.apply(
              Math,
              positionsInSameDay.map(values => values.value)
            )
          };
        }
      });
      return { name: company.name, openpositions: temp };
    });
    let labels = [...Array(daysInMonth(monthFilter + 1, yearFilter)).keys()];
    labels = labels.map(label => (label + 1).toString());
    const datasets = newData.map((company, id) => {
      let companyData = new Int8Array(labels.length);
      const openpositions = Object.keys(company.openpositions);
      openpositions.forEach(day => {
        const dayInt = parseInt(day, 10);
        companyData[dayInt] = company.openpositions[dayInt];
      });
      const color = colors[id];
      return {
        label: company.name,
        strokeColor: color,
        pointColor: color,
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: color,
        data: companyData
      };
    });
  
    return { labels, datasets };
  };
  
  // Month here is 1-indexed (January is 1, February is 2, etc). This is
  // because we're using 0 as the day so that it returns the last day
  // of the last month, so you have to add 1 to the month number
  // so it returns the correct amount of days
  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }