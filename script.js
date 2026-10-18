// 필요한 요소 선택
const recommendForm = document.querySelector("#recommend-form");
const emailInput = document.querySelector("#email");
const recommendButton = document.querySelector("#recommendButton");
const recommendMessage = document.querySelector("#recommendMessage");
const tabButtons = document.querySelectorAll(".tab");
const tabPanels = document.querySelectorAll(".tab-panel");

// 종류별 추천 메뉴 목록
const menus = {
    korean: ["김치찌개", "된장찌개", "순두부찌개", "비빔밥", "제육볶음"],
    western: ["파스타", "피자", "햄버거", "돈가스", "오므라이스"],
    snack: ["떡볶이", "김밥", "라면", "순대", "튀김"]
};
const foods = menus.korean.concat(menus.western, menus.snack);

// 선택한 탭만 강조하고 해당 메뉴 목록만 보여주는 함수
function showTab(tabName) {
    tabButtons.forEach(function (tab) {
        const isSelected = tab.dataset.tab === tabName;
        tab.classList.toggle("is-active", isSelected);
        tab.setAttribute("aria-selected", isSelected);
    });

    tabPanels.forEach(function (panel) {
        panel.hidden = panel.id !== "panel-" + tabName;
    });
}

// 탭을 클릭하면 실행되는 함수
function handleTabClick(event) {
    showTab(event.currentTarget.dataset.tab);
}

// 브라우저의 입력값 검사 결과로 안내 문구를 만드는 함수
function makeRecommendMessage(email) {
    if (emailInput.validity.valueMissing) {
        return "이메일을 입력해 주세요.";
    }

    if (emailInput.validity.typeMismatch || emailInput.validity.patternMismatch) {
        return "이메일 형식을 확인해 주세요. 예: name@example.com";
    }

    const index = Math.floor(Math.random() * foods.length);
    return email + "로 추천 신청이 완료되었습니다. 오늘의 추천 메뉴는 \"" + foods[index] + "\"입니다.";
}

// 폼 제출 시 실행되는 함수
function handleSubmit(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    recommendMessage.textContent = makeRecommendMessage(email);

    if (emailInput.validity.valid) {
        recommendMessage.classList.remove("is-error");
        recommendMessage.classList.add("is-success");
        recommendButton.textContent = "추천완료";
        recommendButton.disabled = true;
    } else {
        recommendMessage.classList.remove("is-success");
        recommendMessage.classList.add("is-error");
        emailInput.focus();
    }
}

// 입력 내용이 바뀌면 다시 추천받을 수 있게 버튼을 되돌리는 함수
function handleInput() {
    recommendButton.disabled = false;
    recommendButton.textContent = "추천받기";
}

recommendForm.addEventListener("submit", handleSubmit);
emailInput.addEventListener("input", handleInput);
tabButtons.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});
