const passport = require('passport');

exports.loginPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Clody 어드민 페이지</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #f3f4f6, #d1d5db);
          font-family: Arial, sans-serif;
        }
        .login-container {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        h2 {
          color: #333;
        }
        label {
          font-weight: bold;
          display: block;
          margin-top: 10px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 5px;
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
      </style>
    </head>
    <body>
  <div class="login-container">
    <h2>Clody 어드민</h2>
    <form id="loginForm">
      <label for="id">ID</label>
      <input type="text" id="id" name="id" required>

      <label for="password">Password</label>
      <input type="password" id="password" name="password" required>

      <button type="submit">로그인</button>
    </form>
  </div> <script>
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
      event.preventDefault();

      const id = document.getElementById('id').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, password }),
        });

        if (response.status === 403) {
          const result = await response.json();
          console.log(result)
          alert(result.message);  // 로그인 실패 시 받은 메시지를 alert로 표시
        } else if (response.redirected) {
          window.location.href = response.url;  // 로그인 성공 시 리디렉션
        }
      } catch (error) {
        alert('로그인 중 오류가 발생했습니다.');
        console.error(error);
      }
    });
  </script>
    </body>
    </html>
  `);
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      // 로그인 실패 시 403 상태 코드와 함께 메시지 전송
      return res.status(403).json({ message: info.message });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/console');
    });
  })(req, res, next);
};
