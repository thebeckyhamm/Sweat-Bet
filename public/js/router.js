app.Router = Backbone.Router.extend({

    initialize: function() {

        // create teams
        this.teams = new app.models.Teams();

        // fetch teams
        this.teams.fetch().done(function(){
            this.team = this.teams.last();
            app.trigger("teams:fetched");
        }.bind(this));




        React.render(
            React.createElement(app.views.Header, {model: app.currentUser}),
            document.querySelector(".header")
        );

        // when sign in triggered
        this.listenTo(app, "sign:in", function(){
            // check if user has a team id
            console.log("signing in user with team", app.currentUser.get("_team_id"));
            if (app.currentUser.get("_team_id")) {
                this.listenTo(app, "teams:fetched", function(){
                    React.render(
                        React.createElement(app.views.MainDash, {model: this.team}),
                        document.querySelector(".main-wrapper")
                    ); 
                });
            }

            else {
                this.listenTo(app, "teams:fetched", function(){
                    React.render(
                        React.createElement(app.views.JoinOrCreateTeam, {
                            model: app.currentUser,
                            onJoinSelect: this.showTeamList.bind(this)

                        }),
                        document.querySelector(".main-wrapper")
                    ); 
                });
            }
        });

        this.listenTo(app, "user:added:to:team", function() {
            React.render(
                React.createElement(app.views.MainDash, {model: app.currentUser}),
                document.querySelector(".main-wrapper")
            ); 
        });


    },

    showTeamList: function() {
        React.render(
            React.createElement(app.views.JoinTeam, {
                collection: this.teams,
                onTeamSelect: this.addUserToTeam.bind(this)
            }),
            document.querySelector(".main-wrapper")
        ); 

    },

    addUserToTeam: function(model) {
        console.log("team id", model.id);
        app.currentUser.save({
            _team_id: model.id,
            success: function() {
                app.trigger("user:added:to:team");
                console.log("user team added", app.currentUser.get("_team_id"));
            }
        });
    }

});