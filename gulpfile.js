const gulp = require("gulp");
const exec = require('child_process').exec;

function barcode(cb) {
   exec("yarn barcode build", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

function example(cb) {
   exec("yarn example build", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}


exports.example = gulp.series(
  barcode,
  example,
)

exports.default = gulp.series(
  barcode,
  example
)
