(function($) {
    $.fn.scrollbox = function(config) {
    //default config
        var defConfig = {
            linear: true,
            direction: 'h',
            step: 1,
            delay: 0,
            speed: 10,
            onMouseOverPause: true,
            startDelay: 0,
            distance: 'auto',
            switchItems: 1, // Items to switch after each scroll event
            autoPlay: true,
            queue: null,
            listElement: 'ul',
            listItemElement: 'li',
            infiniteLoop: true, // Infinite loop or not loop
        };
        
        config = $.extend(defConfig, config);
        config.scrollOffset = config.direction === 'vertical' ? 'scrollTop' : 'scrollLeft';
        if (config.queue) {
            config.queue = $('#' + config.queue);
        }

        return this.each(function() {
            var container = $(this),
                containerUL,
                scrollingId = null,
                nextScrollId = null,
                paused = false,
                forward,
                scrollForward,
                pauseHover,
                switchCount = 0;

            if (config.onMouseOverPause) {
                container.bind('mouseover', function() {
                    paused = true;
                });
                container.bind('mouseout', function() {
                    paused = false;
                });
            }
            containerUL = container.children(config.listElement + ':first-child');

            // init default switchAmount
            if (config.infiniteLoop === false && config.switchAmount === 0) {
                config.switchAmount = containerUL.children().length;
            }

            scrollForward = function() {
                if (paused) {
                    return;
                }
                var curLi,
                    i,
                    newScrollOffset,
                    scrollDistance,
                    theStep;

                curLi = containerUL.children(config.listItemElement + ':first-child');

                scrollDistance = config.distance !== 'auto' ? config.distance :
                config.direction === 'vertical' ? curLi.outerHeight(true) : curLi.outerWidth(true);

                // offset
                if (!config.linear) {
                    theStep = Math.max(3, parseInt((scrollDistance - container[0][config.scrollOffset]) * 0.3, 10));
                    newScrollOffset = Math.min(container[0][config.scrollOffset] + theStep, scrollDistance);
                } else {
                    newScrollOffset = Math.min(container[0][config.scrollOffset] + config.step, scrollDistance);
                }
                container[0][config.scrollOffset] = newScrollOffset;

                if (newScrollOffset >= scrollDistance) {
                    for (i = 0; i < config.switchItems; i++) {
                        if (config.queue && config.queue.find(config.listItemElement).length > 0) {
                            containerUL.append(config.queue.find(config.listItemElement)[0]);
                            containerUL.children(config.listItemElement + ':first-child').remove();
                        } else {
                            containerUL.append(containerUL.children(config.listItemElement + ':first-child'));
                        }
                        ++switchCount;
                    }
                    container[0][config.scrollOffset] = 0;
                    clearInterval(scrollingId);
                    scrollingId = null;
                    if (config.infiniteLoop === false && switchCount >= config.switchAmount) {
                        return;
                    }
                    if (config.autoPlay) {
                        nextScrollId = setTimeout(forward, config.delay * 1000);
                    }
                }
            };

            forward = function() {
                clearInterval(scrollingId);
                scrollingId = setInterval(scrollForward, config.speed);
            };

            // Implements mouseover function.

            pauseHover = function() {
                paused = true;
            };

            if (config.autoPlay) {
                nextScrollId = setTimeout(forward, config.startDelay * 1000);
            }
        });
    };
}(jQuery));