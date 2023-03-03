// Load data from cyclist-data.json using the Fetch API
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(response => response.json())
  .then(data => {
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#plot')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
      .range([0, width]);

    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.Seconds * 1000)))
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .call(yAxis);

    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
      .attr('r', 6)
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => new Date(d.Seconds * 1000))
      .on('mouseover', (event, d) => {
        d3.select('#tooltip')
          .html(
            `Name: ${d.Name}<br>
             Year: ${d.Year}<br>
             Time: ${d.Time}<br>
             ${d.Doping ? 'Doping Allegations: ' + d.Doping : 'No Doping Allegations'}`
          )
          .attr('data-year', d.Year)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 30 + 'px')
          .style('opacity', 0.9);
      })
      .on('mouseout', () => {
        d3.select('#tooltip').style('opacity', 0);
      });

    // Append x-axis label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom)
      .text('Year');

    // Append y-axis label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 20)
      .attr('transform', 'rotate(-90)')
      .text('Time (minutes)');

    // Append y-axis tick labels
    svg.selectAll('.y-axis .tick')
      .append('text')
      .attr('x', -10)
      .attr('y', 0)
      .attr('dy', '0.32em')
      .text(d => d3.timeFormat('%M:%S')(new Date(d * 1000)));

    // Append legend
    const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width - 50}, ${height - 100})`);

    legend.append('circle')
      .attr('class', 'dot')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 6)
      .style('fill', 'blue');

    legend.append('text')
      .attr('x', 10)
      .attr('y', 5)
      .text('No Doping Allegations');

    legend.append('circle')
      .attr('class', 'dot')
      .attr('cx', 0)
      .attr('cy', 20)
      .attr('r', 6)
      .style('fill', 'blue')
      .style('opacity', 0.7);

    legend.append('text')
      .attr('x', 10)
      .attr('y', 25)
      .text('Doping Allegations');
  })
  .catch(error => console.log(error));