# ZeroFrame Router
A *very* basic router that works with the ZeroFrame API.<br>
License: BSD 2-Clause

## Example Usage
```javascript
Router.add('about', function () {
    console.log('about');
}, { // Hooks for a specific route - the 'about' route
    // This route-specific before function is called directly after the global before function (passed in with the Router.hooks function)
    before: function(params) {
        console.log("Route-specific before hook");
        return true; // Continue to resolving the route. If false, the route doesn't resolve.
    },
    after: function(params) {
        console.log("Route-specific after hook");
    }
}).add('tutorials', function() {
    console.log('tutorials')
}).add('products/:pid/edit/:eid', function(params) {
    console.log('products', params.pid, params.eid);
    // If you go to route: /products/21/edit/3
    // It will log: products 21 3
}).add('*/create', function() {
    console.log('Wildcard example');
}).add(function() {
    console.log('home');
});

Router.hooks({
    // Called before every route resolves. currentRoute is the route that will be resolved (if you return true).
    before: function(currentRoute, params) {
        console.log("Global before hook");
        var refreshBtn = document.getElementById('refreshBtn');
        if (currentRoute == 'tutorials') {
            // Show refresh button on tutorials route
            refreshBtn.style.display = 'inline';
        } else {
            // Hide refresh button for all other routes
            refreshBtn.style.display = 'none';
        }

        return true; // Continue to resolving the route. If false, the route doesn't resolve.
    },
    // Called after every route resolves. currentRoute is the route that just resolved.
    after: function(currentRoute, params) {
        console.log("Global after hook");
    },
    // Called when leaving a route, `route` is the route you are leaving.
    leave: function(route) {
        console.log('Leaving route: ' + route);
        return true; // Continue navigating to route. Return false if you don't want to continue with leaving the route.
    }
});

Router.init();
```

To navigate to a route, use the `Router.navigate('/route')` function. **You must also make sure your ZeroFrame instance is called `page`.** (you can get around this by doing something as simple as `page = zeroframe;`).

The order in which you add routes matters. The URL which is added earlier and matches will be the one that is called.

*Note*: You must call `Router.listenForBack()` in the `OnRequest()` function of your ZeroFrame class in order to detect when the user hits the back button and navigate to the correct route.


*Credit*: Library based on code from this tutorial: [http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url](http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url)

## Sharing Variables Between A Route's Function And Its Hooks
Let's say you want to set a variable in the `before` hook and access it in the route's main function. You can do this simply by setting the variable on `this`. Here's an example:

```javascript
Route.add('about', function(params) {
    console.log(this.testvariable, " works in here!"); // Use the variable here.
}, {
    before: function(params) {
        this.testvariable = "Test Variable"; // Set the variable here!
        return true;
    },
    after: function() {
        console.log(this.testvariable, " also works in here!"); // Use the variable here also.
    }
});
```

It should be noted that this also applies to global hooks.

## What Happens When `navigate` Is Called?
This is exactly what happens when you call the `navigate` function:
* Call Global `leave` hook
* Push State to new route
* Call Global `before` hook
  - If returned false, push state to previous route and return (don't do anything else)
* Call Route-specific `before` hook
  - If returned false, push state to previous route and return (don't do anything else)
* Set `currentRoute` to the route navigating to
* Call Route's function
* Call Route-specific `after` hook
* Call Global `after` hook

## Router Vue Plugin
If you wan't to be able to easily create links that navigate to a route without having to type out a call to a function, you can use the vue component that the vuejs plugin provides. Simply include the js file, after the vue js and initialize the plugin file AND `router.js` file, and use the component as such:

```html
<route-link to="/">Home</route-link>
```

### Initializing ZeroFrame Router Vue Plugin
You must initialize the plugin before you can use it and the `route-link` component.

```javascript
Vue.use(VueZeroFrameRouter.VueZeroFrameRouter);
```

If you want to use Vue components for each route, you must add `currentView` to the data section of your root Vue instance. This is how the data for ZeroMedium's root Vue instance looks:

```javascript
data: {
    currentView: null,
    siteInfo: null,
    userInfo: null,
    navbarShadow: false,
    signin_modal_active: false
},
```

In order to show the route's component, you must put this into your template for the root Vue instance. This is how ZeroMedium does it:

```javascript
template: `
    <div>
        <custom-nav v-on:show-signin-modal="showSigninModal()" v-on:get-user-info="getUserInfo()" v-bind:user-info="userInfo" v-bind:shadow="navbarShadow"></custom-nav>
        <component ref="view" v-bind:is="currentView" v-on:show-signin-modal="showSigninModal()" v-on:navbar-shadow-on="navbarShadowOn()" v-on:navbar-shadow-off="navbarShadowOff()" v-on:get-user-info="getUserInfo()" v-bind:user-info="userInfo"></component>
    </div>
    `,
```

Notice that `currentView` is bound to `is` on the `component` tag. ZeroMedium also binds things to this component that will be accessed by *many* of the routes and is often global data, like the current user's information, for example.

### Adding Routes with the Plugin
The Vue plugin has a different way of managing the routes. Also, your vuejs components' `mounted`, `beforeMount`, and `afterMount` should be used instead of the router's hooks (this is detailed more below.

This code comes directly from [ZeroMedium](https://github.com/krixano/ZeroMedium):

```javascript
// Router Pages
var Home = require("./router_pages/home.js");
var Search = require("./router_pages/search.js");
var TopicSlug = require("./router_pages/topic_slug.js");
var TagSlug = require("./router_pages/tag_slug.js");
var Newstory = require("./router_pages/newstory.js");
var Profile = require("./router_pages/profile.js");
var ProfileStory = require("./router_pages/profile_story.js");
var MeStories = require("./router_pages/me_stories.js");
var EditStory = require("./router_pages/edit_story.js");

VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
    { route: 'search', component: Search },
    { route: 'topic/:slug', component: TopicSlug },
    { route: 'tag/:slug', component: TagSlug },
    { route: 'me/newstory', component: Newstory },
    { route: 'me/stories/:slug/edit', component: EditStory },
    { route: 'me/stories', component: MeStories },
    { route: ':userauthaddress/:slug', component: ProfileStory },
    { route: ':userauthaddress', component: Profile }, // TODO: Have tabs use '&tab='
    { route: '', component: Home }
]);
```

Notice that each route has a component, which are `require`d from their own files. This keeps everything organized and seperate. You can also create components that are associated with a specific route within their files to keep everything related together. This is the code for the Home route, taken from ZeroMedium (a lot of the html, and any methods that correspond to that html, has been cut out so it's not so big):

```javascript
var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");
var moment = require('moment');

var Home = {
    beforeMount: function() {
        this.$emit("navbar-shadow-off");
        var that = this;
        page.getTopics((topics) => {
            that.topics = topics;
        });
        this.getStories();
        // TODO: Do a sort based on number of likes/claps and maybe responses (only responses made during that day).
    },
    methods: {
        showSigninModal: function() {
            //this.signin_modal_visible = !this.signin_modal_visible;
            this.$emit('show-signin-modal');
        },
        goto: function(to) {
            Router.navigate(to);
        },
    },
    data: function() {
        return {
            topics: []
        }
    },
    template: `
        <div>
            <div class="navbar is-transparent has-shadow" style="border-top: 1px solid rgba(0,0,0,.05);">
                <div class="container">
                    <div class="navbar-brand" style="overflow-x: hidden;">
                        <!-- Categories -->
                        <a class="navbar-item is-active">Home</a>
                        <a class="navbar-item">Popular</a>
                        <!--<a class="navbar-item">Staff Picks</a>-->
                        <a class="navbar-item" v-for="topic in topics" :key="topic.topic_id" :href="'./?/topic/' + topic.slug" v-on:click.prevent="topicClick(topic.slug)">{{topic.name}}</a>
                    </div>
                </div>
            </div>
            <home-hero v-on:show-signin-modal="showSigninModal()"></home-hero>
            <section class="section">
                <div class="columns is-centered">
                    <div class="column is-three-quarters-tablet is-three-quarters-desktop">
                        <!-- This was cut out, along with its corresponding methods -->
                    </div>
                </div>
            </section>
        </div>
        `
};

Vue.component('home-hero', {
    methods: {
        showSigninModal: function() {
            this.$emit("show-signin-modal");
        }
    },
    template: `
        <div class="hero">
            <div class="columns is-centered">
                <div class="column is-three-quarters-tablet is-three-quarters-desktop">
                    <div class="hero-body">
                        <p class="title">ZeroMedium</p>
                        <p>Blogs on many different topics, from many different people.</p>
                        <br>
                        <a class="button is-dark is-small" v-on:click.prevent="showSigninModal()">Get Started</a>
                        <a class="button is-small" href="bitcoin:1CVmbCKWtbskK2GAZLM6gnMuiL6Je25Yds?message=Donation to ZeroMedium">Donate via Bitcoin</a>
                    </div>
                </div>
            </div>
        </div>
        `
});

module.exports = Home;
```

Notice how the `Home` route uses a component that is also created/defined within the same file (at the bottom). In order to be able to do this, we must `require` Vue.

We also `require` the Router because one of its functions are used within the `Home` route, `Router.navigate()`. This lets you have a link that calls this method, called `goto`, giving it only the route, which will call the Router's `navigate` function. We could also have just called `Router.navigate()` directly from the links that need it if we wanted to.

However, sometimes you need to use a router function to get information passed in from the route. For example, if you have a route `blog/:slug`, you will be able to get what the `slug` was by calling `Router.currentParams["slug"]`. This is typically done in the `beforeMount()` Vue function so you can get the information *before* the Vue component is mounted and shown. This is exactly how ZeroMedium does its profile route, `:userauthaddress`. The code for its `beforeMount` function is shown below:

```javascript
beforeMount: function() {
    this.$emit('navbar-shadow-off');
    var that = this;
    page.getUserProfileInfo(Router.currentParams["userauthaddress"], true, true, (profileInfo) => {
        that.profileInfo = profileInfo;
        page.getUserClaps(Router.currentParams["userauthaddress"], (claps) => {
            that.claps = claps;
        });
    });
},
```

ZeroMedium gets the `userauthaddress` that was passed in within the `beforeMount` function so it can start getting the user's profile information (by calling `page.getUserProfileInfo()`) before the route's Vue component is mounted. Because a function is passed into `getUserProfileInfo`, it uses `var that = this` to be able to reference `this` as `that` from within the callback function. This callback function is called once the profile information has been gathered. The callback function then sets the Vue component's `profileInfo` data to that which was given to the function. *This is done this way because the `getUserProfileInfo` function is async.*