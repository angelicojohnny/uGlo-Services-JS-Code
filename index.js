// FAQ and Dropdown Delay Handler
document.addEventListener('DOMContentLoaded', function() {
    // FAQ open
    const faqElement = document.getElementById('faq-open');
    if (faqElement) {
        faqElement.click();
    }

    // Dropdown delay adjustment
    function adjustDropdownDelay() {
        const delay = window.innerWidth <= 768 ? '0' : '300';
        document.querySelectorAll('.navbar_menu-dropdown').forEach(el => {
            el.setAttribute('data-delay', delay);
        });
    }

    adjustDropdownDelay();
    window.addEventListener('resize', adjustDropdownDelay);
});

// BeerSlider Implementation
"use strict";

function _instanceof(e, t) {
    return null != t && "undefined" != typeof Symbol && t[Symbol.hasInstance] ? !!t[Symbol.hasInstance](e) : e instanceof t
}

function _classCallCheck(e, t) {
    if (!_instanceof(e, t)) throw new TypeError("Cannot call a class as a function")
}

function _defineProperties(e, t) {
    for (var a = 0; a < t.length; a++) {
        var i = t[a];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
    }
}

function _createClass(e, t, a) {
    return t && _defineProperties(e.prototype, t), a && _defineProperties(e, a), e
}

var BeerSlider = function() {
    function i(e) {
        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "50";
        var a = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "udesly-before-after";
        _classCallCheck(this, i);
        this.start = parseInt(t) ? Math.min(100, Math.max(0, parseInt(t))) : 50;
        this.prefix = a;
        this.element = e;
        this.element.classList.add("udesly-before-after-slider");
        this.imageLeft = this.element.querySelector('[image="left"]');
        this.imageRight = this.element.querySelector('[image="right"]');
        this.labelLeft = this.element.querySelector('[image="left-label"]');
        this.labelRight = this.element.querySelector('[image="right-label"]');
        this.isAnimating = true;
        this.animationState = 'paused';
        if (!this.imageLeft || !this.imageRight) {
            console.error('Required images are missing');
            return;
        }

        this.revealContainerImage = document.createElement("div");
        this.revealContainerImage.classList.add("".concat(this.prefix, "-reveal"));
        this.revealContainerImage.appendChild(this.imageLeft);
        this.element.appendChild(this.revealContainerImage);
        
        this.range = this.addElement("input", {
            type: "range",
            class: "".concat(this.prefix, "-range"),
            "aria-label": "Percent of revealed content",
            "aria-valuemin": "0",
            "aria-valuemax": "100",
            "aria-valuenow": this.start,
            value: this.start,
            min: "0",
            max: "100"
        });

        this.handle = this.element.querySelector('[before-after="handle"]');
        if (this.handle) {
            this.handle.classList.add("udesly-before-after-handle");
        } else {
            console.error('Handle element is missing');
            return;
        }

        this.onImagesLoad();
    }

    _createClass(i, [{
        key: "init",
        value: function() {
            this.element.classList.add("".concat(this.prefix, "-ready"));
            this.setImgWidth();
            this.move();
            this.addListeners();
            this.startAnimation();
        }
    }, {
        key: "startAnimation",
        value: function() {
            if (!this.isAnimating) return;
            
            var self = this;
            const PAUSE_DURATION = 4000;
            const ANIMATION_DURATION = 2000;
            const ANIMATION_STEPS = 60;
            function animateToPosition(startPos, endPos) {
                return new Promise((resolve) => {
                    if (!self.isAnimating) {
                        resolve();
                        return;
                    }

                    const stepCount = (ANIMATION_DURATION / 1000) * ANIMATION_STEPS;
                    const stepSize = (endPos - startPos) / stepCount;
                    let currentStep = 0;
                    
                    function step() {
                        if (!self.isAnimating) {
                            resolve();
                            return;
                        }

                        currentStep++;
                        const newPosition = startPos + (stepSize * currentStep);
                        self.range.value = newPosition;
                        self.move();

                        if (currentStep < stepCount) {
                            setTimeout(step, 1000 / ANIMATION_STEPS);
                        } else {
                            resolve();
                        }
                    }
                    
                    step();
                });
            }

            async function animationSequence() {
                while (self.isAnimating) {
                    await new Promise(resolve => setTimeout(resolve, PAUSE_DURATION));
                    if (!self.isAnimating) break;

                    await animateToPosition(parseFloat(self.range.value), 0);
                    if (!self.isAnimating) break;

                    await new Promise(resolve => setTimeout(resolve, PAUSE_DURATION));
                    if (!self.isAnimating) break;

                    await animateToPosition(0, 100);
                    if (!self.isAnimating) break;

                    await new Promise(resolve => setTimeout(resolve, PAUSE_DURATION));
                    if (!self.isAnimating) break;
                }
            }
            
            animationSequence();
        }
    }, {
        key: "loadingImg",
        value: function(i) {
            return new Promise(function(e, t) {
                if (!i) {
                    t(new Error('Image source is missing'));
                    return;
                }
                var a = new Image;
                a.onload = function() {
                    return e()
                };
                a.onerror = function() {
                    t(new Error('Failed to load image: ' + i));
                };
                a.src = i;
            })
        }
    }, {
        key: "loadedBoth",
        value: function() {
            var e = this.imageRight.src,
                t = this.imageLeft.src;
            return Promise.all([this.loadingImg(e), this.loadingImg(t)])
        }
    }, {
        key: "onImagesLoad",
        value: function() {
            var e = this;
            this.loadedBoth().then(function() {
                e.init()
            }).catch(function(error) {
                console.error("Failed to load images:", error);
                e.element.classList.add("".concat(e.prefix, "-error"));
            })
        }
    }, {
        key: "addElement",
        value: function(e, t) {
            var a = document.createElement(e);
            Object.keys(t).forEach(function(e) {
                a.setAttribute(e, t[e])
            });
            this.element.appendChild(a);
            return a;
        }
    }, {
        key: "setImgWidth",
        value: function() {
            const containerWidth = this.element.clientWidth;
            if (containerWidth > 0) {
                this.imageLeft.style.width = containerWidth + 'px';
                this.imageRight.style.width = containerWidth + 'px';
            }
        }
    }, {
        key: "addListeners",
        value: function() {
            var t = this;
            
            ["mousedown", "touchstart"].forEach(function(e) {
                t.range.addEventListener(e, function() {
                    t.isAnimating = false;
                });
            });

            ["input", "change"].forEach(function(e) {
                t.range.addEventListener(e, function() {
                    t.move();
                });
            });
            
            let resizeTimeout;
            window.addEventListener("resize", function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    t.setImgWidth();
                }, 250);
            });
        }
    }, {
        key: "move",
        value: function() {
            this.revealContainerImage.style.width = "".concat(this.range.value, "%");
            this.handle.style.left = "".concat(this.range.value, "%");
            this.range.setAttribute("aria-valuenow", this.range.value);

            if (this.labelRight) {
                this.labelRight.style.opacity = this.range.value > 90 ? 
                    Math.max(0, (100 - this.range.value) / 10) : "1";
            }
            if (this.labelLeft) {
                this.labelLeft.style.opacity = this.range.value < 10 ? 
                    Math.max(0, this.range.value / 10) : "1";
            }
        }
    }]);

    return i;
}();

// Add styles
const style = document.createElement("style");
style.innerHTML = `
.udesly-before-after-slider {
    display: inline-block;
    overflow: hidden;
    position: relative;
    width: 100%;
}
.udesly-before-after-reveal {
    left: 0;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    right: 50%;
    top: 0;
    transition: opacity 0.35s;
    z-index: 1;
}
.udesly-before-after-reveal > :first-child {
    height: 100%;
    max-width: none;
    width: 100%;
    object-fit: cover;
}
.udesly-before-after-range {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    bottom: 0;
    cursor: col-resize;
    height: 100%;
    left: -1px;
    margin: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    touch-action: auto;
    width: calc(100% + 2px);
    z-index: 3;
}
.udesly-before-after-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 100%;
    width: 2px;
    background: transparent;
    cursor: col-resize;
}
.udesly-before-after-range::-moz-range-thumb {
    height: 100%;
    width: 2px;
    background: transparent;
    cursor: col-resize;
    border: none;
}
.udesly-before-after-handle {
    left: 50%;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    transition: background 0.3s, box-shadow 0.3s, opacity 0.5s 0.25s;
    z-index: 2;
}
.udesly-before-after-ready .udesly-before-after-handle,
.udesly-before-after-ready .udesly-before-after-reveal {
    opacity: 1;
}
.udesly-before-after-ready img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.udesly-before-after-ready [image="left"] {
    position: relative;
}
.udesly-before-after-ready [image="right"] {
    position: absolute;
    top: 0;
    left: 0;
}
.udesly-before-after-error {
    border: 1px solid red;
}`;
document.head.appendChild(style);

// Initialize BeerSlider
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[udesly-before-after]").forEach(function (slider) {
        const startValue = 80;
        new BeerSlider(slider, startValue);
    });
});

// Pricing Dropdown Handler
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggles = document.querySelectorAll('.pricing-dropdown');
    const dropdownWrappers = document.querySelectorAll('.choose-a-product_wrapper');

    dropdownToggles.forEach((dropdownToggle, index) => {
        const dropdownText = dropdownToggle.querySelector('div:nth-child(2)');
        const dropdownWrapper = dropdownWrappers[index];

        dropdownText.textContent = 'Process #2';

        function updateMobileTable(selectedValue) {
            document.querySelectorAll('[mobile-table]').forEach(element => {
                element.style.display = element.getAttribute('mobile-table') === selectedValue ? 'block' : 'none';
            });
        }

        updateMobileTable('process-two');

        dropdownWrapper.querySelectorAll('.choose-a-product_link').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                dropdownText.textContent = this.textContent;
                updateMobileTable(this.getAttribute('table-mobile-link'));
                dropdownWrapper.style.display = 'none';
            });
        });

        dropdownToggle.addEventListener('click', function() {
            dropdownWrapper.style.display = dropdownWrapper.style.display === 'none' || dropdownWrapper.style.display === '' ? 'block' : 'none';
        });
    });
});






