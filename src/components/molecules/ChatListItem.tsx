import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from '../../store';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import ItemSwitch from './ItemSwitch';
import { css } from '@emotion/core';
import { black } from '../../styles/colors';
import ChatListItemPlaceholder from './ChatListItemPlaceholder';
import Prando from 'prando';

interface Props {
  itemIndex: number;
  observerRef?: React.RefObject<ResizeObserver>;
  provided?: DraggableProvided;
  float?: boolean;
  isDragging?: boolean;
}

const dragging = css`
  filter: brightness(200%);
  box-shadow: 1px 1px 2px ${black};
`;

const rng = new Prando();

function ChatListItem({ itemIndex, observerRef, provided, float = false, isDragging = false }: Props) {
  const item = useSelector((state) => state.chat!.itemSet.messages.get(itemIndex));
  const myMember = useSelector((state) => {
    if (state.profile === undefined || state.chat === undefined) {
      return undefined;
    } else {
      return state.profile.channels.get(state.chat!.channel.id)?.member;
    }
  });
  const myId = myMember?.userId;
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current && observerRef && observerRef.current) {
      const observer = observerRef.current;
      const container = containerRef.current;
      observer.observe(container, {});
      return () => observer.unobserve(container);
    }
  }, [containerRef.current, observerRef]);

  const [isRender, setRender] = useState(item === undefined || (item.type === 'PREVIEW' && item.mine));
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setRender(true);
    }, rng.nextInt(0, 200));
    return () => window.clearTimeout(timeout);
  }, []);
  if (!isRender) {
    return <ChatListItemPlaceholder />;
  }
  if (float) {
    return (
      <div ref={containerRef}>
        <ItemSwitch item={item} myMember={myMember} />
      </div>
    );
  }
  const isDraggable =
    isRender && item && item.type === 'MESSAGE' && myId !== undefined && (item.mine || myMember?.isMaster);
  const renderer = (provided: DraggableProvided) => {
    return (
      <div ref={provided.innerRef} {...provided.draggableProps}>
        <div ref={containerRef} data-index={itemIndex + 1} css={isDragging ? dragging : undefined}>
          <ItemSwitch myMember={myMember} item={item} handleProps={provided.dragHandleProps} />
        </div>
      </div>
    );
  };
  if (provided) {
    return renderer(provided);
  }
  const id = item?.id || myId || '';
  // https://github.com/atlassian/react-beautiful-dnd/issues/1767#issuecomment-670680418
  return (
    <Draggable key={id} draggableId={id} index={itemIndex} isDragDisabled={!isDraggable}>
      {renderer}
    </Draggable>
  );
}

export default ChatListItem;
