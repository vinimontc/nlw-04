import { AppError } from '../../../shared/errors/AppError';
import { getCustomRepository } from 'typeorm';

import { User } from '../models/User';
import { UsersRepository } from '../repositories/UsersRepository';

interface IRequest {
  name: string;
  email: string;
}

class CreateUserService {
  public async execute({ name, email }: IRequest): Promise<User> {
    const usersRepository = await getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
        email
    });

    if (userAlreadyExists) {
        throw new AppError("User already exists");
    }

    const user = await usersRepository.create({
        name,
        email
    })

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
