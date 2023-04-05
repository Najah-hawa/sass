const {src, dest, parallel, series, watch}= require ('gulp');

//importera paket för concat css och js 
const concat = require('gulp-concat');

//minifera js kod
const terser = require('gulp-terser');

//minifera css kod
const cssnano = require('gulp-cssnano');

// minifera image 
const imagemin = require('gulp-imagemin');

//live server
const browserSync = require('browser-sync').create();

//konvetera sass 
const sass = require('gulp-sass')(require('sass'));

// sourscemaps 
const sourcemaps = require('gulp-sourcemaps');



// sökvägar till html/css och js filer 
const files ={
htmlPath : "src/**/*.html",
cssPath :"src/css/*.css",
jsPath :"src/js/*.js",
imagePath :"src/images/*",
sassPath :"src/sass/*.scss",
}

//html task, kopiera filer 
function copyHTML(){
    //kopiera filer till pup
    return src(files.htmlPath)
    .pipe(dest('pup'));
}

//css task läsa in fil-modifiera den och skciak den till pup katalogen
function cssTask(){
    return src(files.cssPath)
    .pipe(concat('main.css'))
    .pipe(cssnano())
    .pipe(dest('pup/css'))
    .pipe(browserSync.stream());
}

//js task kopiera js fil, samla dem i en fil och minifera koden
function jsTask(){
    return src(files.jsPath)
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(dest('pup/js'));
}
//kopiera bilder 
function imagesTask(){
    //kopiera filer till pup
    return src(files.imagePath)
    .pipe (imagemin())
    .pipe(dest('pup/images'));
}

//Task sass
function sassTask() {
    return src(files.sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(dest('pup/css'))
        .pipe(browserSync.stream());
}

//watch-task 
function watchTask(){
   browserSync.init({
      server: "./pup"
   });

watch ([files.htmlPath, files.cssPath, files.jsPath, files.imagePath, files.sassPath], parallel(copyHTML,cssTask,jsTask,imagesTask,sassTask)).on('change', browserSync.reload);
}


exports.default = series(  
parallel(copyHTML,cssTask,jsTask,imagesTask,sassTask ), 
watchTask
)




