import prisma from "../../config/prismaConfig";
import { CreateUserType } from "../../types/dbEssentialTypes";
const createUser = async (user: CreateUserType) => {
  const newUser = await prisma.user.create({
    data: user,
  });
  return newUser;
};

export { createUser };
