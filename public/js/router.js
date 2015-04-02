app.Router = Backbone.Router.extend({

    initialize: function() {

        // create teams
        app.teams = new app.models.Teams();
        // render header
        React.render(
            React.createElement(app.views.Header, {model: app.currentUser}),
            document.querySelector(".header")
        );

        // when sign in triggered, look for teams
        this.listenTo(app, "sign:in", function(){
            app.trigger("check:for:teams");
        });

        // fetch teams
        this.listenTo(app, "check:for:teams", function() {
            app.teams.fetch().done(function(){
                app.trigger("teams:fetched");
            }.bind(this)); 
        });

        this.listenTo(app, "teams:fetched", function() {
            // check if user has a team id
            if (app.currentUser.get("team_id")) {
                console.log("User has a team");
                // if so, show them their main dashboard
                React.render(
                    React.createElement(app.views.MainDash, {
                        model: app.currentUser,
                        getTeamName: this.getTeamNameFromTeams.bind(this),
                        addGoal: this.showGoalForm

                    }),
                    document.querySelector(".main-wrapper")
                ); 
            }

            else {
                // if not, ask them to create or join a team
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
                    getTeamName: this.getTeamNameFromTeams.bind(this),
                    addGoal: this.showGoalForm
                }),
                document.querySelector(".main-wrapper")
            ); 
        });


        this.listenTo(app, "add:team", function(teamInfo) {

            var startDate = teamInfo.start_date;
            var realDate = new Date(startDate).toString();
            teamInfo.start_date = realDate;

            var newTeam = app.teams.add(teamInfo);
            newTeam.save(null, 
                {success: function(model) {
                    this.addUserToTeam(model);
                }.bind(this)
            });
        });
    },

    showTeamList: function() {
        React.render(
            React.createElement(app.views.JoinTeam, {
                collection: app.teams,
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
        app.currentUser.save({team_id: model.id},
            {success: function() {
                app.trigger("user:added:to:team");
                console.log("user team added", app.currentUser.get("team_id"))  
                }  
            }
        );
    },

    getTeamNameFromTeams: function() {
        var teamId = app.currentUser.get("team_id");
        var team = app.teams.get(teamId);
        return team.get("name");
    },

    showGoalForm: function() {
        // this is still not triggering
        console.log("clicked");
        // React.render(
        //     React.createElement(app.views.GoalForm),
        //     document.querySelector(".main-wrapper")
        // ); 
    }

});