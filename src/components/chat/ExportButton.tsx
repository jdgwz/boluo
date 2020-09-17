import * as React from 'react';
import { Id } from '../../utils/id';
import Button from '../atoms/Button';
import { useRef, useState } from 'react';
import { get } from '../../api/request';
import { useDispatch } from '../../store';
import { throwErr } from '../../utils/errors';
import { Message } from '../../api/messages';
import { ExportEntity } from '../../interpreter/entities';
import { evaluate, makeRng, nodeToText } from '../../interpreter/eval';

interface Props {
  channelId: Id;
  channelName: string;
  className?: string;
}

interface ExportMessage {
  id: Id;
  senderId: Id;
  name: string;
  mediaId: Id | null;
  inGame: boolean;
  isAction: boolean;
  isMaster: boolean;
  folded: boolean;
  created: number;
  modified: number;
  text: string;
  entities: ExportEntity[];
}

function exportMessage(message: Message): ExportMessage {
  const {
    id,
    senderId,
    name,
    mediaId,
    inGame,
    isAction,
    isMaster,
    folded,
    created,
    modified,
    text,
    entities,
    seed,
  } = message;
  const rng = makeRng(seed);
  const exportEntities: ExportEntity[] = !rng
    ? []
    : entities.map((entity) => {
        if (entity.type === 'Expr') {
          const { type, start, offset } = entity;
          const node = evaluate(entity.node, rng);
          return {
            type,
            start,
            offset,
            node,
            exprText: nodeToText(node),
            text: text.substr(start, offset).trimRight(),
          };
        } else {
          return { ...entity, text: text.substr(entity.start, entity.offset) };
        }
      });
  return {
    id,
    senderId,
    name,
    mediaId,
    inGame,
    isAction,
    isMaster,
    folded,
    created,
    modified,
    text,
    entities: exportEntities,
  };
}

function ExportButton({ channelId, channelName, className }: Props) {
  const [loading, setLoading] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const dispatch = useDispatch();
  const handleClick = async () => {
    setLoading(true);
    const result = await get('/channels/export', { id: channelId });
    if (!result.isOk) {
      throwErr(dispatch)(result.value);
      return;
    }
    const messages = result.value.map(exportMessage);
    const blob = new Blob([JSON.stringify(messages)], { type: 'text/json' });
    const href = URL.createObjectURL(blob);
    linkRef.current!.href = href;
    linkRef.current!.click();
    URL.revokeObjectURL(href);
    setLoading(false);
  };
  return (
    <React.Fragment>
      <Button className={className} disabled={loading} onClick={handleClick}>
        导出
      </Button>
      <a hidden href="#" ref={linkRef} download={`${channelName}.json`} />
    </React.Fragment>
  );
}

export default ExportButton;