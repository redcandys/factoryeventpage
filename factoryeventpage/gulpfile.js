var gulp = require('gulp');
var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps'); // 소스 파일 경로
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var del = require('del');


var PATH = {
    HTML: './workspace'
    , DATA: './workspace/data'
    , ASSETS: {
        FONTS:      './workspace/assets/fonts'
        , IMAGES:   './workspace/assets/images'
        , STYLE:    './workspace/assets/style'
        , SCRIPT:   './workspace/assets/script'
        , LIB:      './workspace/assets/lib'
    }
}, // 산출물 경로
DEST_PATH = {
    HTML: './dist'
    , DATA: './dist/data'
    , ASSETS: {
        FONTS:      './dist/assets/fonts'
        , IMAGES:   './dist/assets/images'
        , STYLE:    './dist/assets/style'
        , SCRIPT:   './dist/assets/script'
        , LIB:      './dist/assets/lib'
    }
};

gulp.task( 'clean', () => {
    return new Promise( resolve => {
        del.sync(DEST_PATH.HTML);

        resolve();
    });
});

gulp.task( 'scss:compile', () => {
    return new Promise( resolve => {
        var options = {
            outputStyle: "nested" // nested, expanded, compact, compressed
            , indentType: "space" // space, tab
            , indentWidth: 4 //
            , precision: 8
            , sourceComments: true // 코멘트 제거 여부
        };
        gulp.src( PATH.ASSETS.STYLE + '/*.scss' )
            .pipe( sourcemaps.init() )
            .pipe( scss(options) )
            .pipe( sourcemaps.write() )
            .pipe( gulp.dest( DEST_PATH.ASSETS.STYLE ) )
            .pipe( browserSync.reload({stream: true}));
        
        resolve();
    });
});

gulp.task( 'css', () => {
    return new Promise( resolve => {
        gulp.src( PATH.ASSETS.STYLE + '/*.css' )
            .pipe( gulp.dest(DEST_PATH.ASSETS.STYLE ) )
            .pipe( browserSync.reload({stream: true}));
        resolve();
    });
});

gulp.task( 'html', () => {
    return new Promise( resolve => {
        gulp.src( PATH.HTML + '/**/*.html' )
            .pipe( gulp.dest( DEST_PATH.HTML ) )
            .pipe( browserSync.reload({stream: true}) );
        
        resolve();
    });
});

gulp.task( 'data', () => {
    return new Promise( resolve => {
        gulp.src( PATH.DATA + '/**/*.*' )
            .pipe( gulp.dest( DEST_PATH.DATA ) )
            .pipe( browserSync.reload({stream: true}) );
        
        resolve();
    });
});

gulp.task( 'script:build', () => {
    return new Promise( resolve => {
        gulp.src( PATH.ASSETS.SCRIPT + '/*.js' )
            .pipe( concat('common.js') )
            .pipe( gulp.dest( DEST_PATH.ASSETS.SCRIPT ))
            .pipe( uglify({
                mangle: true
            }))
            .pipe( rename('common.min.js') )
            .pipe( gulp.dest( DEST_PATH.ASSETS.SCRIPT ))
            .pipe( browserSync.reload({stream: true}));

        resolve();
    });
});

gulp.task( 'fonts', () => {
    return new Promise( resolve => {
        gulp.src( PATH.ASSETS.FONTS + '/**/*.*')
            .pipe( gulp.dest( DEST_PATH.ASSETS.FONTS ));

        resolve();
    });
});

gulp.task( 'library', () => {
    return new Promise( resolve => {
        gulp.src( PATH.ASSETS.LIB + '/**/*.*')
            .pipe( gulp.dest( DEST_PATH.ASSETS.LIB ));
        
        resolve();
    });
});

gulp.task( 'imagemin', () => {
    return new Promise( resolve => {
        gulp.src( PATH.ASSETS.IMAGES + '/**/*.*' )
            .pipe( imagemin([
                imagemin.gifsicle({interlaced: false})
                , imagemin.jpegtran({progressive: true})
                , imagemin.optipng({optimizationLevel: 5})
                , imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ]))
            .pipe( gulp.dest( DEST_PATH.ASSETS.IMAGES ) )
            .pipe( browserSync.reload({stream: true}) );
        resolve();
    });
});


gulp.task( 'nodemon:start', () => {
    return new Promise( resolve => {
        nodemon({
            script: 'app.js'
            , watch: DEST_PATH.HTML
        });

        resolve();
    });
});

gulp.task( 'watch', () => {
    return new Promise( resolve => {
        gulp.watch(PATH.HTML + '/**/*.html', gulp.series(['html']));
        gulp.watch(PATH.DATA + '/**/*.json', gulp.series(['data']));
        gulp.watch(PATH.ASSETS.STYLE + '/**/*.scss', gulp.series(['scss:compile']));
        gulp.watch(PATH.ASSETS.STYLE + '/**/*.css', gulp.series(['css']));
        gulp.watch(PATH.ASSETS.SCRIPT + '/**/*.js', gulp.series(['script:build']));
        gulp.watch(PATH.ASSETS.IMAGES + "/**/*.*", gulp.series(['imagemin']));

        resolve();
    });
});

gulp.task('browserSync', () => {
    return new Promise( resolve => {
        browserSync.init( null, {
            proxy: 'http://localhost:8005'
            , port: 8006
        });
        
        resolve();
    });
});

var allSeries = gulp.series([
    'clean'
    , 'scss:compile'
    , 'css'
    , 'html'
    , 'data'
    , 'script:build'
    , 'imagemin'
    , 'fonts'
    , 'library'
    , 'nodemon:start'
    , 'browserSync'
    , 'watch'
]);


gulp.task( 'default', allSeries);