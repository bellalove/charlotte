var targetd = './',
    htmld = targetd,
    stylesd = targetd + 'styles/',
    scriptsd = targetd + 'scripts/',
    imagesd = targetd + 'images/',
    gulp = require("gulp"),
    glob = require("glob"),
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
    .pipe(gulp.dest(scriptsd));
});

gulp.task('scripts-plain', function(){
  return gulp.src(['src/scripts/*.js', '!src/scripts/*.min.js'])
    .pipe(p.jshint())
    .pipe(p.uglify())
    .pipe(gulp.dest(scriptsd));
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
    .pipe(gulp.dest(stylesd));
});

gulp.task('styles-asis', function(){
  return gulp.src('src/styles/**/*.!(styl)')
    .pipe(gulp.dest(stylesd));
});

gulp.task('styles',['stylus','styles-asis']);

//------------------------------- images ---------------------------------

gulp.task('favicon',function(){
  return gulp.src('src/images/favicon.ico')
    .pipe(gulp.dest(targetd));
});

gulp.task('raster',function(){
  return gulp.src('src/images/**/*.{jpg,jpeg,png,gif}')
    .pipe(p.imagemin())
    .pipe(gulp.dest(imagesd));
});

gulp.task('svg',function(){
  return gulp.src('src/images/**/*.{svg}')
    .pipe(p.svgmin())
    .pipe(gulp.dest(imagesd));
});

gulp.task('images', ['favicon', 'raster', 'svg']);

//------------------------------- html -----------------------------------

gulp.task('html-plain', function(){
  return gulp.src('src/html/*.html')           
    .pipe(p.minifyHtml())
    .pipe(gulp.dest(htmld));
});

gulp.task('jade', function(){
  return gulp.src('src/html/*.jade')           
    .pipe(p.jade())
    .pipe(p.minifyHtml())
    .pipe(gulp.dest(htmld));
});

gulp.task('html', ['html-plain', 'jade']);

//------------------------------- default --------------------------------

gulp.task('default',['scripts','styles','images','html'],function(){
  //TODO: reactivate when watch and concat combo is fixed
  //gulp.watch('src/styles/**/*.styl', ['styles','html']);
  //gulp.watch('src/scripts/**/*.js', ['scripts','html']); 
  //gulp.watch('src/images/**', ['images']);
  //gulp.watch('src/html/**/*.{html,jade}', ['html']);
});

gulp.task('once',['scripts','styles','images','html']);
