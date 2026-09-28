 
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma"; // adjust path if needed

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Authenticated Clerk user has no email address");
  }

  return db.user.upsert({
    where: {
      clerkUserId: user.id,
    },
    update: {
      name,
      imageUrl: user.imageUrl,
      email,
    },
    create: {
      clerkUserId: user.id,
      name,
      imageUrl: user.imageUrl,
      email,
    },
  });
};