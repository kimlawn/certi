const dataUrl = "https://raw.githubusercontent.com/mtinet/supervisorList/main/supervisorList.csv";
const resultsContainer = document.getElementById("results");


function searchName(name, number) {
  // 기수와 이름이 둘 다 입력되지 않았을 경우에 대한 검증 추가
  if (name === "" || number === "") {
    displayResults("기수와 이름을 모두 입력하고 검색해주세요.");
    return; // 필요한 정보가 모두 제공되지 않으면 검색을 하지 않고 종료
  }

  // 사용자 입력으로부터 받은 number를 문자열로 처리하고, 정확히 6자리 숫자 형태인지 확인
  const formattedNumber = number.trim();

  fetch(dataUrl)
    .then(response => response.text())
    .then(data => {
      const rows = data.trim().split("\n").slice(1);
      const teachers = rows.map(row => row.split(","));
      let matchingTeachers = teachers.filter(teacher => {
        // CSV 파일 내의 number와 사용자 입력 number가 6자리 숫자로서 일치하는 경우에만 필터링
        return teacher[1].trim() === formattedNumber && teacher[2] === name;
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
          <p><strong>Batch No.:</strong> ${teacher[1]}기</p>
          <!-- PDF 다운로드 링크 추가 -->
          <p><a href="pdf/${teacher[0]}.pdf" download="${teacher[0]}.pdf">Download PDF</a></p>
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
