"use string";

var browserSync  = require('browser-sync');         // Подключаем Browser Sync
var del          = require('del');                  // Удаление файлов и папок
var gulp         = require('gulp');                 // Gulp пакет
var gulpAutopref = require('gulp-autoprefixer');    // Автопрефексер для CSS
var gulpCleanCSS = require('gulp-clean-css');       // Минификация CSS файлов
var rename       = require('gulp-rename');          // Переименования файлов
var gulpScss     = require('gulp-sass');            // Подключаем Sass пакет
var gulpUglify   = require('gulp-uglify');          // Минификация JS файлов




const paths = {
    app:  'app/',
    scss: 'app/scss/',
    css:  'app/css/',
    js:   'app/js/',
};

var clean = function(){
    return del([ paths.css + '*.css' ]);    // Удаляем все указанные файлы CSS
};

var scss = function(){
    return gulp.src( paths.scss + 'main.scss' )          // Берем источник
           .pipe( gulpScss() )                           // Преобразуем Scss в CSS
           .pipe( gulpAutopref(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: false }) ) // Добавляем префексы
           .pipe( gulp.dest(paths.css) )                 // Выгружаем результат
           .pipe( browserSync.reload({stream: true}) )   // Обновляем CSS на странице при изменении
};

var minCSS = function(){
    return gulp.src( paths.css + 'main.css' )               // Берем источник
           .pipe( gulpCleanCSS() )                          // Минифицируем файл
           .pipe( rename({suffix: '.min'}) )                // Добавляем суффикс .min
           .pipe( gulp.dest(paths.css) )                    // Выгружаем результат
           .pipe( browserSync.reload({stream: true}) )      // Обновляем CSS на странице при изменении
};

var minJS = function(){
    return gulp.src( paths.js + 'main.js' )        // Все JS файлы
           .pipe( gulpUglify() )                // Минифицируем файл
           .pipe(rename({suffix: '.min'}))      // Добавляем суффикс .min
           .pipe( gulp.dest( paths.js ) )       // Выгружаем все в текущий каталог
           .pipe( browserSync.reload({stream: false}) )   // Обновляем CSS на странице при изменении
};

var browser = function(){
    browserSync({                   // Выполняем browser Sync
        server: {                   // Определяем параметры сервера
            baseDir: paths.app },   // Директория для сервера - app
        notify: false               // Отключаем уведомления
    });
};

var watch = function(){ // Следим за изменениями файлов
    browser();
    gulp.watch( paths.scss + 'main.scss', scss );
    gulp.watch( paths.css + 'main.css', minCSS );
    gulp.watch( paths.js + 'main.js', minJS );
    gulp.watch( paths.app + '*.html', browserSync.reload );
};

gulp.task('clean', clean);
gulp.task('scss', scss);
gulp.task('minCSS', minCSS);
gulp.task('minJS', minJS);
gulp.task('browser', browser);
gulp.task('watch', watch);