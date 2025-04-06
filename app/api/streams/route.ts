import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";
import { YT_REGEX, SPOTIFY_REGEX } from "@/app/lib/utils";

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST(req: NextRequest) {
    try {
        // add the rate limiting so that the single user does not flood the stream
        const data = CreateStreamSchema.parse(await req.json()); //error thrown as the data comes in
        const isYt = YT_REGEX.test(data.url);
        const isSpotify = SPOTIFY_REGEX.test(data.url)

        if(!isYt && !isSpotify) {
            return NextResponse.json ({
                message: "Wrong URL"
            }, {
                status: 411
            })
        }

        // Determine type based on URL
        const type = isYt ? "Youtube" : "Spotify";
        
        // Extract ID differently based on URL type
        let extractedId;
        if (isYt) {
            // For YouTube
            extractedId = data.url.split("?v=")[1];
        } else {
            // For Spotify
            const match = data.url.match(SPOTIFY_REGEX);
            extractedId = match ? match[2] : null;
        }

        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId: extractedId ?? "",
                type  // This will be either "Youtube" or "Spotify"
            }
        })

        return NextResponse.json({
            message: "Added Stream",
            id: stream.id,
            type
        })
    } catch(e) {
        return NextResponse.json ({
            message: "Error while adding a stream"
        }, {
            status: 411
        })
    }
}