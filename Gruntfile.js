'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var date = Date.now();

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // configurable paths
        appName: {
            app: 'app',
            dist: 'dist',
            build: 'build'
        },
        watch: {
            compass: {
                files: ['<%= appName.app %>/styles/{,*/}*css'],
                tasks: ['clean:css', 'compass:server', 'autoprefixer', 'cssmin:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= appName.app %>/*.html',
                    '.tmp/styles/{,*/}*css',
                    '{.tmp,<%= appName.app %>}/scripts/{,*/}*.js',
                    '<%= appName.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        '<%= appName.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= appName.dist %>',
                    livereload: false
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= appName.dist %>/*',
                        '!<%= appName.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp',
            css: '.tmp/styles/*'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= appName.app %>/scripts/{,*/}*.js',
                '!<%= appName.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 0.5%', 'chrome 25', 'ie 8', 'ios 5', 'safari 5', 'ff 17', 'opera 12.1', 'bb 10', 'android 2.3']
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    //dest: '<%= appName.dist %>/styles/'
                    dest: '.tmp/styles/'
                }]
            }
        },
        removelogging: {
            dist : {
                expand: true,     // Enable dynamic expansion.
                cwd: '.tmp',      // Src matches are relative to this path.
                src: [
                    'scripts/**/*.js',
                    'bower_components/requirejs-google-analytics/dist/GoogleAnalytics.js'
                ], // Actual pattern(s) to match.
                dest: '.tmp'  // Same dest
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    name: '../bower_components/almond/almond',
                    almond: true,
                    baseUrl: '.tmp/scripts',
                    out: '<%= appName.dist %>/scripts/main.js',
                    include: ['main'],
                    insertRequire: ['main'],
                    optimize: 'none',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    mainConfigFile: '.tmp/scripts/main.js',
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        'bower-install': {
            app: {
                html: '<%= appName.app %>/index.html',
                ignorePath: '<%= appName.app %>/'
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= appName.dist %>/scripts/{,*/}*.js',
                        '<%= appName.dist %>/styles/{,*/}*.css',
                        '<%= appName.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    ]
                }
            },
        },
        useminPrepare: {
            options: {
                dest: '<%= appName.dist %>'
            },
            html: '<%= appName.app %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= appName.dist %>']
            },
            html: ['<%= appName.dist %>/{,*/}*.html'],
            //css: ['<%= appName.dist %>/styles/{,*/}*.css']
            css: ['.tmp/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= appName.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= appName.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= appName.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= appName.dist %>/images'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= appName.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= appName.app %>/images',
                javascriptsDir: '<%= appName.app %>/scripts',
                fontsDir: '<%= appName.app %>/styles/fonts',
                importPath: 'app/bower_components',
                relativeAssets: true,
                debugInfo: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            server: {
                files: {
                    '.tmp/styles/main.css': [
                        '<%= appName.app %>/styles/*.css',
                        '.tmp/styles/*.css'
                    ]
                }
            },
            dist: {
                files: {
                    '<%= appName.dist %>/styles/main.css': [
                        '<%= appName.app %>/styles/{,*/}*.css',
                        '.tmp/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                     /*
                    removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                    */
                },
                files: [{
                    expand: true,
                    cwd: '<%= appName.app %>',
                    src: '*.html',
                    dest: '<%= appName.dist %>'
                }]
            }
        },
        // Replace 
        replace: {
            dist: {
                options: {
                    variables: {
                        '<script data-main="scripts/main" src="bower_components/requirejs/require.js">':
                            '<script src="scripts/main.js">'
                    },
                    prefix: '<!-- @@Replace that by almond main script -->'
                },
                files: {
                    '<%= appName.dist %>/index.html': ['<%= appName.dist %>/index.html']
                }
            },
            appcache: {
                options: {
                    variables: {
                        '<html lang="en">': '<html lang="en" manifest="' + date + '.appName.appcache">'
                    },
                    prefix: '<!--@@Add appcache-->'
                },
                files: {
                    '<%= appName.dist %>/index.html': ['<%= appName.dist %>/index.html']
                }
            }
        },
        // Put files not handled in other tasks here
        copy: {
            tmp: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= appName.app %>',
                    dest: '.tmp/',
                    src: [
                        'scripts/**/*.js',
                        'bower_components/**/*.js'
                    ]
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= appName.app %>',
                    dest: '<%= appName.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '*.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/{,*/}*.*',
                        'scripts/json/{,*/}*.json',
                        'scripts/locales/{,*/}*.json'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= appName.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= appName.app %>/scripts/main.js'
            }
        },
        modernizr: {
            devFile: '<%= appName.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= appName.dist %>/scripts/vendor/modernizr.js',
            files: [
                '<%= appName.dist %>/scripts/{,*/}*.js',
                '<%= appName.dist %>/styles/{,*/}*.css',
                '!<%= appName.dist %>/scripts/vendor/*'
            ],
            extensibility: {
                'prefixed': true
            }
        },
        concurrent: {
            server: [
                'cssmin:server'
            ],
            test: [
                'cssmin:server'
            ],
            dist: [
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        uglify: {
            dist: {
                files: {
                    '<%= appName.dist %>/scripts/main.js': ['<%= appName.dist %>/scripts/main.js']
                }
            }
        },
        appcache: {
            options: {
                basePath: 'dist'
            },
            dist: {
                dest: '<%= appName.dist%>/' + date + '.appName.appcache',
                cache: '<%= appName.dist %>/{*.html,images/**/*,scripts/**/*,styles/**/*}',
                network: ['rre/rest', 'http://www.google-analytics.com/']
            }
        },
        minjson: {
            dist: {
                files: {
                    // Minify json files, cant use wildcards
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'compass:server',
            'concurrent:server',
            'autoprefixer:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer:server',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', function (target) {
        var result = grunt.task.run([
            'clean:dist',
            'compass:dist',
            'useminPrepare',
            'autoprefixer:dist',
            'concurrent:dist',
            'copy:tmp',
            'removelogging:dist',
            //'rev',
            'usemin:html',
            'requirejs',
            'concat',
            'uglify',
            'copy:dist',
            'minjson',
            'replace:dist',
            //'replace:appcache',
            'usemin:css',
            'cssmin:dist',
            //'appcache:dist',
        ]);

        return result && grunt.task.run([
            'modernizr'
        ]);
    });

    grunt.registerTask('build-beta', function (target) {
        var result = grunt.task.run([
            'build'
        ]);

        return result && grunt.task.run([
            'replace:appcache',
            'appcache:dist'
        ]);
    });

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
