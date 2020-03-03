import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMy } from './App';
import { useFetchResult } from '../hooks';
import { get } from '../api/request';
import { Channel } from '../api/channels';
import { JoinChannelButton } from './JoinChannelButton';
import { JoinSpaceButton } from './JoinSpaceButton';
import { CreateChannel } from './CreateChannel';

interface Params {
  id: string;
}

const ChannelItem: React.FC<{ channel: Channel; isSpaceMember: boolean }> = ({ channel, isSpaceMember }) => {
  return (
    <li className="group inline-block w-32 border rounded shadow p-4 mb-3 mr-4">
      <div className="mb-2">
        <Link className="link" to={`/channel/${channel.id}`}>
          {channel.name}
        </Link>
      </div>
      {isSpaceMember && (
        <div className="opacity-0 group-hover:opacity-100 text-right">
          <JoinChannelButton className="text-xs rounded py-1 px-1" channel={channel} />
        </div>
      )}
    </li>
  );
};

export const SpacePage: React.FC = () => {
  const { id } = useParams<Params>();
  const my = useMy();
  const member = my === 'GUEST' ? undefined : my.spaces.get(id)?.member;
  const isMember = Boolean(member);
  const [spaceWithRelated, refetch] = useFetchResult(() => get('/spaces/query_with_related', { id }), [id]);
  if (spaceWithRelated.isErr) {
    return <div>{spaceWithRelated.value}</div>;
  }
  const { space, channels } = spaceWithRelated.value;
  const channelList = channels.map(channel => (
    <ChannelItem key={channel.id} channel={channel} isSpaceMember={isMember} />
  ));
  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl">
          <Link to={`/space/${id}`}>{space.name}</Link> <JoinSpaceButton space={space} className="text-sm" />
        </h1>
        <div>{space.description}</div>
      </div>
      <div className="my-4">
        <h2 className="text-lg mb-2">频道</h2>
        <CreateChannel spaceId={space.id} onCreated={refetch} />
        <ul className="block">{channelList}</ul>
      </div>
    </div>
  );
};