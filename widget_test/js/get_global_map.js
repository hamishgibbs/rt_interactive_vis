/* function to create a global map of rt estimates */
/* Hamish Gibbs LSHTM 2020 */

function get_global_map(){
	d3.json(map_data, function(error, world) {
		if (error) return console.error(error);

	  	var features = world.features;

	  	var projection = d3.geoCylindricalStereographic()
	  	  .scale(150)
	  	  .center([0, 0])
	  	  .translate([map_width / 2, map_height / 2]);


	  	var path = d3.geo.path()
		    .projection(projection);

		main_map_svg.selectAll('path')
		      .data(features)
		    .enter().append('path')
		      .attr('d', path)

		main_map_svg.selectAll(".features")
		    .data(features)
		  .enter().append("path")
		    .attr("class", function(d) { return "trajectory " + d.properties.c_traj; })
		    .attr("d", path)
		    .style('stroke', 'black')
		   	.style('stroke-width', '0.1')
		    .on('mouseover', map_mouseover)
		   	.on('mouseout', map_mouseout)
		   	.on('click', map_click)

	});

}

/* map interaction functions */

function map_mouseover(d){

  d3.select(this)
    .moveToFront()
  	.style('stroke', 'black')
  	.style('stroke-width', '0.9')
  	.attr('id', 'map_active');

}

function map_mouseout(d){

  d3.select(this)
  	.style('stroke', 'black')
  	.style('stroke-width', '0.3')
  	.attr('id', 'map_inactive');

}

function map_click(d){
	if (map_active === d) return reset_map();
	main_map_svg.selectAll(".active").classed("active", false);
  	d3.select(this).classed("active", map_active = d);

  	update_r0_plot(d.properties.sovereignt)
  	update_nc_plot(d.properties.sovereignt)

}

function reset_map() {
  main_map_svg.selectAll(".active").classed("active", map_active = false);
  main_map_svg.transition().duration(750).attr("transform", "");
}
