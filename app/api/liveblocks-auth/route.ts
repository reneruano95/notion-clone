import { redirect } from "next/navigation";

import { liveblocks } from "@/lib/liveblock";
import { getUser } from "@/lib/server-actions/auth-actions";
import { getUserDetails } from "@/lib/server-actions/user-actions";
import { getUserColor } from "@/lib/utils";

export async function POST(request: Request) {
  // Get the current user from your database
  const { data: supabaseUser, error: supabaseUserError } = await getUser();
  if (!supabaseUser) {
    return redirect("/sign-in");
  }
  const { data: userDetails, error: userDetailsError } = await getUserDetails(
    supabaseUser?.id
  );

  if (supabaseUserError || userDetailsError) {
    console.error(supabaseUserError, userDetailsError);
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
