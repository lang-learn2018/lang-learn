
//checking login
$("#login").keyup(function (){
  var name = $("#login").val();
  if (isNameValid(name)) {
    setValid("#login");
  } else {
    setInvalid("#login");
  }
  enableSubmit();
});
//checking name
$("#name").keyup(function (){
  var name = $("#name").val();
  if (isNameValid(name)) {
    setValid("#name");
  } else {
    setInvalid("#name");
  }
  enableSubmit();
});
//checking email
$("#email").keyup(function (){
  var name = $("#email").val();
  if (isEmailValid(name)) {
    setValid("#email");
  } else {
    setInvalid("#email");
  }
  enableSubmit();
});
// checking password
$("#password2").keyup(function (){
  var p1 = $("#password1").val();
  var p2 = $("#password2").val();
  if (!isPwsdValid(p2)) {
    setInvalid("#password2");
  } else  {
    setValid("#password2");
  }
  if (p1 == "") return;
  if (isMatch(p1, p2)) {
    setValid("#password2");
  } else {
    setInvalid("#password2");
  }
  enableSubmit();
});

$("#password1").keyup(function (){
  var p1 = $("#password1").val();
  var p2 = $("#password2").val();
  if (!isPwsdValid(p1)) {
    setInvalid("#password1");
  } else  {
    setValid("#password1");
  }
//check if user entered second field first
  if (p2 == "") return;
  if (isMatch(p1, p2)) {
    setValid("#password2");
  } else {
    setInvalid("#password2");
  }
  enableSubmit();
});
function isLoginValid(login) {
  if (login.length > 0) {
    return true;
  }
  return false;
}
function isNameValid(name) {
  if (name.length > 0) {
    return true;
  }
  return false;
}
function isEmailValid(email) {
  if (email.length > 0) {
    return true;
  }
  return false;
}
function isPwsdValid(pass) {
  if (pass.length >= 6) {
    return true;
  }
  return false;
}
function isMatch(p1, p2) {
  if (p1 == p2) {
    return true;
  }
  return false;
}
function setValid(id) {
  $(id).removeClass("is-invalid");
  $(id).addClass("is-valid");
}
function setInvalid(id) {
  $(id).removeClass("is-valid");
  $(id).addClass("is-invalid");
}
//button activation
function enableSubmit() {
  if ($("#login").hasClass("is-valid") && $("#name").hasClass("is-valid") && $("#email").hasClass("is-valid") && $("#password1").hasClass("is-valid") && $("#password2").hasClass("is-valid")) {
    document.getElementById("sbmt").disabled = false;
    document.getElementById("submitHelp").hidden = true;
  } else {
    document.getElementById("sbmt").disabled = true;
    document.getElementById("submitHelp").hidden = false;
  }
}

export function isFieldEmpty(value) {
  value = value.replace(/\s/g,'');
  if (value == "") return true;
  return false;
}

// export {isFieldEmpty};
















