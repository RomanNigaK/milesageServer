const express = require('express')
const createError = require('http-errors');
const app = express()
const port = 3000
const cors = require('cors')
const pool = require("./config").pool;
const NOT_FOUND = "Данных удовлетворяющих условиям поиска нет";

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Сервер работает!');
})

app.get("/quantity", (req, res, next) => {
  pool.query('SELECT COUNT( * ) FROM milesage ', (error, result) => {
    if (error) throw error;
    if (result.length === 0) return next(createError(412, {
      isSuccess: false,
      kod: 412,
      message: NOT_FOUND
    }))
    res.send({ count: result[0]['COUNT( * )'], isSuccess: true });
  });

});


app.get("/milesage", (req, res, next) => {
  pool.query(`SELECT * FROM milesage limit ${req.query.start},${req.query.limit}`, (error, result) => {
    if (error) throw error;
    if (result.length === 0) return next(createError(412, {
      isSuccess: false,
      kod: 412,
      message: NOT_FOUND
    }))
    res.send({ data: result, isSuccess: true });
  });

});

app.post("/milesage", (req, res, next) => {
  const rules = {
    "Больше": ` where  ${req.body.selectField} > '${req.body.strSearch}' `,
    "Меньше": ` where  ${req.body.selectField} < '${req.body.strSearch}' `,
    "Равно": ` where  ${req.body.selectField} = '${req.body.strSearch}' `,
    "Входит": ` where ${req.body.selectField} like '%${req.body.strSearch}%' `,

  }

  let sql = `SELECT * FROM milesage ${rules[req.body.selectTypeFilter]}`;
  if (req.query.start != 'undefined') {
    sql = `SELECT * FROM milesage ${rules[req.body.selectTypeFilter]} limit ${req.query.start},${req.query.limit}`;
  } else {
    sql = `SELECT id FROM milesage ${rules[req.body.selectTypeFilter]}`
  }
  pool.query(sql, (error, result) => {
    if (error) throw error;
    if (result.length === 0) return next(createError(412, { 
      isSuccess: false,
      kod: 412, 
      message: NOT_FOUND }))
    res.send({ data: result, isSuccess: true });
  });

});

var hederServer = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', ' GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', ' true');
  res.header('Access-Control-Allow-Headers', ' Authorization, Origin, X-Requested-With, Accept, X-PINGOTHER, Content-Type');
  next();
}
app.use(hederServer);

app.use(function (err, req, res, next) {
  res.send(err);
});


app.listen(port, () => {
  console.log(`Сервер работает, порт:  ${port}`)
})
