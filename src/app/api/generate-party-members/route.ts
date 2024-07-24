import { createJsonTranslator, createOpenAILanguageModel } from "typechat";
import path from "path";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { createTypeScriptJsonValidator } from "typechat/ts";
import { HireablePartyMembers } from "@/schema";

interface GeneratePartyMembersRequest {
    dungeonDescription: string;
    totalBudget: number;
}

export async function POST(req: NextRequest) {

    if (!req.body) {
        return new NextResponse("BAD RESPONSE", { status: 400 })
    }

    const requestData = await req.json() as GeneratePartyMembersRequest;
    console.log('received requestData', requestData)

    const model = createOpenAILanguageModel('REPLACE ME', 'gpt-4o');
    const schema = fs.readFileSync(path.join(__dirname, "../../../../../src/schema.ts"), "utf8");
    const validator = createTypeScriptJsonValidator<HireablePartyMembers>(schema, "HireablePartyMembers");
    const translator = createJsonTranslator(model, validator);
    const response = await translator.translate(`You are a DnD dungeon master. The games dungeon has the following description "${requestData.dungeonDescription}". Additionally, there is gold that the players can spend to purchase adventurers for their journey.
     The players have a total of ${requestData.totalBudget} gold. Your job is to create a number of hireable adventurers that need to be strategically purchased given the dungeon description and total budget. Consider making the choice of characters to select challenging given the available budget and dungeon.`);

    return new NextResponse(JSON.stringify(response), { status: 200 })
}