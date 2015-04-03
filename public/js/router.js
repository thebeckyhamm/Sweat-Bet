app.Router = Backbone.Router.extend({

    routes: {
        "/" : "showLandingPage",
        "join-create-team" : "joinOrCreateTeam",
        "join-a-team" : "showTeamList",
        "create-a-team" : "showNewTeamForm",
        "main-dashboard" : "showMain"
    },

    initialize: function() {

        // create teams
        app.teams = new app.models.Teams();
        // render header
        React.render(
            React.createElement(app.views.Header, {model: app.currentUser}),
            document.querySelector(".header")
        );

        React.render(
            React.createElement(app.views.LandingPage),
            document.querySelector(".main-wrapper")
        );

        // when sign in triggered, look for teams
        this.listenTo(app, "sign:in", function(){
            app.trigger("check:for:teams");
        });


        // when sign out triggered load landing page
        this.listenTo(app, "sign:out", function(){
            this.showLandingPage();
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
                this.showMain();
            }
            else {
                // if not, ask them to create or join a team
                console.log("user doesn't have a team yet");
                this.joinOrCreateTeam();
                this.navigate("join-create-team", {replace: true});
            }
        })

        this.listenTo(app, "user:added:to:team", function() {
            this.showMain();
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

    showLandingPage: function() {
        this.navigate("/");
        React.render(
            React.createElement(app.views.LandingPage),
            document.querySelector(".main-wrapper")
        );
    },

    showMain: function() {
        this.navigate("main-dashboard");
        React.render(
            React.createElement(app.views.MainDash, {
                model: app.currentUser,
                getTeamName: this.getTeamName.bind(this),
                addGoal: this.showGoalForm
            }),
            document.querySelector(".main-wrapper")
        ); 
    },

    joinOrCreateTeam: function() {
        React.render(
            React.createElement(app.views.JoinOrCreateTeam, {
                model: app.currentUser,
                onJoinSelect: this.showTeamList.bind(this),
                onCreateNew: this.showNewTeamForm.bind(this)
            }),
            document.querySelector(".main-wrapper")
        ); 
    },

    showTeamList: function() {
        this.navigate("join-a-team");
        React.render(
            React.createElement(app.views.JoinTeam, {
                collection: app.teams,
                onTeamSelect: this.addUserToTeam.bind(this)
            }),
            document.querySelector(".main-wrapper")
        ); 
    },

    showNewTeamForm: function() {
        this.navigate("create-a-team");
        React.render(
            React.createElement(app.views.CreateTeamForm),
            document.querySelector(".main-wrapper")
        ); 
    },

    addUserToTeam: function(model) {
        app.currentUser.save({team_id: model.id},
            {
                success: function() {
                    app.trigger("user:added:to:team");
                    console.log("user added to team:", app.currentUser.get("team_id"))  
                }  
            }
        );
    },

    getTeamName: function() {
        var teamId = app.currentUser.get("team_id");
        var team = app.teams.get(teamId);
        return team.get("name");
    },

    showGoalForm: function() {
        console.log("clicked");
        // React.render(
        //     React.createElement(app.views.GoalForm),
        //     document.querySelector(".main-wrapper")
        // ); 
    }

});