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
const steps = document.querySelectorAll("#input .steps li");
const tabButtons = document.querySelectorAll(".tab");
const tabPanels = document.querySelectorAll(".tab-panel");
const emailForm = document.querySelector("#email-form");
const emailInput = document.querySelector("#email");
const emailHint = document.querySelector("#emailHint");
const emailButton = document.querySelector("#emailButton");
const emailMessage = document.querySelector("#emailMessage");
const favoriteButton = document.querySelector("#favoriteButton");
const favoriteMessage = document.querySelector("#favoriteMessage");
const favoritesTitle = document.querySelector("#favoritesTitle");
const favoriteCount = document.querySelector("#favoriteCount");
const favoriteList = document.querySelector("#favoriteList");
const emptyFavorites = document.querySelector("#emptyFavorites");
const favoritesMessage = document.querySelector("#favoritesMessage");
const storageMessage = document.querySelector("#storageMessage");
const favoriteDetail = document.querySelector("#favorite-detail");
const favoriteDetailTitle = document.querySelector("#favoriteDetailTitle");
const favoriteDetailSummary = document.querySelector("#favoriteDetailSummary");
const favoriteStorageKey = "today-menu-favorites";
let currentStep = 0;
let currentRecommendation = null;
let favorites = [];

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
    currentRecommendation = {
        name: foods[index].name,
        category: categorySelect.value,
        spicy: spicySelect.value
    };
    completedSummary.textContent = categoryNames[categorySelect.value] + " · " + spicyNames[spicySelect.value];
    recommendMessage.textContent = "오늘의 추천 메뉴는 \"" + foods[index].name + "\"입니다.";
    favoriteMessage.textContent = "";
    updateFavoriteButton();
    showStep(3);
}

// 다시 시작하면 현재 추천만 초기화하고 찜 목록은 유지하는 함수
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
    currentRecommendation = null;
    favoriteMessage.textContent = "";
    favoritesMessage.textContent = "";
    renderFavorites();
    showStep(0);
}

// 브라우저에 저장한 찜 목록을 읽고 메뉴와 선택값이 올바른지 확인하는 함수
function loadFavorites() {
    try {
        const savedFavorites = JSON.parse(localStorage.getItem(favoriteStorageKey) || "[]");
        const isValid = Array.isArray(savedFavorites) && savedFavorites.every(function (favorite) {
            return favorite !== null &&
                Object.keys(categoryNames).includes(favorite.category) &&
                Object.keys(spicyNames).includes(favorite.spicy) &&
                getFoods(favorite.category, favorite.spicy).some(function (food) {
                    return food.name === favorite.name;
                });
        });
        if (!isValid) {
            throw new Error("저장한 메뉴 정보가 올바르지 않습니다.");
        }
        favorites = savedFavorites;
    } catch (error) {
        storageMessage.textContent = "찜 목록을 불러오지 못했어요. 새로고침하거나 메뉴를 다시 찜해 주세요.";
        storageMessage.hidden = false;
    }
}

// 저장에 성공했을 때만 찜 목록을 바꾸는 함수
function saveFavorites(nextFavorites) {
    try {
        localStorage.setItem(favoriteStorageKey, JSON.stringify(nextFavorites));
        favorites = nextFavorites;
        storageMessage.textContent = "";
        storageMessage.hidden = true;
        return true;
    } catch (error) {
        storageMessage.textContent = "변경 내용을 저장하지 못했어요. 브라우저 저장 설정을 확인하고 다시 눌러 주세요.";
        storageMessage.hidden = false;
        return false;
    }
}

// 같은 메뉴는 한 번만 찜할 수 있도록 버튼 상태를 바꾸는 함수
function updateFavoriteButton() {
    const isSaved = currentRecommendation !== null && favorites.some(function (favorite) {
        return favorite.name === currentRecommendation.name;
    });
    favoriteButton.disabled = currentRecommendation === null || isSaved;
    favoriteButton.textContent = isSaved ? "찜한 메뉴" : "이 메뉴 찜하기";
}

// 찜 목록과 개수를 갱신하고, 비어 있으면 추천 시작을 안내하는 함수
function renderFavorites() {
    favoriteList.textContent = "";
    favoriteList.hidden = false;
    favoriteDetail.hidden = true;
    favoriteCount.textContent = favorites.length;
    emptyFavorites.hidden = favorites.length !== 0;

    favorites.forEach(function (favorite) {
        const item = document.createElement("li");
        const title = document.createElement("h3");
        const summary = document.createElement("p");
        const buttons = document.createElement("div");
        const viewButton = document.createElement("button");
        const removeButton = document.createElement("button");

        title.textContent = favorite.name;
        summary.textContent = "선택한 취향: " + categoryNames[favorite.category] + " · " + spicyNames[favorite.spicy];
        buttons.className = "flow-buttons";
        viewButton.type = "button";
        viewButton.textContent = "다시 보기";
        viewButton.setAttribute("aria-label", favorite.name + " 다시 보기");
        viewButton.addEventListener("click", function () {
            showFavorite(favorite);
        });
        removeButton.type = "button";
        removeButton.className = "secondary";
        removeButton.textContent = "찜 해제";
        removeButton.setAttribute("aria-label", favorite.name + " 찜 해제");
        removeButton.addEventListener("click", function () {
            removeFavorite(favorite.name);
        });

        buttons.appendChild(viewButton);
        buttons.appendChild(removeButton);
        item.appendChild(title);
        item.appendChild(summary);
        item.appendChild(buttons);
        favoriteList.appendChild(item);
    });
    updateFavoriteButton();
}

// 추천 결과를 찜 목록에 추가하고 저장 결과를 안내하는 함수
function handleFavorite() {
    if (currentStep !== 3 || currentRecommendation === null) {
        return;
    }
    const isSaved = favorites.some(function (favorite) {
        return favorite.name === currentRecommendation.name;
    });
    if (isSaved) {
        favoriteMessage.textContent = "이미 찜한 메뉴예요. 찜한 메뉴 목록에서 다시 볼 수 있어요.";
        return;
    }
    if (!saveFavorites(favorites.concat(currentRecommendation))) {
        favoriteMessage.textContent = storageMessage.textContent;
        return;
    }
    renderFavorites();
    favoritesMessage.textContent = "";
    favoriteMessage.textContent = "\"" + currentRecommendation.name + "\" 메뉴를 찜했어요. 찜한 메뉴 보기에서 확인해 주세요.";
}

// 새 추천을 실행하지 않고 찜할 당시의 메뉴와 선택값을 보여주는 함수
function showFavorite(favorite) {
    favoriteDetailTitle.textContent = favorite.name;
    favoriteDetailSummary.textContent = categoryNames[favorite.category] + " · " + spicyNames[favorite.spicy];
    favoriteList.hidden = true;
    favoriteDetail.hidden = false;
    favoritesMessage.textContent = "";
    favoriteDetailTitle.focus();
}

// 찜한 메뉴를 해제하고 완료 화면의 찜 버튼도 함께 갱신하는 함수
function removeFavorite(name) {
    const nextFavorites = favorites.filter(function (favorite) {
        return favorite.name !== name;
    });
    if (!saveFavorites(nextFavorites)) {
        return;
    }
    renderFavorites();
    favoriteMessage.textContent = "";
    favoritesMessage.textContent = name + " 찜을 해제했어요.";
    favoritesTitle.focus();
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
favoriteButton.addEventListener("click", handleFavorite);
document.querySelector("#viewFavoritesButton").addEventListener("click", function () {
    renderFavorites();
    favoritesTitle.focus();
});
document.querySelector("#backToFavoritesButton").addEventListener("click", function () {
    favoriteDetail.hidden = true;
    favoriteList.hidden = false;
    favoritesTitle.focus();
});
document.querySelector("#emptyRecommendButton").addEventListener("click", function () {
    showStep(currentStep === 0 ? 1 : currentStep);
});
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

loadFavorites();
renderFavorites();

// 오늘의 식사 기록에 필요한 요소 선택
const mealForm = document.querySelector("#meal-form");
const mealStartButton = document.querySelector("#mealStartButton");
const mealViewButton = document.querySelector("#mealViewButton");
const mealRecordsPanel = document.querySelector("#mealRecordsPanel");
const mealCancelButton = document.querySelector("#mealCancelButton");
const mealRecordsTitle = document.querySelector("#mealRecordsTitle");
const mealSteps = document.querySelectorAll(".meal-steps li");
const mealNameInput = document.querySelector("#mealName");
const mealRatingField = document.querySelector("#mealRating");
const mealRatingInputs = document.querySelectorAll("input[name=mealRating]");
const mealNameStatus = document.querySelector("#mealNameStatus");
const mealReasonStatus = document.querySelector("#mealReasonStatus");
const mealReasonArea = document.querySelector("#mealReasonArea");
const mealReasonInput = document.querySelector("#mealReason");
const mealSubmitButton = document.querySelector("#mealSubmitButton");
const mealResetButton = document.querySelector("#mealResetButton");
const mealMessage = document.querySelector("#mealMessage");
const mealRecordsList = document.querySelector("#mealRecords");
const emptyMeals = document.querySelector("#emptyMeals");
const mealStorageKey = "today-meal-records";
const mealRatingNames = {
    good: "좋았어요",
    normal: "보통이에요",
    bad: "아쉬웠어요"
};
let mealRecords = [];
let isMealSubmitting = false;

// 시작, 입력, 기록 보기 중 현재 단계에 해당하는 영역만 표시하는 함수
function showMealStep(step) {
    const isOpen = step === 1;
    mealSteps.forEach(function (item, index) {
        if (index === step) {
            item.setAttribute("aria-current", "step");
        } else {
            item.removeAttribute("aria-current");
        }
    });
    mealForm.hidden = !isOpen;
    mealRecordsPanel.hidden = step !== 2;
    mealViewButton.hidden = step !== 0;
    mealStartButton.hidden = isOpen;
    mealStartButton.setAttribute("aria-expanded", isOpen);
    setMealSubmitting(false);
    if (isOpen) {
        mealNameInput.focus();
    } else if (step === 2) {
        mealRecordsTitle.focus();
    } else {
        mealStartButton.focus();
    }
}

// 선택한 만족도를 읽는 함수
function getMealRating() {
    const selected = document.querySelector("input[name=mealRating]:checked");
    return selected ? selected.value : "";
}

// 입력 중에는 오류 대신 작은 상태 배지로 글자 수와 충족 여부를 표시
function updateMealStatus(input, status, minimum, maximum) {
    const length = input.value.trim().length;
    const isValid = length >= minimum && length <= maximum;
    status.hidden = length === 0;
    status.classList.toggle("is-complete", isValid);
    status.textContent = length + " / " + maximum + "자";
}

// 저장할 때 입력 길이를 검사하는 함수
function validateMealText(input, minimum, maximum) {
    const length = input.value.trim().length;
    const isValid = length >= minimum && length <= maximum;
    input.classList.toggle("is-invalid", !isValid);
    input.setAttribute("aria-invalid", !isValid);
    return isValid;
}

// 아쉬웠어요를 선택한 경우에만 이유를 표시하고 입력을 활성화하는 함수
function toggleMealReason() {
    mealReasonArea.hidden = getMealRating() !== "bad";
    mealReasonInput.disabled = getMealRating() !== "bad";
    mealMessage.textContent = "";
}

// 저장된 식사 기록을 안전하게 텍스트로 표시하는 함수
function renderMealRecords() {
    mealRecordsList.textContent = "";
    emptyMeals.hidden = mealRecords.length !== 0;
    mealRecords.forEach(function (meal, index) {
        const item = document.createElement("li");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "ghost";
        deleteButton.textContent = "삭제";
        deleteButton.disabled = isMealSubmitting;
        deleteButton.setAttribute("aria-label", meal.name + " 식사 기록 삭제");
        deleteButton.addEventListener("click", function () {
            removeMealRecord(index);
        });
        title.textContent = meal.name;
        description.textContent = mealRatingNames[meal.rating] + (meal.reason ? " · " + meal.reason : "");
        item.appendChild(title);
        item.appendChild(description);
        item.appendChild(deleteButton);
        mealRecordsList.appendChild(item);
    });
}

// 선택한 기록만 삭제하고 저장에 실패하면 기존 목록을 유지하는 함수
function removeMealRecord(index) {
    if (isMealSubmitting) {
        return;
    }
    const nextMeals = mealRecords.filter(function (meal, mealIndex) {
        return mealIndex !== index;
    });
    try {
        localStorage.setItem(mealStorageKey, JSON.stringify(nextMeals));
        const name = mealRecords[index].name;
        mealRecords = nextMeals;
        renderMealRecords();
        mealMessage.textContent = "\"" + name + "\" 식사 기록을 삭제했어요.";
        mealRecordsTitle.focus();
    } catch (error) {
        mealMessage.textContent = "삭제하지 못했어요. 기록은 유지됩니다. 브라우저 저장 공간과 설정을 확인한 후 다시 시도해 주세요.";
    }
}

// 새로고침 후에도 식사 기록을 복원하는 함수
function loadMealRecords() {
    try {
        const savedMeals = JSON.parse(localStorage.getItem(mealStorageKey) || "[]");
        const isValid = Array.isArray(savedMeals) && savedMeals.every(function (meal) {
            return meal !== null && typeof meal.name === "string" &&
                Object.keys(mealRatingNames).includes(meal.rating) &&
                typeof meal.reason === "string";
        });
        if (!isValid) {
            throw new Error("저장 데이터 오류");
        }
        mealRecords = savedMeals;
    } catch (error) {
        mealMessage.textContent = "식사 기록을 불러오지 못했어요. 브라우저 저장 설정을 확인해 주세요.";
    }
    renderMealRecords();
}

// 제출 중 입력과 버튼을 잠가 중복 저장을 막는 함수
function setMealSubmitting(isSubmitting) {
    isMealSubmitting = isSubmitting;
    mealNameInput.disabled = isSubmitting || mealForm.hidden;
    mealRatingField.disabled = isSubmitting || mealForm.hidden;
    mealReasonInput.disabled = isSubmitting || mealForm.hidden || getMealRating() !== "bad";
    mealSubmitButton.disabled = isSubmitting;
    mealResetButton.disabled = isSubmitting;
    mealCancelButton.disabled = isSubmitting;
    mealRecordsList.querySelectorAll("button").forEach(function (button) {
        button.disabled = isSubmitting;
    });
    mealSubmitButton.textContent = isSubmitting ? "저장 중…" : "식사 기록 저장";
    mealForm.setAttribute("aria-busy", isSubmitting);
}

// 입력 검사 후 브라우저에 저장하고 실패하면 입력값을 유지하는 함수
function handleMealSubmit(event) {
    event.preventDefault();
    if (isMealSubmitting || mealForm.hidden) {
        return;
    }
    const nameValid = validateMealText(mealNameInput, 2, 30);
    const ratingValid = getMealRating() !== "";
    mealRatingField.classList.toggle("is-invalid", !ratingValid);
    mealRatingField.setAttribute("aria-invalid", !ratingValid);
    const reasonValid = getMealRating() !== "bad" || validateMealText(mealReasonInput, 10, 100);
    if (!nameValid || !ratingValid || !reasonValid) {
        mealMessage.textContent = [
            !nameValid ? "먹은 메뉴를 2~30자로 입력해 주세요." : "",
            !ratingValid ? "만족도를 선택해 주세요." : "",
            !reasonValid ? "아쉬웠던 이유를 10~100자로 입력해 주세요." : ""
        ].filter(Boolean).join(" ");
        if (!nameValid) {
            mealNameInput.focus();
        } else if (!ratingValid) {
            mealRatingInputs[0].focus();
        } else {
            mealReasonInput.focus();
        }
        return;
    }
    const meal = {
        name: mealNameInput.value.trim(),
        rating: getMealRating(),
        reason: getMealRating() === "bad" ? mealReasonInput.value.trim() : ""
    };
    setMealSubmitting(true);
    mealMessage.textContent = "식사 기록을 저장하고 있어요. 잠시 기다려 주세요.";
    // 저장 진행 상태를 확인할 수 있도록 잠시 기다린 뒤 저장
    window.setTimeout(function () {
        try {
            const nextMeals = mealRecords.concat(meal);
            localStorage.setItem(mealStorageKey, JSON.stringify(nextMeals));
            mealRecords = nextMeals;
            renderMealRecords();
            setMealSubmitting(false);
            mealForm.reset();
            showMealStep(2);
            mealMessage.textContent = "\"" + meal.name + "\" 식사를 기록했어요. 아래 목록에서 확인해 주세요.";
        } catch (error) {
            setMealSubmitting(false);
            mealMessage.textContent = "저장하지 못했어요. 입력 내용은 유지됩니다. 브라우저 저장 공간과 설정을 확인한 후 다시 저장해 주세요.";
        }
    }, 700);
}

// 다시 작성하면 입력값과 안내 문구, 조건부 영역을 함께 초기화하는 함수
function handleMealReset(event) {
    if (isMealSubmitting) {
        event.preventDefault();
        return;
    }
    [mealNameInput, mealRatingField, mealReasonInput].forEach(function (input) {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
    });
    mealNameStatus.hidden = true;
    mealReasonStatus.hidden = true;
    mealNameStatus.textContent = "";
    mealReasonStatus.textContent = "";
    mealNameStatus.classList.remove("is-complete");
    mealReasonStatus.classList.remove("is-complete");
    mealReasonArea.hidden = true;
    setMealSubmitting(false);
    mealReasonInput.disabled = true;
    mealMessage.textContent = "";
}

// 입력을 수정하면 이전 오류만 지우고, 검사는 저장 시 실행
[mealNameInput, mealRatingField, mealReasonInput].forEach(function (input) {
    input.addEventListener("input", function () {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
        mealMessage.textContent = "";
    });
});
mealNameInput.addEventListener("input", function () {
    updateMealStatus(mealNameInput, mealNameStatus, 2, 30);
});
mealReasonInput.addEventListener("input", function () {
    updateMealStatus(mealReasonInput, mealReasonStatus, 10, 100);
});
mealRatingInputs.forEach(function (input) {
    input.addEventListener("change", toggleMealReason);
});
mealForm.addEventListener("submit", handleMealSubmit);
mealForm.addEventListener("reset", handleMealReset);
mealViewButton.addEventListener("click", function () {
    mealMessage.textContent = "";
    showMealStep(2);
});
mealStartButton.addEventListener("click", function () {
    mealForm.reset();
    showMealStep(1);
});
mealCancelButton.addEventListener("click", function () {
    if (isMealSubmitting) {
        return;
    }
    mealForm.reset();
    showMealStep(0);
});
loadMealRecords();
setMealSubmitting(false);
