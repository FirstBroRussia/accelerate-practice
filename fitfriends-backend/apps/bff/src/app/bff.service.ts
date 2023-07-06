import { Injectable, Logger } from '@nestjs/common';

import { CoachCreateUserDto, GenderType, LocationMetroType, SkillLevelType, TrainingType, UserRoleType, UsersMicroserviceConstants } from '@fitfriends-backend/shared-types';
import { getRandomItems, getRandomValue } from '@fitfriends-backend/core';
import { mockAvatar, mockAwardsToCoach, mockCertificates, mockCoachEmail, mockDateOfBirthArray, mockDescription, mockGenderArray, mockImageForSite, mockLocationArray, mockPassword, mockRoleArray, mockSkillLevelArray, mockTrainingIsReadyArray, mockTrainingTypeArray, mockUsernameArray } from '../assets/mock-data/mock-data';


@Injectable()
export class BffService {
  private readonly logger = new Logger(BffService.name);


  public async generateAdminCoachData() {
    const coachUser: CoachCreateUserDto = {
      name: getRandomValue(mockUsernameArray),
      email: mockCoachEmail,
      password: mockPassword,
      avatar: mockAvatar,
      gender: getRandomValue(mockGenderArray) as GenderType,
      role: getRandomValue(mockRoleArray) as UserRoleType,
      description: mockDescription,
      trainingType: getRandomItems(Array.from({ length: UsersMicroserviceConstants.TRAINING_TYPE_MAX_COUNT }, (_) => getRandomValue(mockTrainingTypeArray))) as TrainingType[],
      location: getRandomValue(mockLocationArray) as LocationMetroType,
      dateOfBirth: getRandomValue(mockDateOfBirthArray),
      imageForSite: mockImageForSite,
      skillLevel: getRandomValue(mockSkillLevelArray) as SkillLevelType,
      awardsToCoach: mockAwardsToCoach,
      certificates: mockCertificates,
      personalTraining: getRandomValue(mockTrainingIsReadyArray),
    };

    return coachUser;
  }
}
