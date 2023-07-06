import { CreateNotifyForNotifyMicroservice } from '@fitfriends-backend/shared-types';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

import * as ejs from 'ejs';
import { resolve } from 'path';


@Injectable()
export class NodemailerService {
  private readonly logger = new Logger(NodemailerService.name);

  constructor (
    private readonly mailerService: MailerService,
  ) { }


  public async sendNotifyAddFriend(dto: CreateNotifyForNotifyMicroservice): Promise<void> {
    const { userEmail } = dto;

    ejs.renderFile(resolve('apps', 'notify', 'src', 'assets', 'template', 'add-friend.ejs'), {}, (err, data) => {
      if (err) {
        throw err;
      } else {
        const options: ISendMailOptions = {
        to: userEmail,
        html: data
        };

        this.mailerService.sendMail(options);
        this.logger.log(`Произведена отправка email: ${userEmail} для уведомления о добавлении в друзья.`);

      }
    });

  }

  public async sendNotifyRequestTrainingToStudentUser(dto: CreateNotifyForNotifyMicroservice): Promise<void> {
    const { userEmail } = dto;

    ejs.renderFile(resolve('apps', 'notify', 'src', 'assets', 'template', 'request-training-to-student-user.ejs'), {}, (err, data) => {
      if (err) {
        throw err;
      } else {
        const options: ISendMailOptions = {
        to: userEmail,
        html: data
        };

        this.mailerService.sendMail(options);
        this.logger.log(`Произведена отправка email: ${userEmail} для уведомления о добавлении в друзья.`);

      }
    });

  }

  public async sendNotifyRequestCoachTraining(dto: CreateNotifyForNotifyMicroservice): Promise<void> {
    const { userEmail } = dto;

    ejs.renderFile(resolve('apps', 'notify', 'src', 'assets', 'template', 'request-coach-training.ejs'), {}, (err, data) => {
      if (err) {
        throw err;
      } else {
        const options: ISendMailOptions = {
        to: userEmail,
        html: data
        };

        this.mailerService.sendMail(options);
        this.logger.log(`Произведена отправка email: ${userEmail} для уведомления о добавлении в друзья.`);

      }
    });

  }

}
