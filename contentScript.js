chrome.runtime.onMessage.addListener(startIt);

let d = new Date();
let date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
let file_name = date;
var attendance = [];
var list = [];

function startIt(message, sender, sendResponse) {
    file_name = message + " | " + "(" + date + ")";
    fillPreDataInFile(file_name, date, message);
    getAttendence();
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
                isTeacher: isTeacher,
            };

            list.push(obj);
        }
        sortAndModifyList(list);
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
        item.div == "A" ?
            A.push(item) :
            item.div == "B" ?
            B.push(item) :
            others.push(item);
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
        attendance.push(s);
    });

    if (A.length || B.length) ptetxt(file_name, attendance);
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

// let arr =[
//   {div:null,roll:null,name:"yash",isTeacher:true},
//   {div:"B",roll:3,name:"ab",isTeacher:false},
//   {div:"A",roll:2,name:"das",isTeacher:false},
//   {div:"A",roll:10,name:"dvasf",isTeacher:false},
//   {div:"A",roll:44,name:"sdfc",isTeacher:false},
//   {div:"A",roll:50,name:"sdcsad",isTeacher:false},
//   {div:"B",roll:60,name:"adasec",isTeacher:false},
//   {div:"B",roll:13,name:"btar",isTeacher:false},
//   {div:"B",roll:11,name:"fase",isTeacher:false},
//   {div:"B",roll:22,name:"saefdsa",isTeacher:false},
//   {div:"B",roll:92,name:"chsdbfk",isTeacher:false},

// ]