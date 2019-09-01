const electron = require("electron");
const fs = require("fs");
const mouseWheel = require("mouse-wheel");

let vueMethods = importFunctions();

/*
TODO
Flytta tools till plugin
*/

let app = new Vue({
    el: "#wrapper",
    data: {
        plugins: {
            count: 0,
            dialogs: []
        },
        project: {
            width: 10,
            height: 10,
            drawing: null,
        },
        tabs: {

        },
        tools: {
            list: [],
            selected: null
        }
    },
    computed: {
        hasDrawingLoaded() {
            return this.project.drawing ? true : false;
        },
        isLayerSelected() {
            return this.project.drawing.layers.selected ? true : false;
        }
    },
    watch: {
        //Draw everytime project.drawing changes
        'project.drawing': {
            handler: function() {
                this.project.drawing.draw();
            }, deep: true
        }
    },
    mounted() {
        //Initialization
        this.project.drawing = new TileCanvas(this.$refs.mainCanvas);
        this.project.drawing.setZoom(50);

        //Run all plugins
        this.loadPlugins();
    },
    methods: vueMethods
})

mouseWheel(app.$refs.mainCanvas.parentNode, (dx, dy) => {
    if (dy > 0 && app.project.drawing.zoom > 0)
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