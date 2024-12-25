const map = `
####################
##    []    []  []##
##            []  ##
##  [][]    []  []##
##    []@     []  ##
##[]##    []      ##
##[]    []    []  ##
##  [][]  []  [][]##
##        []      ##
####################`;

let matrix: String[][] = map
  .trim()
  .split("\n")
  .map((x: string) => {
    console.log(x);
    return x.split("");
  });

let pos: number[] = [0, 0];
matrix.forEach((row, x) => {
  row.forEach((col, y) => {
    if (col == "@") {
      pos = [x, y];
    }
  });
});

function movePlayer(e: KeyboardEvent) {
  let [x, y] = pos;
  switch (e.key) {
    case "ArrowUp":
      if (x > 0 && matrix[x - 1][y] == " ") {
        matrix[x][y] = " ";
        matrix[x - 1][y] = "@";
        pos = [x - 1, y];
      }
      render();
      break;

    case "ArrowDown":
      if (matrix[x + 1][y] == " ") {
        matrix[x][y] = " ";
        matrix[x + 1][y] = "@";
        pos = [x + 1, y];
      }
      render();
      break;

    case "ArrowRight":
      if (matrix[x][y + 1] == " ") {
        matrix[x][y] = " ";
        matrix[x][y + 1] = "@";
        pos = [x, y + 1];
      }
      render();
      break;

    case "ArrowLeft":
      if (matrix[x][y - 1] == " ") {
        matrix[x][y] = " ";
        matrix[x][y - 1] = "@";
        pos = [x, y - 1];
      }
      render();
      break;

    default:
      break;
  }
}

let el: HTMLElement = document.getElementById("matrix")!!;
function render(): void {
  el.innerHTML = matrix.map((row) => row.join("")).join("\n");
}

window.addEventListener("keydown", (e) => {
  if (!["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"].includes(e.key)) {
    return e;
  }

  e.preventDefault();
  movePlayer(e);
});

render();
