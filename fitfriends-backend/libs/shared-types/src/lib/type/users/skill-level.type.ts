import { SkillLevelEnum } from "@fitfriends-backend/shared-types";


export type SkillLevelType = typeof SkillLevelEnum[keyof typeof SkillLevelEnum];
