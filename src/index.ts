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

let matrix: string[][] = map
  .trim()
  .split("\n")
  .map((x: string) => {
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

function findObject(
  pos: number[],
  dir: number[],
  visited: Set<string>,
): any[][] {
  if (visited.has(JSON.stringify(pos))) {
    return [];
  }
  visited.add(JSON.stringify(pos));

  let ans: any[][] = [];
  let [x, y] = pos;
  switch (matrix[x][y]) {
    case "@":
      ans.push([pos[0], pos[1], matrix[x][y]]);
      findObject([x + dir[0], y + dir[1]], dir, visited).forEach((res) =>
        ans.push(res),
      );
      break;

    case "[":
      ans.push([pos[0], pos[1], matrix[x][y]]);
      if (JSON.stringify(dir) == "[0,-1]" || JSON.stringify(dir) == "[0,1]") {
        findObject([x + dir[0], y + dir[1]], dir, visited).forEach((res) =>
          ans.push(res),
        );
      } else {
        findObject([x + dir[0], y + dir[1]], dir, visited).forEach((res) =>
          ans.push(res),
        );
        findObject([x, y + 1], dir, visited).forEach((res) => ans.push(res));
      }
      break;

    case "]":
      ans.push([pos[0], pos[1], matrix[x][y]]);
      if (JSON.stringify(dir) == "[0,-1]" || JSON.stringify(dir) == "[0,1]") {
        findObject([x + dir[0], y + dir[1]], dir, visited).forEach((res) =>
          ans.push(res),
        );
      } else {
        findObject([x + dir[0], y + dir[1]], dir, visited).forEach((res) =>
          ans.push(res),
        );
        findObject([x, y - 1], dir, visited).forEach((res) => ans.push(res));
      }
      break;

    case " ":
    case "#":
      break;
  }
  return ans;
}

function checkMove(obj: any[][], dir: number[]): boolean {
  return obj.every((pos) => {
    return matrix[pos[0] + dir[0]][pos[1] + dir[1]] != "#";
  });
}

function pushObject(obj: any[][], dir: number[]) {
  // Push to new positions
  obj
    .slice()
    .reverse()
    .forEach((pos) => {
      matrix[pos[0] + dir[0]][pos[1] + dir[1]] = pos[2];
    });

  // Cleanup old positions
  let newPositions = new Set();
  obj.forEach((pos) => {
    newPositions.add(JSON.stringify([pos[0] + dir[0], pos[1] + dir[1]]));
  });
  obj
    .filter((pos) => !newPositions.has(JSON.stringify([pos[0], pos[1]])))
    .forEach((pos) => {
      matrix[pos[0]][pos[1]] = " ";
    });
}

function movePlayer(dir: number[]) {
  let obj = findObject(pos, dir, new Set());
  if (checkMove(obj, dir)) {
    pushObject(obj, dir);
    matrix[pos[0]][pos[1]] = " ";
    pos = [pos[0] + dir[0], pos[1] + dir[1]];
  }
}

let el: HTMLElement = document.getElementById("matrix")!!;
function render(): void {
  el.innerHTML = matrix.map((row) => row.join("")).join("\n");
}

function dirFromEvent(e: KeyboardEvent): number[] {
  switch (e.key) {
    case "ArrowUp":
      return [-1, 0];
    case "ArrowDown":
      return [1, 0];
    case "ArrowLeft":
      return [0, -1];
    case "ArrowRight":
      return [0, 1];
  }
  throw "unknown key event";
}

window.addEventListener("keydown", (e) => {
  if (!["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"].includes(e.key)) {
    return e;
  }

  e.preventDefault();
  movePlayer(dirFromEvent(e));
  render();
});

let upButton = document.getElementById("up")!!;
upButton.addEventListener("click", () => {
  movePlayer([-1, 0]);
  render();
});

let downButton = document.getElementById("down")!!;
downButton.addEventListener("click", () => {
  movePlayer([1, 0]);
  render();
});

let leftButton = document.getElementById("left")!!;
leftButton.addEventListener("click", () => {
  movePlayer([0, -1]);
  render();
});

let rightButton = document.getElementById("right")!!;
rightButton.addEventListener("click", () => {
  movePlayer([0, 1]);
  render();
});

render();
