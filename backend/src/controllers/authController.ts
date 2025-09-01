import { Context } from "hono";
import { SigninInput, SignupInput } from "../validators/schemas";
import { Env, Variables, SignupResponse, SigninResponse } from "../types";
import { PrismaClientType } from "../service/prismaService";
import {
  generateToken,
  hashPassword,
  verifyPassword,
} from "../service/authService";

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

export async function signin(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: SigninInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      return c.json({ message: "User not found." }, 401);
    }

    const isValidPassword = await verifyPassword(input.password, user.password);

    if (!isValidPassword) {
      return c.json({ message: "Invalid email or password." }, 401);
    }

    const token = await generateToken(user.id, c.env.JWT_SECRET);

    const response: SigninResponse = {
      message: "User signed in successfully",
      name: user.name,
      token: token,
    };

    return c.json(response, 200);
  } catch (error) {
    console.error("Signin error:", error);
    return c.json({ message: "Error signing in user." }, 500);
  }
}
