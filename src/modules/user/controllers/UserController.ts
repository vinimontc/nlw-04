import { Request, Response } from 'express';
import * as yup from 'yup';
import { AppError } from '../../../shared/errors/AppError';

import CreateUserService from '../services/CreateUserService';

class UserController {
    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        });

        try {
            await schema.validate(request.body, {abortEarly: false});
        } catch(err) {
            throw new AppError(err);
        }

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({ name,  email });

        return response.status(201).json(user);
    }

}

export { UserController };
