const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//라우팅(users URL의 요청이 들어오면 해당 라우트 폴더로 연결)
app.use('/api/users', require('./routes/users'));

//노드 js 서버에 있는 이미지를 클라이언트에 표시하려면 이 옵션 사용
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));

//개발 환경이 배포 환경이면
if (process.env.NODE_ENV === "production") {

  //리액트 배포시 npm run build로 빌드하는데 이때, client/build 폴더에 모든 react 소스가 webpack으로 인해 bundle 되어서 들어가짐
  //이 때문에 모든 static 파일은 client/build 폴더에 있기에 이에 접근하기 위한 코드
  app.use(express.static("client/build"));

  // 모든 요청에 대해 클라이언트 폴더에 있는 index.html 파일 실행
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});