const buttons = document.querySelectorAll(".btn");
const display = document.querySelector(".display");

buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    checkWhatToDo(e.target.innerText);
  });
});

const checkWhatToDo = (pressedButton) => {
  if (display.textContent === "0" && pressedButton !== ".") {
    display.textContent = "";
  }
  if (pressedButton === "Clear") {
    display.textContent = 0;
  } else {
    display.textContent += pressedButton;

    // calculate the thing
    if (pressedButton === "=") {
      let [number1, number2, operator] = getValuesFromDisplay();
      console.log(number1, number2, operator);
      if (number1 !== undefined && number2 !== undefined && operator !== undefined) {
        number1 = parseFloat(number1);
        number2 = parseFloat(number2);
        display.textContent = operate(number1, number2, operator);
      }
    }
  }
}

const getValuesFromDisplay = () => {
  const displayContent = display.textContent;
  const operator = getOperator(displayContent);
  const numbers = [];

  if(operator) {
    // regex thing, not sure how this works tbh
    // escape + - / * to work properly
    const escapedOperator = operator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // number operator number. Number can be decimal, negative or both
    const pattern = `(-?\\d?.?\\d+)${escapedOperator}(-?\\d?.?\\d+)`;
    const regex = new RegExp(pattern, "g");

    const matches = Array.from(displayContent.matchAll(regex));
    matches.forEach(match => {
      numbers.push(match[1]);
      numbers.push(match[2]);
    });
  }

  console.log(displayContent);
  console.log(typeof displayContent);
  console.log(displayContent.length);
  console.log(numbers);
  return [numbers[0], numbers[1], operator];
}

const getOperator = (displayContent) => {
  if (displayContent.includes("+")) {
    return "+";
  } else if (displayContent.includes("-")) {
    return "-";
  } else if (displayContent.includes("*")) {
    return "*";
  } else if (displayContent.includes("/")) {
    return "/";
  }
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
  return number1 + number2;
}
const substract = (number1, number2) => {
  return number1 - number2;
}
const multiply = (number1, number2) => {
  return number1 * number2;
}
const divide = (number1, number2) => {
  if (number2 === 0) {
    return "Zero division";
  }
  return number1 / number2;
}
