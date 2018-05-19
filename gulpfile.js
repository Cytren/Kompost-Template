
var gulp = require("gulp");
var del = require("del");
var sequence = require("gulp-sequence");
var typescript = require("gulp-typescript");

gulp.task("clean:build", function() {
    return del(["build"]);
});

gulp.task("clean:package", function() {
    return del(["package"]);
});

gulp.task("clean", sequence("clean:build", "clean:package"));

gulp.task("build:typescript", function () {
    var config = typescript.createProject("./tsconfig.json");

    return gulp
        .src("src/**/*.ts")
        .pipe(config())
        .pipe(gulp.dest("build"));
});

gulp.task("watch", function () {
    gulp.watch("src/**/*.ts", ["build:typescript"]);
});

gulp.task("build", sequence("clean:build", "build:typescript"));
