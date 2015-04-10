(function(views){

    views.MyProfile = React.createBackboneClass({

        render: function() {
            var profile = this.props.model.get("twitter_profile");
            console.log(profile);
            return (
                <section>
                    <header className="header-main">
                        <h2>My Profile</h2>
                    </header>
                    <div className="main">

                        <div className="profile">
                            <span className="label">Name:</span>
                            <span>{this.props.model.get("name")}</span>
                            <br />
                            <span className="label">Photo:</span>
                            <span><img src={profile.profile_image_url} /></span>
                        </div>
                    </div>
                </section>
            );
        }
    });



})(app.views);