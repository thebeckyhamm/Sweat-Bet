(function(views){

    views.MainDash = React.createBackboneClass({

        render: function() {
            return (
                <section className="main">
                    <header className="header-main">
                        <h2>Test</h2>
                        <button className="button button-primary">+ Entry</button>
                    </header>
                    <div className="results-toggle">
                        <button className="button button-secondary">To Date</button>
                        <button className="button">Week 5</button>
                    </div>
                    <article className="all-goals">
                        <h3>All Goals</h3>
                        <span className="completion-rate completion-rate-lg">45%</span>
                        <div className="progress-bar progress-bar-lg"></div>
                        <hr />
                        <h4>Run 15 mi per week</h4>
                        <span className="completion-rate">55%</span>
                        <div className="progress-bar"></div>
                    </article>
                </section>
            );
        }

    });



})(app.views);