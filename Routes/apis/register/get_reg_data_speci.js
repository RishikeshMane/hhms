var express = require("express");
var conn = require("../../../Database/database");
var cors = require("cors");

exports.get_reg_data_speci = (req, res) => {

try {
    const query = "SELECT * FROM specialization";
    conn.query(query, function select(err, rows) {
      if (err) {
        res.json({
          msg: "error",
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
