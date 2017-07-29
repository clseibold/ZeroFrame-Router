# ZeroFrame Router
A *very* basic router that works with the ZeroFrame API.

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
}).add(function() {
    console.log('home');
});
Router.init();
```

To navigate to a route, use the `Router.navigate('/route')` function.

*Note*: You must also call `Router.listenForBack()` in the `OnRequest()` function of your ZeroFrame class. This will detect when the user hits the back button and navigate to the correct route.


*Credit*: Library based on code from this tutorial: [http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url](http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url)

## Router Link Vue Component
If you wan't to be able to easily create links that navigate to a route without having to type out a call to a function, you can use this vue component. Simply include the js file, after the vue js file AND `router.js` file, and use as such:

```html
<route-link to="/">Home</route-link>
```