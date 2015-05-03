function generate_random_data() {
  var dataset = [];                        //Initialize empty array
  for (var i = 0; i < 25; i++) {           //Loop 25 times
      var newNumber = Math.floor(Math.random() * (100 - 0)) + 0
      dataset.push(newNumber);             //Add new number to array
  }
  return dataset
}

dataset = generate_random_data()

var w = 850;
var h = 80;

var margin = { left : 10, right : 10}


var xmax = d3.max(dataset,function (d) { return d;})

var xmin = d3.min(dataset,function(d){ return d;})

var xScale = d3.scale.linear()
                    .domain([0,xmax])
                    .range([0,w])

function buildTimeline(data) {

  var xTimeScale = d3.time.scale()
            .domain([new Date(data[0]), d3.time.day.offset(new Date(data[data.length - 1]), 1)])
            .rangeRound([0, w  - margin.right]);

  var svg = d3.select('#history').append('svg').attr('width',w).attr('height',h)

  var xAxis = d3.svg.axis().scale(xTimeScale)
                           .orient("bottom")
                           //.ticks(d3.time.days, 1)
                           .ticks(5)
                           .tickFormat(d3.time.format('%d/%m'))
                           .tickPadding(8)

  svg.append("g")
    .attr("class","axis")
    .attr("transform", "translate(0,"+h/2+")")
    .call(xAxis)


  rect_data = []

  for (var i = 0 ; i < data.length  - 1 ; i++){
    rect_data[i] = {
      last : data[i+1],
      first : data[i],
      duration : data[i+1] - data[i]
  }
}

  var rectangles = svg.selectAll('rect')
                      .data(rect_data)
                      .enter()
                      .append('rect')
  rectangles.attr('x',function (d) {
    return xTimeScale(d.first)
  })
  .attr('y',function (d) {
    return (h/2 - 5)
  })
  .attr('width',function (d) {
    return (xTimeScale(d.last) - xTimeScale(d.first))
  })
  .attr('height',10)
  .attr('fill',function (d) {
    var diffDays = Math.ceil(d.duration / (1000 * 3600 * 24));

    if (diffDays < 3){
      return 'rgba(93, 236, 37, 0.46)';
    }
    else if (diffDays < 5){
      return 'rgba(255, 145, 0, 0.69)';
    }
    else{
      return 'rgba(255, 0, 12, 0.58)';
    }

  });

  var circles = svg.selectAll('circle')
                    .data(data)
                    .enter()
                    .append("circle")

  circles.attr("cx", function (d){
    return xTimeScale(d)
  })
  .attr("cy",function (d) {
    return h/2
  })
  .attr("r",5)
  .attr("fill", "teal")
  .attr("class","dot");

}

function buildFocus(data) {
  var w = 900
  var h = 200
  var svg = d3.select('#focus').append('svg').attr('width',w).attr('height',h);
  var number_of_focus_days = 21;

  var random_dataset = generate_random_data()

  if (data.length < 2){
    return
  }

  dat = data.slice(data.length - 2, data.length - 1);

  // Today's date :
  today = new Date()

  var xTimeScale = d3.time.scale()
            .domain([d3.time.day.offset(new Date(),-number_of_focus_days), new Date()])
            .rangeRound([0, w  - margin.right]);

  var xAxis = d3.svg.axis().scale(xTimeScale)
                           .orient("bottom")
                           .ticks(d3.time.days,1)
                           .tickFormat(d3.time.format('%d/%m'))


  svg.append("g")
    .attr("class","axis")
    .attr("transform", "translate(0,"+9*h/10+")")
    .call(xAxis)


  var todayMarker = svg.selectAll('rectangles').data([today]).enter().append('rect')

  todayMarker.attr('x',function (d) {
    return xTimeScale(d)
  })
  .attr('y',function (d) {
    return 0
  })
  .attr('width',2)
  .attr('height',9*h/10)
  .attr('fill','black')


  var dates_range = []
  for (var i = 100 ; i >= 0 ; i-- ){
      dates_range.push({date : d3.time.day.offset(new Date(),-i), val : Math.floor(Math.random() * (100 - 0)) + 0 })
  }

  var gradations = svg.selectAll('rectangles').data(dates_range).enter().append('rect')

  gradations.attr('x',function (d,i) {
      return xTimeScale(d.date) + 0
  })
  .attr('y',function (d) {
    return 9*h/10 - d.val
  })
  .attr('width',10)
  .attr('height',function (d) {
    return d.val
  })
  .attr('fill',function (d) {
    if (d.val < 2){
      return '#2eb6cc'
    }
    else if (d.val > 85){
      return 'rgba(255, 59, 0, 0.67)'
    }
    else {
      return 'teal'
    }
  })
  .attr('opacity','0.5');


  var markers = svg.selectAll('rectangles').data(dat).enter().append('rect')

  markers.attr('x',function (d) {
    return xTimeScale(d)
  })
  .attr('y',0)
  .attr('width',8)
  .attr('height',9*h/10)
  .attr('fill','green');


  var probasValues = svg.selectAll("rectangles").data(dates_range).enter().append('text')

  probasValues.text(function (d) { return d.val})
              .attr('y',function (d) {
                return 9*h/10 - d.val
              })
              .attr('x',function (d,idx) {
                return xTimeScale(d.date)
              })
              .attr('dy',-8)
              .attr('dx',-1)
              .attr('font-size',10);

}

dateParser = d3.time.format('%Y-%m-%d').parse

d3.csv("dates.csv")
.row(function (d) {
  return dateParser(d.date)
})
.get(function (error,rows) {
  buildTimeline(rows);
  buildFocus(rows)
})
