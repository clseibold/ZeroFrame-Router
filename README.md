# ZeroFrame Router
A *very* basic router that works with the ZeroFrame API.

## Example Usage
```
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
```

*Note*: You must also call `Router.listenForBack()` in the `OnRequest()` function of your ZeroFrame class. This will detect when the user hits the back button and navigate to the correct route.