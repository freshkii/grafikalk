class Shape {
	constructor() {}
	render() {}
}

class Dot extends Shape {
	constructor(pts,parent_=null) {
		super()
		this.pt = pts[0]
		this.parent_ = parent_
	}
	render(ctx) {
		ctx.beginPath()
		ctx.fillStyle = "black"
		const pixel = convertPointToPixel(this.pt)
		ctx.arc(pixel.x,pixel.y,2,0,2*Math.PI)
		ctx.fill()
	}
	static neededCords() { return 1 }
}

class Line extends Shape {
	constructor(pts) {
		super()
		this.pts = pts
		this.connectedDots = [new Dot(pts), new Dot([pts[1]])]
		shapes.push(this.connectedDots[0])
		shapes.push(this.connectedDots[1])
	}
	render(ctx) {
		ctx.beginPath()
		const pixels = [convertPointToPixel(this.pts[0]),convertPointToPixel(this.pts[1])]
		ctx.moveTo(pixels[0].x, pixels[0].y)
		ctx.lineTo(pixels[1].x, pixels[1].y)
		ctx.stroke()

		this.connectedDots[0].render(ctx)
		this.connectedDots[1].render(ctx)
	}
	static neededCords() { return 2 }
}

class Circle extends Shape {
	constructor(pts) {
		super()
		this.pt = pts[0]
		this.radius = Math.sqrt((pts[1].x-pts[0].x)**2+(pts[1].y-pts[0].y)**2)
		this.connectedDots = [new Dot(pts), new Dot([pts[1]])]
	}
	render(ctx) {
		const pixel = convertPointToPixel(this.pt)
		ctx.beginPath()
		ctx.fillStyle = "black"
		ctx.arc(pixel.x,pixel.y,this.radius,0,2*Math.PI)
		ctx.stroke()

		this.connectedDots[0].render(ctx)
		this.connectedDots[1].render(ctx)
	}
	static neededCords() { return 2 }
}

function drawGrid(viewpoint,ctx) {
	ctx.fillStyle = "black"
	ctx.fillRect(viewpoint.x,0,1,canvas.height)
	ctx.fillRect(0,viewpoint.y,canvas.width,1)
}

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// manually set the size of the canvas
canvas.width = 800
canvas.height = 600

let canvas_rect = canvas.getBoundingClientRect()

let viewpoint = {
	x: canvas.width/2, // (0,0) origin cords in terms of real cords
	y: canvas.height/2,
	zoom: 1
}

drawGrid(viewpoint,ctx)

let mode = "move"
let currentTool = Dot

let shapes = []
let currentPoints = []

function convertPixelToPoint(pixel) {
	return {x:pixel.x-canvas_rect.left-viewpoint.x, y:pixel.y-canvas_rect.top-viewpoint.y}
}
function convertPointToPixel(point) {
	return {x:point.x+viewpoint.x, y:point.y+viewpoint.y}
}

// bind keys
document.getElementById("move-mode")
.addEventListener("click", () => mode = "move")

for (const tool of document.getElementById("tool-picker").children) {
	tool.addEventListener("click", () => {
		currentTool = eval(tool.id)
		mode = "shape"
	})
}

// canvas interaction
canvas.addEventListener("click", e => {
	if (mode === "shape") {
		currentPoints.push(convertPixelToPoint({x:e.clientX,y:e.clientY}))
		if (currentTool.neededCords() == currentPoints.length){
			shapes.push(
			  new currentTool(currentPoints)
			)
			shapes[shapes.length-1].render(ctx)
			currentPoints = []
		}
	}
})

