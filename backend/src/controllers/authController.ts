import { Context } from "hono";
import { SignupInput } from "../validators/schemas";
import { Env, Variables, SignupResponse } from "../types";
import { PrismaClientType } from "../service/prismaService";
import { generateToken, hashPassword } from "../service/authService";

export async function signup(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: SignupInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return c.json({ message: "User already exists." }, 400);
    }

    const passwordHash = await hashPassword(input.password);

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: passwordHash,
        },
      });

      return newUser;
    });

    const token = await generateToken(result.id, c.env.JWT_SECRET);

    const response: SignupResponse = {
      message: "User created successfully",
      token: token,
    };
    return c.json(response, 201);
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ message: "Error creating user." }, 500);
  }
}
