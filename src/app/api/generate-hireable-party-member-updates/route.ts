import { createJsonTranslator, createOpenAILanguageModel } from "typechat";
import path from "path";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { createTypeScriptJsonValidator } from "typechat/ts";
import { HireablePartyMembers } from "@/schema";

interface GeneratePartyMembersRequest {
    dungeonDescription: string;
    totalBudget: number;
    currentPartyMembers: HireablePartyMembers[]
}

export async function POST(req: NextRequest) {

    if (!req.body) {
        return new NextResponse("BAD RESPONSE", { status: 400 })
    }

    const requestData = await req.json() as GeneratePartyMembersRequest;
    console.log('received requestData', requestData)

    const model = createOpenAILanguageModel('REPLACE THIS!!!', 'gpt-4o');
    const schema = fs.readFileSync(path.join(__dirname, "../../../../../src/schema.ts"), "utf8");
    const validator = createTypeScriptJsonValidator<HireablePartyMembers>(schema, "HireablePartyMembers");
    const translator = createJsonTranslator(model, validator);
    const prompt = `You are a DnD dungeon master. The games dungeon has the following description "${requestData.dungeonDescription}". Additionally, there is gold that the players can spend to purchase adventurers for their journey.
    The players have a total of ${requestData.totalBudget} gold. 
    The game currently has the following list of hireable adventurers: \n\n ${JSON.stringify(requestData.currentPartyMembers)}. \n\n 
    Your job is to provide updates this list of hireable adventurers to make the game more engaging and strategic. You can delete adventurers, add new ones or modify existing ones. . 
    Consider making the choice of characters to select challenging and varied given the available budget and dungeon description. If existing adventurers have poor descriptions that don't add any value to the game you should be considering either removing or updating them.`

    console.log('sending prompt: ', prompt);
    const response = await translator.translate(prompt);

    return new NextResponse(JSON.stringify(response), { status: 200 })
}