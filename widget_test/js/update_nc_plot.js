function update_nc_plot(country){

		nc_svg.selectAll("*").remove();

		var max = 0;

		var minDate = new Date();
		var maxDate = new Date();

		d3.csv(nc_data)
		  .row(function(d) {
		        return {
		            date: parseDate(d.date),
		            median: parseFloat(d.median),
		            lower_90: parseFloat(d.bottom),
		            upper_90: parseFloat(d.top),
		            lower_50: parseFloat(d.lower),
		            upper_50: parseFloat(d.upper),
		            cases: parseFloat(d.cases)
		        }; 
		   })
		  .get(function(error, data) {

		  	cases_ymax = d3.max(data, function(d) { return d.cases; });

		  	estim_ymax = d3.max(data, function(d) { return d.upper_90; });

		  	ymax = d3.max(Array(cases_ymax, estim_ymax))

		  	if (data.length == 0){
	  			console.log('no data')
	  			nc_svg.append("text")
				    .attr("x", nc_width / 2 )
				    .attr("y", nc_height / 2)
				    .text("- no data -")
				    .attr("fill", "gray");

				return;
	  		}

	  		/* mak emin date the date of first case - this is vulnerable to disorganized dates (ok if input is standard) */ 
	  		minDate = d3.min(data, function(d) {
	  			if (d.cases > 1){
	  				return(d.date)
	  			}
	  		});
			maxDate = d3.max(data, function(d) { return d.date; });

			var y = d3.scaleLinear()
						.domain([0,ymax])
						.range([nc_height,0]);

			var x = d3.scaleTime()
						.domain([minDate,maxDate])
						.range([0,nc_width]);
	

			console.log(minDate, maxDate)

			/* add bar plot */
			nc_svg.selectAll('rect')
			  .data(data)
			  .enter()
			  .append('rect')
			  .attr('height', function(d, i) {return nc_height - y(d.cases);})
			  .attr('y', function(d, i) {return y(d.cases);})
			  .attr("width", function(d) {return x(d3.timeDay.offset(d.date, 1)) - x(d.date)})
			  .attr('x', function(d, i) {return x(d3.timeDay.offset(d.date, -0.5));})
			  .attr('class', 'cases_bar')

			/* add 90% ci poly */
			nc_svg.append("path")
				.datum(data)
				.attr("class", "poly90")   
				.attr("d", d3.area()
				    .x(function(d) { return x(d.date) })
				    .y0(function(d) { return y(d.upper_90) })
				    .y1(function(d) { return y(d.lower_90) })
			)

			/* add 50% ci poly */
			nc_svg.append("path")
				.datum(data)
				.attr("class", "poly50") 
				.attr("d", d3.area()
				    .x(function(d) { return x(d.date) })
				    .y0(function(d) { return y(d.upper_50) })
				    .y1(function(d) { return y(d.lower_50) })
			)

			/* add x axis line */
			nc_svg.append("g")
				.attr("class","axis x")
				.attr("transform","translate(0,"+nc_height+")")
				.call(d3.axisBottom(x));

			/* add y axis line */
			nc_svg.append("g")
				.attr("class","axis y")
				.call(d3.axisLeft(y));

			/* add title */
			nc_svg.append("text")
				    .attr("x", nc_width / 70 )
				    .attr("y", nc_height / 10)
				    .text(country)
				    .attr("fill", "black")
				    .attr("font-size","13px");



		  })

};