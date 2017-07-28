# ZeroFrame Router
A *very* basic router that works with the ZeroFrame API.

## Example Usage
```javascript
Router.add(/about/, function () {
    console.log('about');
}).add(/tutorials/, function() {
    console.log('tutorials')
}).add(function() {
    console.log('home');
});
Router.init();
```

To navigate to a route, use the `Router.navigate('/route')` function.

*Note*: You must also call `Router.listenForBack()` in the `OnRequest()` function of your ZeroFrame class. This will detect when the user hits the back button and navigate to the correct route.
