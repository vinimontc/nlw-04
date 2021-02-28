import { Router } from 'express';
import { AnswerController } from './modules/surveyUser/controllers/AnswerController';
import { NpsController } from './modules/surveyUser/controllers/NpsController';
import { SendMailController } from './modules/surveyUser/controllers/SendMailController';
import { SurveyController } from './modules/survey/controllers/SurveyController';
import { UserController } from './modules/user/controllers/UserController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post('/users', userController.create);

router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.show);

router.post('/sendMail', sendMailController.execute);

router.get('/answers/:value', answerController.execute);

router.get('/nps/:survey_id', npsController.execute);

export { router };
