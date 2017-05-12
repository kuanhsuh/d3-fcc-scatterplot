
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var timeFormat = d3.time.format("%M:%S");
var yearFormat = d3.time.format("%Y");

//setup X
var x = d3.time.scale()
        .range([0, width]);
var xValue = (d)=>d.Year

var y = d3.time.scale()
        .range([0, height]);
var yValue = (d)=>d.Time

var cValue = (d)=> {
  return d.Doping.length === 0 ? "No Doping" : "Doping"
}
var color = d3.scale.category10();

var xAxis = d3.svg.axis()
              .scale(x)
              .tickFormat(yearFormat)
              .orient("bottom")

var yAxis = d3.svg.axis()
              .scale(y)
              .tickFormat(timeFormat)
              .orient("left")

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(error, data) {
  if (error) return console.warn(error);
  // console.log(data)


  data.forEach((d)=>{
    d.Time = timeFormat.parse(d.Time)
    d.Year = yearFormat.parse(d.Year+"")
  });

  y.domain(d3.extent(data, (d)=> d.Time )).nice();
  x.domain(d3.extent(data, (d)=> d.Year )).nice();

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Time in Minutes");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", (d) => x(d.Year))
      .attr("cy", (d) => y(d.Time))
    .style("fill", (d) => color(cValue(d)))
    .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html( `Name: ${d.Name} <br />Year: ${yearFormat(xValue(d))}
                        Time: ${timeFormat(yValue(d))} <br /><br />
                        ${d.Doping}
                        `)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

    var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text((d) => d);


});
