# ZeroFrame Router
A *very* basic router that works with the ZeroFrame API.
License: BSD 2-Clause

## Example Usage
```javascript
Router.add('about', function () {
    console.log('about');
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
        console.log("Happens after route resolves");
    }
});

Router.init();
```

To navigate to a route, use the `Router.navigate('/route')` function. **You must also make sure your ZeroFrame instance is called `page`.** (you can get around this by doing something as simple as `page = zeroframe;`).

The order in which you add routes matters. The URL which is added earlier and matches will be the one that is called.

*Note*: You must call `Router.listenForBack()` in the `OnRequest()` function of your ZeroFrame class in order to detect when the user hits the back button and navigate to the correct route.


*Credit*: Library based on code from this tutorial: [http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url](http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url)

## Router Link Vue Component
If you wan't to be able to easily create links that navigate to a route without having to type out a call to a function, you can use this vue component. Simply include the js file, after the vue js file AND `router.js` file, and use as such:

```html
<route-link to="/">Home</route-link>
```