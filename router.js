var Router = {
	routes: [],
	currentRoute: '',
	root: '/',
	config: function(options) {
		this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
		return this;
	},
	getFragment: function() { // get's current query string/hash & clears slashes from beginning and end, Note: only for initial load
		var fragment = '';
		fragment = window.location.search.replace(/&wrapper_nonce=([A-Za-z0-9]+)/, "").replace(/\?\//, '');
		return this.clearSlashes(fragment);
	},
	clearSlashes: function(path) {
		return path.toString().replace(/\/$/, '').replace(/^\//, '');
	},
	add: function(re, handler) {
		if (typeof re == 'function') {
			handler = re;
			re = '';
		}
		this.routes.push({ re: re, handler: handler });
		return this;
	},
	remove: function(param) {
		for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
			if (r.handler === param || r.re.toString() === param.toString()) {
				this.routes.splice(i, 1);
				return this;
			}
		}
		return this;
	},
	flush: function() {
		this.routes = [];
		this.root = '/';
		return this;
	},
	check: function(f) {
		var fragment = f || this.getFragment();
		for (var i = 0; i < this.routes.length; i++) {
			var match = fragment.match(this.routes[i].re);
			if (match) {
				match.shift();
				this.currentRoute = f;
				this.routes[i].handler.apply({}, match);
				return this;
			}
		}
		return this;
	},
	listenForBack: function(cmd, message) { // Note: Call in the OnRequest function in ZeroFrame class.
		if (!cmd) console.log("[Router] Please pass in cmd and message into Router.listenForBack function");
		if (cmd == "wrapperPopState") {
			if (message.params.state) {
				if (!message.params.state.url) {
					message.params.state.url = message.params.href.replace(/.*\?/, "");
				}
				window.scroll(window.pageXOffset, message.params.state.scrollTop || 0)
				this.navigate(message.params.state.url.replace(/^\//, ''));
			}
		}
	},
	navigate: function(path) {
		path = path ? path : '';
		zeroframe.cmd('wrapperPushState', [{"route": path}, null, this.root + this.clearSlashes(path)]);
		this.check(path);
		return this;
	}
}

// Note: Call right after creating all of your routes.
Router.init = function() {
	Router.check(Router.getFragment());
}

/* Example Ussage
  
   Router.add(/about/, function () {
		app.currentView = 'about';
		app.heroIsMedium = false;
		app.heroTitle = "About";
		app.heroSubtitle = "";
		app.heroContent = "";
	}).add(/tutorials/, function() {
		app.currentView = 'tutorials';
		app.heroIsMedium = false;
		app.heroTitle = "Tutorials";
		app.heroSubtitle = "";
		app.heroContent = "";
	}).add(function() {
		app.currentView = 'home';
		app.heroIsMedium = true;
		app.heroTitle = "ZeroNet Dev Center";
		app.heroSubtitle = "Tutorials, Questions, Collaboration";
		app.heroContent = '<a href="tutorials/?t=the_basics" class="button is-info">The Basics</a>\
		<a href="tutorials/" style="margin-top: 10px; margin-left: 10px;">All Tutorials</a>';

		zeroframe.cmd('dbQuery', ['SELECT * FROM tutorials'], (tutorials) => {
			for (var i in tutorials) {
				app.tutorialsList += "<a href='tutorials/?t=" + tutorials[i].slug + "'>" + tutorials[i].title + "</a><br>";
			}
			//this.cmd('wrapperPushState', [{}, '', '']);
			app.tutorialsList += "Database Basics (Coming Soon)";
		});
	});
	Router.init();
    

    You must also call Router.listenForBack() in the OnRequest function of your ZeroFrame class. This will detect when the
    user hits the back button and navigate to the correct route.
 */