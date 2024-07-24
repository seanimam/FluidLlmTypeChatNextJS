export interface CoffeeSuggestionList {
    suggestions: {
        coffeeName: string;
        temperature: string;
    }[]
}


export interface DungeonDescription {
    description: string;
    justification: string;
}

export interface HireablePartyMembers {
    partyMembers: {
        id: string;
        name: string;
        description: string;
        hiringCost: number;
    }[]
}