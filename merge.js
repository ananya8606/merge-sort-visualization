const sideMargin = 80;
const topMargin = 20;
const input = document.getElementById("input-value");
const inputVisualizer = document.getElementById("input-visualizer");
var arr = [];
var x;

function handleAdd() {
  const value = input.value;
  const node = document.createElement("div");
  const textnode = document.createTextNode(value);
  node.appendChild(textnode);
  inputVisualizer.appendChild(node);
  arr.push(Number(value));
  x = displayArray(arr);
}

function displayArray(arr) {
  const arrayContainer = document.createElement("div");
  arrayContainer.classList.add("array-container");
  for (i in arr) {
    const node = document.createElement("div");
    const textnode = document.createTextNode(arr[i]);
    node.appendChild(textnode);
    node.classList.add("array-element");
    arrayContainer.appendChild(node);
  }
  arrayContainer.style.left =
    document.getElementsByTagName("section")[1].offsetWidth / 2 -
    arrayContainer.offsetWidth / 2 +
    "px";
  document.getElementsByTagName("section")[1].appendChild(arrayContainer);
  return arrayContainer;
}

function sort() {
  handleSort(x);
}

function handleReset() {
  const e=document.querySelectorAll("div.array-container");
  for(let i=0;i<e.length;i++)
  e[i].remove();
 inputVisualizer.innerHTML = "";
  arr = [];
}

function createSubArray(arr, from, to) {
  const arrayContainer = document.createElement("div");
  arrayContainer.classList.add("array-container");
  for (let i = from; i < to; i++) {
    const node = document.createElement("div");
    const textnode = document.createTextNode(arr.childNodes[i].innerText);
    node.appendChild(textnode);
    node.classList.add("array-element");
    arrayContainer.appendChild(node);
  }
  return arrayContainer;
}

function animateDivision(element, direction) {
  return new Promise((resolve) => {
    element.animate(
      {
        transform: [
          `translate(${direction}10px, ${
            -1 * element.offsetHeight - topMargin
          }px)`,
          "translate(0, 0)",
        ],
      },
    1000
    );
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function animateMerge(element, target) {
  return new Promise((resolve) => {
    element.animate(
      {
        transform: [
          "translate(0, 0)",
           `translate(
                    ${$(target).offset().left - $(element).offset().left}px,
                    ${$(target).offset().top - $(element).offset().top}px
                )`
        ],
      },
      1000
    );
    setTimeout(() => {
      target.innerHTML = element.innerHTML;
      target.style.backgroundColor = "#21db37";
      element.style.opacity=0;
      resolve();
    },1000);
  });
}

async function merge(arr1, arr2, target) {
  let i1 = 0,
    i2 = 0,
    i3 = 0;
  while (i1 < arr1.childNodes.length && i2 < arr2.childNodes.length) {
    let value1 = parseInt(arr1.childNodes[i1].innerText);
    let value2 = parseInt(arr2.childNodes[i2].innerText);
    if (value1 < value2) {
      await animateMerge(arr1.childNodes[i1++], target.childNodes[i3++]);
    } else await animateMerge(arr2.childNodes[i2++], target.childNodes[i3++]);
  }
  while (i1 < arr1.childNodes.length)
    await animateMerge(arr1.childNodes[i1++], target.childNodes[i3++]);
  while (i2 < arr2.childNodes.length)
    await animateMerge(arr2.childNodes[i2++], target.childNodes[i3++]);
}

async function handleSort(arr4) {
  if (arr4.childNodes.length <= 1) return;
  let middle = Math.floor(arr4.childNodes.length / 2);
  let half1 = createSubArray(arr4, 0, middle);
  let half2 = createSubArray(arr4, middle, arr4.childNodes.length);
  document.getElementsByTagName("section")[1].appendChild(half1);
  half1.style.left = `${arr4.offsetLeft - sideMargin}px`;
  half1.style.top = `${arr4.offsetTop + arr4.offsetHeight + topMargin}px`;
  await animateDivision(half1, "+", sideMargin);
  document.getElementsByTagName("section")[1].appendChild(half2);
  half2.style.left = `${ half1.offsetLeft + half1.offsetWidth + sideMargin * 2 }px`;
  half2.style.top = `${half1.offsetTop}px`;
  await animateDivision(half2, "-", sideMargin);
  await handleSort(half1);
  await handleSort(half2);
  await merge(half1, half2, arr4);
}
