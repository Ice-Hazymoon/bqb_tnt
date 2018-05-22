const gulp = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const parcel = require('gulp-parcel');

gulp.task('server', ()=>{
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        port: 2333,
        open: false
    })
    gulp.watch(['./src/js/**/*.js', './src/**/*.html', './src/images/*.{png,jpg,jpeg,gif,svg}']).on('change', (e)=>{
        setTimeout(() => {
            reload()
        }, 100);
    });
    gulp.watch(['./dist/*.css']).on('change', (e)=>{
        reload(e.path)
    });
})

gulp.task('start', ()=>{
    gulp.src('./src/**/*.html', {read:false})
    .pipe(parcel({
        outDir: './dist', 
        publicURL: './',
        minify: false,
        watch: true,
        sourceMaps: true,
        cache: true,
        cacheDir: '.parcelCache',
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('build', ()=>{
    gulp.src('./src/**/*.html', {read:false})
    .pipe(parcel({
        outDir: './dist', 
        publicURL: './',
        minify: true,
        watch: false,
        sourceMaps: false,
        cache: false,
        cacheDir: '.parcelCache',
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('default', ['start', 'server']);