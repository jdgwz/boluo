import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql';
import { Channel } from '../channels/channels.entity';
import { Entity as MessageEntity, MessageType, Metadata } from 'boluo-common';
import { Media } from '../media/media.entity';
import { Content } from './Content';
import { GraphQLJSONObject } from 'graphql-type-json';

registerEnumType(MessageType, { name: 'MessageType' });

@Entity('messages')
@ObjectType()
export class Message {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  id!: string;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.OOC })
  @Field(() => MessageType)
  type!: MessageType;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'senderId' })
  @Field(() => User, { nullable: true })
  sender!: Promise<User> | null;

  @Column({ type: 'uuid', nullable: true })
  @Field(() => ID, { nullable: true })
  senderId!: string | null;

  @ManyToOne(() => Channel, channel => channel.messages, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  @Field(() => Channel)
  channel!: Promise<Channel>;

  @Column({ type: 'uuid' })
  @Field(() => ID)
  channelId!: string;

  @Column()
  @Field()
  name!: string;

  @Column({ type: 'boolean', default: false })
  @Field({ description: 'Whether this message represents an action.' })
  isAction!: boolean;

  @Column({ type: 'boolean', default: false })
  @Field()
  isMaster!: boolean;

  @Column({ type: 'boolean', default: false })
  @Field()
  isPinned!: boolean;

  @Column({ type: 'boolean', default: false })
  @Field()
  isHidden!: boolean;

  @Column({ type: 'uuid', array: true, default: '{}' })
  @Field(() => [ID], { description: 'If the list is not empty, it represents this is a whisper message.' })
  whisperTo!: string[];

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'jsonb', default: [] })
  entities!: MessageEntity[];

  @Column({ type: 'jsonb', nullable: true })
  @Field(() => GraphQLJSONObject, { nullable: true })
  metadata!: Metadata | null;

  @ManyToOne(() => Media, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mediaId' })
  @Field(() => Media, { nullable: true })
  media!: Media;

  @Column({ type: 'uuid', nullable: true })
  @Field(() => ID, { nullable: true })
  mediaId!: string;

  @OneToMany(() => Message, message => message.parent)
  children!: Promise<Message[]>;

  @ManyToOne(() => Message, message => message.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parentId' })
  @Field(() => ID, { nullable: true })
  parent!: Promise<Message> | null;

  @Column({ type: 'uuid', nullable: true })
  @Field(() => ID, { nullable: true })
  parentId!: string | null;

  @Column({ type: 'boolean', default: false })
  @Field()
  crossOff!: boolean;

  @Column({ type: 'boolean', default: false })
  deleted!: boolean;

  @Column({ type: 'integer', default: 0 })
  seed!: number;

  @CreateDateColumn()
  @Field()
  created!: Date;

  @CreateDateColumn()
  @Field()
  orderDate!: Date;

  @Column({ type: 'integer', default: 0 })
  @Field(() => Int)
  orderOffset!: number;

  @UpdateDateColumn()
  @Field()
  modified!: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  editDate!: Date | null;

  isPublic() {
    return !this.isHidden && this.whisperTo.length === 0;
  }

  content() {
    return new Content(this.text, this.entities, this.seed);
  }
}
