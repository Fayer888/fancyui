import path from 'path';
import template from 'gulp-template';
import gulp from 'gulp';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import yargs    from 'yargs';
import rimraf   from 'rimraf';
import merge    from 'merge-stream';
import watch    from 'gulp-watch';
import webpack from 'webpack';
import colorsSupported from 'supports-color';

import browserSync from 'browser-sync';
import webpackDevMiddelware from 'webpack-dev-middleware';
import webpachHotMiddelware from 'webpack-hot-middleware';
import historyApiFallback   from 'connect-history-api-fallback';


'use strict';

let resolveToLibs = (glob = '') => {
  return path.join('lib/', glob); // app/components/{glob}
};

let resolveToComponents = (glob = '') => {
  return path.join('example/app/components/', glob); // app/components/{glob}
}

gulp.task('component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;

  const destComponentsPath = path.join(resolveToComponents(), name);
  const destLibPaths = path.join(resolveToLibs(), cap(name));

  let gulpLibs = gulp.src(path.join(__dirname, 'generator', 'lib/**/*.**'))
    .pipe(template({
      name: name,
      upCaseName: cap(name),
      dateTime: new Date()
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destLibPaths));

  let gulpComponents = gulp.src(path.join(__dirname, 'generator', 'example/component/*.**'))
    .pipe(template({
      name: name,
      upCaseName: cap(name),
      dateTime: new Date()
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destComponentsPath));

  return merge(gulpLibs, gulpComponents);
});

gulp.task('dev', () => {
  const bs = browserSync.create();
  const webpackDevConfig = require('./conf/webpack.dev.config');
  const compiler = webpack(webpackDevConfig);
  bs.init(
    {
      port: process.env.PORT || 3000,
      server: {
        baseDir: './example',
        index: 'index.html'
      },
      files: ['example/**/*.js',
        'example/**/*.less',
        'example/**/*.html',
        'lib/**/*.js',
        'lib/**/*.less',
        'lib/**/*.html'],
      middleware: [
        webpackDevMiddelware(compiler, {
          stats: {
            colors: colorsSupported,
            chunks: false,
            modules: false
          }
        })
      ]
    }
  );
});


gulp.task('webpack', (cb) => {
  const config = require('./conf/webpack.example.config');
  webpack(config, (err, stats) => {
    if(err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
});
