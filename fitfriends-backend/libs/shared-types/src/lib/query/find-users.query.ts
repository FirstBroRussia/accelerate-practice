import { AscDescSortType, LocationMetroType, SkillLevelType, TrainingType, UserRoleType } from "@fitfriends-backend/shared-types";


export class FindUsersQuery {
  role?: UserRoleType;

  location?: LocationMetroType;

  trainingType?: TrainingType[];

  skillLevel?: SkillLevelType;

  page?: number;

  sort?: AscDescSortType;
}
