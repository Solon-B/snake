import React from 'react';

import { Players } from './players';
import { SnakeGame } from './snakeGame';

export function Play_medium(props) {
  return (
    <main className='bg-secondary'>
      <Players userName={props.userName} />
      <SnakeGame userName={props.userName} />
    </main>
  );
}
