(function(models){

    // var BaseModel = Backbone.Model.extend({
    //     idAttribute: "_id"
    // })

    // User model and Collection
    models.User = Backbone.Model.extend({
        idAttribute: "_id",

        urlRoot: "/users"
    });

    models.Users = Backbone.Collection.extend({
        model: models.User,
        url: "/users",
    });



    // Team model and collection
    models.Team = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: "/teams"
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
             this.on("add", function(model){
                if(model.isNew()) {
                    model.set("user_id", this.user.id);
                }
             });

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
             this.on("add", function(model){
                if(model.isNew()) {
                    model.set("_goal_id", this.goal.id);
                }
             });
        }
    });


})(app.models);