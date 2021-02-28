import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { AppError } from "../../../shared/errors/AppError";
import { SurveysRepository } from "../../survey/repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../../user/repositories/UsersRepository";
import EtheralMailService from "../../../shared/providers/MailProvider/implementations/EtherealMailService";

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});

        const from = "NPS <noreply@nps.com.br>";

        if(!user) {
            throw new AppError("User does not exists.");
        }

        console.log({email, survey_id});
        const survey = await surveysRepository.findOne({id: survey_id});

        if(!survey) {
            throw new AppError("Survey does not exists.");
        }

        const npsPath = resolve(__dirname, "..", "..", "..", "shared", "providers", "MailProvider", "views", "emails" ,"npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"],
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id;
            await EtheralMailService.execute(email, from, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id,
        });        

        await surveysUsersRepository.save(surveyUser); 

        variables.id = surveyUserAlreadyExists.id;

        await EtheralMailService.execute(email, from, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController };