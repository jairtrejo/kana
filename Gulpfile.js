var gulp           = require("gulp"),
    minifyHTML     = require("gulp-minify-html"),
    concat         = require("gulp-concat"),
    transform      = require("vinyl-transform"),
    browserify     = require("browserify"),
    uglify         = require("gulp-uglify"),
    cssmin         = require("gulp-cssmin"),
    uncss          = require("gulp-uncss"),
    imagemin       = require("gulp-imagemin"),
    sourcemaps     = require("gulp-sourcemaps"),
    mainBowerFiles = require("main-bower-files"),
    inject         = require("gulp-inject"),
    less           = require("gulp-less"),
    filter         = require("gulp-filter"),
    rename         = require("gulp-rename"),
    browserSync    = require("browser-sync"),
    karma          = require("karma");
    path           = require("path"),
    swPrecache     = require("sw-precache");

var config = {
    paths: {
        html: {
            src:  ["src/**/*.html", "!src/templates/**/*.html"],
            dest: "build"
        },
        javascript: {
            src:  ["src/js/**/*.js"],
            dest: "build/js",
            bundles: ["src/js/app.js"]
        },
        css: {
            src: ["src/css/**/*.css"],
            dest: "build/css"
        },
        images: {
            src: ["src/images/**/*.jpg", "src/images/**/*.jpeg", "src/images/**/*.png"],
            dest: "build/images"
        },
        less: {
            src: ["src/less/**/*.less", "!src/less/includes/**"],
            dest: "build/css"
        },
        bower: {
            src: "bower_components",
            dest: "build/lib"
        },
        verbatim: {
            src: ["src/manifest.json", "src/favicon.png"],
            dest: "build"
        }
    }
};

gulp.task("html", function(){
    return gulp.src(config.paths.html.src)
        .pipe(inject(
            gulp.src(
                mainBowerFiles(),
                {read: false, cwd: "bower_components"}
            ),
            {name: "bower", addPrefix: "lib", addRootSlash: false}
        ))
        .pipe(minifyHTML())
        .pipe(gulp.dest(config.paths.html.dest));
});

gulp.task("browserify", function(){
    var browserified = transform(function(filename){
        var b = browserify(filename, {
            debug: true,
            transform: ['brfs']
        });
        return b.bundle();
    });

    return gulp.src(config.paths.javascript.bundles)
        .pipe(browserified)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.paths.javascript.dest));
});

gulp.task("css", function(){
    return gulp.src(config.paths.css.src)
        .pipe(sourcemaps.init())
        .pipe(cssmin())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.paths.css.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task("images", function(){
    return gulp.src(config.paths.images.src)
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(config.paths.images.dest));
});

gulp.task("bower", function(){
    return gulp.src(mainBowerFiles(), {base: "bower_components"})
        .pipe(gulp.dest(config.paths.bower.dest));
});

gulp.task("less", function(){
    var responsiveFilter = filter("!responsive.css");

    return gulp.src(config.paths.less.src)
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [
                "bower_components/bootstrap/less",
                "bower_components/less-prefixer"
            ]
        }))
        .pipe(responsiveFilter)
        .pipe(uncss({
            html: [
                'src/index.html',
                'src/templates/app.html',
                'src/templates/kana-row.html',
                'src/templates/question.html',
                'src/templates/settings.html',
            ],
            ignore: [
                ".answer[disabled]", ".invisible",
                /.is-visible.*/, /.wrong.*/, /.correct.*/, /.hidden.*/,
                /.settings.*/
            ],
        }))
        .pipe(responsiveFilter.restore())
        .pipe(concat("main.min.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.paths.css.dest))
        .pipe(filter("**/*.css"))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task("verbatim", function(){
    gulp.src(config.paths.verbatim.src)
        .pipe(gulp.dest(config.paths.verbatim.dest));
});

gulp.task("generate-service-worker",
          ["bower", "html", "browserify", "css", "images", "less"], function(callback) {
  var rootDir = "build";

  swPrecache.write(path.join(rootDir, "service-worker.js"), {
    cacheId: 'com.getkana',
    staticFileGlobs: [
        rootDir + "/**/*.{js,html,css,png,jpg,gif,otf,eot,svg,ttf,woff}",
    ],
    ignoreUrlParametersMatching: [/v/],
    stripPrefix: rootDir
  }, callback);
});

gulp.task("build", ["generate-service-worker", "verbatim"]);

gulp.task("test", function(){
    karma.server.start({
        configFile: __dirname + '/karma.conf.js'
    });
});

gulp.task("default", ["build"], function(){
    browserSync({
        server: "./build",
        https: true
    });

    gulp.watch(config.paths.html.src, ["html", "generate-service-worker", browserSync.reload]);
    gulp.watch(config.paths.javascript.src, ["browserify", "generate-service-worker", browserSync.reload]);
    gulp.watch(config.paths.bower.src, ["bower", "generate-service-worker", browserSync.reload]);
    gulp.watch(config.paths.images.src, ["images", "generate-service-worker", browserSync.reload]);

    gulp.watch(config.paths.css.src, ["css", "generate-service-worker"]);
    gulp.watch(config.paths.less.src, ["less", "generate-service-worker"]);
});
