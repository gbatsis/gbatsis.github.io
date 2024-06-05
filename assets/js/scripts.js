function animateNeurons() {
    const layers = ['#layer1', '#layer2', '#layer3'];

    layers.forEach((layer, index) => {
        const neurons = $(layer).find('.neuron');
        neurons.each((i, neuron) => {
            gsap.fromTo(neuron, {
                scale: 0,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                delay: index * 0.5 + i * 0.1,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        });
    });
}

function initializeNetwork() {
    const network = $('#network');
    const svg = createSVGElement('svg');
    const defs = createSVGElement('defs');

    // Add id to SVG element
    svg.setAttribute('id', 'connection');

    svg.appendChild(defs);
    network.append(svg);

    // Define animated gradient
    createAnimatedGradient(defs);

    // Draw initial paths with animation
    drawPathsWithAnimation();

    // Function to create SVG element
    function createSVGElement(type) {
        return document.createElementNS("http://www.w3.org/2000/svg", type);
    }

    // Function to create the animated gradient
    function createAnimatedGradient(defs) {
        const gradient = createSVGElement('linearGradient');
        gradient.setAttribute('id', 'animatedGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('y2', '0%');

        const startColor = createSVGElement('stop');
        startColor.setAttribute('offset', '0%');
        startColor.setAttribute('style', 'stop-color:#c5d4e6; stop-opacity:0');
        gradient.appendChild(startColor);

        const midColor = createSVGElement('stop');
        midColor.setAttribute('offset', '50%');
        midColor.setAttribute('style', 'stop-color:#c5d4e6; stop-opacity:1;');
        gradient.appendChild(midColor);

        const endColor = createSVGElement('stop');
        endColor.setAttribute('offset', '100%');
        endColor.setAttribute('style', 'stop-color:#c5d4e6; stop-opacity:0');
        gradient.appendChild(endColor);

        defs.appendChild(gradient);
    }

    function drawPathsWithAnimation() {
        const svg = document.querySelector('#network #connection');
        const defs = svg.querySelector('defs');
        $(svg).empty();
        svg.appendChild(defs);

        $('.layer').each(function(idx, layer) {
            if (idx < $('.layer').length - 1) {
                const neurons = $(layer).find('.neuron');
                const nextNeurons = $('.layer').eq(idx + 1).find('.neuron');

                neurons.each(function() {
                    const neuron = this;
                    const start = neuron.getBoundingClientRect();
                    nextNeurons.each(function() {
                        const nextNeuron = this;
                        const end = nextNeuron.getBoundingClientRect();
                        const path = createAnimatedPath(start, end);
                        svg.appendChild(path);

                        // Animate path drawing in reverse direction
                        const pathLength = path.getTotalLength();
                        gsap.fromTo(path, {
                            strokeDasharray: pathLength,
                            strokeDashoffset: pathLength
                        }, {
                            strokeDasharray: pathLength,
                            strokeDashoffset: 0,
                            duration: 2,
                            delay: idx * 0.5,
                            ease: "power2.out"
                        });
                    });
                });
            }
        });
    }

    function createAnimatedPath(start, end) {
        const path = createSVGElement('path');
        const startX = start.left + start.width / 2;
        const startY = start.top + start.height / 2;
        const endX = end.left + end.width / 2;
        const endY = end.top + end.height / 2;
        const curveControlX1 = (startX + endX) / 2;
        const curveControlY1 = startY - 50;
        const curveControlX2 = (startX + endX) / 2;
        const curveControlY2 = endY + 50;

        path.setAttribute('d', `M ${startX} ${startY} C ${curveControlX1} ${curveControlY1}, ${curveControlX2} ${curveControlY2}, ${endX} ${endY}`);
        path.setAttribute('stroke', 'url(#animatedGradient)');
        path.style.strokeWidth = '3';
        path.style.fill = 'none';

        return path;
    }
}

function animateOverlay() {
    gsap.fromTo(".overlay", {
        y: -100,  // Start position (above the viewport)
        opacity: 0
    }, {
        y: 0,  // End position
        opacity: 1,
        duration: 1,
        delay: 1.5, // Add a delay of 0.5 seconds
        ease: "bounce.out"
    });
}

function resizeConnections() {
    // Redraw paths when window is resized
    initializeNetwork();
}

// On page load
$(document).ready(function () {
    animateNeurons();
    initializeNetwork();
    animateOverlay();
    $(window).resize(resizeConnections); // Attach resize event
});
