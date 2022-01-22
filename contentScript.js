chrome.runtime.onMessage.addListener(startIt);

let d = new Date();
let date = d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
let file_name = date;
var attendance = [];
var list = [];
// const KEY_PANTRY = "";
const KEY_PANTRY = "Your key here";
let bName = "";
let subject = "";

function startIt(message, sender, sendResponse) {
  var basketName = message + "_" + date;
  bName = basketName;
  subject = message;
  file_name = message + " | " + "(" + date + ")";
  fillPreDataInFile(file_name, date, message);
  getAttendence();
  createBasket(basketName);

  console.log("basket name : ", bName);
}

function getAttendence() {
  let participantListButton = document.getElementsByClassName(
    "footer-button-base__button ax-outline footer-button__button"
  );
  alert("Opening participant list ");
  participantListButton[0] && participantListButton[0].click();

  let allParticipantsList = document.getElementsByClassName(
    "participants-item__name-section"
  );

  if (allParticipantsList) {
    for (let i = 0; i < allParticipantsList.length; i++) {
      let item = allParticipantsList[i].innerText.replace(/\n/g, "");
      let data = item.split("_");
      let roll = data[1];
      let div = data[0];
      let name = data.splice(2).join(" ");
      let isTeacher = false;
      // if is Teacher
      if (item.indexOf("_") == -1) {
        isTeacher = true;
        name = data[0];
      }
      let obj = {
        div: div,
        name: name,
        roll: roll,
      };
      list.push(obj);
    }
    putData(bName, list);
    sortAndModifyList(list);
    // console.log("List is : ", list);
    console.log("BName", bName);
  }

  // ptetxt(file_name, attendance);
}

function ptetxt(file_name, content) {
  alert("inside download");
  var pData = new Blob(content, { type: "text/plain" });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // for IE
    window.navigator.msSaveOrOpenBlob(pData, file_name);
  } else {
    // for Non-IE (chrome, firefox etc.)
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var pUrl = URL.createObjectURL(pData);
    a.href = pUrl;
    a.download = file_name;
    a.click();

    URL.revokeObjectURL(a.href);
    a.remove();
  }
}

function fillPreDataInFile(fileName, date, lecture) {
  let l1 = `\nLecture : ${lecture}\n`;
  let l2 = `Date : ${date}`;

  attendance.push(l2, l1);
}

function sortAndModifyList(l) {
  console.log("List is : ", l);
  let A = [];
  let B = [];
  let others = [];

  l.map((item) => {
    item.div == "A"
      ? A.push(item)
      : item.div == "B"
      ? B.push(item)
      : others.push(item);
  });

  // sorting A and B by roll number
  A.sort(compare);
  B.sort(compare);

  let line1 = `\n\nTotal participants : ${l.length}\n`;
  let line2 = `Total Students ( with roll number) : ${A.length + B.length}\n\n`;

  let line3 = `Present Students from Division A : ${A.length}\n`;
  let line4 = `Present Students from Division B : ${B.length}\n\n`;

  attendance.push(line1, line2, line3, line4);
  attendance.push("\n------------------------------------------\n");

  attendance.push("A division students : \n");

  A.map((item) => {
    let s = `\t ${item.div}  |  Roll : ${item.roll}  |  Name : ${item.name}\n`;
    attendance.push(s);
  });

  attendance.push("\n------------------------------------------\n");

  attendance.push("B division students : \n");

  B.map((item) => {
    let s = `\t ${item.div}  |  Roll : ${item.roll}  |  Name : ${item.name}\n`;
    attendance.push(s);
  });

  attendance.push("\n------------------------------------------\n");

  attendance.push("Others : \n");

  others.map((item) => {
    let s = `\t Name : ${item.name}`;
    attendance.push(s + "\n");
  });

  if (A.length || B.length) ptetxt(file_name, attendance); // save to and download txt file
}

function compare(a, b) {
  if (a.roll < b.roll) {
    return -1;
  }
  if (a.roll > b.roll) {
    return 1;
  }
  return 0;
}

// API functions
function createBasket(name) {
  var requestOptions = {
    method: "POST",
    redirect: "follow",
  };

  fetch(
    `https://getpantry.cloud/apiv1/pantry/${KEY_PANTRY}/basket/${name}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function putData(name, obj) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let b = {
    date: d.getTime(),
    subject: subject,
    data: obj,
  };
  var raw = JSON.stringify(b);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    `https://getpantry.cloud/apiv1/pantry/${KEY_PANTRY}/basket/${name}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function getBasket(name) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    `https://getpantry.cloud/apiv1/pantry/${KEY_PANTRY}/basket/${name}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function getpantry() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`https://getpantry.cloud/apiv1/pantry/${KEY_PANTRY}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function deleteBasket(name) {
  var requestOptions = {
    method: "DELETE",
    redirect: "follow",
  };

  fetch(
    `https://getpantry.cloud/apiv1/pantry/${KEY_PANTRY}/basket/${name}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
