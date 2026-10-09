// 필요한 요소 선택
const form = document.querySelector("#input form");
const emailInput = document.querySelector("#email");
const button = document.querySelector("#input button");

// 폼 제출 시 실행되는 함수
function handleSubmit(event) {
    event.preventDefault();
    console.log("입력한 이메일:", emailInput.value);
}

form.addEventListener("submit", handleSubmit);
