// app/api/waitlist/route.js
import { NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import dbConnect from '@/app/lib/dbconnect';

// Define schema for waitlist submissions
const waitlistSchema = new mongoose.Schema({
    twitterHandle: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Get the waitlist model (or create it if it doesn't exist)
function getWaitlistModel() {
    return mongoose.models.Waitlist || mongoose.model('Waitlist', waitlistSchema);
}

// Validation schema with zod
const submissionSchema = z.object({
    twitterHandle: z.string().min(1, "Twitter handle is required"),
    email: z.string().email("Invalid email format").optional().nullable(),
});

export async function POST(request) {
    try {
        // Validate input
        const body = await request.json();
        const { twitterHandle, email } = submissionSchema.parse(body);

        // Connect to database
        await dbConnect();
        const WaitlistModel = getWaitlistModel();

        // Check if user already exists (by Twitter handle)
        const existingUser = await WaitlistModel.findOne({ twitterHandle: twitterHandle.toLowerCase() });

        if (!existingUser) {
            // Create new waitlist entry
            const waitlistEntry = new WaitlistModel({
                twitterHandle: twitterHandle.toLowerCase(),
                email: email || null,
            });

            await waitlistEntry.save();
        }

        // Always return success, whether it's a new or existing user
        return NextResponse.json({
            success: true,
            message: "Successfully joined the waitlist!"
        });

    } catch (error) {
        console.error("Waitlist API error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                message: "Invalid submission data",
                details: error.errors
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: "Failed to join waitlist"
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const WaitlistModel = getWaitlistModel();

        const count = await WaitlistModel.countDocuments();

        return NextResponse.json({
            success: true,
            count
        });

    } catch (error) {
        console.error("Waitlist count error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to retrieve waitlist count"
        }, { status: 500 });
    }
}