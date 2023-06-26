import { CoachTrainingDurationEnum } from "../../enum/cabinet/coach-training-duration.enum";


export type CoachTrainingDurationType = typeof CoachTrainingDurationEnum[keyof typeof CoachTrainingDurationEnum];
