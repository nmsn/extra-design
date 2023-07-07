const del = require("del");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const replace = require("gulp-replace");
const gulp = require("gulp");
const babelrc = require("./babel.config");

const ROOT = "./src";
const ESM_DIR = "./es";
const LIB_DIR = "./lib";
const TS_SOURCE = ["./src/**/*.tsx", "./src/**/*.ts", "!./src/**/*.d.ts"];
const SRC_SOURCE = [...TS_SOURCE, "./src/**/*.d.ts", "./src/**/*.less"];

const clean = (done) => {
  del.sync([ESM_DIR, LIB_DIR], { force: true });
  done();
};

const clean2 = (done) => {
  del.sync([ESM_DIR], { force: true });
  done();
};

// console.log('addEventListener',addEventListener)

const buildEsm = () =>
  gulp
    .src(TS_SOURCE)
    // .pipe(sourcemaps.init())
    // .pipe(ts.createProject("tsconfig.json")())
    .pipe(
      babel(
        babelrc(null, {
          NODE_ENV: "esm",
        })
      )
    )
    // .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(ESM_DIR)); //

const buildLib = () =>
  gulp
    .src(TS_SOURCE)
    // .pipe(ts.createProject("tsconfig.lib.json")())
    .pipe(babel(babelrc()))
    .pipe(gulp.dest(LIB_DIR));

const buildAll = () =>
  gulp
    .src(TS_SOURCE)
    // .pipe(sourcemaps.init())
    // .pipe(ts.createProject("tsconfig.json")())
    .pipe(
      babel(
        babelrc(null, {
          NODE_ENV: "esm",
        })
      )
    )
    // .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(ESM_DIR))
    // .pipe(ts.createProject("tsconfig.lib.json")())
    .pipe(babel(babelrc()))
    .pipe(gulp.dest(LIB_DIR)); //

// 可复用部分
const cssJs = () =>
  gulp
    .src([`${ESM_DIR}/**/style/index.js`])
    .pipe(replace(/\.less/g, ".css")) // 将文件中的 .less 转化为 .css
    .pipe(rename({ basename: "css" })) // 将 less 后缀的文件名改为 css
    .pipe(gulp.dest(ESM_DIR))
    .pipe(gulp.dest(LIB_DIR));

const css = () =>
  gulp
    .src([`${ROOT}/**/*.less`])
    .pipe(less({ javascriptEnabled: true }))
    .pipe(postcss([require("autoprefixer")]))
    .pipe(gulp.dest(ESM_DIR))
    .pipe(gulp.dest(LIB_DIR));

const buildLess = () =>
  gulp
    .src([`${ROOT}/**/*.less`])
    .pipe(gulp.dest(ESM_DIR))
    .pipe(gulp.dest(LIB_DIR));

const tsDeclaration = () =>
  gulp
    .src([`${ROOT}/**/*.d.ts`])
    .pipe(gulp.dest(ESM_DIR))
    .pipe(gulp.dest(LIB_DIR));

const cssJs2 = () =>
  gulp
    .src([`${ESM_DIR}/**/style/index.js`])
    .pipe(replace(/\.less/g, ".css")) // 将文件中的 .less 转化为 .css
    .pipe(rename({ basename: "css" })) // 将 less 后缀的文件名改为 css
    .pipe(gulp.dest(ESM_DIR));

const css2 = () =>
  gulp
    .src([`${ROOT}/**/*.less`])
    .pipe(less({ javascriptEnabled: true }))
    .pipe(postcss([require("autoprefixer")]))
    .pipe(gulp.dest(ESM_DIR));

const buildLess2 = () =>
  gulp.src([`${ROOT}/**/*.less`]).pipe(gulp.dest(ESM_DIR));

const tsDeclaration2 = () =>
  gulp.src([`${ROOT}/**/*.d.ts`]).pipe(gulp.dest(ESM_DIR));

// const taskArr = [
//   gulp.parallel(buildAll),
//   // gulp.parallel(buildEsm, buildLib),
//   gulp.parallel(css, buildLess),
//   gulp.parallel(cssJs),
//   gulp.parallel(tsDeclaration),
// ];

const taskArr = [
  gulp.parallel(buildEsm, buildLib, css, buildLess),
  gulp.parallel(cssJs),
  gulp.parallel(tsDeclaration),
];

const taskArr2 = [
  gulp.parallel(buildEsm, css2, buildLess2),
  gulp.parallel(cssJs2),
  gulp.parallel(tsDeclaration2),
];

exports.dev = gulp.series(clean2, ...taskArr2);

// .pipe(gulp.dest(cjsDir)) 拷贝语句

exports.build = gulp.series(clean, ...taskArr);
