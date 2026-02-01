import {InputText} from "primereact/inputtext";
import type PlayerList from "./../../lib/props";
import {useEffect, useState} from "react";
import {Button} from "primereact/button";

export default function NewCricket({playerList} : PlayerList) {
    const [playerNames, setPlayerNames] = useState<PlayerList>(playerList);

    function setPlayerName(name: string, index: number) {
        playerList[index] = name;
        setPlayerNames(playerList);
    }

    return (
        <div className={"cricket-options"}>
            <label htmlFor="player1">Name player 1</label>
            <InputText
                value={playerNames[0]}
                key={0}
                type="text"
                placeholder="Player 1"
                onChange={(e) => setPlayerName(e.target.value, 0)}/>
            <label htmlFor="player2">Name Player 2</label>
            <InputText
                value={playerNames[1]}
                key={1}
                type="text"
                placeholder="Player 2"
                onChange={(e) => setPlayerName(e.target.value, 1)}/>
            <Button icon="pi pi-plus"></Button>
        </div>
    )
}