/**
 * gnavi-gulp-boiler-jade-babel-postcss
 *
 * ** 開発開始手順
 *
 * $ npm i
 * $ gulp sprite
 * $ gulp iamgemin
 *
 *
 * ** 開発開始 with watchコマンド
 *
 * $ gulp start
 *
 * ** buildコマンド
 *
 * $ gulp
 *
 * ** spriteコマンド
 *
 * $ gulp sprite
 *
 * ** iamgeminコマンド
 *
 * $ gulp iamgemin
 *
 * ** js testコマンド
 *
 * $ gulp test
 *
 * ** dist、tmp削除コマンド
 *
 * $ gulp clean
 *
 * ---------------------------------------------------------------------- */

/*
 * init package
 */
import fs from 'fs'
import gulp from 'gulp'
import runSequence from 'run-sequence'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import browserSync from 'browser-sync'
import rename from 'gulp-rename'
import size from 'gulp-size'
import postcss from 'gulp-postcss'
import data from 'gulp-data'
import clean from 'del'
import spritesmith from 'gulp.spritesmith'
import imagemin from 'gulp-imagemin'
import precss from 'precss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import kss from 'gulp-kss'
import babel from 'gulp-babel'
import concat from 'gulp-concat-util'
// import minify from 'gulp-babel-minify'
import uglify from 'gulp-uglify'
import eslint from 'gulp-eslint'
import jade from 'gulp-jade'
// import moment from 'momentjs'

// const timestump = moment().format('YYYYMMDDhhmmss')
const timestump = '20161012113446'
const version = require('./version.json')


/*
 * task manage
 */
// build:css
gulp.task('build:css', () => {
  runSequence('precss', 'renamecss', 'postcss')
})

// build:js
gulp.task('build:js', () => {
  runSequence('babel', 'concat', 'test')
})

// build:js lib
gulp.task('concat', () => {
  runSequence('concat:lib')
})

// build:html
gulp.task('build:html', () => {
  runSequence('jade')
})

// build:copy
gulp.task('build:copy', () => {
  runSequence('copy')
})

// imagemin
gulp.task('imagemin', () => {
  runSequence('imageMin')
})

// test
gulp.task('test', () => {
  runSequence('eslint')
})

// build
gulp.task('build', () => runSequence(
  'build:css', 'build:js', 'build:html', 'build:copy',
))

// default
gulp.task('default', () => {
  runSequence('build')
})


/*
 * option task
 */
// start
gulp.task('start', () => runSequence(
  'build', 'watch', 'serve',
))

// local
gulp.task('local', () => {
  runSequence('build')
})

// dev
gulp.task('dev', () => {
  runSequence('build')
})


/*
 * directory
 */
const directory = {
  src: 'src/',
  dist: 'dist/',
  tmp: 'tmp/',
  html_src: 'src/jade/',
  css_src: 'src/css/',
  styleguide_src: 'src/styleguide/',
  js_src: 'src/js/',
  img_src: 'src/img/',
  sprite_src: 'src/sprite/',
}


/*
 * stat path
 */
const pathStat = {
  local: './',
  test_x: 'http://hoge/',
}


/*
 * js parts
 */
const jsPart = {
  lib: [
    directory.js_src + 'lib/jquery-3.0.0.min.js',
    directory.js_src + 'lib/lodash.min.js',
  ],
  common: [
    directory.js_src + 'common/utility.js',
    directory.js_src + 'common/sample_a.js',
  ],
}


/*
 * BrowserSync
 */
gulp.task('serve', (callback) => {
  const syncOption = {
    port: 8051,
    ui: {
      port: 8052,
    },
    server: {
      baseDir: directory.dist,
    },
  }
  browserSync(syncOption)
  callback()
})


/*
 * watch
 */
gulp.task('watch', (callback) => {
  console.log('---------- watch ----------')
  gulp.watch(directory.css_src + '**/*.css', ['build:css']).on('change', browserSync.reload)
  gulp.watch(directory.js_src + '**/*.js', ['build:js']).on('change', browserSync.reload)
  gulp.watch(directory.html_src + '**/*.{jade,json}', ['build:html']).on('change', browserSync.reload)
  gulp.watch(directory.img_src + '**/*.{png,jpg}', ['build:copy']).on('change', browserSync.reload)
  gulp.watch('gulpfile.js', ['build']).on('change', browserSync.reload)
  callback()
})


/*
 * clean
 */
gulp.task('clean', (callback) => {
  console.log('---------- clean ----------')
  clean(directory.tmp)
  clean(directory.dist)
  clean(directory.tmp_dev)
  callback()
})


/*
 * sprite
 */
gulp.task('sprite', () => {
  console.log('---------- sprite ----------')
  const spriteData = gulp.src(directory.sprite_src + 'sprite-icon/*.png')
    .pipe(spritesmith({
      imgName: 'sprite-icon.png',
      cssName: 'sprite-icon.css',
      imgPath: '../img/sprite-icon.png',
      cssFormat: 'css',
      padding: 5,
      cssOpts: {
        cssSelector: sprite => '.icon--' + sprite.name,
      },
    }))
  spriteData.img.pipe(gulp.dest(directory.img_src))
  spriteData.css.pipe(gulp.dest(directory.css_src + 'common/module/'))
    .pipe(size({ title: 'size : sprite' }))
  return spriteData
})


/*
 * imageMin
 */
gulp.task('imageMin', () => {
  console.log('---------- imageMin ----------')
  const gulpTask = gulp.src(directory.img_src + '**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
    }))
    .pipe(gulp.dest(directory.img_src))
  return gulpTask
})


/*
 * postcss
 */
// precss(scss like)
gulp.task('precss', () => {
  console.log('---------- css ----------')
  const gulpTask = gulp.src(directory.css_src + '**/*.css')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(postcss([
      precss(),
    ]))
    .pipe(gulp.dest(directory.tmp + 'css/'))
  return gulpTask
})

// rename
gulp.task('renamecss', () => {
  const gulpTask = gulp.src(directory.tmp + 'css/common/import.css')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(rename('common-' + version.css.common + '.css'))
    .pipe(gulp.dest(directory.tmp + 'css/'))
  return gulpTask
})


// postcss
gulp.task('postcss', () => {
  const gulpTask = gulp.src(directory.tmp + 'css/*.css')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 version', 'ie >= 9'],
        cascade: false,
      }),
      cssnano({
        minifyFontValues: {
          removeQuotes: false,
        },
      }),
    ]))
    .pipe(gulp.dest(directory.dist + 'css/'))
    .pipe(size({ title: 'size : css' }))
  return gulpTask
})


/*
 * kss styleguide
 */
gulp.task('styleguide', () => {
  const gulpTask = gulp.src(directory.tmp + 'css/common.css')
    .pipe(kss({
      overview: directory.styleguide_src + 'styleguide.md',
    }))
    .pipe(gulp.dest(directory.dist + 'styleguide/'))
  return gulpTask
})

/*
 * js
 */
// es2015

// babel
gulp.task('babel', () => {
  console.log('---------- js ----------')
  const gulpTask = gulp.src(jsPart.common)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(concat('common-' + version.js.common + '.js'))
    .pipe(gulp.dest(directory.tmp + 'js/'))
    .pipe(concat.header([
      '(function(window, $){',
      "  'use strict'",
      '',
    ].join('\n')))
    .pipe(concat.footer([
      '',
      '})(window, window.jQuery)',
    ].join('\n')))
    .pipe(babel({
      filename: 'common-' + version.js.common + '.js',
      presets: [['es2015', { loose: true }]],
      compact: true,
      minified: true,
      comments: false,
    }))
    .pipe(uglify())
    .pipe(gulp.dest(directory.dist + 'js/'))
    .pipe(size({ title: 'size : js common' }))
  return gulpTask
})

// concat
// lib
gulp.task('concat:lib', () => {
  const gulpTask = gulp.src(jsPart.lib)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(concat('lib-' + version.js.lib + '.js'))
    .pipe(gulp.dest(directory.dist + 'js/'))
    .pipe(size({ title: 'size : js lib' }))
  return gulpTask
})


/*
 * js test
 */
// eslint
gulp.task('eslint', () => {
  const gulpTask = gulp.src(directory.tmp + 'js/common-' + version.js.common + '.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
  return gulpTask
})


/*
 * html
 */
// jade
gulp.task('jade', () => {
  console.log('---------- html ----------')
  const gulpTask = gulp.src(
    [
      directory.html_src + 'html/**/*.jade',
      '!' + directory.html_src + 'html/include/**/*.jade',
    ],
  )
    .pipe(data(() => {
      const gulpData = {
        config: JSON.parse(fs.readFileSync(`./${directory.html_src}data/common/config.json`, 'utf8')),
        nav: JSON.parse(fs.readFileSync(`./${directory.html_src}data/common/nav.json`, 'utf8')),
        sample: JSON.parse(fs.readFileSync(`./${directory.html_src}data/module/sample.json`, 'utf8')),
        version,
        timestump,
        pathStat: pathStat.local,
      }
      return gulpData
    }))
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(jade({
      pretty: true,
    }))
    .pipe(gulp.dest(directory.dist + '/'))
    .pipe(size({ title: 'size : html' }))
  return gulpTask
})


/*
 * copy
 */
gulp.task('copy', () => {
  console.log('---------- copy ----------')
  const gulpTask = gulp.src(
    [
      directory.img_src + '**/*',
    ],
    { base: directory.src },
  )
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(gulp.dest(directory.dist))
  return gulpTask
})
