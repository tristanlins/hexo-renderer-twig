/* global hexo */
'use strict';

var Twig = require('twig');

function twigCompile(data) {
    var template = Twig.twig({
        data: data.text,
        path: data.path
    });

    return function(locals) {
        var context = {};
        Object.keys(locals).forEach(function(key) {
            var value = locals[key];

            if ('function' === typeof value) {
                Twig.extendFunction(key, value);
            } else {
                context[key] = value;
            }
        });

        return template.render(context);
    }
}

function twigRenderer(data) {
    return twigCompile(data)(data);
}

twigRenderer.compile = twigCompile;

// Configure twig
(function(config) {
    if (config.filters) {
        config.filters.forEach(function(name) {
            var fn = global[name];
            Twig.extendFilter(name, fn);
        });
    }

    if (config.functions) {
        config.functions.forEach(function(name) {
            var fn = global[name];
            Twig.extendFunction(name, fn);
        });
    }
})(hexo.config.twig || {});

// Register the renderer
hexo.extend.renderer.register('twig', 'html', twigRenderer);
