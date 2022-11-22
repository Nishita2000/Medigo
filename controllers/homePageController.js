let getHomePage = async (req, res) => {
    return res.render("receptionist_dashboard.ejs", {
        info: req.session.recep
    });
};

let getHomePage2 = async (req, res) => {
    //console.log(req.user)
    return res.render("patient_dashboard.ejs", {
        user: req.user
    });
};

module.exports = {
    getHomePage,
    getHomePage2
};