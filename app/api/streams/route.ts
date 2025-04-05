import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string().url({message: "Should be valid url"}).refine((url) => { //added stricter schema for only youtube and spotify urls
        const domain = new URL(url).hostname;
        return domain.includes("youtube.com") ||
               domain.includes("youtu.be") ||
               domain.includes("spotify.com");
    })
})

export async function POST(req: NextRequest) {
    try {
        // add the rate limiting so that the single user does not flood the stream
        const data = CreateStreamSchema.parse(await req.json()); //error thrown as the data comes in

    } catch(e) {
        return NextResponse.json ({
            message: "Error while adding a stream"
        }, {
            status: 411
        })
    }
}