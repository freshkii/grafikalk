class Shape {
	constructor() {}
	render() {}
}

class Dot extends Shape {
	constructor(cords,connectedDots=null) {
		super()
		this.cords = cords
		this.connectedDots = connectedDots
	}
	render(ctx, viewpoint) {
		ctx.fillStyle = "black"
		ctx.fillRect(this.cords.x+viewpoint.x-2,this.cords.y+viewpoint.y-2,4,4)
	}
}

class Line extends Shape {
	constructor(cords,connectedDots=null) {
		super()
		this.cords = cords
		this.connectedDots = connectedDots
	}
	render(ctx) {
		ctx.beginPath()
		ctx.moveTo(this.cords[0].x, this.cords[0].y)
		ctx.lineTo(this.cords[1].x, this.cords[1].y)
		ctx.stroke()
	}
}

class Circle extends Shape {
	constructor(cords,connectedDots=null) {
		this.cords = cords
		this.connectedDots = connectedDots
	}
	render(ctx, viewpoint) {
	}
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

let viewpoint = {
	x: canvas.width/2,
	y: canvas.height/2,
	zoom: 1
}

let mode = "move"
let currentTool = Dot

let shapes = []

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
		switch(currentTool) {
			case Dot:
				const canvas_rect = canvas.getBoundingClientRect()
				shapes.push(
					new currentTool({x:e.clientX-canvas_rect.left-viewpoint.x, y:e.clientY-canvas_rect.top-viewpoint.y})
				)
				shapes[shapes.length-1].render(ctx,viewpoint)
				break
			case Line:
				break
		}
	}
})

