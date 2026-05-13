import  express  from "express";

const app = express();
const port = 8000;

app.use(express.json());

app.use('/', (req, res) => {
  res.send("Hello Welcome To The Classroom API!")
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})