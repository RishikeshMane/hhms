var express = require('express');
var users = express.Router();
var conn = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var multer = require("multer");
var token;

var { get_reg_data_quali } = require('../Routes/apis/register/get_reg_data_quali');
var { get_reg_data_speci } = require('../Routes/apis/register/get_reg_data_speci');

users.use(cors());

process.env.SECRET_KEY = "devesh";

users.get('/get_reg_data_quali',get_reg_data_quali);
users.get('/get_reg_data_speci',get_reg_data_speci);

const storage5 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Routes/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload5 = multer({
  storage: storage5,
});

users.post("/register_user", upload5.single("document"), function (req, res) {
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;
  const gender = req.body.gender;
  const age = req.body.age;
  const mob_no = req.body.mob_no;
  const email_id = req.body.email_id;
  const speci = req.body.speci;
  const quali = req.body.quali;
  const designation = req.body.designation;
  const li_no = req.body.li_no;
  const doctor_type = req.body.doctor_type;
  const addr = req.body.addr;
  const patient_charge = req.body.patient_charge;
  const consul_charge = req.body.consul_charge;
  const document = req.file.originalname;
  if (
    (f_name,
    l_name,
    gender,
    age,
    mob_no,
    email_id,
    speci,
    quali,
    designation,
    li_no,
    doctor_type,
    addr,
    patient_charge,
    consul_charge,
    document
    )
  ) {
    try {
      const query =
        "INSERT INTO users_data (f_name,l_name,gender,age,mob_no,email_id,speci,quali,designation,li_no,doctor_type,addr,patient_charge,consul_charge,document) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      conn.query(
        query,
        [
          f_name,
          l_name,
          gender,
          age,
          mob_no,
          email_id,
          speci,
          quali,
          designation,
          li_no,
          doctor_type,
          addr,
          patient_charge,
          consul_charge,
          document
        ],
        function select(err, rows) {
          if (err) {
            res.json({
              msg: err,
            });
          } else {
            res.json({ Message: "Insert successful" });
          }
        }
      );
    } catch (error) {
      res.json({
        msg: "Enter proper deatils",
      });
    }
  } else {
    res.json({
      msg: "Enter all Fields",
    });
  }
});


users.get("/get_reg_data",function(req,res){
	const query = "SELECT * FROM users_data";
	conn.query(query,function select(err, rows){
	if(err){
	res.json({msg:"error"});
}
else {
 res.json({Data:rows});
}
})
})

users.post('/login', function(req, res) {

    var appData = {};
    var email = req.body.email;
    var password = req.body.password;

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows, fields) {
                if (err) {
                    appData.error = 1;
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                } else {
                    if (rows.length > 0) {
                        if (rows[0].password == password) {
                            let token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });
                            appData.error = 0;
                            appData["token"] = token;
                            res.status(200).json(appData);
                        } else {
                            appData.error = 1;
                            appData["data"] = "Email and Password does not match";
                            res.status(204).json(appData);
                        }
                    } else {
                        appData.error = 1;
                        appData["data"] = "Email does not exists!";
                        res.status(204).json(appData);
                    }
                }
            });
            connection.release();
        }
    });
});

users.post('/login', function(req, res) {

    var appData = {};
    var email = req.body.email;
    var password = req.body.password;

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows, fields) {
                if (err) {
                    appData.error = 1;
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                } else {
                    if (rows.length > 0) {
                        if (rows[0].password == password) {
                            token = jwt.sign(rows[0], process.env.SECRET_KEY, {
                                expiresIn: 5000
                            });
                            appData.error = 0;
                            appData["token"] = token;
                            res.status(200).json(appData);
                        } else {
                            appData.error = 1;
                            appData["data"] = "Email and Password does not match";
                            res.status(204).json(appData);
                        }
                    } else {
                        appData.error = 1;
                        appData["data"] = "Email does not exists!";
                        res.status(204).json(appData);
                    }
                }
            });
            connection.release();
        }
    });
});

users.use(function(req, res, next) {
    var token = req.body.token || req.headers['token'];
    var appData = {};
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Token is invalid";
                res.status(500).json(appData);
            } else {
                next();
            }
        });
    } else {
        appData["error"] = 1;
        appData["data"] = "Please send a token";
        res.status(403).json(appData);
    }
});

users.get('/getUsers', function(req, res) {

    var appData = {};

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('SELECT *FROM users', function(err, rows, fields) {
                if (!err) {
                    appData["error"] = 0;
                    appData["data"] = rows;
                    res.status(200).json(appData);
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData);
                }
            });
            connection.release();
        }
    });
});

module.exports = users;
