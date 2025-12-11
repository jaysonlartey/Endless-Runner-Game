import GreenSlime from "../entities/GreenSlime.js";
import PurpleSlime from "../entities/PurpleSlime.js";
import EnemyType from "../enums/EnemyType.js";

export default class EnemyFactory {
    static createInstance(type, x, y) {
        switch (type) {
            case EnemyType.GreenSlime:
                return new GreenSlime(x, y);
            case EnemyType.PurpleSlime:
                return new PurpleSlime(x, y);
        }
    }
}

