document.addEventListener("DOMContentLoaded", function (event) {
    function spawnGrain() {
        var canvas = document.getElementById("gamecanvas");
        if (canvas !== null && canvas instanceof HTMLCanvasElement) {
            var xpos = Math.floor(Math.random() * (5 / 16 - 3 / 16) * canvas.width) +
                canvas.width / 4;
            var ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "red";
                ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(xpos, 20, 2, 2);
                console.log("grain spawned at pos", xpos);
            }
        }
        else {
            console.error("canvas not found or not an instance of HTMLCanvasElement.");
        }
    }
    document.addEventListener("keydown", function (e) {
        console.log("Key pressed: ".concat(e.key));
        if (e.key == " ") {
            console.log("space");
            spawnGrain();
        }
    });
});
