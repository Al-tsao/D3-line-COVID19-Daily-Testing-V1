async function draw() {
  // Data
  const dataset = await d3.csv('covid19_daily_test.csv')

  // Data Parse
  const parseData = d3.timeParse('%Y/%m/%d')
  const xAccessor = d => parseData(d.date)
  const yAccessor = d => parseInt(d.testing)


  // Dimensions
  let dimensions = {
    width: 1000,
    height: 500,
    margins: 100,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Ctr
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  // Scales
  const xScale = d3.scaleUtc()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.ctrWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.ctrHeight, 0])
    .nice()

  // Img
  const lineGenerator = d3.line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)))

  ctr.append('path')
    .datum(dataset)
    .attr('d', lineGenerator)
    .attr('fill', 'none')
    .attr('stroke', '#30475e')
    .attr('stroke-width', 2)

  // Axis
  // Y axis
  const yAxis = d3.axisLeft(yScale)
    .tickFormat((d) => {
      const addComma = d3.format(",")
      const newFormat = addComma(d)
      return `${newFormat}`
    })

  const yAxisGroup = ctr.append('g')
    .call(yAxis)
    .classed('axis', true)

  yAxisGroup.append('text')
    .attr('y', -60)
    .attr('x', -(dimensions.ctrHeight / 2))
    .attr('fill', 'black')
    .text('Number')
    .style('transform', 'rotate(270deg)')
    .style('text-anchor', 'middle')

  // X axis
  const xAxis = d3.axisBottom(xScale)
    .tickFormat((d) => {
      dateFormatter = d3.timeFormat('%Y/%m/%d')
      date = dateFormatter(d)
      return date
    })
    // .ticks(3)
    .tickValues([
      parseData('2020/03/01'),
      parseData('2020/06/01'),
      parseData('2020/09/01'),
      parseData('2020/12/01'),
      parseData('2021/03/01'),
      parseData('2021/06/01'),
    ])


  const xAxisGroup = ctr.append('g')
    .style('transform', `translateY(${dimensions.ctrHeight}px)`)
    .call(xAxis)
    .classed('axis', true)

  xAxisGroup.append('text')
    .attr('x', dimensions.ctrWidth / 2)
    .attr('y', 35)
    .attr('fill', 'black')
    .text('Testing')



}
draw()