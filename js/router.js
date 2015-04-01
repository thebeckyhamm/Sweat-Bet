app.Router = Backbone.Router.extend({

    initialize: function() {



        React.render(
            React.createElement(app.views.Header),
            document.querySelector(".header")
        );

        React.render(
            React.createElement(app.views.MainDash),
            document.querySelector(".main-wrapper")
        );

    }


});