exports.consolePage = (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>쿼리 콘솔</title>
  <style>
    /* 기존 스타일 유지 */
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #f3f4f6, #d1d5db);
      font-family: Arial, sans-serif;
    }
    .console-container {
      display: flex;
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      width: 90%;
      height: 80vh;
    }
    .query-input, .query-result {
      flex: 1;
      padding: 0.5rem;
    }
    .query-input textarea {
      width: 70%;
      height: 30%;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 10px;
      font-size: 0.9rem;
    }
    .query-result {
      border-left: 1px solid #ccc;
      overflow-y: auto;
    }
    button {
      background: #4CAF50;
      color: white;
      border: none;
      padding: 10px;
      width: 100%;
      margin-top: 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
    }
    button:hover {
      background: #45a049;
    }

    /* 테이블 스타일 개선 */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 0.85rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
      word-wrap: break-word;
    }
    th {
      background: #4CAF50;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    tr:hover {
      background-color: #f1f1f1;
    }
    td {
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <div class="console-container">
    <div class="query-input">
      <textarea id="query" placeholder="SQL 쿼리를 입력하세요"></textarea>
      <button onclick="executeQuery()">실행</button>
      <div>전체 유저 조회: select * from users;</div>
      <div>특정 유저 조회: select * from users where id=100;</div>
      <div>전체 일기 조회: select * from diaries;</div>
      <div>특정 유저의 일기 조회: select * from diaries where user_id=100</div>
      <button id="downloadButton" style="display: none;" onclick="downloadExcel()">엑셀 다운로드</button>
    </div>
    <div class="query-result" id="result"></div>
  </div>

  <script>
    let queryData = []; // 쿼리 결과를 저장할 변수

    async function executeQuery() {
      const query = document.getElementById('query').value;
      const resultDiv = document.getElementById('result');
      const downloadButton = document.getElementById('downloadButton');
      
      // 콘솔 비우기
      resultDiv.innerHTML = '';
      downloadButton.style.display = 'none'; // 다운로드 버튼 숨기기

      // SQL 쿼리에서 'SELECT' 외의 명령어가 포함되어 있는지 확인
      const forbiddenCommands = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE'];
      const upperQuery = query.trim().toUpperCase();  // 대문자로 변환

      if (forbiddenCommands.some(command => upperQuery.includes(command))) {
        alert('경고: 데이터베이스 조작 명령어는 허용되지 않습니다.');
        return;
      }

      try {
        const response = await axios.post('/execute-query', { query }, {
          headers: { 'Content-Type': 'application/json' }
        });

        // 응답에서 메시지가 있을 경우 사용
        if (response.data && response.data.message) {
          alert(response.data.message);  // 서버에서 받은 메시지를 알림으로 표시
        } else {
          queryData = response.data; // 쿼리 결과 저장
          renderTable(queryData); // 결과 테이블 렌더링
          downloadButton.style.display = 'block'; // 다운로드 버튼 보이기
        }
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || '알 수 없는 오류가 발생했습니다.';
          alert(message);  // 서버에서 보내는 에러 메시지를 알림으로 표시
        } else {
          alert('오류 발생: ' + (error.message || '알 수 없는 오류'));
        }
      }
    }

    function renderTable(data) {
      if (!Array.isArray(data) || data.length === 0) {
        document.getElementById('result').innerText = '결과가 없습니다';
        return;
      }

      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      
      const headers = Object.keys(data[0]);
      const headerRow = document.createElement('tr');
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      
      data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
          const td = document.createElement('td');
          td.textContent = row[header];
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '';
      resultDiv.appendChild(table);
    }

    function downloadExcel() {
      if (queryData.length === 0) return; // 데이터가 없으면 다운로드 안함

      const data = [];
      const headers = Object.keys(queryData[0]);
      data.push(headers); // 첫 번째 행은 헤더

      queryData.forEach(row => {
        const rowData = headers.map(header => row[header]);
        data.push(rowData);
      });

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Query Result');

      // 엑셀 파일 다운로드
      XLSX.writeFile(wb, 'query_result.xlsx');
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
</body>
</html>


  `);
};
