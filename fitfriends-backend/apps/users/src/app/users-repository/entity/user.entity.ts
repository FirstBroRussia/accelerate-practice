import { Document } from "mongoose";

import { BackgroundImageForUsercardType, GenderType, LocationMetroType, UserInterface, UserRoleInfoType, UserRoleType, } from '@fitfriends-backend/shared-types';
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { createPasswordHash } from "@fitfriends-backend/core";
import { CreateUserDto } from "../dto/create-user.dto";


const BCRYPT_SALT_ROUNDS = 10;


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseUser extends Document { }

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserEntity implements UserInterface {
  @Prop({
    required: true,
    trim: true,
  })
  public name: string;

  @Prop({
    required: true,
    trim: true,
  })
  public email: string;

  @Prop({
    trim: true,
  })
  public avatar: string;

  @Prop({
    required: true,
    trim: true,
  })
  passwordHash: string;

  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  gender?: GenderType;

  @Prop({
    trim: true,
  })
  dateOfBirth?: string;

  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  role?: UserRoleType;

  @Prop({
    required: true,
    trim: true,
  })
  description?: string;

  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  location?: LocationMetroType;

  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  imageForSite?: BackgroundImageForUsercardType;

  @Prop({
    required: true,
    default: {},
    type: 'Mixed'
  })
  roleInfo: UserRoleInfoType;


  public async fillObject(dto: CreateUserDto): Promise<this> {
    const { name, email, password, gender, role, dateOfBirth, description, location, avatar, imageForSite } = dto;

    this.name = name;
    this.email = email;
    this.passwordHash = await createPasswordHash(password, BCRYPT_SALT_ROUNDS);
    this.gender = gender;
    this.role = role;
    this.dateOfBirth = dateOfBirth;
    this.description = description;
    this.location = location;
    this.avatar = avatar;
    this.imageForSite = imageForSite;


    return this;
  }

}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);
