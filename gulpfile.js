"use string";
var browserSync    = require('browser-sync');         // Подключаем Browser Sy
var gulp           = require('gulp');                 // Gulp пакет
var gulpAutopref   = require('gulp-autoprefixer');    // Автопрефексер для CSS
var gulpCache      = require('gulp-cache');           // Работа с кэшем
var gulpCleanCSS   = require('gulp-clean-css');       // Минификация CSS файлов
var rename         = require('gulp-rename');          // Переименования файлов
var gulpScss       = require('gulp-sass');            // Подключаем Sass пакет
var gulpUglify     = require('gulp-uglify');          // Минификация JS файлов




const paths = {
    app:  'app/',
    scss: 'app/scss/',
    css:  'app/css/',
    js:   'app/js/',
};

var clean = function(){
    return gulpCache.clearAll();    // Очищаем кэш
};

var scss = function(){
    return gulp.src( paths.scss + '**/*.scss' )          // Берем источник
           .pipe( gulpScss() )                           // Преобразуем Scss в CSS
           .pipe( gulpAutopref(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: false }) ) // Добавляем префексы
           .pipe( gulp.dest(paths.css) )                 // Выгружаем результат
};

var minCSS = function(){
    return gulp.src( paths.css + 'main.css' )               // Берем источник
           .pipe( gulpCleanCSS() )                          // Минифицируем файл
           .pipe( rename({suffix: '.min'}) )                // Добавляем суффикс .min
           .pipe( gulp.dest(paths.css) )                    // Выгружаем результат
           .pipe( browserSync.reload({stream: true}) )      // Обновляем CSS на странице при изменении
};

var minJS = function(){
    return gulp.src( paths.js + 'main.js' )     // Все JS файлы
           .pipe( gulpUglify() )                // Минифицируем файл
           .pipe(rename({suffix: '.min'}))      // Добавляем суффикс .min
           .pipe( gulp.dest( paths.js ) )       // Выгружаем все в текущий каталог
};

var browser = function(){
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: paths.app // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
};


var watch = function(){ // Следим за изменениями файлов
    clean();
    browser();
    gulp.watch( paths.scss + '**/*.scss', scss );
    gulp.watch( paths.css + 'main.css', minCSS );
    gulp.watch( paths.js + 'main.js', minJS ).on('change', browserSync.reload);
    gulp.watch( paths.app + '*.html').on('change', browserSync.reload);
};

gulp.task('clean', clean);
gulp.task('scss', scss);
gulp.task('minCSS', minCSS);
gulp.task('minJS', minJS);
gulp.task('browser', browser);
gulp.task('watch', watch);