var express = require('express');
var reg_data = express.Router();
var conn = require("../../../Database/database");
var cors = require("cors");

exports.get_reg_data_quali = (req, res) => {
  try {
    const query = "SELECT * FROM qualifications";
    conn.query(query, function select(err, rows) {
      if (err) {
        res.json({
          msg: err,
        });
      } else {
        res.json({
          Data: rows,
        });
      }
    });
  } catch (error) {
    res.json({ Message: "No data here!" });
  }
}



