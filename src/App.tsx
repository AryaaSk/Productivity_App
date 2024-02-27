import { GetState } from './state';
import { useState } from 'react';
import { Button } from './input';

//state
const state = GetState();













const APP = () => {
  let [count, SetCount] = useState(0);
  const handler = () => {
    SetCount(count + 1);
  }

  const Button2 = <Button count={count} handler={handler} />

  return (
    <div className="App">
      {state.username}
      <br />


      {Button2}
      {Button2}
      {Button2}
    </div>
  );
}

export default APP;
