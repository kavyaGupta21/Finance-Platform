 
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma"; // adjust path if needed

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedUser) {
      return loggedUser;
    }

    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress || "",
      },
    });

    return newUser;
  } catch (error) {
    console.log("User creation error:", error);
    return null;
  }
};