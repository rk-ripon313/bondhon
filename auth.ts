import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { dbConnect } from "./lib/db/db-connect";
import { User } from "./models/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials;
        if (!email || !password) return null;

        await dbConnect();

        const user = await User.findOne({ email }).select("+password");

        if (!user) throw new Error("Invalid Email User Not Found");

        const isMatch = await bcrypt.compare(password as string, user.password);
        if (!isMatch) throw new Error("Invalid Password");
        return user;
      },
    }),
  ],
});
