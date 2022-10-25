const del = require('del');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const replace = require('gulp-replace');
const gulp = require('gulp');
const babelrc = require('./babel.config');

const ROOT = './src';
const LIB_DIR = './lib';
const ESM_DIR = './es';
const DIST_DIR = './dist';
const LIB_ASSETS_DIR = './lib/assets';
const ESM_ASSETS_DIR = './es/assets';
const TS_SOURCE = ['./src/**/*.tsx', './src/**/*.ts', '!./src/**/*.d.ts'];
const SRC_SOURCE = [...TS_SOURCE, './src/**/*.d.ts', './src/**/*.less'];

const clean = done => {
  del.sync([LIB_DIR, ESM_DIR, DIST_DIR], { force: true });
  done();
};

const cleanCssSourceForDIST = done => {
  del.sync([`${LIB_DIR}/style/all`, `${ESM_DIR}/style/all`], { force: true });
  done();
};

const build = dir => ({
  main:
    dir === LIB_DIR
      ? () =>
          gulp
            .src(TS_SOURCE)
            .pipe(ts.createProject('tsconfig.lib.json')())
            .pipe(babel(babelrc()))
            .pipe(gulp.dest(dir))
      : () =>
          gulp
            .src(TS_SOURCE)
            .pipe(ts.createProject('tsconfig.json')())
            .pipe(
              babel(
                babelrc(null, {
                  NODE_ENV: 'esm',
                }),
              ),
            )
            .pipe(gulp.dest(dir)),
  buildTsDeclaration: () => gulp.src([`${ROOT}/**/*.d.ts`]).pipe(gulp.dest(dir)),
  buildLess: () => gulp.src([`${ROOT}/**/*.less`]).pipe(gulp.dest(dir)),
  buildCss: () =>
    gulp
      .src([`${ROOT}/**/*.less`])
      .pipe(sourcemaps.init())
      .pipe(less({ javascriptEnabled: true }))
      .pipe(postcss([require('autoprefixer')]))
      .pipe(gulp.dest(dir)),
  buildCssJs: () =>
    gulp
      .src([`${dir}/**/style/index.js`])
      .pipe(replace(/\.less/g, '.css'))
      .pipe(rename({ basename: 'css' }))
      .pipe(gulp.dest(dir)),
  buildAssets: () =>
    gulp
      .src([`${ROOT}/assets/*`])
      .pipe(gulp.dest(dir === LIB_DIR ? LIB_ASSETS_DIR : ESM_ASSETS_DIR)),
});

const libBuild = build(LIB_DIR);

const esmBuild = build(ESM_DIR);

const distBuild = () => gulp.src(`${ESM_DIR}/style/all/index.css`).pipe(gulp.dest(DIST_DIR));

function watch() {
  const watcher = gulp.watch(SRC_SOURCE);
  // eslint-disable-next-line no-console
  console.log('Enable listening for file modifications...');

  watcher.on('change', filePath => {
    // eslint-disable-next-line no-console
    console.log(`File ${filePath} was changed, running tasks...`);
    esmBuild.main();
    esmBuild.buildCss();
    esmBuild.buildCssJs();
    esmBuild.buildTsDeclaration();
    esmBuild.buildLess();
    esmBuild.buildAssets();
  });
}

exports.dev = gulp.series(
  clean,
  gulp.parallel(libBuild.main, esmBuild.main),
  gulp.parallel(libBuild.buildCssJs, esmBuild.buildCssJs),
  gulp.parallel(libBuild.buildCss, esmBuild.buildCss, libBuild.buildLess, esmBuild.buildLess),
  gulp.parallel(
    libBuild.buildTsDeclaration,
    esmBuild.buildTsDeclaration,
    libBuild.buildAssets,
    esmBuild.buildAssets,
  ),
  distBuild,
  cleanCssSourceForDIST,
  watch,
);

exports.build = gulp.series(
  clean,
  gulp.parallel(libBuild.main, esmBuild.main),
  gulp.parallel(libBuild.buildCssJs, esmBuild.buildCssJs),
  gulp.parallel(libBuild.buildCss, esmBuild.buildCss, libBuild.buildLess, esmBuild.buildLess),
  gulp.parallel(
    libBuild.buildTsDeclaration,
    esmBuild.buildTsDeclaration,
    libBuild.buildAssets,
    esmBuild.buildAssets,
  ),
  distBuild,
  cleanCssSourceForDIST,
);
