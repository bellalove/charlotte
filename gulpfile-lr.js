var targetd = './',
    htmld = targetd,
    stylesd = targetd + 'styles/',
    scriptsd = targetd + 'scripts/',
    imagesd = targetd + 'images/',
    http = require("http"),
    gulp = require("gulp"),
    glob = require("glob"),
    tinylr = require("tiny-lr")(),
    ecstatic = require('ecstatic'),
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

gulp.task('clean',function(){
  return gulp.src(paths.clean, {read: false})
    .pipe(p.clean());
});

//------------------------------- scripts ---------------------------------

gulp.task('scripts-pkgs', function(){
  var pkgDirs = glob.sync('src/scripts/pkgs/*/');
  pkgDirs.forEach(function(d){
    var pkgName = d.match('/.+\/(.+)\/$')[1];
    gulp.src(d + '*.js')
      .pipe(p.jshint())
      .pipe(p.uglify())
      .pipe(p.concat(pkgName + '.pkg.min.js'))
      .pipe(gulp.dest(scriptsd))
  });
});

gulp.task('scripts-asis', function(){
  return gulp.src('src/scripts/*.min.js')
    .pipe(gulp.dest(scriptsd))
    .pipe(p.livereload(tinylr));
});

gulp.task('scripts-plain', function(){
  return gulp.src(['src/scripts/*.js', '!src/scripts/*.min.js'])
    .pipe(p.jshint())
    .pipe(p.uglify())
    .pipe(gulp.dest(scriptsd))
    .pipe(p.livereload(tinylr));
});

gulp.task('scripts',['scripts-plain','scripts-asis','scripts-pkgs']);

//------------------------------- styles ---------------------------------

gulp.task('stylus', function(){
  return gulp.src('src/styles/**/*.styl')
    .pipe(p.stylus({paths: paths.stylus, use: ['nib']}))
    .pipe(p.autoprefixer('last 2 versions'))
    .pipe(gulp.dest(stylesd))
    .pipe(p.minifyCss({keepSpecialComments: 0}))
    .pipe(p.rename({extname: ".min.css"}))
    .pipe(gulp.dest(stylesd))
    .pipe(p.livereload(tinylr));
});

gulp.task('styles-asis', function(){
  return gulp.src('src/styles/**/*.!(styl)')
    .pipe(gulp.dest(stylesd))
    .pipe(p.livereload(tinylr));
});

gulp.task('styles',['stylus','styles-asis']);

//------------------------------- images ---------------------------------

gulp.task('favicon',function(){
  return gulp.src('src/images/favicon.ico')
    .pipe(gulp.dest(targetd))
    .pipe(p.livereload(tinylr));
});

gulp.task('raster',function(){
  return gulp.src('src/images/**/*.{jpg,jpeg,png,gif}')
    .pipe(p.imagemin())
    .pipe(gulp.dest(imagesd))
    .pipe(p.livereload(tinylr));
});

gulp.task('svg',function(){
  return gulp.src('src/images/**/*.{svg}')
    .pipe(p.svgmin())
    .pipe(gulp.dest(imagesd))
    .pipe(p.livereload(tinylr));
});

gulp.task('images', ['favicon', 'raster', 'svg']);

//------------------------------- html -----------------------------------

gulp.task('html-plain', function(){
  return gulp.src('src/html/*.html')           
    .pipe(p.embedlr())
    .pipe(p.minifyHtml())
    .pipe(gulp.dest(htmld))
    .pipe(p.livereload(tinylr));
});

gulp.task('jade', function(){
  return gulp.src('src/html/*.jade')           
    .pipe(p.jade())
    .pipe(p.embedlr())
    .pipe(p.minifyHtml())
    .pipe(gulp.dest(htmld))
    .pipe(p.livereload(tinylr));
});

gulp.task('html', ['html-plain', 'jade']);

//------------------------------- serve ----------------------------------

gulp.task('serve', function() {
  http.createServer(ecstatic({ root: __dirname })).listen(4000);
  tinylr.listen(35729);
});


//------------------------------- watch ----------------------------------

gulp.task('watch', function(){
  gulp.watch('src/styles/**', ['styles']);
  gulp.watch('src/scripts/**', ['scripts']); 
  gulp.watch('src/images/**', ['images']);
  gulp.watch('src/html/**', ['html']);
});

//------------------------------- default --------------------------------

gulp.task('once',['scripts','styles','images','html']);
gulp.task('default',['once','watch']);
