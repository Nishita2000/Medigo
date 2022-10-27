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
}