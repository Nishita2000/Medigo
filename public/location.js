/*var x = document.getElementById("demo");*/
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        // x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    //get location --ALVEE
    let { latitude, longitude } = position.coords;
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=4dad3123413a40eb941dedc3cb91ffcc`)
        //fetch(`localhost:3000/getdoctor`)
        .then(response => response.json()).then(response => {
            let allDetails = response.results[0].components;
            console.table(allDetails);
            let {suburb,state_district,state} = allDetails;
            state_district=state_district.replace(' District','');
            state=state.replace(' Division','');
            document.getElementById("hiddenSuburb").value = suburb;
            document.getElementById("hiddenStateDistrict").value = state_district;
            document.getElementById("hiddenState").value = state;
            console.log(document.getElementById("hiddenSuburb").value);
            console.log(document.getElementById("hiddenStateDistrict").value);
            console.log(document.getElementById("hiddenState").value);
        }).catch(() => {
            // button.innerText = "Something went wrong";
        });
}




