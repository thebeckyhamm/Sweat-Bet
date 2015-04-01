(function(models){

    // User model and Collection
    models.User = Backbone.Model.extend({
        idAttribute: "_id",

        url: function() {
            if(this.isNew()) {
                return this.collection.url();
            } else {
                return "/users/" + this.id;
            }
        }
    });

    models.Users = Backbone.Collection.extend({
        model: models.User,

        url: function() {
             return "/teams/" + this.team.id + "/users"
        },

        initialize: function(data, options) {
             this.team = options.team;
        }
    });



    // Team model and collection
    models.Team = Backbone.Model.extend({
        idAttribute: "_id",

        url: function() {
                return this.collection.url() + "/" + this.id;
        }
    });

    models.Teams = Backbone.Collection.extend({
        model: models.Team,

        url: "/teams"
        
    });

    // Goal model and Collection
    models.Goal = Backbone.Model.extend({
        idAttribute: "_id",

        url: function() {
            if(this.isNew()) {
                return this.collection.url();
            } else {
                return "/goals/" + this.id;
            }
        }
    });

    models.Goals = Backbone.Collection.extend({
        model: models.Goal,

        url: function() {
             return "/users/" + this.user.id + "/goals"
        },

        initialize: function(data, options) {
             this.user = options.user;
        }
    });


    // Entries model and Collection
    models.Entry = Backbone.Model.extend({
        idAttribute: "_id",

        url: function() {
            if(this.isNew()) {
                return this.collection.url();
            } else {
                return "/entries/" + this.id;
            }
        }
    });

    models.Entries = Backbone.Collection.extend({
        model: models.Entry,

        url: function() {
             return "/goals/" + this.goal.id + "/entries"
        },

        initialize: function(data, options) {
             this.goal = options.goal;
        }
    });


})(app.models);