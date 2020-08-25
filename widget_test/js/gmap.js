/* break submodules into separat files, all accessed through gmap */
/* documentation */
/* functions for dropdown list */

var gmap = {}

gmap.legend = {
    annotateText: function(svg, y_pos, x_pos, labels, container_dims, cls="legend_text"){
        svg.append("text")
            .attr("x", container_dims.width * x_pos)
            .attr("y", container_dims.height * y_pos)
            .text(labels)
            .attr("class", cls)
            .attr("padding-left", "20px");
    },
    annotateTextSeqV: function(svg, y_pos, x_pos, labels, container_dims, cls="legend_text"){
        var i;
        for (i = 0; i < y_pos.length; i++) {
          this.annotateText(svg, y_pos[i], x_pos, labels[i], container_dims)
        }
    },
    annotateKeyRect: function(svg, y_pos, x_pos, colours, container_dims, cls="legend_rect"){
        svg.append('rect')
            .attr("x", container_dims.width * x_pos)
            .attr("y", container_dims.height * y_pos)
            .attr("fill", colours)
            .attr("class", cls)
    },
    annotateKeyRectSeqV: function(svg, y_pos, x_pos, colours, container_dims, cls="legend_rect"){
        var i;
        for (i = 0; i < y_pos.length; i++) {
          this.annotateKeyRect(svg, y_pos[i], x_pos, colours[i], container_dims, cls=cls)
        }
    }
};

gmap.geometry = {
    plotLine: function(x, y, x_scale, y_scale){
        var line = d3.line()
                .x(function(d){ return x_scale(d[x]); })
                .y(function(d){ return y_scale(d[y]); })
                .curve(d3.curveCardinal);

        return(line)
    },
    plotHLine: function(x, y_intercept, x_scale, y_scale){
        var line = d3.line()
                .x(function(d){ return x_scale(d[x]); })
                .y(function(d){ return y_scale(y_intercept); })
                .curve(d3.curveCardinal);

        return(line)
    },
    plotHPoly: function(x, y0, y1, x_scale, y_scale){

        var poly = d3.area()
                    .x(function(d) { return x_scale(d[x]) })
                    .y0(function(d) { return y_scale(d[y0]) })
                    .y1(function(d) { return y_scale(d[y1]) })

        return(poly)
    },
    plotSpatialPolygons: function(data, projection, map_width, map_height, choropleth=null){

        var features = data.features;

        var path = d3.geo.path()
            .projection(projection);

        var scaleCenter = gmap.geodata.calculateScaleCenter(data, map_width, map_height, path);

        projection.scale(scaleCenter.scale)
            .center(scaleCenter.center)
            .translate([map_width/2, map_height/2]);

        return(path);

    },
    appendGeom: function(svg, data, geom, cls){

        svg.append("path")
                .datum(data)
                .attr("d", geom)
                .attr("class", cls)
    },
    appendSpatialGeom: function(svg, data, geom, cls, on){
        /* cls accepts either string class or functions to
        map class names from data attributes */
        /* "on" accepts array of [action, function] or array of arrays of [action, function] */
        /* required: array of arrays even if one element of interaction */

        var spap = svg.selectAll(".features")
            .data(data)
            .enter()
            .append("path")
            .attr("d", geom)
            .attr("class", cls)

        var i
        for (i = 0; i < on.length; i++) {
            spap.on(on[i][0], on[i][1])
        }

    }
};

gmap.plot = {
    appendXAxis: function(svg, plot_height, x_scale, cls){
         svg.append("g")
                .attr("transform","translate(0,"+plot_height+")")
                .call(d3.axisBottom(x_scale))
                .attr("class",cls);
    },
    appendYAxis: function(svg, y_scale, cls){
        svg.append("g")
                .call(d3.axisLeft(y_scale))
                .attr("class", cls);
    },
    appendTitle: function(svg, text, x_pos, y_pos, container_dims, cls, id=null){

        svg.append("text")
            .attr("x", container_dims.width * x_pos)
            .attr("y", container_dims.height * y_pos)
            .text(text)
            .attr("class", cls)
            .attr("id", id)
    },
};

gmap.geodata = {
    calculateScaleCenter: function(features, map_width, map_height, path) {

    var bbox_path = path.bounds(features),
        scale = 120 / Math.max(
          (bbox_path[1][0] - bbox_path[0][0]) / map_width,
          (bbox_path[1][1] - bbox_path[0][1]) / map_height
        );

    var bbox_feature = d3.geo.bounds(features),
        center = [
            (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
            (bbox_feature[1][1] + bbox_feature[0][1]) / 2];

    return {
        'scale': scale,
        'center': center
        };
    }

};

gmap.interact = {

    /* change id to hover_active on hover for spatial data */
    /*hilight values */

    activateHoverSpatial: function(d){
        d3.select(this)
            .moveToFront()
            .attr('id', 'hover_spatial_active');
    },
    deactivateHoverSpatial: function(d){
        d3.select(this)
            .moveToFront()
            .attr('id', 'hover_spatial_inactive');
    }

}

d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
}

gmap.utils = {
    arrayUnique: function(value, index, self){
        return self.indexOf(value) === index;
    },
}





/* add methods for adding each geometry type */
/* add methods for creating each svg type */
/* make zoom in on graph */
/* update text values */
/* wrap everythign into gmap package */
