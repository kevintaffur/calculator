const buttons = document.querySelectorAll(".btn");
const display = document.querySelector(".display");
const keys = "1234567890+-*/.=<-";
let numberOfPoints = 0;
const pointButton = document.querySelector(".point");
let isOnSecondNumber = false;
let alreadyHaveAPoint = false;

const ZERO_DIVISION = "Zero Division";

buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    checkWhatToDo(e.target.innerText);
  });
});

document.addEventListener("keydown", (e) => {
  let pressedKey = e.key;
  if (pressedKey === "Enter") {
    pressedKey = "=";
  }
  if (pressedKey === "Backspace") {
    pressedKey = "<-";
  }
  if (keys.includes(pressedKey)) {
    checkWhatToDo(pressedKey);
  }
});

const checkWhatToDo = (pressedButton) => {
  if (display.textContent === "0" && pressedButton !== ".") {
    display.textContent = "";
  }
  // points control
  if (pressedButton === ".") {
    if (isOnSecondNumber && !alreadyHaveAPoint) {
      numberOfPoints = 0;
      alreadyHaveAPoint = true;
    }
    if (numberOfPoints === 1) {
      return;
    } else {
      numberOfPoints += 1;
    }
  }
  if ((display.textContent === "" && pressedButton === "=") ||
      (display.textContent === "" && pressedButton === "+") ||
      (display.textContent === "" && pressedButton === "/") ||
      (display.textContent === "" && pressedButton === "-") ||
      (display.textContent === "" && pressedButton === "*") ||
      (display.textContent === "" && pressedButton === "<-") ||
      (display.textContent === "" && pressedButton === "+/-") ||
      (display.textContent === ZERO_DIVISION && pressedButton === "=") ||
      (display.textContent === ZERO_DIVISION && pressedButton === "+") ||
      (display.textContent === ZERO_DIVISION && pressedButton === "/") ||
      (display.textContent === ZERO_DIVISION && pressedButton === "-") ||
      (display.textContent === ZERO_DIVISION && pressedButton === "*") ||
      (display.textContent === ZERO_DIVISION && pressedButton === "<-") ||
      (display.textContent === ZERO_DIVISION && pressedButton === "+/-"))  {
    display.textContent = "0";
  } else if (pressedButton === "Clear") {
    display.textContent = 0;
    numberOfPoints = 0;
    isOnSecondNumber = false;
    alreadyHaveAPoint = false;
  } else if (pressedButton === "<-") {
    const oldContent = display.textContent;
    if (oldContent.length === 1) {
      display.textContent = "0";
    } else {
      if (oldContent.slice(-1) === ".") {
        numberOfPoints -= 1;
      }
      display.textContent = oldContent.substring(0, oldContent.length - 1);
    }
  } else if (pressedButton === "+/-") {
    let lastNumberStr = display.textContent.slice(-1);
    const beforeNumber = display.textContent.slice(-2, -1);
    const displayContent = display.textContent;
    let lastNumber = 0;

    if (beforeNumber === "-") {
      lastNumberStr = "-" + lastNumberStr;
      lastNumber = parseFloat(lastNumberStr * -1);
      display.textContent = displayContent.substring(0, displayContent.length - 2) + lastNumber;
    } else {
      lastNumber = parseFloat(lastNumberStr * -1);
      display.textContent = displayContent.substring(0, displayContent.length - 1) + lastNumber;
    }
  } else {
    if (pressedButton !== "=") {
      if (display.textContent === ZERO_DIVISION) {
        display.textContent = pressedButton;
      } else {
        display.textContent += pressedButton;
      }
    }

    let [number1, operator, number2] = getValuesFromDisplay();

    // when operator value is available means it's already on the second number
    // so another point can be added
    if (operator) {
      isOnSecondNumber = true;
    }

    // calculate if another operation sign is pressed after 2 numbers and operator
    if (number1 !== undefined && number2 !== undefined && operator !== undefined) {
      if (pressedButton === "+" || pressedButton === "-" ||
          pressedButton === "/" || pressedButton === "*") {
        doMath(number1, number2, operator);
        isOnSecondNumber = false;
        alreadyHaveAPoint = false;
        numberOfPoints = 0;
        if (display.textContent !== ZERO_DIVISION) {
          display.textContent += pressedButton;
        }
      }
    }

    // calculate the thing
    if (pressedButton === "=") {
      isOnSecondNumber = false;
      alreadyHaveAPoint = false;
      numberOfPoints = 0;
      doMath(number1, number2, operator);
    }
  }
}

const doMath = (n1, n2, op) => {
  number1 = parseFloat(n1);
  number2 = parseFloat(n2);
  display.textContent = operate(number1, number2, op);
}

const getValuesFromDisplay = () => {
  const displayContent = display.textContent;
  const result = [];
  // all possible operations for the calculator
  const operators = ["+", "-", "*", "/"];
  
  // find the operator and save it
  for (const operator of operators) {
    const regex = createRegex(operator);
    const match = displayContent.match(regex);
    // result: index 1 = operator, index 0 = number 1, and index 2 = number 2
    if (match) {
      result[1] = match[2]; // values from regex are in format totalString, n1, op, n2
      result[0] = match[1];
      result[2] = match[3];
    }
  }
  return result;
}

// with this I can get the numbers and operator from display text
const createRegex = (operator) => {
  // escape + - / * to work properly
  const escapedOperator = operator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // number operator number. Number can be decimal, negative or both
  const pattern = `(-?\\d*.?\\d+)(${escapedOperator})(-?\\d*.?\\d+)`;
  return new RegExp(pattern);
}

const operate = (number1, number2, operator) => {
  switch (operator) {
    case "+":
      return add(number1, number2);     
    case "-":
      return substract(number1, number2);     
    case "*":
      return multiply(number1, number2);     
    case "/":
      return divide(number1, number2);     
    default:
      break;
  }
}

const add = (number1, number2) => {
  const result = number1 + number2;
  if (result % 1 !== 0) {
    return result.toFixed(1);
  }
  return result;
}

const substract = (number1, number2) => {
  const result = number1 - number2;
  if (result % 1 !== 0) {
    return result.toFixed(1);
  }
  return result;
}

const multiply = (number1, number2) => {
  const result = number1 * number2;
  if (result % 1 !== 0) {
    return result.toFixed(1);
  }
  return result;
}

const divide = (number1, number2) => {
  if (number2 === 0) {
    return ZERO_DIVISION;
  }
  const result = number1 / number2;
  if (result !== 1) {
    return result.toFixed(1);
  }
  return result;
}
