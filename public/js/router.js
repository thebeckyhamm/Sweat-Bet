app.Router = Backbone.Router.extend({

    initialize: function() {

        // create teams
        this.teams = new app.models.Teams();


        // fetch teams
        this.listenTo(app, "check:for:teams", function() {
            this.teams.fetch().done(function(){
                app.trigger("teams:fetched");
                console.log("current user:", app.currentUser);
            }.bind(this)); 
        });




        React.render(
            React.createElement(app.views.Header, {model: app.currentUser}),
            document.querySelector(".header")
        );

        // when sign in triggered
        this.listenTo(app, "sign:in", function(){
            app.trigger("check:for:teams");
        });

        this.listenTo(app, "teams:fetched", function() {
            // check if user has a team id
            if (app.currentUser.get("team_id")) {
                console.log("User has a team");
                React.render(
                    React.createElement(app.views.MainDash, {
                        model: app.currentUser,
                        getTeamName: this.getTeamName.bind(this)
                    }),
                    document.querySelector(".main-wrapper")
                ); 
            }

            else {
                console.log("user doesn't have a team yet");
                React.render(
                    React.createElement(app.views.JoinOrCreateTeam, {
                        model: app.currentUser,
                        onJoinSelect: this.showTeamList.bind(this),
                        onCreateNew: this.showNewTeamForm.bind(this)
                    }),
                    document.querySelector(".main-wrapper")
                ); 
            }
        })

        this.listenTo(app, "user:added:to:team", function() {
            React.render(
                React.createElement(app.views.MainDash, {
                    model: app.currentUser,
                    getTeamName: this.getTeamName.bind(this)
                }),
                document.querySelector(".main-wrapper")
            ); 
        });


        this.listenTo(app, "add:team", function(teamInfo) {
            var newTeam = this.teams.add(teamInfo);
            newTeam.save();
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

    showNewTeamForm: function() {
        React.render(
            React.createElement(app.views.CreateTeamForm),
            document.querySelector(".main-wrapper")
        ); 

    },



    addUserToTeam: function(model) {
        console.log("this model's id", model.id);
        app.currentUser.save({team_id: model.id},
            {success: function() {
                app.trigger("user:added:to:team");
                console.log("user team added", app.currentUser.get("team_id"))  
                }  
            }
        );
    },

    getTeamName: function() {
        console.log("getting team name from", app.currentUser.get("team_id"));
    }

});