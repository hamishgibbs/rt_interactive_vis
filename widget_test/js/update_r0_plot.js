/* function to update ro plot on map click */
/* Hamish Gibbs LSHTM 2020 */

function update_r0_plot(country){

	r0_svg.selectAll("*").remove();

	var max = 0;

	var minDate = new Date();
	var maxDate = new Date();

	d3.csv(r0_data)
	  .row(function(d) {
	        return {
	        	country: d.country,
	            date: parseDate(d.date),
	            median: d.median,
	            lower_90: d.lower_90,
	            upper_90: d.upper_90,
	            lower_50: d.lower_50,
	            upper_50: d.upper_50
	        }; 
	   })
	  .get(function(error, data) {

	  		ymax = d3.max(data, function(d) { return d.upper_90; });

	  		var data = data.filter(data => data.country == country);

	  		if (data.length == 0){
	  			console.log('no data')
	  			r0_svg.append("text")
				    .attr("x", r0_width / 2 )
				    .attr("y", r0_height / 2)
				    .text("- no data -")
				    .attr("fill", "gray");

				return;
	  		}

	  		minDate = d3.min(data, function(d) {return d.date; });
			maxDate = d3.max(data, function(d) { return d.date; });

			var y = d3.scaleLinear()
						.domain([0,ymax])
						.range([r0_height,0]);

			var r0_x = d3.scaleTime()
						.domain([minDate,maxDate])
						.range([0,r0_width]);
			
			var r0_1_line = d3.line()
				.x(function(d){ return r0_x(d.date); })
				.y(function(d){ return y(1); })
				.curve(d3.curveCardinal);


			/* add 90% ci poly */
			r0_svg.append("path")
				.datum(data)
				.attr("class", "poly90")   
				.attr("d", d3.area()
				    .x(function(d) { return r0_x(d.date) })
				    .y0(function(d) { return y(d.upper_90) })
				    .y1(function(d) { return y(d.lower_90) })
			)

			/* add 50% ci poly */
			r0_svg.append("path")
				.datum(data)
				.attr("class", "poly50") 
				.attr("d", d3.area()
				    .x(function(d) { return r0_x(d.date) })
				    .y0(function(d) { return y(d.upper_50) })
				    .y1(function(d) { return y(d.lower_50) })
			)

			/* add r0_1_line horiz line */
			r0_svg.append("path")
				.datum(data)
				.attr("class", "r0_1_line")   
				.attr("d", r0_1_line)
				.attr("stroke-dasharray", "5,5")
				.attr("stroke", "black")
				.attr("stroke-width", "1")


			/* add x axis line */
			r0_svg.append("g")
				.attr("class","axis x")
				.attr("transform","translate(0,"+r0_height+")")
				.call(d3.axisBottom(r0_x));

			/* add y axis line */
			r0_svg.append("g")
				.attr("class","axis y")
				.call(d3.axisLeft(y));

			r0_svg.append("text")
				    .attr("x", r0_width / 70 )
				    .attr("y", r0_height / 10)
				    .text(country)
				    .attr("fill", "black")
				    .attr("font-size","13px");

	  });

	};