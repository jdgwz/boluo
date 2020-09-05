import * as React from 'react';
import { ComposeDispatch, update } from './compose/reducer';

let submitKeyHandle: number | undefined = undefined;

const submitKey = (callback: () => void) => {
  window.clearTimeout(submitKeyHandle);
  submitKeyHandle = window.setTimeout(callback, 200);
};

export const handleKeyDown = (
  composeDispatch: ComposeDispatch,
  onSend: () => void,
  inGame: boolean
): React.KeyboardEventHandler => {
  return (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      submitKey(async () => await onSend());
    } else if (e.key === 'Alt') {
      e.preventDefault();
      submitKey(() => composeDispatch(update({ inGame: !inGame })));
    }
  };
};
