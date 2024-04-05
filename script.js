const dataUrl = "https://raw.githubusercontent.com/mtinet/certi/main/certi.csv";
const resultsContainer = document.getElementById("results");


function searchName(name, number) {
  if (name.trim() === "" || number.trim() === "") {
    displayResults("생년월일과 이름을 모두 입력하고 검색해주세요.");
    return;
  }

  // 입력값의 앞뒤 공백 제거 및 소문자 변환을 통한 정규화
  const normalizedNumber = number.trim();
  const normalizedName = name.trim().toLowerCase();

  fetch(dataUrl)
    .then(response => response.text())
    .then(data => {
      const rows = data.trim().split("\n").slice(1);
      const teachers = rows.map(row => row.split(",").map(value => value.trim()));

      let matchingTeachers = teachers.filter(teacher => {
        // CSV 데이터와 입력값의 대소문자 구분 없이 비교
        const teacherNumber = teacher[1];
        const teacherName = teacher[2].toLowerCase();
        return teacherNumber === normalizedNumber && teacherName === normalizedName;
      });

      if (matchingTeachers.length > 0) {
        displayResults(matchingTeachers);
      } else {
        displayResults("검색 결과가 없습니다.");
      }
    })
    .catch(error => console.log(error));
}


function displayResults(teachers) {
  if (typeof teachers === "string") {
    resultsContainer.innerHTML = teachers;
  } else {
    const html = teachers.map(teacher => `
      <div class="teacher">
        <div class="teacher-info">
          <h2>${teacher[2]}</h2>
          <p><strong>생년월일:</strong> ${teacher[1]}</p>
          <!-- PDF 다운로드 링크 추가 -->
          <p><a href="https://github.com/mtinet/certi/blob/08cded10d87d3c9fbc31707cf4bcb89c533797d6/pdf/${teacher[0]}.pdf?raw=true" download="${teacher[0]}.pdf">Download PDF</a></p>
        </div>
      </div>
    `).join("");
    resultsContainer.innerHTML = html;
  }
}


const form = document.querySelector("form");
form.addEventListener("submit", event => {
  event.preventDefault();
  const name = form.elements.name.value;
  const number = form.elements.number.value;
  searchName(name, number);
});


const numberInput = document.getElementById("number");
numberInput.addEventListener('focus', () => {
  numberInput.placeholder = "";
  numberInput.style.opacity = 1.0;
});

numberInput.addEventListener('blur', () => {
  if (numberInput.value === '') {
    numberInput.placeholder = "ex) 24, 24-2, 31";
    numberInput.style.opacity = 0.3;
  }
});
