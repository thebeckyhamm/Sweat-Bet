app = {

    views: {},
    models: {},
    
    baseURL: "https://final-app.firebaseio.com/users",

    // firebase connection reference
    fireRef: null,


    init: function() {

        // add backbone events
        _.extend(this, Backbone.Events);

        // create a model to store our current user
        this.currentUser = new app.models.User();

        // connect to firebase
        this.fireRef = new Firebase(this.baseURL);
        // give firebase a callback when a user signs in or out
        this.fireRef.onAuth(this.onAuthCallback);
    },

    // called when user logs in or out
    onAuthCallback: function(authData) {
        if (authData) {
            app.authData = authData;
            // app.currentUser.set(authData.twitter.cachedUserProfile);
            console.log("A twitter user is logged in");

            var twitterProf = authData.twitter.cachedUserProfile;
            var url = "/find_user_by_twitter_id/" + twitterProf.id
            $.getJSON(url, function(data){
              if(data) {
                // user exists
                app.currentUser.set(data);
                app.currentUser.save({
                    twitter_profile: twitterProf
                });
              } else {
                // user is new
                app.currentUser.set({
                    name: twitterProf.name,
                    twitter_id: twitterProf.id,
                    twitter_profile: twitterProf
                });
                app.currentUser.save();
              }
                app.trigger("sign:in");
            });
        }
        else {
            app.authData = null;
            app.currentUser.clear();
            console.log("No one is signed in.");
            app.trigger("sign:out");
        }
        app.trigger("sign:in:out");
    },

    // log in to twitter
    twitterLogin: function() {
        console.log("logging in attempt");
        console.log(this.fireRef);
        this.fireRef.authWithOAuthRedirect("twitter", function(error, authData) {
            if (error) {
                console.log("Login failed", error);
            }
            else {
                console.log("Authenticated successfully:", authData);
            }
        });
    },

    isLoggedIn: function() {
        return !!(this.authData && this.authData.uid);
    },

    logout: function() {
        this.fireRef.unauth();
    }


}