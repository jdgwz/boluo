import * as React from 'react';
import { Preview } from '../../api/events';
import { chatItemContainer } from '../atoms/ChatItemContainer';
import ChatItemTime from '../../components/atoms/ChatItemTime';
import ChatItemName from '../../components/atoms/ChatItemName';
import { previewStyle } from '../../styles/atoms';
import ChatItemContent from '../../components/molecules/ChatItemContent';
import { ChatItemContentContainer } from '../atoms/ChatItemContentContainer';

interface Props {
  preview: Preview;
}

function ChatPreviewItem({ preview }: Props) {
  let { text, isAction } = preview;

  if (text === '') {
    return null;
  }
  if (text === null) {
    text = '输入中…';
    isAction = true;
  }

  const name = (
    <ChatItemName action={isAction} master={preview.isMaster} name={preview.name} userId={preview.senderId} />
  );

  return (
    <div css={[chatItemContainer, previewStyle]}>
      <ChatItemTime timestamp={preview.start} />
      {!isAction && name}
      <ChatItemContentContainer data-action={isAction} data-in-game={preview.inGame}>
        {isAction && name}
        <ChatItemContent entities={preview.entities} text={text} />
      </ChatItemContentContainer>
    </div>
  );
}

export default React.memo(ChatPreviewItem);
