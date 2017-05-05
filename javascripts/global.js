	//load handlebars template
function templateLoad(templateName, dataSource, htmlNode, callback) { //TODO - VERIFY IF I NEED THE DATA SOURCE
	var templateFile = 'views/' + templateName + '.html';

	jQuery.get(templateFile, function(template) { 
		var renderedTemplate = Handlebars.compile(template);
		var result = renderedTemplate(dataSource);	

		jQuery(htmlNode).html(result);

		if(callback != null) { 
			callback();
		}
	});
}

$(document).ready(function(){
		//load site header
	templateLoad('site-header', null, '#site-header', null);
		
		//load main navigation 
	templateLoad('main-navigation', null, '#main-navigation', setupMainNavigation);

		//load sub navigation 
	templateLoad('sub-navigation', null, '#sub-navigation', setupSubNavigation);

		//load career
	templateLoad('career', null, '#career', loadcareerSkillsSet);	

		//load education
	templateLoad('education', null, '#education', null);	

		//load projects
	templateLoad('projects', null, '#projects', loadProjectsSections);	

		//load skills
	templateLoad('skills', null, '#skills', buildSkillsGraph);	


	function setupMainNavigation() {
		$('.main-nav-item').click(function(e){
			if (!$(this).hasClass('active')) {
				e.preventDefault();

		    	$('.sub-navigation-item').slideUp('slow');
		    	$('.sub-navigation-item').removeClass('active');
		    	$('#' + $(this).attr('sub-nav')).slideDown('slow');
		    	$('#' + $(this).attr('sub-nav')).addClass('active');

		    	$('.main-nav-item').removeClass('active');
		    	$(this).addClass('active');

		    	var navSection = $(this).children('a').attr('href');

		    	$('html, body').animate({
				    scrollTop: $(navSection).offset().top - 200
				}, 750, function(){
		        	// Add hash (#) to URL when done scrolling (default click behavior)
		        	window.location.hash = navSection;
		      	});
		  	}
		});
	}

	function setupSubNavigation() {
		$('.sub-navigation-item .sub-navigation-body a').click(function(e){
		  	if($(this).attr("href") !== "") {
		  		e.preventDefault();

			  	var section = $(this).attr("href");

			  	$('html, body').animate({
				    scrollTop: $(section).offset().top - 200
				}, 750, function(){
		        	// Add hash (#) to URL when done scrolling (default click behavior)
		        	window.location.hash = section;
		      	});
		  	}
		});
	}

	function loadProjectsSections() {
		templateLoad('projects-ai', null, '#projects-ai', function(){
			templateLoad('projects-apps', null, '#projects-apps', function(){
				templateLoad('projects-sites', null, '#projects-sites', loadProjectsCarousels);
			});
		});	
	}

	function loadProjectsCarousels() {
		$('.projects-content-item').matchHeight();

		$('.projects-carousel-ai').owlCarousel({
			items: 1,
			loop: true,
			nav: false
		});

		$('.projects-carousel-apps').owlCarousel({
			items: 1,
			loop: true,
			nav: false
		});

		$('.projects-carousel-sites').owlCarousel({
			items: 1,
			loop: true,
			nav: false
		});
	}

	function loadcareerSkillsSet() { 
		$('.skillbar').each(function() { 
			$(this).find('.skillbar-bar').animate({
				width:$(this).attr('data-percent')
			},6000);
		});
	}

	function buildSkillsGraph() {
		var svg = d3.select("svg"),
	    width = +svg.attr("width"),
	    height = +svg.attr("height");

		var format = d3.format(",d");

		var color = d3.scaleOrdinal(d3.schemeCategory20c);

		var pack = d3.pack()
		    .size([width, height])
		    .padding(1.5);

		d3.csv("javascripts/skills.csv", function(d) {
		  d.value = +d.value;
		  if (d.value) return d;
		}, function(error, classes) {
		  if (error) throw error;

		  var root = d3.hierarchy({children: classes})
		      .sum(function(d) { return d.value; })
		      .each(function(d) {
		        if (id = d.data.id) {
		          var id, i = id.lastIndexOf(".");
		          d.id = id;
		          d.package = id.slice(0, i);
		          d.class = id.slice(i + 1);
		        }
		      });

		  var node = svg.selectAll(".node")
		    .data(pack(root).leaves())
		    .enter().append("g")
		      .attr("class", "node")
		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		  node.append("circle")
		      .attr("id", function(d) { return d.id; })
		      .attr("r", function(d) { return d.r; });
		      //.style("fill", function(d) { return color(d.package); });

		  node.append("clipPath")
		      .attr("id", function(d) { return "clip-" + d.id; })
		    .append("use")
		      .attr("xlink:href", function(d) { return "#" + d.id; });

		  node.append("text")
		      .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
		    .selectAll("tspan")
		    .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
		    .enter().append("tspan")
		      .attr("x", 0)
		      .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
		      .text(function(d) { return d; });

		  node.append("title")
		      .text(function(d) { return d.id + "\n" + format(d.value); });
		});
	}
});