const electron = require("electron");
const fs = require("fs");
const mouseWheel = require("mouse-wheel");
const tools = require("../scripts/tools.json");

let vueMethods = importFunctions();

let app = new Vue({
    el: "#wrapper",
    data: {
        project: {
            width: 10,
            height: 10,
            drawing: null,
        },
        tools: {
            list: tools,
            selected: tools[0]
        }
    },
    watch: {
        'project.drawing': {
            handler: function() {
                this.project.drawing.draw();
            }, deep: true
        }
    },
    mounted() {
        this.project.drawing = new TileCanvas(this.$refs.mainCanvas);
        this.createLayer();
        this.project.drawing.setZoom(50);
        this.project.drawing.draw();
    },
    methods: vueMethods
})

mouseWheel(app.$refs.mainCanvas.parentNode, (dx, dy) => {
    if (dy > 0 && app.drawing.zoom > 0)
        app.zoom(-2);

    if (dy < 0)
        app.zoom(2);
}, true);

function importFunctions() {
    let functions = {}
    let scripts = fs.readdirSync("./gui/scripts/vue");
    scripts.forEach(script => {
        let scriptFunctions = require("../scripts/vue/" + script);
        Object.keys(scriptFunctions).forEach(func => {
            functions[func] = scriptFunctions[func];
        })
    })
    return functions;
}