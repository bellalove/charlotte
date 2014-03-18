var targetd = './',
    htmld = targetd,
    stylesd = targetd + 'styles/',
    scriptsd = targetd + 'scripts/',
    imagesd = targetd + 'images/',
    gulp = require("gulp"),
    p = require("gulp-load-plugins")();

var paths = {
  stylus: [
  ],
  clean: [
    targetd + '*.html', 
    targetd + '*.ico',
    targetd + 'images',
    targetd + 'scripts',
    targetd + 'styles'
  ]
};

gulp.task('scripts', function(){
  gulp.src('src/scripts/**/*.js')
    .pipe(p.jshint())
    .pipe(gulp.dest(scriptsd))
    .pipe(p.uglify())
    .pipe(p.rename({extname: ".min.js"}))
    .pipe(gulp.dest(scriptsd));
  gulp.src(scriptsd + 'before/*.min.js')
    .pipe(p.concat('before.min.js'))
    .pipe(gulp.dest(scriptsd));
  gulp.src(scriptsd + 'after/*.min.js')
    .pipe(p.concat('after.min.js'))
    .pipe(gulp.dest(scriptsd));
});

gulp.task('styles', function(){
  gulp.src('src/styles/**/*.styl')
    .pipe(p.stylus({paths: paths.stylus, use: ['nib']}))
    .pipe(p.autoprefixer('last 2 versions'))
    .pipe(gulp.dest(stylesd))
    .pipe(p.minifyCss({keepSpecialComments: 0}))
    .pipe(p.rename({extname: ".min.css"}))
    .pipe(gulp.dest(stylesd));
  gulp.src('src/styles/**/*.!(styl)')
    .pipe(gulp.dest(stylesd));
});

gulp.task('favicon',function(){
  gulp.src('src/images/favicon.ico')
    .pipe(gulp.dest(targetd));
});

gulp.task('images',['favicon'],function(){
  gulp.src('src/images/**/*.{jpg,jpeg,png,gif}')
    .pipe(p.imagemin())
    .pipe(gulp.dest(imagesd));
  gulp.src('src/images/**/*.{svg}')
    .pipe(p.svgmin())
    .pipe(gulp.dest(imagesd));
});

gulp.task('clean',function(){
  gulp.src(paths.clean, {read: false})
    .pipe(p.clean());
});

gulp.task('html', function(){
  gulp.src('src/html/*.html')           
    .pipe(p.minifyHtml())
    .pipe(gulp.dest(htmld));
  gulp.src('src/html/*.jade')           
    .pipe(p.jade())
    .pipe(p.minifyHtml())
    .pipe(gulp.dest(htmld));
});

gulp.task('default',['scripts','styles','images','html'],function(){
  gulp.watch('src/styles/**/*.styl', ['styles','html']);
  gulp.watch('src/scripts/**/*.js', ['scripts','html']); 
  gulp.watch('src/images/**', ['images']);
  gulp.watch('src/html/**/*.{html,jade}', ['html']);
});

gulp.task('once',['scripts','styles','images','html']);
