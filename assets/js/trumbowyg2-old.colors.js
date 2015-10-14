/* ===========================================================
 * trumbowyg.colors.js v1.0
 * Colors picker plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */

(function($){
    'use strict';

    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                foreColor: "Text color",
                backColor: "Background color"
            },
            fr: {
                foreColor: "Couleur du texte",
                backColor: "Couleur de fond"
            },
            sk: {
                foreColor: "Farba textu",
                backColor: "Farba pozadia"
            }
        }
    });

    // Create btnsDef entry
    $.extend(true, $.trumbowyg, {
        opts: {
            btnsDef: {}
        }
    });

    // Set default colors
    if(!$.trumbowyg.opts.colors)    
        $.trumbowyg.opts.colors = ['000000', 'ad1a19'];
    
    // Add all colors in two dropdowns
    $.extend(true, $.trumbowyg, {
        opts: {
            btnsDef: {
                foreColor: {
                    dropdown: buildDropdown('foreColor')
                },
                backColor: {
                    dropdown: buildDropdown('backColor')
                }
            }
        }
    });



    function buildDropdown(func){
        var dropdown = [];

        $.each($.trumbowyg.opts.colors, function(i, color){
            var btn = '_' + func + color;
            $.trumbowyg.opts.btnsDef[btn] = {
                func: func,
                param: '#' + color,
                style: 'background-color: #' + color + ';'
            };
            dropdown.push(btn);
        });
        var btn = '_' + func + 'transparent';
        $.trumbowyg.opts.btnsDef[btn] = {
            func: func,
            param: 'transparent',
            style: 'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQIW2NkQAAfEJMRmwBYhoGBYQtMBYoAADziAp0jtJTgAAAAAElFTkSuQmCC);'
        };
        dropdown.push(btn);
        return dropdown;
    }
})(jQuery);
