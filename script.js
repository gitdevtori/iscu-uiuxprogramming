// 필요한 요소 선택
const form = document.querySelector("#input form");
const emailInput = document.querySelector("#email");
const button = document.querySelector("#input button");
const message = document.querySelector("#message");

// 추천할 음식 목록
const foods = ["김치찌개", "된장찌개", "순두부찌개", "떡볶이", "돈가스", "파스타", "카레", "피자", "햄버거", "오므라이스", "쌀국수"];

// 이메일 형식을 간단하게 확인하는 함수
function isEmail(email) {
    return email.includes("@") && email.includes(".");
}

// 입력한 이메일에 따라 안내 문구를 만드는 함수
function getRecommendMessage(email) {
    if (email === "") {
        return "이메일을 입력해주세요.";
    }

    if (!isEmail(email)) {
        return "이메일 형식이 올바르지 않습니다. 예: name@example.com";
    }

    const index = Math.floor(Math.random() * foods.length);
    return "오늘은 \"" + foods[index] + "\"를 추천합니다! 앞으로 추천 메뉴를 " + email + " 주소로 보내드릴게요.";
}

// 폼 제출 시 실행되는 함수
function handleSubmit(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    message.textContent = getRecommendMessage(email);

    if (email === "" || !isEmail(email)) {
        emailInput.focus();
    }
}

form.addEventListener("submit", handleSubmit);
