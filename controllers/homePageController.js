let getHomePage = async (req, res) => {
    return res.render("receptionist_dashboard.ejs", {
        user: req.user
    });
};

let getHomePage2 = async (req, res) => {
    return res.render("patient_dashboard.ejs", {
        user: req.user
    });
};

module.exports = {
    getHomePage,
    getHomePage2
};