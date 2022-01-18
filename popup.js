console.log("popup js page");

let params = {
    active: true,
    currentWindow: true,
};
var submitButton = document.getElementById("submitButton");
var subName = document.getElementById("subjectName");

window.onload = () => {
    submitButton.addEventListener("click", () => {
        subName.value && handleButtonClick(subName.value);
    });
};

let handleButtonClick = (value) => {
    chrome.tabs.query(params, doIt);

    function doIt(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, value);
    }
};