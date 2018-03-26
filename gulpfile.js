const gulp = require("gulp");
const babel = require("gulp-babel");
const watch = require("gulp-watch");
const rollup = require("gulp-rollup");
const replace = require("rollup-plugin-replace");

// babel + rolup 流清理
gulp.task("buildprod", () => {
  gulp
    .src(["./src/server/**/*.js", "!./src/server/start.js"])
    .pipe(
      babel({
        babelrc: false,
        ignore: ["./src/server/start.js","./src/server/config/main.js"],
        plugins: [
          "transform-decorators-legacy",
          "transform-es2015-modules-commonjs"
        ]
      })
    )
    .pipe(gulp.dest("./dist/"));
});

gulp.task("buildconfig", () => {
  gulp
    .src("./src/server/**/*.js")
    .pipe(
      rollup({
        input: ["./src/server/config/main.js"],
        format: "cjs",
        plugins: [
          replace({
            "process.env.NODE_ENV": JSON.stringify("production")
          })
        ]
      })
    )
    .pipe(gulp.dest("./dist/"));
});
let _task = ["builddev"];

if (process.env.NODE_ENV === "production") {
  _task = ["buildconfig", "buildprod"];
}

gulp.task("default", _task);
