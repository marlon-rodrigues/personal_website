	//load handlebars template
function templateLoad(templateName, dataSource, htmlNode, callback) {
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

	//select menu and add/remove needed classes 
function selectMenu(obj) {
	$('.sub-navigation-item').slideUp('slow');
	$('.sub-navigation-item').removeClass('active');
	$('#' + obj.attr('sub-nav')).slideDown('slow');
	$('#' + obj.attr('sub-nav')).addClass('active');

	$('.main-nav-item').removeClass('active');
	
	if(!isIntroVisible) {
		obj.addClass('active');
	}

	return obj.children('a').attr('href');
}

var isAnimatedScrolling = false;
var isIntroVisible = true;

$(document).ready(function(){
		//load introduction
	templateLoad('introduction', null, '#introduction', showSite);	

		//load site header
	templateLoad('site-header', null, '#site-header', null);

		//load mobile navigation
	templateLoad('mobile-navigation', null, '#mobile-navigation-menu', setupMainNavigation);	
		
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
	templateLoad('skills', null, '#skills', null);	

		//load contact me
	templateLoad('contact', null, '#contact', null);	

	function showSite() {
		$('.view-site').click(function(){
			$('.introduction-wrapper').slideUp('slow');
			isIntroVisible = false;
			$('body').css('overflow-y', 'visible');
		});
	}

	function setupMainNavigation() {
		$('.main-nav-item').click(function(e){
			if (!$(this).hasClass('active')) {
				e.preventDefault();

					//hide intro view if is visible
			  	if($('.introduction-wrapper').is(':visible')) {
					$('.introduction-wrapper').slideUp('slow');
					isIntroVisible = false;
				}
				$('body').css('overflow-y', 'visible');

		    	var navSection = selectMenu($(this));

		    	isAnimatedScrolling = true;

		    	$('html, body').animate({
				    scrollTop: $(navSection).offset().top - 200
				}, 750, function(){
		        	// Add hash (#) to URL when done scrolling (default click behavior)
		        	window.location.hash = navSection;

		        	isAnimatedScrolling = false;
		      	});
		  	}
		});

		$('.main-navigation-header img, .mobile-header-image img').click(function(){
			$('.introduction-wrapper').slideDown('slow');
			$('.main-nav-item').removeClass('active');
			$('body').css('overflow-y', 'hidden');
			isIntroVisible = true;
		});

			//mobile nav action
		$('#mobile-navigation-menu .navbar-nav a.clickable').click(function(){
			$('#mobile-navigation-menu .navbar-collapse').removeClass('in');
		})
	}

	function setupSubNavigation() {
		$('.sub-navigation-item .sub-navigation-body a').click(function(e){
		  	if($(this).attr("href") !== "") {
		  		e.preventDefault();

			  	var section = $(this).attr("href");

			  	isAnimatedScrolling = true;

			  	$('html, body').animate({
				    scrollTop: $(section).offset().top - 200
				}, 750, function(){
		        	// Add hash (#) to URL when done scrolling (default click behavior)
		        	window.location.hash = section;

		        	isAnimatedScrolling = false;
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
		$('.projects-content-ai-item').matchHeight();
		//$('.match-projects-ai-height').matchHeight();

		$('.projects-content-apps-item').matchHeight();
		$('.match-projects-apps-height').matchHeight();

		$('.projects-content-sites-item').matchHeight();
		$('.match-projects-sites-height').matchHeight();

		$('.projects-carousel-ai').owlCarousel({
			items: 1,
			loop: true,
			nav: true,
			navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>', '<i class="fa fa-chevron-right" aria-hidden="true"></i>']
		});

		$('.projects-carousel-apps').owlCarousel({
			items: 1,
			loop: true,
			nav: true,
			navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>', '<i class="fa fa-chevron-right" aria-hidden="true"></i>']
		});

		$('.projects-carousel-sites').owlCarousel({
			items: 1,
			loop: true,
			nav: true,
			navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>', '<i class="fa fa-chevron-right" aria-hidden="true"></i>']
		});
	}

	function loadcareerSkillsSet() { 
		$('.skillbar').each(function() { 
			$(this).find('.skillbar-bar').animate({
				width:$(this).attr('data-percent')
			},6000);
		});
	}

	//function used for the skills graph - currently not being used
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

		//apply match height to mobile graph
		$('.skills-content-column').matchHeight();
		
	}
});

$(window).scroll(function(e) {
	if($(window).width() >= 992) {

		if(!isAnimatedScrolling) {
			var wS = parseInt(Math.round($(this).scrollTop() + 2));
		    var offset = 300;
		    var hTCareer = parseInt(Math.round($('#career').offset().top - offset));
		    var hTEducation = parseInt(Math.round($('#education').offset().top - offset));
		    var hTProjects = parseInt(Math.round($('#projects').offset().top - offset));
		    var hTSkills = parseInt(Math.round($('#skills').offset().top - offset));
		    var hTContact = parseInt(Math.round($('#contact').offset().top - offset));

		    var wST = parseInt($(window).scrollTop());
		    var wH = parseInt($(window).height());
		    var dH = parseInt($(document).height());

		    var navSection = "";

		    //console.log(wS + "," + hTCareer + "," + hTEducation + "," + hTProjects);

		    if(wS >= 0 && wS < hTEducation) {
		    	if(!$('#sub-navigation-career').is(':visible')) {
		    		navSection = selectMenu($('#main-nav-career'));
		    		//window.location.hash = navSection;
		    	}
		    } else if(wS >= hTEducation && wS < hTProjects) { 
		    	if(!$('#sub-navigation-education').is(':visible')) {
		    		navSection = selectMenu($('#main-nav-education'));
		    		//window.location.hash = navSection;
		    	}
		    } else if(wS >= hTProjects && wS < hTSkills) { 
		    	if(!$('#sub-navigation-projects').is(':visible')) {
		    		navSection = selectMenu($('#main-nav-work'));
		    		//window.location.hash = navSection;
		    	}
		    } else if(wS >= hTSkills && wS < hTContact) { 
		    	if(!$('#sub-navigation-skills').is(':visible')) {
		    		navSection = selectMenu($('#main-nav-skills-list'));
		    		//window.location.hash = navSection;
		    	}
		    } 

		    //if its a the bottom, always show the contact me sub nav
		    if( (wST + wH) == dH) {
				if(!$('#sub-navigation-contact').is(':visible')) {
					navSection = selectMenu($('#main-nav-contact-me'));
					//window.location.hash = navSection;
				}
			}
		} 
	}
});