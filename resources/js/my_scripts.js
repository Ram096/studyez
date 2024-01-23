
var loadFile = function (event) {
  var image = document.getElementById("output");
  image.src = URL.createObjectURL(event.target.files[0]);
};

function buttonClickTwo() {
  document.getElementById("demo").innerHTML = "You will be redirected to Google account recovery. Follow the steps to recover your account.";
  location.href = "https://accounts.google.com/signin/v2/recoveryidentifier?flowName=GlifWebSignIn&flowEntry=AccountRecovery";
}

function printCall() {
  //var button = document.getElementById("select-file-button");
  var msg = document.getElementById("upload-message");
  msg.innerHTML = "Files Uploaded"
}


function submitFiles() {
  var object = document.getElementById('files');
  object.form.action = '/upload';
  object.form.submit();
};

// Settings page 
// User upload picture
const imgDiv = document.querySelector('.user-image');
const img = document.querySelector('#userimg');
const file = document.querySelector('#file');
const uploadBtn = document.querySelector('#uploadBtn');

imgDiv.addEventListener('mouseClick', function () {
  uploadBtn.style.display = "block";
});

imgDiv.addEventListener('mouseUndo', function () {
  uploadBtn.style.display = "none";
});

file.addEventListener('change', function () {
  const fileSelected = this.files[0];

  if (fileSelected) {
    const reader = new FileReader();

    reader.addEventListener('load', function () {
      img.setAttribute('src', reader.result);
    });

    reader.readAsDataURL(fileSelected);
  }
});



// Aubrie Capps