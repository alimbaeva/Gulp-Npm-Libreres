const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify-es").default;
const csso = require("gulp-csso");
const del = require("del");
// const newer = require("gulp-newer");
// const imagemin = import("gulp-imagemin").default;

const src = "./src/",
    dist = "./dist/";

const config = {
    src: {
        html: src + '**/*.html',
        style: src + 'scss/**/*.scss',
        js: src + 'js/**/*.js',
        fonts: src + "fonts/**/*.*",
        cssLibs: src + "libs/css/*.css",
        jsLibs: src + "libs/js/*.js",
        img: src + "images/**/*.*",
    },
    dist: {
        html: dist,
        style: dist + "css/",
        js: dist + "js/",
        fonts: dist + "fonts/",
        img: dist + "images/",
    },
    watch: {
        html: src + '**/*.html',
        style: src + 'scss/**/*.scss',
        js: src + 'js/**/*.js',
        fonts: src + "fonts/**/*.*",
        cssLibs: src + "libs/css/*.css",
        jsLibs: src + "libs/js/*.js",
        img: src + "images/**/*.*",
    }
};

const webServer = () => {
    browserSync.init({
        server: dist,
    });
    browserSync.watch(`${dist}**/*.*`).on('change', browserSync.reload);
};

const htmlTask = () => {
    return gulp.src(config.src.html)
        .pipe(gulp.dest(config.dist.html));
};

const styleTask = () => {
    return gulp.src(config.src.style)
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat("main.min.css"))
        .pipe(autoprefixer({
            "overrideBrowserslist": ['last 10 version'],
            grid: true,
        }))
        .pipe(gulp.dest(config.dist.style));
};

const jsTask = () => {
    return gulp.src(config.src.js)
        .pipe(babel({ presets: ["@babel/preset-env"] }))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist.js));
}

const fontsTask = () => {
    return gulp.src(config.src.fonts)
        .pipe(gulp.dest(config.dist.fonts));
}

const cssLibsTask = () => {
    return gulp
        .src(config.src.cssLibs)
        .pipe(csso())
        .pipe(gulp.dest(config.dist.style));
};



const jsLibsTask = () => {
    return gulp
        .src(config.src.jsLibs)
        .pipe(uglify())
        .pipe(gulp.dest(config.dist.js));
};


const imgTask = () => {
    return gulp
        .src(config.src.img)
        // .pipe(newer(config.src.img))
        // .pipe(imagemin([
        //     imagemin.gifsicle({ interlaced: true }),
        //     imagemin.mozjpeg({ quality: 75, progressive: true }),
        //     imagemin.optipng({ optimizationLevel: 5 }),
        //     imagemin.svgo({
        //         plugins: [
        //             { removeViewBox: true },
        //             { cleanupIDs: false }
        //         ]
        //     })
        // ]))
        .pipe(gulp.dest(config.dist.img));
};


const cleanDist = () => {
    return del("dist");
};


const watchFiles = () => {
    gulp.watch([config.watch.html], gulp.series(htmlTask));
    gulp.watch([config.watch.style], gulp.series(styleTask));
    gulp.watch([config.watch.js], gulp.series(jsTask));
    gulp.watch([config.watch.img], gulp.series(imgTask));
    gulp.watch([config.watch.fonts], gulp.series(fontsTask));
    gulp.watch([config.watch.cssLibs], gulp.series(cssLibsTask));
    gulp.watch([config.watch.jsLibs], gulp.series(jsLibsTask));
};

const start = gulp.series(
    htmlTask,
    styleTask,
    jsTask,
    imgTask,
    fontsTask,
    cssLibsTask,
    jsLibsTask
);


exports.default = gulp.series(start, gulp.parallel(watchFiles, webServer));

exports.build = gulp.series(
    cleanDist,
    htmlTask,
    styleTask,
    cssLibsTask,
    jsTask,
    jsLibsTask,
    imgTask,
    fontsTask
);