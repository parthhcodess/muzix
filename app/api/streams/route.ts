import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";
import { YT_REGEX, SPOTIFY_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
// @ts-expect-error - youtube types not available
import youtubesearchapi from "youtube-search-api";
import fetch from "cross-fetch";
// @ts-expect-error - spotify types not available
import spotifyUrlInfo from 'spotify-url-info';
const { getData, getPreview } = spotifyUrlInfo(fetch);

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        
        // Check if user is authenticated
        if (!session?.user?.email) {
            return NextResponse.json({
                message: "Unauthenticated"
            }, {
                status: 403
            });
        }

        // Look up the user by email to get their ID
        const user = await prismaClient.user.findFirst({
            where: {
                email: session.user.email
            }
        });

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, {
                status: 404
            });
        }

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
            // For YouTube - handle multiple URL formats
            if (data.url.includes("youtube.com/watch?v=")) {
                extractedId = data.url.split("?v=")[1]?.split("&")[0];
            } else if (data.url.includes("youtu.be/")) {
                extractedId = data.url.split("youtu.be/")[1]?.split("?")[0];
            } else if (data.url.includes("youtube.com/embed/")) {
                extractedId = data.url.split("embed/")[1]?.split("?")[0];
            }
        } else {
            // For Spotify
            const match = data.url.match(SPOTIFY_REGEX);
            extractedId = match ? match[2] : null;
        }

        let title = "Cannot Find the video";
        let smallImg = "https://imgs.search.brave.com/K5qJGu4_wEW_TR8ENuFUwJceG8oRdtbhLO8qaagmbXw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9qb2xs/eWNvbnRyYXJpYW4u/Y29tL2ltYWdlcy82/LzZjL1JpY2tyb2xs/LmpwZz8yMDE3MDQw/MzE2MjMzNg";
        let bigImg = smallImg;

        // Get metadata for YouTube videos only
        if (isYt && extractedId) {
            try {
                console.log("Fetching YouTube details for ID:", extractedId);
                const res = await youtubesearchapi.GetVideoDetails(extractedId);
                console.log("YouTube API response:", res);
                
                // Process YouTube metadata
                title = res.title ?? "Can't Find Video";
                
                if (res.thumbnail && res.thumbnail.thumbnails) {
                    const thumbnails = res.thumbnail.thumbnails;
                    console.log("Available thumbnails:", thumbnails);
                    thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1);
                    
                    smallImg = (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url);
                    bigImg = thumbnails[thumbnails.length - 1].url;
                    console.log("Selected thumbnail URLs - small:", smallImg, "big:", bigImg);
                } else {
                    // Fallback to direct YouTube thumbnail URL
                    smallImg = `https://img.youtube.com/vi/${extractedId}/mqdefault.jpg`;
                    bigImg = `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`;
                    console.log("Using fallback YouTube thumbnails:", smallImg);
                }
            } catch (ytError) {
                console.error("Error fetching YouTube details:", ytError);
                // Use direct YouTube thumbnail URLs as fallback
                smallImg = `https://img.youtube.com/vi/${extractedId}/mqdefault.jpg`;
                bigImg = `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`;
                console.log("YouTube API failed, using direct thumbnail URLs:", smallImg);
            }
        }

        else if (isSpotify && extractedId) {
            try {
                const spotifyData = await getPreview(data.url);
                
                if (spotifyData.title) {
                    title = spotifyData.title;
                    
                    if (spotifyData.artist) {
                        title = `${title} - ${spotifyData.artist}`;
                    }
                }
                
                if (spotifyData.image) {
                    smallImg = spotifyData.image;
                    bigImg = spotifyData.image;
                } 
                
                try {
                    const detailedData = await getData(data.url);
                    
                    if (detailedData.type === 'track' && detailedData.album && detailedData.album.images) {
                        const images = detailedData.album.images;
                        if (images.length > 0) {
                            images.sort((a: {width: number}, b: {width: number}) => b.width - a.width);
                            
                            bigImg = images[0].url;
                            
                            smallImg = images.length > 1 ? images[images.length - 1].url : images[0].url;
                        }
                    } else if (detailedData.images && detailedData.images.length > 0) {
                        const images = detailedData.images;
                        
                        images.sort((a: {width: number}, b: {width: number}) => b.width - a.width);
                        
                        bigImg = images[0].url;
                        
                        smallImg = images.length > 1 ? images[images.length - 1].url : images[0].url;
                    }
                } catch (detailError) {
                    console.error("Error fetching detailed Spotify data:", detailError);
                }
                
            } catch (spotifyError) {
                console.error("Error fetching Spotify metadata:", spotifyError);
                title = "Cannot find the song";
                smallImg = "https://imgs.search.brave.com/K5qJGu4_wEW_TR8ENuFUwJceG8oRdtbhLO8qaagmbXw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9qb2xs/eWNvbnRyYXJpYW4u/Y29tL2ltYWdlcy82/LzZjL1JpY2tyb2xs/LmpwZz8yMDE3MDQw/MzE2MjMzNg";
                bigImg = smallImg;
            }
        }

        const stream = await prismaClient.stream.create({
            data: {
                userId: user.id, // Use the actual user ID from the database
                url: data.url,
                extractedId: extractedId ?? "",
                type,
                title,
                smallImg,
                bigImg
            }
        })

        return NextResponse.json({
            message: "Added Stream",
            id: stream.id,
            title: stream.title,
            smallImg: stream.smallImg,
            type
        })
    } catch(e) {
        console.log(e)
        return NextResponse.json ({
            message: "Error while adding a stream"
        }, {
            status: 411
        })
    }
}

export async function GET(req: NextRequest){
    try {
        const creatorId = req.nextUrl.searchParams.get('creatorId')
        const session = await getServerSession();
        
        let streams;
        
        if (creatorId) {
            // Find streams by creator email
            const creator = await prismaClient.user.findFirst({
                where: {
                    email: creatorId
                }
            });
            
            if (!creator) {
                return NextResponse.json([]);
            }
            
            streams = await prismaClient.stream.findMany({
                where: {
                    userId: creator.id
                },
                include: {
                    _count: {
                        select: {
                            upvotes: true
                        }
                    },
                    upvotes: session?.user?.email ? {
                        where: {
                            userId: session.user.email
                        }
                    } : false
                }
            });
        } else {
            // Get all streams if no creatorId specified
            streams = await prismaClient.stream.findMany({
                include: {
                    _count: {
                        select: {
                            upvotes: true
                        }
                    },
                    upvotes: session?.user?.email ? {
                        where: {
                            userId: session.user.email
                        }
                    } : false
                }
            });
        }
        
        // Format the response to match the expected structure
        const formattedStreams = streams.map(stream => ({
            id: stream.id,
            title: stream.title,
            smallImg: stream.smallImg,
            bigImg: stream.bigImg,
            url: stream.url,
            extractedId: stream.extractedId,
            type: stream.type.toLowerCase(),
            upvotes: stream._count.upvotes,
            haveUpvoted: stream.upvotes && stream.upvotes.length > 0,
            creatorId: creatorId || stream.userId
        }));
        
        return NextResponse.json(formattedStreams);
    } catch (error) {
        console.error('Error fetching streams:', error);
        return NextResponse.json({
            message: "Error fetching streams"
        }, {
            status: 500
        });
    }
}