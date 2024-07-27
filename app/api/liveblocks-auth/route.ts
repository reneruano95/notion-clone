import { redirect } from "next/navigation";

import { liveblocks } from "@/lib/liveblock";
import { getUser } from "@/lib/server-actions/auth-actions";
import { getUserDetails } from "@/lib/server-actions/user-actions";
import { getUserColor } from "@/lib/utils";

export async function POST(request: Request) {
  // Get the current user from your database
  //   const user = __getUserFromDB__(request);
  const { data: supabaseUser, error: supabaseUserError } = await getUser();

  const { data: userDetails, error: userDetailsError } = await getUserDetails(
    supabaseUser?.id as string
  );

  if (supabaseUserError || userDetailsError) {
    console.error(supabaseUserError, userDetailsError);
  }

  if (!supabaseUser) {
    return redirect("/sign-in");
  }

  const { id, full_name, email, avatar_url } = userDetails!;

  const user = {
    id,
    info: {
      id,
      name: full_name!,
      email: email!,
      avatar: avatar_url!,
      color: getUserColor(id),
    },
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email!,
      groupIds: [], // Optional
    },
    { userInfo: user.info }
  );

  return new Response(body, { status });
}
