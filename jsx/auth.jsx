(function(views){

    views.TwitterLogin = React.createBackboneClass({

        render: function() {
            return (
                <button 
                    className="button" 
                    onClick={app.twitterLogin.bind(app)}>Sign In / Up
                </button>  
            );     
        }

    });


    views.TwitterLogout = React.createBackboneClass({

        render: function() {
            return (
                <button 
                    className="button" 
                    onClick={app.logout.bind(app)}>Sign Out
                </button>  
            )
        }
    });


    views.LogInOut = React.createBackboneClass({

        getCorrectButton: function() {
            if (this.props.model.id) {
                return <views.TwitterLogout />;
            }
            else {
                return <views.TwitterLogin />
            }
        },

        render: function() {
            return (
               <div className="log-in-out">{this.getCorrectButton()}</div>
            )
        }
    });



})(app.views);