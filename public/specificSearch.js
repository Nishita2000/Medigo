function Enableprec() {
    var ans = document.getElementById("precSearchYes");
    var ansField = document.getElementById("precSearch");
    var locYes = document.getElementById("locationYes");
    var locNo = document.getElementById("locationNo");
    var op1 = document.getElementById("Option-1");
    var op2 = document.getElementById("Option-2");
    var op3 = document.getElementById("Option-3");
    var op4 = document.getElementById("Option-4");
    var op5 = document.getElementById("Option-5");
    ansField.disabled = ans.checked ? false : true;
    ansField.value = "";
    if (!ansField.disabled) {
        ansField.focus();
        locYes.disabled = true;
        locYes.checked = false;
        locNo.disabled = true;
        locNo.checked = false;
        op1.disabled = true;
        op2.disabled = true;
        op3.disabled = true;
        op4.disabled = true;
        op5.disabled = true;
    }
    else {
        locYes.disabled = false;
        locNo.disabled = false;
        op1.disabled = false;
        op2.disabled = false;
        op3.disabled = false;
        op4.disabled = false;
        op5.disabled = false;
    }
    let criteria_;
    let cri = document.getElementsByName('Criteria');
    cri.forEach((Criteria) => {
        if (Criteria.checked) {
            criteria_ = Criteria.value;

        }
    });
    console.log(criteria_)
    // fetch('/get_data').then(function (response) {

    //     return response.json();

    // }).then(function (responseData) {

    //     //console.log(responseData)
    //     var doctors_arr = [];
    //     for (var count = 0; count < responseData.length; count++) {
    //         doctors_arr[count] = responseData[count];
    //     }
    //     //console.log(doctors_arr);


    // });

    //console.log("doc")
    fetch('/get_data?cri=' + criteria_ + '').then(function (response) {

        return response.json();

    }).then(function (responseData) {

        //console.log(responseData)
        var doctors_arr = [];
        for (var count = 0; count < responseData.length; count++) {
            doctors_arr[count] = responseData[count].name;
        }
        console.log(doctors_arr);
        autoComplete(document.getElementById("precSearch"), doctors_arr);
        


    });


}
function autoComplete(inp, arr) {
    console.log(JSON.stringify(arr));
    /*the autoComplete function takes two arguments,
    the text field element and an array of possible autoCompleted values:*/
    console.log("string");
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        console.log(val);
        /*close any already open lists of autoCompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autoComplete-list");
        a.setAttribute("class", "autoComplete-items");
        /*append the DIV element as a child of the autoComplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if ( arr[i].substring(0,val.length).toUpperCase()==val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substring(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substring(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autoComplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autoCompleted values,
                    (or any other open lists of autoCompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autoComplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autoComplete-active":*/
        x[currentFocus].classList.add("autoComplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autoComplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autoComplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autoComplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autoComplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}