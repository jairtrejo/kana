var gulp           = require("gulp"),
    minifyHTML     = require("gulp-minify-html"),
    concat         = require("gulp-concat"),
    transform      = require('vinyl-transform'),
    browserify     = require("browserify"),
    uglify         = require("gulp-uglify"),
    cssmin         = require("gulp-cssmin"),
    sourcemaps     = require("gulp-sourcemaps"),
    mainBowerFiles = require("main-bower-files"),
    inject         = require("gulp-inject"),
    less           = require("gulp-less"),
    filter         = require("gulp-filter"),
    rename         = require("gulp-rename"),
    browserSync    = require("browser-sync"),
    karma          = require("karma");

var config = {
    paths: {
        html: {
            src:  ["src/**/*.html"],
            dest: "build"
        },
        javascript: {
            src:  ["src/js/**/*.js"],
            dest: "build/js",
            bundles: ["src/js/*.js"]
        },
        css: {
            src: ["src/css/**/*.css"],
            dest: "build/css"
        },
        less: {
            src: ["src/less/**/*.less", "!src/less/includes/**"],
            dest: "build/css"
        },
        bower: {
            src: "bower_components",
            dest: "build/lib"
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
            {name: "bower", addPrefix: "lib"}
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
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.javascript.dest));
});

gulp.task("css", function(){
    return gulp.src(config.paths.css.src)
        .pipe(sourcemaps.init())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.css.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task("bower", function(){
    return gulp.src(mainBowerFiles(), {base: "bower_components"})
        .pipe(gulp.dest(config.paths.bower.dest));
});

gulp.task("less", function(){
    return gulp.src(config.paths.less.src)
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [
                "bower_components/bootstrap/less",
                "bower_components/less-prefixer"
            ]
        }))
        .pipe(concat("main.min.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.css.dest))
        .pipe(filter("**/*.css"))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task("browser-sync", function(){
    browserSync({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task("build", ["bower", "html", "browserify", "css", "less"]);

gulp.task("test", function(){
    karma.server.start({
        configFile: __dirname + '/karma.conf.js'
    });
});

gulp.task("default", ["build", "browser-sync"], function(){
    gulp.watch(config.paths.html.src, ["html", browserSync.reload]);
    gulp.watch(config.paths.javascript.src, ["browserify", browserSync.reload]);
    gulp.watch(config.paths.bower.src, ["bower", browserSync.reload]);

    gulp.watch(config.paths.css.src, ["css"]);
    gulp.watch(config.paths.less.src, ["less"]);
});
