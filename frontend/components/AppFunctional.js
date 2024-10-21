import React, { useState } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState(initialMessage);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setIndex(initialIndex);
    setSteps(initialSteps);
    setEmail(initialEmail);
    setMessage(initialMessage);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const x = index % 3;
    const y = Math.floor(index / 3);

    let newX = x;
    let newY = y;

    if (direction === 'left') newX = x > 0 ? x - 1 : x;
    if (direction === 'right') newX = x < 2 ? x + 1 : x;
    if (direction === 'up') newY = y > 0 ? y - 1 : y;
    if (direction === 'down') newY = y < 2 ? y + 1 : y;

    return newY * 3 + newX;
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);

    if (nextIndex === index) {
      if (direction === 'up') {
        setMessage("You can't go up");
      } else if (direction === 'down') {
        setMessage("You can't go down");
      } else if (direction === 'left') {
        setMessage("You can't go left");
      } else if (direction === 'right') {
        setMessage("You can't go right")
      }
    } else {
      setIndex(nextIndex);
      setSteps(steps + 1);
      setMessage('');
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  const onSubmit = async (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          steps: steps,
          x: getXY().x,
          y: getXY().y
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || 'Success!');
      } else {
        setMessage(result.message || 'Error occured');
      }
    } catch (error) {
      setMessage('An unexpected error occured.');
    }
  };


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
