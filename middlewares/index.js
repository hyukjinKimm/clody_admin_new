exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>로그인 필요</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: linear-gradient(135deg, #f3f4f6, #d1d5db);
              font-family: Arial, sans-serif;
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              text-align: center;
            }
            button {
              background: #4CAF50;
              color: white;
              border: none;
              padding: 10px 20px;
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
          <div class="container">
            <h2>로그인이 필요합니다</h2>
            <button onclick="location.href='/'">홈으로 이동</button>
          </div>
        </body>
        </html>
      `);
    }
};

  
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('YouAreLoggedIn.');
    res.redirect(`/?error=${message}`);
  }
};