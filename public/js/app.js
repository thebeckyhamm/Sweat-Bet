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
        this.currentUser = new Backbone.Model();

        // connect to firebase
        this.fireRef = new Firebase(this.baseURL);

        // give firebase a callback when a user signs in or out
        this.fireRef.onAuth(this.onAuthCallback);
    },

    // called when user logs in or out
    onAuthCallback: function(authData) {
        if (authData) {
            app.authData = authData;
            app.currentUser.set(authData.twitter.cachedUserProfile);
            console.log("A user is logged in:", app.currentUser.get("name"));
            app.trigger("sign:in");
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