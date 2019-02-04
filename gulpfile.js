var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    del = require("del"),
    rename = require("gulp-rename"),
    sassGlob = require("gulp-sass-glob"),
    browserSync = require("browser-sync").create();


sass.compiler = require('node-sass');

var paths = {
    styles: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "scss/main.scss",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "css/"
    }

    // Easily add additional paths
    // ,html: {
    //  src: '...',
    //  dest: '...'
    // }
};



function clean() {
    return del('./css/');
}

function style() {
    return (
        gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream())
    );
}


// ...

// A simple task to reload the page
function reload() {
    browserSync.reload();
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
        //proxy: 'localhost/vdashboard/',
    });
    gulp.watch('scss/**/*.scss', style);
    // We should tell gulp which files to watch to trigger the reload
    // This can be html or whatever you're using to develop your website
    // Note -- you can obviously add the path to the Paths object
    gulp.watch("./*.html", reload);
}

const build = gulp.series(clean, style, watch);



exports.default = build;

// We don't have to expose the reload function
// It's currently only useful in other functions