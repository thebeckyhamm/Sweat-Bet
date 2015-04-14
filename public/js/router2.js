app.Router = Backbone.Router.extend({

    routes: {
        "/"                : "showLandingPage",
        "join-create-team" : "joinOrCreateTeam",
        "join-a-team"      : "showTeamList",
        "create-a-team"    : "showNewTeamForm",
        "main-dashboard"   : "showMain",
        "add-a-goal"       : "showGoalForm",
        "my-dashboard"     : "showMyDash",
        "add-an-entry"     : "showEntryForm",
        "profile"          : "showProfile"

    },

    initialize: function() {

        app.teams = new app.models.Teams();