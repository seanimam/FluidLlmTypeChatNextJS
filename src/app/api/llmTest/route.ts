import { createJsonTranslator, createOpenAILanguageModel } from "typechat";
import path from "path";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { createTypeScriptJsonValidator } from "typechat/ts";
import { DungeonDescription } from "@/schema";

export async function POST(req: NextRequest) {

    if (!req.body) {
        return new NextResponse("BAD RESPONSE", { status: 400 })
    }

    const requestData = await req.json();
    console.log('received requestData', requestData)

    const model = createOpenAILanguageModel('REPLACE ME', 'gpt-4o');
    const schema = fs.readFileSync(path.join(__dirname, "../../../../../src/schema.ts"), "utf8");
    const validator = createTypeScriptJsonValidator<DungeonDescription>(schema, "DungeonDescription");
    const translator = createJsonTranslator(model, validator);

    const response = await translator.translate(`You are a DnD dungeon master. I have the following description for a dungeon "${requestData.dungeonDescription}". Suggest a modified version of the dungeon description, making it the dungeon more complex, fixing grammatical issues or even simplifying it, or do nothing. Provide some justification`);

    return new NextResponse(JSON.stringify(response), { status: 200 })
}