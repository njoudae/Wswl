const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();
const del = require("del");
const path = require("path");

const paths = {
  html: {
    pages: "src/pages/**/*.html",
    partials: "src/partials/**/*.html",
    temp: "temp.html", // same level as gulpfile
  },
  styles: {
    src: ["src/scss/main.scss", "styles.css"],
    watch: ["src/scss/**/*.scss", "styles.css"],
  },
  scripts: {
    src: [
      "src/js/**/*.js", // scripts under src/js
      "*.js", // root-level scripts next to gulpfile
      "!gulpfile.js",
      "!gulpconfig.js",
      "!gulp.config.js",
    ],
  },
  assets: {
    src: "src/images/**/*",
  },
  dist: "dist",
};

function clean() {
  return del.deleteAsync([paths.dist]);
}

function html() {
  return src([paths.html.pages, paths.html.temp])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}

function styles() {
  return src(paths.styles.src)
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(dest(path.join(paths.dist, "assets/css")))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(dest(path.join(paths.dist, "assets/js")))
    .pipe(browserSync.stream());
}

function assets() {
  return src(paths.assets.src, { encoding: false }).pipe(
    dest(path.join(paths.dist, "assets/images"))
  );
}

function reload(done) {
  browserSync.reload();
  done();
}

function serve() {
  browserSync.init({
    server: {
      baseDir: paths.dist,
    },
    port: 3000,
  });

  watch([paths.html.pages, paths.html.partials, paths.html.temp], html);
  watch(paths.styles.watch, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.assets.src, series(assets, reload));
}

const build = series(clean, parallel(html, styles, scripts, assets));
const dev = series(build, serve);

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.assets = assets;
exports.build = build;
exports.dev = dev;
exports.default = dev;
