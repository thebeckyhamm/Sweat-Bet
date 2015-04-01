app.Router = Backbone.Router.extend({

    initialize: function() {

        // create teams
        this.teams = new app.models.Teams();

        // fetch teams
        this.teams.fetch().done(function(){
            this.team = this.teams.last();
            this.trigger("teams:fetched");
        }.bind(this));

        this.on("teams:fetched", function(){
            React.render(
                React.createElement(app.views.MainDash, {model: this.team}),
                document.querySelector(".main-wrapper")
            );

            
        });

        React.render(
            React.createElement(app.views.Header),
            document.querySelector(".header")
        );


    }


});