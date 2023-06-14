import { SkillLevelEnum } from "@fitfriends-backend-nx-monorepo/shared-types";


export type SkillLevelType = typeof SkillLevelEnum[keyof typeof SkillLevelEnum];
