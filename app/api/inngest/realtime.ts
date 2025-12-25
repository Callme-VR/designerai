
"use server";

import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";



export async function fetchRealtimeSubscriptionToken() {
     const session = await getKindeServerSession();
     const user = await session.getUser();

     const token = getSubscriptionToken(inngest, {
          channel: `user:${user.id}`,
          topics: [
               "generation.start",
               "analysis.start",
               "analysis.complete",
               "frame.created",
               "generation.complete"
          ]
     })
     return token;




}

