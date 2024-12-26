const level1 = `
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

const level2 = `
########        
###    #####    
##         #    
###  ###   #####
#XX  XX# []@   #
#      # [][]  #
#XX    #       #
################
`;

const levels = [level1, level2];
let currentLevel = 1;
let winPositions: number[][] = [];

let map: string[][] = [];
let pos: number[] = [0, 0];
let steps = 0;

let youWinElement: HTMLElement = document.getElementById("you-win")!!;
let stepsElement: HTMLElement = document.getElementById("steps")!!;

function resetMap(input: string) {
  map = input
    .trim()
    .split("\n")
    .map((x: string) => {
      return x.split("");
    });

  winPositions = [];
  map.forEach((row, x) => {
    row.forEach((col, y) => {
      if (col == "@") {
        pos = [x, y];
      }
      if (col == "X") {
        winPositions.push([x, y]);
      }
    });
  });

  steps = 0;
  youWinElement.classList.remove("show");
  stepsElement.innerText = `steps: ${steps}`;
}

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
  switch (map[x][y]) {
    case "@":
      ans.push([pos[0], pos[1], map[x][y]]);
      findObject([x + dir[0], y + dir[1]], dir, visited).forEach((res) =>
        ans.push(res),
      );
      break;

    case "[":
      ans.push([pos[0], pos[1], map[x][y]]);
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
      ans.push([pos[0], pos[1], map[x][y]]);
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
    return map[pos[0] + dir[0]][pos[1] + dir[1]] != "#";
  });
}

function pushObject(obj: any[][], dir: number[]) {
  // Push to new positions
  obj
    .slice()
    .reverse()
    .forEach((pos) => {
      map[pos[0] + dir[0]][pos[1] + dir[1]] = pos[2];
    });

  // Cleanup old positions
  let newPositions = new Set();
  obj.forEach((pos) => {
    newPositions.add(JSON.stringify([pos[0] + dir[0], pos[1] + dir[1]]));
  });
  obj
    .filter((pos) => !newPositions.has(JSON.stringify([pos[0], pos[1]])))
    .forEach((pos) => {
      map[pos[0]][pos[1]] = " ";
    });
}

function movePlayer(dir: number[]) {
  let obj = findObject(pos, dir, new Set());
  if (checkMove(obj, dir)) {
    pushObject(obj, dir);
    map[pos[0]][pos[1]] = " ";
    pos = [pos[0] + dir[0], pos[1] + dir[1]];
    steps += 1;
    stepsElement.innerText = `steps: ${steps}`;
  }
}

let el: HTMLElement = document.getElementById("matrix")!!;
function render(): void {
  let filled = 0;

  winPositions.forEach(([x, y]) => {
    if (map[x][y] == " ") {
      map[x][y] = "X";
    } else if (map[x][y] != "X") {
      filled += 1;
    }
  });

  if (filled == winPositions.length) {
    youWinElement.innerText = `You win in ${steps} steps`;
    youWinElement.classList.add("show");
  }

  el.innerHTML = map
    .map((row) =>
      row
        .map((c) => {
          switch (c) {
            case " ":
              return "&nbsp";
            case "#":
              return '<span class="text-50">#</span>';
            case "@":
              return '<span class="text-player">@</span>';
            case "X":
              return '<span class="text-target">X</span>';
            default:
              return c;
          }
        })
        .join(""),
    )
    .join("<br/>");
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
  if (
    !["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "r"].includes(e.key)
  ) {
    return e;
  }

  if (e.key == "r") {
    resetMap(levels[currentLevel]);
    render();
    return;
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

let resetButton = document.getElementById("reset")!!;
resetButton.addEventListener("click", () => {
  resetMap(levels[currentLevel]);
  render();
});

resetMap(levels[currentLevel]);
render();
