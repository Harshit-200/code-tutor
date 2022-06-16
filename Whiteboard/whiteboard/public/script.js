var client = io("http://localhost:9999");
let connid;
client.on("connect", () => {
    console.log(`${client.id} connected`);
    client.emit('request-data');
});
let canvas = document.getElementById("canvas");
canvas.width = Math.max(0.98 * window.innerWidth, canvas.width);
canvas.height = Math.max(window.innerHeight, canvas.height);
let ctx = canvas.getContext("2d");
let XOFFSET = 0, YOFFSET = 0;
let x;
let y;
let mouseDown = false;
window.onmousedown = function (e) {
    client.emit("down", { X: e.clientX + XOFFSET, Y: e.clientY + YOFFSET });
    ctx.moveTo(e.clientX + XOFFSET, e.clientY + YOFFSET);
    mouseDown = true;
};
window.onresize = function () {
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = Math.max(window.innerWidth, canvas.width);
    canvas.height = Math.max(window.innerHeight, canvas.height);
    ctx.putImageData(data, 0, 0);
};
window.onscroll = function () {
    // console.log(window.scrollX);
    // console.log(window.scrollY);
    XOFFSET = window.scrollX;
    YOFFSET = window.scrollY;
};
window.onmouseup = function (e) {
    mouseDown = false;
};
client.on('get-data', newSocketID => {
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(`Data requested from ${client.id}`);
    // client.emit('receive-data', data, newSocketID);
})
client.on('new-connection', imageData => {
    if(imageData != null) {
        console.log(imageData);
        ctx.putImageData(imageData, 0, 0);
    }
    else console.log("No data");
})
client.on("onDown", (x, y) => {
    ctx.moveTo(x, y);
});
client.on("onDraw", (x, y) => {
    drawPixel(x, y);
});

window.onmousemove = function (e) {
    x = XOFFSET + e.clientX;
    y = YOFFSET + e.clientY;
    if (mouseDown) {
        client.emit("draw", { X: x, Y: y });
        drawPixel(x, y);
    }
};
function drawPixel(x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
}
