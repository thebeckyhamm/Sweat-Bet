app.Router = Backbone.Router.extend({

    routes: {
        "/"                : "showLandingPage",
        "join-create-team" : "joinOrCreateTeam",
        "join-a-team"      : "showTeamList",
        "create-a-team"    : "showNewTeamForm",
        "main-dashboard"   : "showMain",
        "add-a-goal"       : "showGoalForm",
        "my-dashboard"     : "showMyDash",
        "add-an-entry"     : "showEntryForm"
    },

    initialize: function() {

        // create teams
        app.teams = new app.models.Teams();

        app.teams.fetch().done(function() {
            this.showHeader();
        }.bind(this));

        app.users = new app.models.Users();

        app.users.fetch();

        app.goals = new app.models.Goals(null, {
            user: app.currentUser
        });

        // render header and landing page


        React.render(
            React.createElement(app.views.LandingPage),
            document.querySelector(".main-wrapper")
        );


        this.listenTo(app, "fetch:users:collection", function(goalInfo) {
            app.users.fetch().done(function(){
                this.showMain();
            }.bind(this)); 
        });




        //------ --------------- ------//
        //------ Sign in / out   ------//
        //------ --------------- ------//

        this.listenTo(app, "sign:in", function(){
            app.teams.fetch().done(function(){
                app.trigger("teams:fetched");
            }.bind(this)); 
        });

        this.listenTo(app, "sign:out", function(){
            this.showHeader();
            this.showLandingPage();
        });




        //------ --------------- ------//
        //------ Teams check     ------//
        //------ --------------- ------//

        this.listenTo(app, "teams:fetched", function() {
            this.showHeader();
            // check if user has a team id
            if (app.currentUser.get("team_id")) {
                var team = app.currentUser.get("team_id");
                console.log("User has a team");
                // if so, show them their main dashboard
                React.render(
                    React.createElement(app.views.Menu, {
                        model: app.currentUser,
                        team: app.teams.get(team),
                        addGoal: this.showGoalForm.bind(this),
                        addEntry: this.showEntryForm.bind(this)
                    }),
                    document.querySelector(".nav")
                );

                this.showMain();
            }
            else {
                // if not, ask them to create or join a team
                console.log("user doesn't have a team yet");
                this.joinOrCreateTeam();
                this.navigate("join-create-team", {replace: true});
            }
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



        //------ --------------- ------//
        //------ Goals           ------//
        //------ --------------- ------//

        this.listenTo(app, "fetch:goals:collection", function(goalInfo) {
            app.goals.fetch().done(function(){
                this.showMyDash();
            }.bind(this)); 
        });

        this.listenTo(app, "create:goals:collection", function(goalInfo) {
            app.goals.fetch().done(function(){
                app.trigger("goals:created", goalInfo);
            }.bind(this)); 
        });

        this.listenTo(app, "goals:created", function(goalInfo) {
            var newGoal = app.goals.add(goalInfo);
            newGoal.save(null, {
                success: function() {
                    this.showMyDash();
                }.bind(this)  
            });
        });



        //------ --------------- ------//
        //------ Entries         ------//
        //------ --------------- ------//

        this.listenTo(app, "create:entries:collection", function(entriesInfo) {
            app.entries = new app.models.Entries(null, {goal_id: entriesInfo.goal_id});
            app.entries.fetch().done(function(){
                app.trigger("entries:created", entriesInfo);
            }.bind(this)); 
        });

        this.listenTo(app, "entries:created", function(entryInfo) {
            var newEntry = app.entries.add(entryInfo);

            newEntry.save(null, {
                success: function() {

                    var goal = new app.models.Goal({
                        _id: newEntry.get("goal_id")
                    });

                    goal.fetch().done(function(){
                        var entries_sum = goal.get("entries_sum") || 0;
                        entries_sum += parseInt(newEntry.get("number"));
                        goal.save("entries_sum", entries_sum);

                        app.goals.fetch();
                        this.showMyDash();
                    }.bind(this));
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

    showHeader: function() {
        React.render(
            React.createElement(app.views.Header, {
                model: app.currentUser,
                goToGoals: this.showMyDash.bind(this),
                goToTeamDashboard: this.showMain.bind(this),
            }),
            document.querySelector(".header")
        );
    },

    showMain: function() {
        this.navigate("main-dashboard");
        React.render(
            React.createElement(app.views.MainDash, {
                collection: app.users,
                getTeam: this.getTeam,
                addGoal: this.showGoalForm.bind(this),
                addEntry: this.showEntryForm.bind(this)
            }),
            document.querySelector(".main-wrapper")
        ); 
    },

    showMyDash: function() {
        this.navigate("my-dashboard");
        React.render(
            React.createElement(app.views.MyDash, {
                collection: app.goals,
                addGoal: this.showGoalForm.bind(this),
                addEntry: this.showEntryForm.bind(this),
                getTeam: this.getTeam
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

    showGoalForm: function() {
        this.navigate("add-a-goal");
        React.render(
            React.createElement(app.views.GoalForm),
            document.querySelector(".main-wrapper")
        ); 
    },

    showEntryForm: function() {
        this.navigate("add-an-entry");
        app.goals.fetch().done(function() {
            React.render(
                React.createElement(app.views.EntryForm, {
                    collection: app.goals
                }),
                document.querySelector(".main-wrapper")
            ); 
            
        });
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

    addUserToTeam: function(model) {
        app.currentUser.save({team_id: model.id},
            {
                success: function() {
                    this.showMain();
                }.bind(this) 
            }
        );
    },

    getTeamName: function() {
        var teamId = app.currentUser.get("team_id");
        app.teams.fetch().done(function(){
            var team = app.teams.get(teamId);
            return team.get("name");

        });
    },

    getTeam: function() {
        var teamId = app.currentUser.get("team_id");
        var team = app.teams.get(teamId);
        return team;
    },

    getGoalNames: function() {
        var userID = app.goals.get("user_id");
        return _.filter(app.goals, function(goal) {
            return userID === goal.user_id;
        });
    }

});