// 필요한 요소 선택
const recommendForm = document.querySelector("#recommend-form");
const categorySelect = document.querySelector("#category");
const spicySelect = document.querySelector("#spicy");
const categoryHint = document.querySelector("#categoryHint");
const spicyHint = document.querySelector("#spicyHint");
const categorySummary = document.querySelector("#categorySummary");
const spicySummary = document.querySelector("#spicySummary");
const completedSummary = document.querySelector("#completedSummary");
const recommendMessage = document.querySelector("#recommendMessage");
const noResultMessage = document.querySelector("#noResultMessage");
const flowPanels = document.querySelectorAll(".flow-panel");
const steps = document.querySelectorAll(".steps li");
const tabButtons = document.querySelectorAll(".tab");
const tabPanels = document.querySelectorAll(".tab-panel");
const emailForm = document.querySelector("#email-form");
const emailInput = document.querySelector("#email");
const emailHint = document.querySelector("#emailHint");
const emailButton = document.querySelector("#emailButton");
const emailMessage = document.querySelector("#emailMessage");
let currentStep = 0;

// 종류별 추천 메뉴와 매운맛 정보
const menus = {
    korean: [
        { name: "김치찌개", spicy: "hot" },
        { name: "된장찌개", spicy: "mild" },
        { name: "순두부찌개", spicy: "hot" },
        { name: "비빔밥", spicy: "mild" },
        { name: "제육볶음", spicy: "hot" }
    ],
    western: [
        { name: "파스타", spicy: "mild" },
        { name: "피자", spicy: "mild" },
        { name: "햄버거", spicy: "mild" },
        { name: "돈가스", spicy: "mild" },
        { name: "오므라이스", spicy: "mild" }
    ],
    japanese: [
        { name: "초밥", spicy: "mild" },
        { name: "우동", spicy: "mild" },
        { name: "소바", spicy: "mild" },
        { name: "규동", spicy: "mild" },
        { name: "매운 라멘", spicy: "hot" }
    ],
    snack: [
        { name: "떡볶이", spicy: "hot" },
        { name: "김밥", spicy: "mild" },
        { name: "라면", spicy: "hot" },
        { name: "순대", spicy: "mild" },
        { name: "튀김", spicy: "mild" }
    ]
};
const categoryNames = {
    all: "상관없음",
    korean: "한식",
    western: "양식",
    japanese: "일식",
    snack: "분식"
};
const spicyNames = {
    all: "상관없음",
    mild: "매운 음식 제외",
    hot: "매운 음식 선호"
};

// 선택한 음식 종류와 매운맛에 맞는 메뉴를 돌려주는 함수
function getFoods(category, spicy) {
    let foods = menus[category];

    if (category === "all") {
        foods = menus.korean.concat(menus.western, menus.japanese, menus.snack);
    }

    return foods.filter(function (food) {
        return spicy === "all" || food.spicy === spicy;
    });
}

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

function handleTabClick(event) {
    showTab(event.currentTarget.dataset.tab);
}

// 현재 단계의 화면과 진행 표시를 바꾸고 제목으로 이동하는 함수
function showStep(step) {
    currentStep = step;

    flowPanels.forEach(function (panel, index) {
        panel.hidden = index !== step;
    });

    steps.forEach(function (item, index) {
        if (index === step) {
            item.setAttribute("aria-current", "step");
        } else {
            item.removeAttribute("aria-current");
        }
    });

    flowPanels[step].querySelector("h3").focus();
}

// 필수 선택이 빠지면 항목 아래에 수정 방법을 표시하는 함수
function validateSelection(select, hint) {
    const isValid = select.value !== "";
    select.classList.toggle("is-invalid", !isValid);
    select.setAttribute("aria-invalid", !isValid);
    hint.hidden = isValid;
    return isValid;
}

// 두 항목을 모두 선택했을 때만 확인 화면으로 이동하는 함수
function handleSubmit(event) {
    event.preventDefault();
    if (currentStep !== 1) {
        return;
    }

    const categoryValid = validateSelection(categorySelect, categoryHint);
    const spicyValid = validateSelection(spicySelect, spicyHint);

    if (!categoryValid) {
        categorySelect.focus();
        return;
    }
    if (!spicyValid) {
        spicySelect.focus();
        return;
    }

    categorySummary.textContent = categoryNames[categorySelect.value];
    spicySummary.textContent = spicyNames[spicySelect.value];
    noResultMessage.hidden = true;
    showStep(2);
}

// 조건에 맞는 메뉴가 있으면 하나를 골라 완료 화면에 표시하는 함수
function handleRecommend() {
    if (currentStep !== 2) {
        return;
    }

    const foods = getFoods(categorySelect.value, spicySelect.value);
    if (foods.length === 0) {
        noResultMessage.hidden = false;
        return;
    }

    const index = Math.floor(Math.random() * foods.length);
    completedSummary.textContent = categoryNames[categorySelect.value] + " · " + spicyNames[spicySelect.value];
    recommendMessage.textContent = "오늘의 추천 메뉴는 \"" + foods[index].name + "\"입니다.";
    showStep(3);
}

// 다시 시작하면 선택값, 안내 문구, 오류, 진행 상태를 모두 초기화하는 함수
function handleRestart() {
    recommendForm.reset();
    emailForm.reset();
    handleEmailInput();
    categorySelect.classList.remove("is-invalid");
    spicySelect.classList.remove("is-invalid");
    categorySelect.removeAttribute("aria-invalid");
    spicySelect.removeAttribute("aria-invalid");
    categoryHint.hidden = true;
    spicyHint.hidden = true;
    noResultMessage.hidden = true;
    categorySummary.textContent = "";
    spicySummary.textContent = "";
    completedSummary.textContent = "";
    recommendMessage.textContent = "";
    showStep(0);
}

// 이메일 형식을 검사하고 안내 문구와 버튼 상태를 바꾸는 함수
function handleEmailInput() {
    const isEmpty = emailInput.value.trim() === "";
    const isValid = emailInput.validity.valid;
    emailInput.classList.toggle("is-invalid", !isEmpty && !isValid);
    emailHint.classList.toggle("is-invalid", !isEmpty && !isValid);
    if (!isEmpty && !isValid) {
        emailInput.setAttribute("aria-invalid", "true");
    } else {
        emailInput.removeAttribute("aria-invalid");
    }
    emailHint.hidden = isEmpty || isValid;
    emailHint.textContent = isEmpty
        ? ""
        : "name@example.com 형식으로 입력해 주세요.";
    emailButton.disabled = !isValid;
    emailButton.textContent = "이메일로 추천받기";
    emailMessage.textContent = "";
}

// 이메일 신청을 처리하는 함수
function handleEmailSubmit(event) {
    event.preventDefault();
    if (currentStep !== 3) {
        return;
    }
    handleEmailInput();
    if (!emailInput.validity.valid) {
        emailHint.hidden = false;
        emailHint.textContent = "이메일을 name@example.com 형식으로 입력해 주세요.";
        emailHint.classList.add("is-invalid");
        emailInput.classList.add("is-invalid");
        emailInput.setAttribute("aria-invalid", "true");
        emailInput.focus();
        return;
    }

    emailMessage.textContent = "선택한 취향: " + completedSummary.textContent;
    emailButton.textContent = "입력 완료";
    emailButton.disabled = true;
}

emailInput.addEventListener("input", handleEmailInput);
emailForm.addEventListener("submit", handleEmailSubmit);
recommendForm.addEventListener("submit", handleSubmit);
document.querySelector("#startButton").addEventListener("click", function () {
    showStep(1);
});
document.querySelector("#previousButton").addEventListener("click", function () {
    showStep(0);
});
document.querySelector("#editButton").addEventListener("click", function () {
    noResultMessage.hidden = true;
    showStep(1);
});
document.querySelector("#recommendButton").addEventListener("click", handleRecommend);
document.querySelector("#restartButton").addEventListener("click", handleRestart);
categorySelect.addEventListener("change", function () {
    validateSelection(categorySelect, categoryHint);
});
spicySelect.addEventListener("change", function () {
    validateSelection(spicySelect, spicyHint);
});
tabButtons.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});
