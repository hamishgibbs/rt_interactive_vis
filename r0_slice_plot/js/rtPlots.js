
var rtp = {
    appendPlotSVG: function(container_id, plot_class){

    	var svg = d3.select("#" + container_id).append("svg")
			.attr("height","100%")
			.attr("width","100%")
		    .attr("class", plot_class)

		return(svg)

    },
    getContainerDims: function(container_id){

    	var container_dims = document.getElementById(container_id).getBoundingClientRect()

    	return(container_dims)

    }
  
};
